"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JournalTrade } from "@/lib/journal/types";
import { buildMonthlyRCard, latestTradeMonth, type RCardData } from "@/lib/journal/rcard";
import JournalIcon from "./JournalIcon";
import { T, useLang } from "@/components/site/LangContext";

const SIZE = 1080;
const PALETTE = {
  paper: "#e4e3dd",
  ink: "#272727",
  muted: "#6f6d66",
  gold: "#9a7b3f",
  up: "#5a7d5a",
  down: "#9d5a4f",
  line: "rgba(39,39,39,0.16)",
  soft: "rgba(39,39,39,0.07)",
};

const SANS = "ui-sans-serif, system-ui, 'Segoe UI', sans-serif";
const MONO = "ui-monospace, 'Geist Mono', 'SFMono-Regular', monospace";

function verdictColor(v: RCardData["verdict"]) {
  return v === "positive" ? PALETTE.up : v === "negative" ? PALETTE.down : PALETTE.muted;
}

function signed(value: number, digits = 1, suffix = "R") {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}${suffix}`;
}

function drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 32, size / 32);
  ctx.fillStyle = PALETTE.ink;
  ctx.fill(new Path2D("M4 4H27V10H10V22H27V28H4V4Z"));
  ctx.fillStyle = PALETTE.gold;
  ctx.fill(new Path2D("M22 13H28V19H22V13Z"));
  ctx.restore();
}

function drawCard(ctx: CanvasRenderingContext2D, card: RCardData, monthEn: string, currencyText: string) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // frame
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(48.5, 48.5, SIZE - 97, SIZE - 97);

  const L = 96;
  const R = SIZE - 96;

  // header: logo + wordmark, month on the right
  drawLogo(ctx, L, 92, 52);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `600 24px ${MONO}`;
  ctx.textAlign = "left";
  ctx.fillText("CERFINITS", L + 68, 116);
  ctx.fillStyle = PALETTE.gold;
  ctx.fillText("JOURNAL", L + 68, 144);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `500 26px ${MONO}`;
  ctx.textAlign = "right";
  ctx.fillText(monthEn, R, 132);

  // divider
  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(L, 190);
  ctx.lineTo(R, 190);
  ctx.stroke();

  if (card.verdict === "empty") {
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 40px ${SANS}`;
    ctx.textAlign = "center";
    ctx.fillText("No trades recorded this month", SIZE / 2, 560);
    drawFooter(ctx, L, R);
    return;
  }

  // hero — Net R or Net PnL
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `600 30px ${MONO}`;
  ctx.textAlign = "left";
  if (card.validR > 0) {
    ctx.fillText("NET R", L, 288);
    ctx.fillStyle = verdictColor(card.verdict);
    ctx.font = `700 210px ${SANS}`;
    ctx.fillText(signed(card.netR, 1), L - 6, 460);
  } else {
    ctx.fillText("NET P&L", L, 288);
    ctx.fillStyle = card.netPnl >= 0 ? PALETTE.up : PALETTE.down;
    // Scale font size down slightly for large currency numbers
    ctx.font = `700 140px ${SANS}`;
    ctx.fillText(currencyText, L - 6, 460);
  }

  // sample-size honesty line
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText(`n = ${card.tradeCount} trades  ·  ${card.validR} valid R`, L, 512);

  // secondary stats: three columns
  const cols = [
    { label: "EXPECTANCY", value: card.expectancy == null ? "—" : signed(card.expectancy, 2) },
    { label: "WIN RATE", value: card.winRatePct == null ? "—" : `${Math.round(card.winRatePct)}%` },
    { label: "PROFIT FACTOR", value: card.profitFactor == null ? "—" : card.profitFactor.toFixed(2) },
  ];
  const statTop = 600;
  const colW = (R - L) / 3;
  ctx.strokeStyle = PALETTE.line;
  ctx.beginPath();
  ctx.moveTo(L, statTop);
  ctx.lineTo(R, statTop);
  ctx.stroke();
  cols.forEach((col, i) => {
    const cx = L + colW * i + 4;
    ctx.textAlign = "left";
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `600 22px ${MONO}`;
    ctx.fillText(col.label, cx, statTop + 54);
    ctx.fillStyle = PALETTE.ink;
    ctx.font = `600 76px ${SANS}`;
    ctx.fillText(col.value, cx, statTop + 138);
  });

  // day strip — green/red trading days
  const stripTop = 812;
  ctx.strokeStyle = PALETTE.line;
  ctx.beginPath();
  ctx.moveTo(L, stripTop);
  ctx.lineTo(R, stripTop);
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `600 22px ${MONO}`;
  ctx.fillText("TRADING DAYS", L, stripTop + 50);
  const dot = 26;
  const gap = 10;
  let dx = L;
  const dy = stripTop + 74;
  for (let i = 0; i < card.greenDays; i += 1) {
    ctx.fillStyle = PALETTE.up;
    ctx.fillRect(dx, dy, dot, dot);
    dx += dot + gap;
  }
  for (let i = 0; i < card.redDays; i += 1) {
    ctx.fillStyle = PALETTE.down;
    ctx.fillRect(dx, dy, dot, dot);
    dx += dot + gap;
  }
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `500 24px ${MONO}`;
  ctx.textAlign = "right";
  ctx.fillText(`${card.greenDays} up / ${card.redDays} down`, R, stripTop + 50);

  // currency P&L (secondary, honest sign)
  ctx.textAlign = "right";
  ctx.fillStyle = card.netPnl >= 0 ? PALETTE.up : PALETTE.down;
  ctx.font = `600 30px ${MONO}`;
  ctx.fillText(currencyText, R, dy + dot);

  drawFooter(ctx, L, R);
}

function drawFooter(ctx: CanvasRenderingContext2D, L: number, R: number) {
  const y = SIZE - 76;
  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(L, y - 34);
  ctx.lineTo(R, y - 34);
  ctx.stroke();
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `500 22px ${MONO}`;
  ctx.textAlign = "left";
  ctx.fillText("EDGE + DISCIPLINE = SUCCESS", L, y);
  ctx.fillStyle = PALETTE.gold;
  ctx.textAlign = "right";
  ctx.fillText("cerfinits", R, y);
}

export default function RCard({ trades, timeZone, currency }: { trades: JournalTrade[]; timeZone: string; currency: string }) {
  const { lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initial = useMemo(() => latestTradeMonth(trades, timeZone), [trades, timeZone]);
  const [{ year, month }, setMonth] = useState(initial);
  const [shareable, setShareable] = useState(false);

  const card = useMemo(
    () => buildMonthlyRCard(trades, year, month, timeZone, currency),
    [trades, year, month, timeZone, currency],
  );
  const monthEn = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
        .format(new Date(Date.UTC(year, month - 1, 1)))
        .toUpperCase(),
    [year, month],
  );
  const currencyText = useMemo(() => {
    const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });
    return `${card.netPnl > 0 ? "+" : ""}${fmt.format(card.netPnl)}`;
  }, [card.netPnl, currency]);

  useEffect(() => {
    setShareable(
      typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [new File([new Blob()], "x.png", { type: "image/png" })] }),
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let cancelled = false;
    const paint = () => {
      if (!cancelled) drawCard(ctx, card, monthEn, currencyText);
    };
    paint();
    // Repaint once fonts settle so the export matches the preview.
    if (typeof document !== "undefined" && document.fonts?.ready) document.fonts.ready.then(paint);
    return () => {
      cancelled = true;
    };
  }, [card, monthEn, currencyText]);

  const shift = useCallback((delta: number) => {
    setMonth(({ year: y, month: m }) => {
      const next = new Date(Date.UTC(y, m - 1 + delta, 1));
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 };
    });
  }, []);

  const fileName = `cerfinits-rcard-${card.monthKey}.png`;

  const download = useCallback(() => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [fileName]);

  const share = useCallback(() => {
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], fileName, { type: "image/png" });
      try {
        await navigator.share({ files: [file], title: `Cerfinits · ${monthEn}` });
      } catch {
        /* user cancelled or share failed — no-op */
      }
    }, "image/png");
  }, [fileName, monthEn]);

  return (
    <section className="j-panel j-rcard-panel">
      <div className="j-panel-head">
        <div>
          <h2><T th="การ์ดสรุปเดือน" en="Monthly summary card"/></h2>
          <p><T th="ภาพสรุปผลรายเดือน (R-first, ระบุ sample size) สำหรับดาวน์โหลดหรือแชร์" en="A monthly result card (R-first, with sample size) to download or share"/></p>
        </div>
        <div className="j-cal-month-control">
          <button type="button" className="j-cal-nav" aria-label={lang === "en" ? "Previous month" : "เดือนก่อนหน้า"} onClick={() => shift(-1)}>
            <JournalIcon name="arrow-left" size={16} />
          </button>
          <strong className="j-cal-month-label">{card.periodLabel}</strong>
          <button type="button" className="j-cal-nav" aria-label={lang === "en" ? "Next month" : "เดือนถัดไป"} onClick={() => shift(1)}>
            <JournalIcon name="arrow-right" size={16} />
          </button>
        </div>
      </div>

      <div className="j-rcard-body">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="j-rcard-canvas" role="img" aria-label={lang === "en" ? `Summary card ${card.periodLabel}` : `การ์ดสรุป ${card.periodLabel}`} />
        <div className="j-rcard-actions">
          <button type="button" className="j-primary-button" onClick={download}>
            <JournalIcon name="download" size={18} /> <T th="ดาวน์โหลด PNG" en="Download PNG"/>
          </button>
          {shareable ? (
            <button type="button" className="j-secondary-button" onClick={share}>
              <T th="แชร์" en="Share"/>
            </button>
          ) : null}
          <p className="j-rcard-hint"><T th="ขนาด 1080×1080 · เหมาะกับโพสต์ IG / story" en="1080×1080 · fits IG posts / stories"/></p>
        </div>
      </div>
    </section>
  );
}
