"use client";

import { cumulativeRSeries, cumulativePnlSeries, calculateUnderwaterSeries, calculateDollarUnderwaterSeries } from "@/lib/journal/metrics";
import { createShortDateFormatter, createCurrencyFormatter, formatR } from "@/lib/journal/format";
import type { JournalTrade } from "@/lib/journal/types";
import { T, useLang } from "@/components/site/LangContext";

function linePath(values: number[], width: number, height: number, padding = 18) {
  if (values.length === 0) return "";
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const range = Math.max(max - min, 1);
  return values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = padding + ((max - value) / range) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

export function Sparkline({
  values,
  tone = "positive",
}: {
  values: number[];
  tone?: "positive" | "negative" | "neutral" | "cyan";
}) {
  const { lang } = useLang();
  const strokeColor =
    tone === "negative"
      ? "var(--j-negative)"
      : tone === "cyan"
      ? "var(--j-cyan)"
      : tone === "neutral"
      ? "var(--j-gold)"
      : "var(--j-positive)";

  return (
    <svg className="j-sparkline" viewBox="0 0 120 42" role="img" aria-label={lang === "en" ? "Metric trend" : "แนวโน้ม metric"}>
      <path d={linePath(values, 120, 42, 3)} fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CumulativeRChart({ trades, timeZone = "Asia/Bangkok" }: { trades: JournalTrade[]; timeZone?: string }) {
  const { lang } = useLang();
  const series = cumulativeRSeries(trades);
  const shortDateFormatter = createShortDateFormatter(timeZone);
  const values = series.map((point) => point.value);
  if (values.length === 0) return <div className="j-chart-empty"><T th="ไม่มี trade ที่มี Initial Risk ในช่วงเวลานี้" en="No trades with Initial Risk in this period"/></div>;
  const path = linePath(values, 900, 270, 28);
  const min = Math.floor(Math.min(0, ...values));
  const max = Math.ceil(Math.max(0, ...values));
  const range = Math.max(max - min, 1);
  const yFor = (value: number) => 28 + ((max - value) / range) * 214;
  const ticks = Array.from({ length: 5 }, (_, index) => max - (range * index) / 4);
  const axisIndexes = [...new Set([0, Math.floor((series.length - 1) / 3), Math.floor(((series.length - 1) * 2) / 3), series.length - 1])];
  const lastValue = values[values.length - 1];
  const endY = yFor(lastValue);
  const endTone = lastValue >= 0 ? "is-up" : "is-down";
  // keep the floating value label inside the plot area
  const labelY = Math.min(Math.max(endY - 10, 22), 236);

  return (
    <div className="j-chart-wrap">
      <svg viewBox="0 0 900 270" role="img" aria-label={lang === "en" ? "Cumulative R chart" : "กราฟ Cumulative R"}>
        <defs>
          <linearGradient id="j-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--j-positive)" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="var(--j-positive)" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {ticks.map((tick, index) => {
          const y = 28 + (index / 4) * 214;
          return (
            <g key={tick}>
              <line x1="28" x2="880" y1={y} y2={y} className="j-chart-grid"/>
              <text x="4" y={y + 4} className="j-chart-label">{tick.toFixed(0)}R</text>
            </g>
          );
        })}
        {min < 0 && max > 0 ? <line x1="28" x2="880" y1={yFor(0)} y2={yFor(0)} className="j-chart-zero"/> : null}
        <path d={`${path} L872 242 L28 242 Z`} className="j-chart-area"/>
        <path d={path} className="j-chart-line"/>
        <circle cx="872" cy={endY} r="4" className={`j-chart-end ${endTone}`}/>
        <text x="864" y={labelY} className={`j-chart-end-label ${endTone}`}>{formatR(lastValue, 1)}</text>
      </svg>
      <div className="j-chart-axis">{axisIndexes.map((index) => <span key={series[index].id}>{shortDateFormatter.format(new Date(series[index].date))}</span>)}</div>
    </div>
  );
}

export function CumulativePnlChart({ trades, timeZone = "Asia/Bangkok" }: { trades: JournalTrade[]; timeZone?: string }) {
  const { lang } = useLang();
  const series = cumulativePnlSeries(trades);
  const shortDateFormatter = createShortDateFormatter(timeZone);
  const values = series.map((point: any) => point.value);
  if (values.length === 0) return <div className="j-chart-empty"><T th="ไม่มีข้อมูล Trade ในช่วงเวลานี้" en="No trade data in this period"/></div>;
  const path = linePath(values, 900, 270, 28);
  const min = Math.floor(Math.min(0, ...values));
  const max = Math.ceil(Math.max(0, ...values));
  const range = Math.max(max - min, 1);
  const yFor = (value: number) => 28 + ((max - value) / range) * 214;
  const ticks = Array.from({ length: 5 }, (_, index) => max - (range * index) / 4);
  const axisIndexes = [...new Set([0, Math.floor((series.length - 1) / 3), Math.floor(((series.length - 1) * 2) / 3), series.length - 1])];
  const lastValue = values[values.length - 1];
  const endY = yFor(lastValue);
  const endTone = lastValue >= 0 ? "is-up" : "is-down";
  const labelY = Math.min(Math.max(endY - 10, 22), 236);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="j-chart-wrap">
      <svg viewBox="0 0 900 270" role="img" aria-label={lang === "en" ? "Cumulative P&L chart" : "กราฟ Cumulative P&L"}>
        <defs>
          <linearGradient id="j-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--j-positive)" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="var(--j-positive)" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {ticks.map((tick, index) => {
          const y = 28 + (index / 4) * 214;
          return (
            <g key={tick}>
              <line x1="48" x2="880" y1={y} y2={y} className="j-chart-grid"/>
              <text x="4" y={y + 4} className="j-chart-label" style={{ fontSize: '10px' }}>{tick > 1000 || tick < -1000 ? (tick/1000).toFixed(1) + 'k' : tick.toFixed(0)}</text>
            </g>
          );
        })}
        {min < 0 && max > 0 ? <line x1="48" x2="880" y1={yFor(0)} y2={yFor(0)} className="j-chart-zero"/> : null}
        <path d={`${path} L872 242 L28 242 Z`} className="j-chart-area"/>
        <path d={path} className="j-chart-line"/>
        <circle cx="872" cy={endY} r="4" className={`j-chart-end ${endTone}`}/>
        <text x="864" y={labelY} className={`j-chart-end-label ${endTone}`}>{formatCurrency(lastValue)}</text>
      </svg>
      <div className="j-chart-axis">{axisIndexes.map((index) => <span key={series[index].id}>{shortDateFormatter.format(new Date(series[index].date))}</span>)}</div>
    </div>
  );
}

export function UnderwaterChart({ trades, timeZone = "Asia/Bangkok" }: { trades: JournalTrade[]; timeZone?: string }) {
  const { lang } = useLang();
  const { series, maxDrawdownR } = calculateUnderwaterSeries(trades);
  const shortDateFormatter = createShortDateFormatter(timeZone);
  if (series.length === 0) return <div className="j-chart-empty"><T th="ไม่มีข้อมูล Trade สำหรับสร้าง Underwater Chart" en="No trade data to build the underwater chart"/></div>;

  const drawdowns = series.map((s: any) => s.drawdownR);
  const minDD = Math.min(-0.1, ...drawdowns);
  const padding = 28;
  const width = 900;
  const height = 240;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const yFor = (val: number) => padding + ((val / minDD) * plotHeight);
  const xFor = (index: number) => padding + (index / Math.max(series.length - 1, 1)) * plotWidth;

  const points = series.map((point: any, index: number) => {
    const x = xFor(index);
    const y = yFor(point.drawdownR);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  const zeroY = yFor(0);
  const areaPath = `${points} L${(padding + plotWidth).toFixed(1)} ${zeroY.toFixed(1)} L${padding} ${zeroY.toFixed(1)} Z`;

  const ticks = [0, minDD / 2, minDD];
  const axisIndexes = [...new Set([0, Math.floor((series.length - 1) / 3), Math.floor(((series.length - 1) * 2) / 3), series.length - 1])];
  const lastDD = drawdowns[drawdowns.length - 1];
  const lastX = xFor(series.length - 1);
  const lastY = yFor(lastDD);

  return (
    <div className="j-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={lang === "en" ? "Underwater drawdown chart" : "กราฟ Underwater Drawdown"}>
        <defs>
          <linearGradient id="j-underwater-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--j-negative)" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="var(--j-negative)" stopOpacity="0.45"/>
          </linearGradient>
        </defs>
        {ticks.map((tick) => {
          const y = yFor(tick);
          return (
            <g key={tick}>
              <line x1={padding} x2={width - padding} y1={y} y2={y} className="j-chart-grid"/>
              <text x="4" y={y + 4} className="j-chart-label" style={{ fontSize: '10px' }}>{tick.toFixed(1)}R</text>
            </g>
          );
        })}
        <line x1={padding} x2={width - padding} y1={zeroY} y2={zeroY} className="j-chart-zero" style={{ stroke: 'var(--j-positive)', strokeWidth: 1.5 }}/>
        <path d={areaPath} fill="url(#j-underwater-fill)"/>
        <path d={points} fill="none" stroke="var(--j-negative)" strokeWidth="2"/>
        <circle cx={lastX} cy={lastY} r="4" fill="var(--j-negative)"/>
        <text x={Math.min(lastX - 10, width - 60)} y={Math.max(lastY - 8, 20)} fill="var(--j-negative)" fontSize="12" fontWeight="600">
          {lastDD.toFixed(1)}R
        </text>
      </svg>
      <div className="j-chart-axis">{axisIndexes.map((index) => <span key={series[index].id}>{shortDateFormatter.format(new Date(series[index].date))}</span>)}</div>
    </div>
  );
}

export function DollarUnderwaterChart({ trades, timeZone = "Asia/Bangkok", currency = "USD" }: { trades: JournalTrade[]; timeZone?: string; currency?: string }) {
  const { lang } = useLang();
  const { series } = calculateDollarUnderwaterSeries(trades, lang);
  const shortDateFormatter = createShortDateFormatter(timeZone);
  const money = createCurrencyFormatter(currency);
  if (series.length === 0) return <div className="j-chart-empty"><T th="ไม่มีข้อมูล Trade สำหรับสร้าง Underwater Chart" en="No trade data to build the underwater chart"/></div>;

  const drawdowns = series.map((s) => s.drawdownUsd);
  const minDD = Math.min(-1, ...drawdowns);
  const padding = 28;
  const width = 900;
  const height = 240;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const yFor = (val: number) => padding + (val / minDD) * plotHeight;
  const xFor = (index: number) => padding + (index / Math.max(series.length - 1, 1)) * plotWidth;

  const points = series.map((point, index) => `${index === 0 ? "M" : "L"}${xFor(index).toFixed(1)} ${yFor(point.drawdownUsd).toFixed(1)}`).join(" ");
  const zeroY = yFor(0);
  const areaPath = `${points} L${(padding + plotWidth).toFixed(1)} ${zeroY.toFixed(1)} L${padding} ${zeroY.toFixed(1)} Z`;
  const ticks = [0, minDD / 2, minDD];
  const axisIndexes = [...new Set([0, Math.floor((series.length - 1) / 3), Math.floor(((series.length - 1) * 2) / 3), series.length - 1])];
  const lastDD = drawdowns[drawdowns.length - 1];
  const lastX = xFor(series.length - 1);
  const lastY = yFor(lastDD);

  return (
    <div className="j-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={lang === "en" ? "Underwater drawdown chart in account currency" : "กราฟ Underwater Drawdown เป็นสกุลเงินบัญชี"}>
        <defs>
          <linearGradient id="j-underwater-usd-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--j-negative)" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="var(--j-negative)" stopOpacity="0.45"/>
          </linearGradient>
        </defs>
        {ticks.map((tick) => {
          const y = yFor(tick);
          return (
            <g key={tick}>
              <line x1={padding} x2={width - padding} y1={y} y2={y} className="j-chart-grid"/>
              <text x="4" y={y + 4} className="j-chart-label" style={{ fontSize: "10px" }}>{money.format(tick)}</text>
            </g>
          );
        })}
        <line x1={padding} x2={width - padding} y1={zeroY} y2={zeroY} className="j-chart-zero" style={{ stroke: "var(--j-positive)", strokeWidth: 1.5 }}/>
        <path d={areaPath} fill="url(#j-underwater-usd-fill)"/>
        <path d={points} fill="none" stroke="var(--j-negative)" strokeWidth="2"/>
        <circle cx={lastX} cy={lastY} r="4" fill="var(--j-negative)"/>
        <text x={Math.min(lastX - 10, width - 90)} y={Math.max(lastY - 8, 20)} fill="var(--j-negative)" fontSize="12" fontWeight="600">
          {money.format(lastDD)}
        </text>
      </svg>
      <div className="j-chart-axis">{axisIndexes.map((index) => <span key={series[index].id}>{shortDateFormatter.format(new Date(series[index].date))}</span>)}</div>
    </div>
  );
}

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarPoint(cx, cy, r, startAngle);
  const end = polarPoint(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

// A half-circle KPI gauge — shows the current value as a filled arc against a
// track, with min/max range labels. Deliberately has no "goal" marker: this
// journal never asserts a universal target number (e.g. "60% win rate is
// good"), since the right target depends on a trader's own R:R.
export function Gauge({
  value,
  min = 0,
  max,
  label,
  formattedValue,
  minLabel,
  maxLabel,
  tone = "neutral",
}: {
  value: number;
  min?: number;
  max: number;
  label: string;
  formattedValue: string;
  minLabel: string;
  maxLabel: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  const clamped = Math.max(min, Math.min(max, value));
  const fraction = max > min ? (clamped - min) / (max - min) : 0;
  const valueAngle = 180 - fraction * 180;
  const toneColor = tone === "positive" ? "var(--j-positive)" : tone === "negative" ? "var(--j-negative)" : "var(--j-gold)";

  return (
    <div className="j-gauge">
      <svg viewBox="0 0 200 116" role="img" aria-label={`${label}: ${formattedValue}`}>
        <path d={describeArc(100, 100, 80, 180, 0)} fill="none" stroke="var(--j-line)" strokeWidth="16" strokeLinecap="round"/>
        {fraction > 0 ? (
          <path d={describeArc(100, 100, 80, 180, valueAngle)} fill="none" stroke={toneColor} strokeWidth="16" strokeLinecap="round"/>
        ) : null}
        <text x="100" y="90" textAnchor="middle" className="j-gauge-value">{formattedValue}</text>
      </svg>
      <div className="j-gauge-label">{label}</div>
      <div className="j-gauge-range"><span>{minLabel}</span><span>{maxLabel}</span></div>
    </div>
  );
}

export function DurationBarChart({ buckets }: { buckets: { label: string; successCount: number; failCount: number }[] }) {
  const { lang } = useLang();
  const maxCount = Math.max(1, ...buckets.flatMap((b) => [b.successCount, b.failCount]));
  const width = 700;
  const height = 260;
  const padTop = 16;
  const padRight = 16;
  const padBottom = 40;
  const padLeft = 32;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const groupWidth = plotWidth / buckets.length;
  const barWidth = groupWidth * 0.3;
  const gap = groupWidth * 0.08;
  const tickCount = 4;
  const tickStep = Math.max(1, Math.ceil(maxCount / tickCount));
  const niceMax = tickStep * tickCount;

  return (
    <div className="j-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={lang === "en" ? "Successful vs unsuccessful trades by duration" : "จำนวนไม้สำเร็จเทียบไม่สำเร็จ ตามระยะเวลาถือไม้"}>
        {Array.from({ length: tickCount + 1 }, (_, i) => {
          const val = tickStep * i;
          const y = padTop + plotHeight - (val / niceMax) * plotHeight;
          return (
            <g key={i}>
              <line x1={padLeft} x2={width - padRight} y1={y} y2={y} className="j-chart-grid"/>
              <text x={padLeft - 6} y={y + 4} textAnchor="end" className="j-chart-label">{val}</text>
            </g>
          );
        })}
        {buckets.map((b, i) => {
          const groupX = padLeft + i * groupWidth;
          const successH = (b.successCount / niceMax) * plotHeight;
          const failH = (b.failCount / niceMax) * plotHeight;
          return (
            <g key={b.label}>
              <rect x={groupX + gap} y={padTop + plotHeight - successH} width={barWidth} height={successH} fill="var(--j-positive)"/>
              <rect x={groupX + gap * 2 + barWidth} y={padTop + plotHeight - failH} width={barWidth} height={failH} fill="var(--j-negative)"/>
              <text x={groupX + groupWidth / 2} y={height - padBottom + 18} textAnchor="middle" className="j-chart-label">{b.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="j-chart-legend-row">
        <span><i style={{ background: "var(--j-positive)" }}/><T th="ไม้สำเร็จ" en="Successful"/></span>
        <span><i style={{ background: "var(--j-negative)" }}/><T th="ไม้ไม่สำเร็จ" en="Unsuccessful"/></span>
      </div>
    </div>
  );
}

