// Audits the stylesheets for the things that make the site hard to read on a
// phone, and prints the worklist that the mobile pass works through.
//
//   node scripts/mobile-audit.mjs           (human-readable report)
//   node scripts/mobile-audit.mjs --json    (machine-readable, for diffing runs)
//   node scripts/mobile-audit.mjs --all     (also list declarations already fixed)
//   node scripts/mobile-audit.mjs --journal (include the paused journal styles)
//
// Scope: the public site — globals, site, research, grade, gold-start, algo. The
// journal stylesheets are skipped by default because the journal is paused and
// `/plan` is due to be archived (R8); polishing either is work aimed at a
// surface no reader will reach. They are the larger half of the offences, so
// leaving them in would drown the worklist that matters.
//
// This is the static half of the audit: it reads what the CSS declares. The
// other half — what the browser actually renders, which is where tap-target
// sizes and real overflow live — is scripts/mobile-audit.browser.js, run against
// a dev server. Neither replaces the other: a 13px declaration is a fact of the
// source, a 23px-tall link is a fact of the layout.
//
// Checks, in the order they are reported:
//   1. Type below the readable floor. Anything under 14px is uncomfortable on a
//      handset held at arm's length; under 12px is effectively unreadable. A
//      small size inside a phone-tier media block is a deliberate choice and is
//      reported separately from one that applies everywhere.
//   2. Thin weights on small type. 300 on 12px grey text is the combination that
//      reads as washed out — each factor is survivable alone.
//   3. Fixed widths that exceed a phone viewport. A 760px min-width inside a
//      327px column is a horizontal scroll the reader has to discover.
//   4. Breakpoint sprawl. Eleven different widths across eight stylesheets means
//      no shared idea of what "mobile" is; the pass collapses them to a scale.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app");

/** Below this, body text stops being comfortable on a handset. */
const FLOOR = 14;
/** Below this it is unreadable, phone tier or not. */
const HARD_FLOOR = 12;
/** A media block at or under this width is aimed at phones. */
const PHONE_TIER = 640;
/** Narrowest viewport supported — an iPhone SE minus the page gutters. */
const PHONE_CONTENT = 360;
/** The scale the pass collapses onto. */
const SCALE = [480, 768, 1024];

const argv = process.argv.slice(2);
const asJson = argv.includes("--json");
const showAll = argv.includes("--all");
const withJournal = argv.includes("--journal");

/** Paused surfaces, excluded unless asked for. */
const OUT_OF_SCOPE = ["journal.css", "journal-auth.css"];

async function cssFiles(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await cssFiles(full)));
    else if (entry.name.endsWith(".css")) out.push(full);
  }
  return out
    .filter((f) => withJournal || !OUT_OF_SCOPE.includes(path.basename(f)))
    .sort();
}

/**
 * Walks a stylesheet and yields every declaration with the at-rule context it
 * sits inside. Hand-written CSS only — no preprocessor syntax, no `content`
 * strings carrying braces — so brace counting is enough and pulling in a real
 * parser would buy nothing.
 */
function* declarations(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const stack = [];
  let buf = "";
  let line = 1;

  // These stylesheets drop the semicolon before a closing brace, so a block's
  // last declaration only ever terminates at `}` — flushing on `;` alone loses
  // one declaration per rule.
  const flush = (text, at) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.startsWith("@")) return null;
    const colon = trimmed.indexOf(":");
    if (colon < 0) return null;
    const rule = stack[stack.length - 1];
    if (!rule) return null;
    return {
      prop: trimmed.slice(0, colon).trim(),
      value: trimmed.slice(colon + 1).trim(),
      selector: rule.prelude,
      media: stack
        .map((s) => s.prelude)
        .filter((p) => p.startsWith("@media"))
        .join(" "),
      line: at,
    };
  };

  for (const ch of src) {
    if (ch === "\n") line += 1;

    if (ch === "{") {
      stack.push({ prelude: buf.trim(), line });
      buf = "";
    } else if (ch === "}") {
      const last = flush(buf, line);
      if (last) yield last;
      stack.pop();
      buf = "";
    } else if (ch === ";") {
      const decl = flush(buf, line);
      buf = "";
      if (decl) yield decl;
    } else {
      buf += ch;
    }
  }
}

/**
 * The phone-tier values of the type tokens, mirrored from globals.css so a
 * floored declaration can be judged at the size a phone actually renders.
 */
const TOKENS = { "--type-floor": 14, "--type-read": 15.5 };

/** Resolves a length to the px a phone gets, or null when it cannot be known. */
function toPx(value) {
  const v = value.trim();
  // A clamp() floor is what a narrow viewport gets, so that is the figure.
  const clamped = v.match(/^clamp\(([^,]+),/);
  if (clamped) return toPx(clamped[1]);
  // max(var(--type-floor), 11px) — the whole point of the floor is that the
  // token wins on phones, so the check has to see the resolved value, not the
  // desktop literal sitting next to it.
  const maxed = v.match(/^max\((.+)\)$/);
  if (maxed) {
    const parts = maxed[1].split(",").map((p) => toPx(p)).filter((n) => n != null);
    return parts.length ? Math.max(...parts) : null;
  }
  const token = v.match(/^var\((--[\w-]+)\)$/);
  if (token) return TOKENS[token[1]] ?? null;
  const m = v.match(/^(-?[\d.]+)(px|rem|em)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === "px" ? n : n * 16;
}

/** The narrowest max-width in an at-rule prelude, i.e. who the block targets. */
function mediaWidth(media) {
  const widths = [...media.matchAll(/max-width:\s*(\d+)px/g)].map((m) => Number(m[1]));
  return widths.length ? Math.min(...widths) : null;
}

function rel(file) {
  return path.relative(process.cwd(), file).replaceAll("\\", "/");
}

const report = {
  smallType: [],
  thinSmallType: [],
  wideBoxes: [],
  breakpoints: new Map(),
};

for (const file of await cssFiles(ROOT)) {
  const css = await fs.readFile(file, "utf8");
  const sizes = new Map(); // selector+media → px, to pair weight with size

  for (const d of declarations(css)) {
    const width = mediaWidth(d.media);
    const key = `${d.media}||${d.selector}`;

    if (d.media && width) {
      const at = report.breakpoints.get(width) ?? new Set();
      at.add(rel(file));
      report.breakpoints.set(width, at);
    }

    if (d.prop === "font-size") {
      const px = toPx(d.value);
      if (px == null) continue;
      sizes.set(key, px);
      const phoneTier = width != null && width <= PHONE_TIER;
      // Print media is a different medium with its own comfortable sizes.
      if (d.media.includes("print")) continue;
      const severity = px < HARD_FLOOR ? "hard" : px < FLOOR ? "soft" : null;
      if (severity || showAll) {
        report.smallType.push({
          file: rel(file),
          line: d.line,
          selector: d.selector,
          px,
          phoneTier,
          severity: severity ?? "ok",
        });
      }
    }

    if (d.prop === "font-weight") {
      const weight = Number(d.value);
      const px = sizes.get(key);
      if (weight && weight <= 300 && px != null && px < FLOOR) {
        report.thinSmallType.push({ file: rel(file), line: d.line, selector: d.selector, px, weight });
      }
    }

    if (d.prop === "min-width" || d.prop === "width") {
      const px = toPx(d.value);
      if (px != null && px > PHONE_CONTENT) {
        report.wideBoxes.push({ file: rel(file), line: d.line, selector: d.selector, prop: d.prop, px });
      }
    }
  }
}

const counts = {
  hard: report.smallType.filter((s) => s.severity === "hard").length,
  soft: report.smallType.filter((s) => s.severity === "soft").length,
  thin: report.thinSmallType.length,
  wide: report.wideBoxes.length,
  breakpoints: report.breakpoints.size,
};

if (asJson) {
  console.log(
    JSON.stringify(
      {
        counts,
        smallType: report.smallType,
        thinSmallType: report.thinSmallType,
        wideBoxes: report.wideBoxes,
        breakpoints: [...report.breakpoints].sort((a, b) => a[0] - b[0]).map(([w, files]) => ({ width: w, files: [...files] })),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const byFile = (rows) => {
  const grouped = new Map();
  for (const r of rows) {
    const list = grouped.get(r.file) ?? [];
    list.push(r);
    grouped.set(r.file, list);
  }
  return grouped;
};

console.log(`\nTYPE BELOW ${FLOOR}px  —  ${counts.hard} under ${HARD_FLOOR}px, ${counts.soft} between\n`);
for (const [file, rows] of byFile(report.smallType.filter((s) => s.severity !== "ok" || showAll))) {
  console.log(`  ${file}`);
  for (const r of rows.sort((a, b) => a.px - b.px)) {
    const mark = r.severity === "hard" ? "!!" : r.severity === "soft" ? " !" : "  ";
    const tier = r.phoneTier ? "  [phone tier]" : "";
    console.log(`   ${mark} ${String(r.px).padStart(5)}px  L${String(r.line).padEnd(5)} ${r.selector.slice(0, 70)}${tier}`);
  }
  console.log("");
}

if (counts.thin) {
  console.log(`THIN WEIGHT ON SMALL TYPE  —  ${counts.thin}\n`);
  for (const r of report.thinSmallType) {
    console.log(`      ${r.px}px / ${r.weight}  ${r.file}:${r.line}  ${r.selector.slice(0, 60)}`);
  }
  console.log("");
}

if (counts.wide) {
  console.log(`FIXED WIDTHS OVER ${PHONE_CONTENT}px  —  ${counts.wide}\n`);
  for (const r of report.wideBoxes.sort((a, b) => b.px - a.px)) {
    console.log(`      ${String(r.px).padStart(5)}px  ${r.prop.padEnd(9)} ${r.file}:${r.line}  ${r.selector.slice(0, 55)}`);
  }
  console.log("");
}

console.log(`BREAKPOINTS IN USE  —  ${counts.breakpoints} distinct (target scale: ${SCALE.join(" / ")})\n`);
for (const [width, files] of [...report.breakpoints].sort((a, b) => a[0] - b[0])) {
  const onScale = SCALE.includes(width) ? "  " : " ~";
  console.log(`   ${onScale} ${String(width).padStart(4)}px  ${[...files].map((f) => f.split("/").pop()).join(", ")}`);
}
console.log("");
