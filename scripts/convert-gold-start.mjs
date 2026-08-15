// One-off converter: Web Cerfinits gold-start-*.html -> app/(site)/gold-start/*
// Usage:  node scripts/convert-gold-start.mjs            (generate)
//         node scripts/convert-gold-start.mjs --verify   (text parity vs dev server)
import fs from "node:fs";
import path from "node:path";

const SRC = "C:/Users/narab/Web Cerfinits";
const OUT = "C:/Users/narab/cerfinits-plan/app/(site)/gold-start";

const PAGES = [
  { file: "gold-start-index.html", route: "" },
  ...Array.from({ length: 10 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { file: `gold-start-ch${n}.html`, route: `ch${n}` };
  }),
  { file: "gold-start-glossary.html", route: "glossary" },
  { file: "gold-start-cheatsheet.html", route: "cheatsheet" },
  { file: "gold-start-full.html", route: "full" },
];

// ---------- helpers ----------

const stripTags = (s) =>
  s
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();

function extract(html, file) {
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1].trim();
  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const body = (html.match(/<body>([\s\S]*?)<\/body>/) || [, ""])[1];
  if (!title || !body.trim()) throw new Error(`extract failed: ${file}`);
  const lead = body.match(/<p class="lead">([\s\S]*?)<\/p>/);
  const description = lead ? stripTags(lead[1]).slice(0, 200) : undefined;
  return { title, styles, body, description };
}

function rewriteLinks(s) {
  // broken link on the live site: no 00-cover file exists -> drop the row
  s = s.replace(/<a class="tl" href="gold-start-00-cover\.html">[\s\S]*?<\/a>\s*/g, "");
  s = s.replace(/href="gold-start-index\.html"/g, 'href="/gold-start"');
  s = s.replace(/href="gold-start-(ch\d+|glossary|cheatsheet|full)\.html"/g, 'href="/gold-start/$1"');
  s = s.replace(/href="GOLD-START-Cerfinits\.pdf"/gi, 'href="/gold-start-cerfinits.pdf"');
  s = s.replace(/href="gold-start-cerfinits\.pdf"/g, 'href="/gold-start-cerfinits.pdf"');
  s = s.replace(/href="index\.html"/g, 'href="/"');
  return s;
}

const SVG_ATTRS = {
  "stroke-width": "strokeWidth",
  "stroke-dasharray": "strokeDasharray",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "text-anchor": "textAnchor",
  "font-size": "fontSize",
  "font-family": "fontFamily",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "fill-opacity": "fillOpacity",
  "stroke-opacity": "strokeOpacity",
  "letter-spacing": "letterSpacing",
  "dominant-baseline": "dominantBaseline",
};

function toJsx(bodyHtml) {
  let s = bodyHtml;
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = rewriteLinks(s);
  s = s.replace(/\bclass=/g, "className=");
  for (const [k, v] of Object.entries(SVG_ATTRS)) {
    s = s.replaceAll(`${k}=`, `${v}=`);
  }
  s = s.replace(/<br\s*\/?>/g, "<br />");
  s = s.replace(/<hr\s*\/?>/g, "<hr />");
  s = s.replace(/style="([^"]*)"/g, (_, css) => {
    const obj = css
      .split(";")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((decl) => {
        const i = decl.indexOf(":");
        const prop = decl.slice(0, i).trim();
        const val = decl.slice(i + 1).trim();
        const camel = prop.startsWith("--")
          ? JSON.stringify(prop)
          : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return `${camel}: ${JSON.stringify(val)}`;
      })
      .join(", ");
    return `style={{ ${obj} }}`;
  });
  // sanity: no stray braces outside the style={{...}} we just emitted
  const residue = s.replace(/style=\{\{[^}]*\}\}/g, "");
  if (/[{}]/.test(residue)) {
    const at = residue.search(/[{}]/);
    throw new Error(`stray brace near: …${residue.slice(Math.max(0, at - 60), at + 60)}…`);
  }
  return s;
}

// ---------- CSS scoping ----------

const DROP_SELECTORS = new Set([":root", "*", "html", "::selection"]);

function scopeCss(css, origin) {
  let out = `/* from ${origin} — auto-scoped under .site .gs by scripts/convert-gold-start.mjs */\n`;
  let i = 0;
  const scopeSel = (sel) =>
    sel
      .split(",")
      .map((one) => {
        const t = one.trim();
        if (t === "body") return ".site .gs";
        return `.site .gs ${t}`;
      })
      .join(", ");
  while (i < css.length) {
    const brace = css.indexOf("{", i);
    if (brace === -1) break;
    const selector = css.slice(i, brace).trim();
    if (selector.startsWith("@media")) {
      // find matching closing brace of the media block
      let depth = 1;
      let j = brace + 1;
      while (j < css.length && depth > 0) {
        if (css[j] === "{") depth++;
        else if (css[j] === "}") depth--;
        j++;
      }
      const inner = css.slice(brace + 1, j - 1);
      out += `${selector} {\n${scopeCss(inner, origin).split("\n").slice(1).join("\n")}\n}\n`;
      i = j;
      continue;
    }
    if (selector.startsWith("@page")) {
      const end = css.indexOf("}", brace);
      out += css.slice(i, end + 1) + "\n";
      i = end + 1;
      continue;
    }
    const end = css.indexOf("}", brace);
    const decls = css.slice(brace + 1, end).trim();
    const base = selector.replace(/\s+/g, " ");
    if (DROP_SELECTORS.has(base)) {
      i = end + 1;
      continue;
    }
    out += `${scopeSel(base)} { ${decls} }\n`;
    i = end + 1;
  }
  return out;
}

// ---------- generate ----------

function generate() {
  fs.mkdirSync(OUT, { recursive: true });

  // 1) shared css: tokens/body -> .gs scope, everything else prefixed
  const srcCss = fs.readFileSync(path.join(SRC, "gold-start.css"), "utf8");
  let css = `/* ============================================================
   GOLD START (book) — generated from Web Cerfinits gold-start.css
   by scripts/convert-gold-start.mjs. Every selector lives under
   .site .gs so nothing collides with globals.css or site.css.
   Shared tokens come from globals.css; book overrides below.
   ============================================================ */
.site .gs {
  --max: 760px;
  font-family: var(--thai);
  font-weight: 400;
  line-height: 1.95;
  font-size: 16.5px;
  padding: 48px clamp(20px, 4.5vw, 52px) 72px;
}
`;
  css += scopeCss(srcCss.replace(/\/\*[\s\S]*?\*\//g, ""), "gold-start.css");

  // 2) pages (+ collect their per-page <style> blocks into the shared css)
  for (const { file, route } of PAGES) {
    const html = fs.readFileSync(path.join(SRC, file), "utf8");
    const { title, styles, body, description } = extract(html, file);
    for (const st of styles) css += scopeCss(st.replace(/\/\*[\s\S]*?\*\//g, ""), file);

    const jsx = toJsx(body)
      .trim()
      .split("\n")
      .map((l) => (l.trim() ? "      " + l : ""))
      .join("\n");

    const canonical = route ? `/gold-start/${route}` : "/gold-start";
    const dir = route ? path.join(OUT, route) : OUT;
    fs.mkdirSync(dir, { recursive: true });
    const metaDesc = description ? `\n  description: ${JSON.stringify(description)},` : "";
    const pageTsx = `import type { Metadata } from "next";

// Generated from ${file} by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: ${JSON.stringify(title)},${metaDesc}
  alternates: { canonical: ${JSON.stringify(canonical)} },
};

export default function Page() {
  return (
    <>
${jsx}
    </>
  );
}
`;
    fs.writeFileSync(path.join(dir, "page.tsx"), pageTsx, "utf8");
    console.log(`ok  ${file} -> ${canonical}`);
  }

  fs.writeFileSync(path.join(OUT, "gold-start.css"), css, "utf8");

  // 3) section layout importing the scoped css
  const layout = `import "./gold-start.css";

export default function GoldStartLayout({ children }: { children: React.ReactNode }) {
  return <div className="gs">{children}</div>;
}
`;
  fs.writeFileSync(path.join(OUT, "layout.tsx"), layout, "utf8");
  console.log("ok  gold-start.css + layout.tsx");
}

// ---------- verify (text parity against dev server) ----------

async function verify() {
  let fail = 0;
  for (const { file, route } of PAGES) {
    const html = fs.readFileSync(path.join(SRC, file), "utf8");
    let body = (html.match(/<body>([\s\S]*?)<\/body>/) || [, ""])[1];
    body = body.replace(/<a class="tl" href="gold-start-00-cover\.html">[\s\S]*?<\/a>\s*/g, "");
    const want = stripTags(body);

    const url = `http://localhost:3000/gold-start${route ? "/" + route : ""}`;
    const res = await fetch(url);
    const page = await res.text();
    const gs = page.match(/<div class="gs">([\s\S]*?)<\/div><\/div><\/body>/) || [
      ,
      (page.match(/<div class="gs">([\s\S]*)/) || [, ""])[1],
    ];
    const got = stripTags(gs[1] || "");

    const ok = res.status === 200 && got.includes(want.slice(0, 200)) && got.length >= want.length * 0.98;
    console.log(`${ok ? "PASS" : "FAIL"}  ${url}  want=${want.length} got=${got.length} status=${res.status}`);
    if (!ok) fail++;
  }
  process.exit(fail ? 1 : 0);
}

if (process.argv.includes("--verify")) verify();
else generate();
