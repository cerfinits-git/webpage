// Render a certificate to a PNG in the browser.
//
// Drawn with the Canvas 2D API rather than an image-from-DOM library or a
// server-side renderer: the page has already loaded Anuphan, so canvas can use
// it directly and Thai names come out correctly. next/og would need the font as
// TTF/OTF — next/font ships woff2, which satori cannot read — and screenshotting
// the DOM would mean a new dependency.

import { formatIssueDate, TRACKS, type Certificate } from "./certificates-public";

// Landscape, close to A4 proportions — it reads as a certificate, and it is the
// shape that survives a social feed better than a tall portrait crop.
const WIDTH = 1400;
const HEIGHT = 990;
const SCALE = 2; // draw at 2x so the download stays sharp when zoomed or printed

/**
 * Always the warm-paper palette, never the reader's current theme. A
 * certificate is a printed artefact: a dark version costs ink to print and
 * looks wrong shared into a feed, so the download does not follow dark mode.
 */
const PALETTE = {
  paper: "#e6e5e0",
  ink: "#272727",
  muted: "#6f6d66",
  gold: "#9a7b3f",
  line: "rgba(39, 39, 39, 0.22)",
};

/**
 * Resolve a CSS custom property to a real font-family list.
 *
 * `ctx.font` is not CSS: it rejects `var(...)`, and a rejected value leaves the
 * previous font in place — which is how every line silently rendered at the
 * 10px default. Reading the computed style of a probe element gives the actual
 * family next/font generated (e.g. `__Anuphan_1a2b3c`).
 */
function resolveFamily(cssVar: string, fallback: string): string {
  try {
    const probe = document.createElement("span");
    probe.style.fontFamily = `var(${cssVar})`;
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).fontFamily;
    probe.remove();
    return resolved && !resolved.includes("var(") ? resolved : fallback;
  } catch {
    return fallback;
  }
}

let THAI_FAMILY = "sans-serif";
let MONO_FAMILY = "monospace";

function thai(size: number, weight = 400) {
  return `${weight} ${size}px ${THAI_FAMILY}`;
}

function mono(size: number, weight = 400) {
  return `${weight} ${size}px ${MONO_FAMILY}`;
}

/** Draw text centred at x, wrapping to `maxWidth`. Returns the y after the block. */
function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      cursorY += lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

function letterspaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  spacing: number,
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + spacing * (chars.length - 1);
  let x = centerX - total / 2;
  const previousAlign = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((char, index) => {
    ctx.fillText(char, x, y);
    x += widths[index] + spacing;
  });
  ctx.textAlign = previousAlign;
}

export async function renderCertificatePng(
  certificate: Certificate,
  verifyUrl: string,
): Promise<Blob> {
  // Without this the first draw can fall back to a system font mid-render.
  if (document.fonts?.ready) await document.fonts.ready;

  THAI_FAMILY = resolveFamily("--thai", "sans-serif");
  MONO_FAMILY = resolveFamily("--mono", "monospace");

  const palette = PALETTE;
  const spec = TRACKS[certificate.track];

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d context unavailable");
  ctx.scale(SCALE, SCALE);

  // paper + double rule border
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, WIDTH - 68, HEIGHT - 68);
  ctx.lineWidth = 1;
  ctx.strokeRect(50, 50, WIDTH - 100, HEIGHT - 100);

  const center = WIDTH / 2;
  ctx.textBaseline = "alphabetic";

  // brand row
  ctx.fillStyle = palette.gold;
  ctx.beginPath();
  ctx.arc(108, 104, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.font = mono(23);
  ctx.fillStyle = palette.ink;
  ctx.fillText("Cerfinits Grade", 128, 112);

  ctx.textAlign = "right";
  ctx.font = mono(17);
  ctx.fillStyle = palette.muted;
  ctx.fillText("ใบรับรองการเรียนจบหลักสูตร", WIDTH - 108, 112);

  // recipient
  ctx.textAlign = "center";
  ctx.font = mono(19);
  ctx.fillStyle = palette.muted;
  letterspaced(ctx, "มอบให้แก่", center, 232, 4);

  ctx.font = thai(68, 500);
  ctx.fillStyle = palette.ink;
  const nameEnd = drawWrapped(ctx, certificate.recipientName, center, 318, WIDTH - 300, 82);

  // statement
  ctx.font = thai(26);
  ctx.fillStyle = palette.muted;
  const statementEnd = drawWrapped(
    ctx,
    `ผู้ซึ่งได้ศึกษาหลักสูตร Cerfinits Grade และ${spec.blurbTh} ตามเกณฑ์ผ่านที่ 80% ของแต่ละระดับ`,
    center,
    nameEnd + 26,
    WIDTH - 420,
    42,
  );

  // track band
  const bandY = statementEnd + 74;
  ctx.strokeStyle = palette.gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(center - 230, bandY - 50);
  ctx.lineTo(center + 230, bandY - 50);
  ctx.moveTo(center - 230, bandY + 32);
  ctx.lineTo(center + 230, bandY + 32);
  ctx.stroke();

  ctx.font = thai(38, 500);
  ctx.fillStyle = palette.ink;
  ctx.fillText(spec.titleTh, center, bandY - 6);
  ctx.font = mono(17);
  ctx.fillStyle = palette.gold;
  letterspaced(ctx, spec.titleEn.toUpperCase(), center, bandY + 20, 6);

  // levels
  ctx.font = mono(18);
  ctx.fillStyle = palette.muted;
  ctx.fillText(
    certificate.levels.map((level) => `ระดับ ${level}`).join("  ·  "),
    center,
    bandY + 92,
  );

  // footer: id, date, verify url — anchored to the bottom edge, not to the
  // content above, so a two-line name cannot push it off the certificate.
  const footY = HEIGHT - 195;
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(108, footY - 36);
  ctx.lineTo(WIDTH - 108, footY - 36);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = mono(14);
  ctx.fillStyle = palette.muted;
  ctx.fillText("รหัสใบรับรอง", 108, footY);
  ctx.font = mono(23);
  ctx.fillStyle = palette.ink;
  ctx.fillText(certificate.id, 108, footY + 33);

  ctx.textAlign = "right";
  ctx.font = mono(14);
  ctx.fillStyle = palette.muted;
  ctx.fillText("วันที่ออกใบ", WIDTH - 108, footY);
  ctx.font = thai(23, 500);
  ctx.fillStyle = palette.ink;
  ctx.fillText(formatIssueDate(certificate.issuedAt), WIDTH - 108, footY + 33);

  ctx.textAlign = "center";
  ctx.font = mono(15);
  ctx.fillStyle = palette.muted;
  ctx.fillText(`ตรวจสอบได้ที่ ${verifyUrl}`, center, footY + 84);

  // the same disclaimer the web certificate carries, trimmed to two lines
  ctx.font = thai(15);
  ctx.fillStyle = palette.muted;
  drawWrapped(
    ctx,
    "ใบรับรองนี้ยืนยันการผ่านแบบทดสอบวัดความเข้าใจเนื้อหาหลักสูตรเท่านั้น — ไม่ใช่ใบอนุญาตประกอบวิชาชีพ และไม่ได้รับรองความสามารถในการทำกำไร การเทรดมีความเสี่ยงที่จะสูญเสียเงินลงทุน",
    center,
    footY + 122,
    WIDTH - 240,
    22,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("canvas.toBlob returned null"))),
      "image/png",
    );
  });
}

export async function downloadCertificatePng(certificate: Certificate, verifyUrl: string) {
  const blob = await renderCertificatePng(certificate, verifyUrl);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cerfinits-grade-${certificate.id}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
