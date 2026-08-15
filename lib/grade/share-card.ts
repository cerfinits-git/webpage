import { frameFor, type Archetype } from "./archetypes";

/**
 * Draws the result card to a canvas so it can be shared as a real image file.
 *
 * The card is redrawn here rather than screenshotted from the DOM. Turning DOM
 * into an image needs either a rasteriser dependency or the SVG foreignObject
 * trick, and this project keeps a zero-dependency front end; drawing it also
 * gives a fixed 1080x1620 regardless of the visitor's screen, where a capture
 * would come out at whatever size their phone happens to be.
 *
 * The cost is that the layout lives in two places. The numbers below mirror
 * the percentages in app/(site)/quiz/quiz.css — change one, change the other.
 */

export const SHARE_SIZE = { width: 1080, height: 1620 };

/** Same insets the card uses, as fractions of the canvas. */
const LAYOUT = {
  /** Parchment area inside the printed border. */
  inset: 0.09,
  codeTop: 0.075,
  artTop: 0.15,
  artBottom: 0.1,
  bodyBottom: 0.065,
  /** Where the paper scrim starts fading in, measured up from the card base. */
  scrimTop: 0.46,
};

const INK = "#2f2618";
const CODE_INK = "#3d3116";
const ACCENT = "#7a5c22";
const BODY_INK = "#4a3f2c";
const MARK_INK = "#8a7550";
const PAPER = "240, 232, 214";

/**
 * Canvas cannot read `var(--thai)`; it needs a resolved family list. Reading it
 * back off a real element means the drawn card uses the same faces the page
 * does, including the ones Next generates names for at build time.
 */
function resolvedFonts() {
  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);

  probe.style.fontFamily = "var(--thai)";
  const thai = getComputedStyle(probe).fontFamily || "system-ui, sans-serif";
  probe.style.fontFamily = "var(--mono)";
  const mono = getComputedStyle(probe).fontFamily || "ui-monospace, monospace";

  probe.remove();
  return { thai, mono };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`โหลดภาพไม่สำเร็จ: ${src}`));
    img.src = src;
  });
}

/** Wrap on spaces, and fall back to breaking mid-word for Thai, which has none. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);

    if (ctx.measureText(word).width <= maxWidth) {
      line = word;
      continue;
    }
    let chunk = "";
    for (const ch of word) {
      if (ctx.measureText(chunk + ch).width > maxWidth) {
        lines.push(chunk);
        chunk = ch;
      } else {
        chunk += ch;
      }
    }
    line = chunk;
  }

  if (line) lines.push(line);
  return lines;
}

export async function renderShareCard(archetype: Archetype): Promise<Blob> {
  const { width, height } = SHARE_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("เบราว์เซอร์ไม่รองรับ canvas");

  // Without this the first draw can land before the webfonts arrive and the
  // Thai comes out in a fallback face.
  if (document.fonts?.ready) await document.fonts.ready;
  const fonts = resolvedFonts();

  const [frame, figure] = await Promise.all([
    loadImage(`/quiz/frames/${frameFor(archetype.code)}.webp`),
    loadImage(`/quiz/archetypes/${archetype.code}.webp`),
  ]);

  ctx.drawImage(frame, 0, 0, width, height);

  // Figure, scaled to fit its box and stood on the box's floor.
  const boxLeft = width * LAYOUT.inset;
  const boxWidth = width * (1 - LAYOUT.inset * 2);
  const boxTop = height * LAYOUT.artTop;
  const boxBottom = height * (1 - LAYOUT.artBottom);
  const scale = Math.min(boxWidth / figure.width, (boxBottom - boxTop) / figure.height);
  const figW = figure.width * scale;
  const figH = figure.height * scale;
  ctx.drawImage(figure, boxLeft + (boxWidth - figW) / 2, boxBottom - figH, figW, figH);

  // Paper scrim, matching the card's gradient stops.
  const scrimTop = height * (1 - LAYOUT.scrimTop);
  const scrimBottom = height * (1 - LAYOUT.bodyBottom);
  const scrim = ctx.createLinearGradient(0, scrimBottom, 0, scrimTop);
  for (const [stop, alpha] of [
    [0, 1],
    [0.32, 0.99],
    [0.48, 0.94],
    [0.61, 0.82],
    [0.72, 0.6],
    [0.82, 0.35],
    [0.91, 0.15],
    [1, 0],
  ] as const) {
    scrim.addColorStop(stop, `rgba(${PAPER}, ${alpha})`);
  }
  ctx.fillStyle = scrim;
  ctx.fillRect(boxLeft, scrimTop, boxWidth, scrimBottom - scrimTop);

  ctx.textAlign = "center";
  const centre = width / 2;

  // Code, spaced the way the card spaces it.
  ctx.fillStyle = CODE_INK;
  ctx.font = `600 ${Math.round(width * 0.1)}px ${fonts.mono}`;
  ctx.textBaseline = "top";
  const letters = archetype.code.split("");
  const gap = width * 0.038;
  const letterWidths = letters.map((l) => ctx.measureText(l).width);
  const totalWidth = letterWidths.reduce((a, b) => a + b, 0) + gap * (letters.length - 1);
  let penX = centre - totalWidth / 2;
  for (const [i, letter] of letters.entries()) {
    ctx.fillText(letter, penX + letterWidths[i] / 2, height * LAYOUT.codeTop);
    penX += letterWidths[i] + gap;
  }

  // Caption, stacked upward from the base so it never collides with the frame.
  ctx.textBaseline = "alphabetic";
  let y = scrimBottom - height * 0.012;

  ctx.fillStyle = MARK_INK;
  ctx.font = `${Math.round(width * 0.027)}px ${fonts.mono}`;
  ctx.fillText("cerfinits.com/quiz", centre, y);
  y -= height * 0.055;

  ctx.fillStyle = BODY_INK;
  ctx.font = `${Math.round(width * 0.036)}px ${fonts.thai}`;
  const tagLines = wrap(ctx, archetype.tagline, boxWidth * 0.92);
  for (const line of [...tagLines].reverse()) {
    ctx.fillText(line, centre, y);
    y -= height * 0.032;
  }
  y -= height * 0.024;

  ctx.fillStyle = ACCENT;
  ctx.font = `${Math.round(width * 0.032)}px ${fonts.mono}`;
  ctx.fillText(archetype.english, centre, y);
  y -= height * 0.052;

  ctx.fillStyle = INK;
  ctx.font = `600 ${Math.round(width * 0.076)}px ${fonts.thai}`;
  ctx.fillText(archetype.name, centre, y);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("แปลงเป็นรูปไม่สำเร็จ"))),
      "image/png",
    );
  });
}

export function shareFileName(code: string) {
  return `cerfinits-${code.toLowerCase()}.png`;
}
