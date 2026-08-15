// Turns the 16 source character illustrations into web-sized transparent WebP.
//
// Source: full-body figures on a plain white field, one per archetype code,
// at ~1024x1536 and 1.3-1.7 MB each. Nothing is written on them, which is the
// point — an earlier set had the name, weakness, dominant pole and chapter
// numbers baked into the picture, and that text disagreed with
// lib/grade/archetypes.ts on several cards. Art carries no claims; the page
// gets every word from the tested data.
//
//   node scripts/build-archetype-art.mjs [--sheet]
//
// Sources stay out of the repo; only the derived WebP is committed.

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "C:/Users/narab/Downloads/MBTI/v2";
const OUT_DIR = path.join(process.cwd(), "public", "quiz", "archetypes");

const CODES = [
  "CSKO", "CSKG", "CSRO", "CSRG",
  "CIKO", "CIKG", "CIRO", "CIRG",
  "HSKO", "HSKG", "HSRO", "HSRG",
  "HIKO", "HIKG", "HIRO", "HIRG",
];

/** At or above this the pixel is pure backdrop and goes fully transparent. */
const WHITE_HARD = 240;
/**
 * Down to here the pixel is still backdrop-ish and gets partial transparency.
 * A single hard threshold left two visible faults: a white rim around every
 * silhouette, and white trapped between wisps of hair, because a ring of
 * pixels a shade under the cut acted as a wall the flood could not cross.
 */
const WHITE_SOFT = 208;
/** Any wider spread between channels means it carries colour, so it is not backdrop. */
const NEUTRAL = 14;

const OUT = { width: 440, height: 660 };

/**
 * Knock out the backdrop by flooding inward from the border, not by testing
 * every pixel for brightness.
 *
 * Several figures wear white or pale grey — see the cream cloak on HIKG — and
 * a plain luminance threshold punches holes straight through those clothes.
 * Flooding from the edge only clears white that actually connects to the edge.
 */
function backdropAlpha(data, width, height) {
  const alpha = new Uint8Array(width * height).fill(255);
  const queue = new Int32Array(width * height);
  const seen = new Uint8Array(width * height);
  let head = 0;
  let tail = 0;

  /** How opaque this pixel should end up if the flood reaches it. */
  const alphaAt = (i) => {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) > NEUTRAL) return 255;
    const lum = Math.min(r, g, b);
    if (lum >= WHITE_HARD) return 0;
    if (lum <= WHITE_SOFT) return 255;
    // Partly backdrop, partly subject. Keeping this fractional is what removes
    // the white rim rather than just moving it inward by a pixel.
    return Math.round((255 * (WHITE_HARD - lum)) / (WHITE_HARD - WHITE_SOFT));
  };

  const push = (i) => {
    if (seen[i]) return;
    const a = alphaAt(i);
    if (a === 255) return;
    seen[i] = 1;
    alpha[i] = a;
    queue[tail++] = i;
  };

  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) push(i - 1);
    if (x < width - 1) push(i + 1);
    if (y > 0) push(i - width);
    if (y < height - 1) push(i + width);
  }

  clearEnclosedBackdrop(data, alpha, seen, width, height, alphaAt);
  return alpha;
}

/**
 * Clear pockets of backdrop the flood cannot reach.
 *
 * Windswept hair encloses islands of white — HIRG had 207 of them, 8,865
 * pixels — and they survive an edge flood by definition. What separates them
 * from genuinely pale clothing is that the backdrop is flat: those pockets
 * average luminance 251 at saturation 1.5, while the cream cloak that must
 * survive produced no pocket larger than a few pixels. So a pocket is only
 * cleared when every pixel in it is that same flat white.
 */
function clearEnclosedBackdrop(data, alpha, seen, width, height, alphaAt) {
  const FLAT_LUM = 244;
  const FLAT_SAT = 6;
  const visited = new Uint8Array(width * height);
  const lumAt = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const satAt = (i) =>
    Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) -
    Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const candidate = (i) => !seen[i] && !visited[i] && alphaAt(i) < 255;

  for (let start = 0; start < width * height; start++) {
    if (!candidate(start)) continue;

    const stack = [start];
    const cells = [];
    visited[start] = 1;
    let core = 0;

    while (stack.length) {
      const i = stack.pop();
      cells.push(i);
      // Judged on how much of the pocket is flat white, not on every pixel:
      // each pocket fades into the hair that encloses it, and demanding that
      // the fringe be flat too disqualified all 207 of them.
      if (lumAt(i) >= FLAT_LUM && satAt(i) <= FLAT_SAT) core++;
      const x = i % width;
      const y = (i / width) | 0;
      const around = [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, y > 0 ? i - width : -1, y < height - 1 ? i + width : -1];
      for (const j of around) {
        if (j >= 0 && candidate(j)) {
          visited[j] = 1;
          stack.push(j);
        }
      }
    }

    if (core / cells.length < 0.5) continue;
    for (const i of cells) alpha[i] = alphaAt(i);
  }
}

/** Bounding box of everything still opaque, so the figure fills its frame. */
function opaqueBounds(alpha, width, height) {
  let top = height;
  let bottom = -1;
  let left = width;
  let right = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Ignore the faint fringe the blur leaves behind, or the box grows to
      // the full frame and the trim does nothing.
      if (alpha[y * width + x] < 24) continue;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }

  if (bottom < 0) throw new Error("ไม่พบพิกเซลทึบเลย — เกณฑ์พื้นหลังกินตัวละครหมด");
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/**
 * Take the white back out of the edge pixels.
 *
 * A half-transparent pixel on the boundary is a blend of subject and backdrop:
 * what was captured is `C = a*F + (1-a)*255`. Left alone it keeps that white
 * contribution and the figure wears a pale rim against a dark page. Solving
 * for F recovers the subject's own colour.
 */
function unmixWhite(data, alpha) {
  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a === 0 || a === 255) continue;
    const f = a / 255;
    for (let c = 0; c < 3; c++) {
      const mixed = data[i * 4 + c];
      const recovered = (mixed - (1 - f) * 255) / f;
      data[i * 4 + c] = Math.max(0, Math.min(255, Math.round(recovered)));
    }
  }
}

async function cutout(src) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const alpha = backdropAlpha(data, info.width, info.height);
  unmixWhite(data, alpha);

  // Write the mask straight into the fourth byte of every pixel rather than
  // handing sharp a separate one-channel image. Both of the obvious APIs get
  // this wrong: composite with blend "dest-in" reads a one-channel input as
  // greyscale colour at full opacity, so the cutout silently does nothing,
  // and joinChannel produces a four-band image sharp does not necessarily
  // treat as RGBA, which lands the mask out of step with the picture.
  for (let i = 0; i < alpha.length; i++) data[i * 4 + 3] = alpha[i];

  const bounds = opaqueBounds(alpha, info.width, info.height);

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract(bounds)
    .png()
    .toBuffer();
}

// The card frames. Four of them cover all sixteen archetypes because the
// colour is keyed to the first and third letters of the code — see frameFor()
// in lib/grade/archetypes.ts. They are photographic parchment textures, so
// they stay as flat WebP rather than anything vector.
const FRAME_DIR = "C:/Users/narab/Downloads/MBTI/frames";
const FRAME_OUT = path.join(process.cwd(), "public", "quiz", "frames");
const FRAMES = {
  green: "Green frame.png",
  purple: "Purple frame.png",
  navy: "Blue frame.png",
  gold: "yellow frame.png",
};
/** Twice the size the card is drawn at, so it stays sharp on phone screens. */
const FRAME_OUT_SIZE = { width: 880, height: 1320 };

async function buildFrames() {
  await mkdir(FRAME_OUT, { recursive: true });
  let total = 0;
  for (const [name, file] of Object.entries(FRAMES)) {
    const src = path.join(FRAME_DIR, file);
    if (!existsSync(src)) throw new Error(`ไม่พบกรอบ: ${src}`);
    const buf = await sharp(src)
      .resize(FRAME_OUT_SIZE.width, FRAME_OUT_SIZE.height, { fit: "fill" })
      .webp({ quality: 80 })
      .toBuffer();
    await writeFile(path.join(FRAME_OUT, `${name}.webp`), buf);
    total += buf.length;
    console.log(`frame ${name}  ${(buf.length / 1024).toFixed(0)} KB`);
  }
  console.log(`กรอบรวม ${(total / 1024).toFixed(0)} KB\n`);
}

async function main() {
  const wantSheet = process.argv.includes("--sheet");
  await mkdir(OUT_DIR, { recursive: true });
  await buildFrames();

  let total = 0;
  const thumbs = [];

  for (const code of CODES) {
    const src = path.join(SRC_DIR, `${code}.png`);
    if (!existsSync(src)) throw new Error(`ไม่พบไฟล์ต้นฉบับ: ${src}`);

    const buf = await sharp(await cutout(src))
      .resize(OUT.width, OUT.height, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 84, alphaQuality: 90 })
      .toBuffer();

    await writeFile(path.join(OUT_DIR, `${code}.webp`), buf);
    total += buf.length;
    console.log(`${code}  ${(buf.length / 1024).toFixed(0)} KB`);

    if (wantSheet) {
      thumbs.push(
        await sharp(buf)
          .resize(200, 300, { fit: "contain", background: { r: 22, g: 22, b: 22, alpha: 1 } })
          .flatten({ background: "#161616" })
          .png()
          .toBuffer(),
      );
    }
  }

  console.log(`\nรวม ${(total / 1024 / 1024).toFixed(2)} MB · เฉลี่ย ${(total / CODES.length / 1024).toFixed(0)} KB`);

  if (wantSheet) {
    // One grid so all sixteen can be eyeballed together — a hole bitten out of
    // a pale cloak is easy to miss when opening files one at a time.
    const sheet = await sharp({
      create: { width: 800, height: 1200, channels: 3, background: "#161616" },
    })
      .composite(thumbs.map((input, i) => ({ input, left: (i % 4) * 200, top: Math.floor(i / 4) * 300 })))
      .png()
      .toBuffer();
    const out = path.join(process.cwd(), "..", "contact-sheet.png");
    await writeFile(out, sheet);
    console.log(`contact sheet: ${out}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
