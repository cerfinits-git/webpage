import { fnv1a32 } from "./integrity.ts";
import type { ImportIssue, ImportPreview, JournalTrade, TradeSide } from "./types";
import { DEFAULT_JOURNAL_ACCOUNT } from "./accounts.ts";

export interface CTraderImportOptions {
  accountId?: string;
}

export const MAX_CTRADER_CSV_BYTES = 4 * 1024 * 1024;
export const MAX_CTRADER_CSV_DATA_ROWS = 10_000;
export const MAX_CTRADER_PREVIEW_ISSUES = 100;

export function limitCtraderPreviewIssues(
  issues: ImportIssue[],
  limit = MAX_CTRADER_PREVIEW_ISSUES,
) {
  const visible = issues.slice(0, Math.max(0, limit));
  return { visible, hiddenCount: Math.max(0, issues.length - visible.length) };
}

export function summarizeCtraderImportPreview(
  preview: ImportPreview,
  existingTrades: JournalTrade[] = [],
) {
  const existingById = new Map(existingTrades.map((trade) => [trade.id, trade]));
  const summary = {
    readyTrades: preview.trades.length,
    missingRiskTrades: 0,
    needsInfoIssues: 0,
    duplicateRows: 0,
    rejectedRows: 0,
  };

  for (const trade of preview.trades) {
    const currentRisk = existingById.get(trade.id)?.initialRiskAmount;
    const effectiveRisk = currentRisk != null && currentRisk > 0
      ? currentRisk
      : trade.initialRiskAmount;
    if (effectiveRisk == null || effectiveRisk <= 0) {
      summary.missingRiskTrades += 1;
    }
  }
  for (const issue of preview.issues) {
    if (issue.kind === "needs-info") summary.needsInfoIssues += 1;
    else if (issue.kind === "duplicate") summary.duplicateRows += 1;
    else summary.rejectedRows += 1;
  }
  return summary;
}

interface CTraderSegment {
  row: number;
  rowHash: string;
  positionId: string;
  closingDealId: string | null;
  symbol: string;
  side: TradeSide;
  openedAt: string;
  closedAt: string;
  quantity: number;
  entry: number;
  exit: number;
  stop: number | null;
  riskAmount: number | null;
  grossPnl: number;
  commissionPnl: number;
  swapPnl: number;
  netPnl: number;
}

function parseRows(text: string, maxRows: number) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  let overflow = false;

  const pushRow = () => {
    row.push(cell.trim());
    if (row.some(Boolean)) {
      rows.push(row);
      if (rows.length > maxRows) overflow = true;
    }
    row = [];
    cell = "";
  };

  for (let index = 0; index < text.length && !overflow; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      pushRow();
    } else {
      cell += char;
    }
  }
  if (!overflow) pushRow();
  return { rows, overflow };
}

function normalizeHeader(value: string) {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase();
}

function pick(record: Record<string, string>, aliases: string[]) {
  for (const alias of aliases) {
    const value = record[alias];
    if (value != null && value !== "") return value;
  }
  return "";
}

function pickDynamic(record: Record<string, string>, aliases: string[], prefixes: string[]) {
  const direct = pick(record, aliases);
  if (direct) return direct;
  const key = Object.keys(record).find((header) => prefixes.some((prefix) => header.startsWith(prefix)));
  return key ? record[key] : "";
}

function parseNumber(value: string) {
  const normalized = value.replace(/[,$฿\s]/g, "");
  if (normalized === "") return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasExplicitOffset(value: string) {
  return /(?:z|[+-]\d{2}:?\d{2})$/i.test(value.trim());
}

function parseBrokerTime(value: string) {
  if (!hasExplicitOffset(value)) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function addIssue(issues: ImportIssue[], row: number, message: string, kind: ImportIssue["kind"] = "rejected") {
  issues.push({ row, message, kind });
}

function weightedAverage(segments: CTraderSegment[], select: (segment: CTraderSegment) => number) {
  const quantity = segments.reduce((sum, segment) => sum + segment.quantity, 0);
  return segments.reduce((sum, segment) => sum + select(segment) * segment.quantity, 0) / quantity;
}

function valuesAgree(values: number[]) {
  return values.every((value) => Math.abs(value - values[0]) < 1e-9);
}

function groupSegments(segments: CTraderSegment[], accountId: string, issues: ImportIssue[]) {
  const trades: JournalTrade[] = [];
  const groups = new Map<string, CTraderSegment[]>();
  segments.forEach((segment) => {
    const key = `${accountId}:${segment.positionId}`;
    groups.set(key, [...(groups.get(key) ?? []), segment]);
  });

  groups.forEach((rawGroup) => {
    const first = rawGroup[0];
    if (rawGroup.some((segment) => segment.symbol !== first.symbol || segment.side !== first.side)) {
      addIssue(issues, first.row, `Position ${first.positionId} มี Symbol หรือ Side ไม่ตรงกัน`, "conflict");
      return;
    }
    if (rawGroup.length > 1 && rawGroup.some((segment) => !segment.closingDealId)) {
      addIssue(issues, first.row, `Position ${first.positionId} มีหลาย partial closes แต่ไม่มี Closing Deal ID สำหรับแยก evidence`, "rejected");
      return;
    }

    const evidence = new Map<string, CTraderSegment>();
    let conflicted = false;
    rawGroup.forEach((segment) => {
      const evidenceId = segment.closingDealId ?? `row:${segment.rowHash}`;
      const existing = evidence.get(evidenceId);
      if (!existing) {
        evidence.set(evidenceId, segment);
      } else if (existing.rowHash === segment.rowHash) {
        addIssue(issues, segment.row, `Duplicate closing evidence ${evidenceId} ถูกข้าม`, "duplicate");
      } else {
        addIssue(issues, segment.row, `Closing evidence ${evidenceId} มีค่าขัดแย้งกัน`, "conflict");
        conflicted = true;
      }
    });
    if (conflicted) return;

    const group = [...evidence.values()].sort((left, right) => (
      left.closedAt.localeCompare(right.closedAt)
      || String(left.closingDealId).localeCompare(String(right.closingDealId))
    ));
    const quantity = group.reduce((sum, segment) => sum + segment.quantity, 0);
    const netPnl = group.reduce((sum, segment) => sum + segment.netPnl, 0);
    const grossPnl = group.reduce((sum, segment) => sum + segment.grossPnl, 0);
    const commissionPnl = group.reduce((sum, segment) => sum + segment.commissionPnl, 0);
    const swap = group.reduce((sum, segment) => sum + segment.swapPnl, 0);
    const fees = group.reduce((sum, segment) => sum + Math.max(0, -segment.commissionPnl), 0);
    const risks = group.map((segment) => segment.riskAmount).filter((value): value is number => value != null && value > 0);
    const stops = group.map((segment) => segment.stop).filter((value): value is number => value != null && value > 0);
    const initialRiskAmount = risks.length > 0 && valuesAgree(risks) ? risks[0] : null;
    const initialStop = stops.length > 0 && valuesAgree(stops) ? stops[0] : null;
    if (risks.length > 0 && !valuesAgree(risks)) addIssue(issues, first.row, `Position ${first.positionId} มี Initial Risk หลายค่า กรุณาตรวจสอบ`, "needs-info");
    if (initialRiskAmount == null) addIssue(issues, first.row, `Position ${first.positionId} ไม่มี Initial Risk amount จึงยังไม่รวมใน R metrics`, "needs-info");
    if (initialStop == null) addIssue(issues, first.row, `Position ${first.positionId} ไม่มี Initial Stop ที่ยืนยันได้`, "needs-info");

    const safePositionId = encodeURIComponent(first.positionId);
    const id = `ctrader-${accountId}-position-${safePositionId}`;
    const sourceEvidenceHash = fnv1a32(group.map((segment) => segment.rowHash).sort().join("|"));
    trades.push({
      id,
      accountId,
      symbol: first.symbol,
      side: first.side,
      openedAt: group.reduce((earliest, segment) => segment.openedAt < earliest ? segment.openedAt : earliest, first.openedAt),
      closedAt: group.reduce((latest, segment) => segment.closedAt > latest ? segment.closedAt : latest, first.closedAt),
      quantity,
      averageEntry: weightedAverage(group, (segment) => segment.entry),
      averageExit: weightedAverage(group, (segment) => segment.exit),
      initialStop,
      initialRiskAmount,
      grossPnl,
      fees,
      commissionPnl,
      swap,
      netPnl,
      rMultiple: initialRiskAmount == null ? null : netPnl / initialRiskAmount,
      setup: "Unmapped",
      timeframe: "Unmapped",
      session: "Unmapped",
      marketCondition: "Unmapped",
      notes: "Imported from cTrader CSV. Complete setup and risk fields before analysis.",
      tags: ["Imported"],
      source: "ctrader-csv",
      externalPositionId: first.positionId,
      sourceEvidenceHash,
      executions: group.map((segment, index) => ({
        id: `${id}-close-${segment.closingDealId ?? segment.rowHash}`,
        tradeId: id,
        type: index === group.length - 1 ? "exit" : "partial",
        side: first.side === "buy" ? "sell" : "buy",
        executedAt: segment.closedAt,
        quantity: segment.quantity,
        price: segment.exit,
        fee: Math.max(0, -segment.commissionPnl),
        externalId: segment.closingDealId ?? `row:${segment.rowHash}`,
        externalPositionId: first.positionId,
        commissionPnl: segment.commissionPnl,
        swapPnl: segment.swapPnl,
        sourceRow: segment.row,
        sourceHash: segment.rowHash,
      })),
    });
  });
  return trades;
}

export function parseCtraderCsv(
  text: string,
  fileName = "cTrader.csv",
  options: CTraderImportOptions = {},
): ImportPreview {
  const accountId = options.accountId?.trim() || DEFAULT_JOURNAL_ACCOUNT.id;
  if (new TextEncoder().encode(text).byteLength > MAX_CTRADER_CSV_BYTES) {
    return {
      fileName,
      trades: [],
      issues: [{
        row: 1,
        message: `ไฟล์ใหญ่เกิน ${MAX_CTRADER_CSV_BYTES / 1024 / 1024} MiB ระบบยังไม่อ่านเพื่อป้องกัน browser ค้าง`,
        kind: "rejected",
      }],
    };
  }
  const parsedRows = parseRows(text, MAX_CTRADER_CSV_DATA_ROWS + 1);
  if (parsedRows.overflow) {
    return {
      fileName,
      trades: [],
      issues: [{
        row: MAX_CTRADER_CSV_DATA_ROWS + 2,
        message: `ไฟล์มีมากกว่า ${MAX_CTRADER_CSV_DATA_ROWS.toLocaleString("en-US")} data rows ระบบไม่สร้าง partial preview`,
        kind: "rejected",
      }],
    };
  }
  const rows = parsedRows.rows;
  if (rows.length < 2) {
    return { fileName, trades: [], issues: [{ row: 1, message: "ไฟล์ไม่มีข้อมูล trade", kind: "rejected" }] };
  }
  const headers = rows[0].map(normalizeHeader);
  const issues: ImportIssue[] = [];
  const segments: CTraderSegment[] = [];

  rows.slice(1).forEach((cells, rowIndex) => {
    const record = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    const currentRow = rowIndex + 2;
    const positionId = pick(record, ["position id", "positionid", "resulting position", "requesting position"]);
    const closingDealId = pick(record, ["closing deal id", "closingdealid", "deal id", "dealid", "id"]) || null;
    const symbol = pick(record, ["symbol", "symbolname", "symbol name", "instrument"]).toUpperCase();
    const direction = pick(record, ["opening direction", "tradetype", "trade type", "direction", "side", "trade side"]).toLowerCase();
    const side: TradeSide | null = direction.includes("buy") ? "buy" : direction.includes("sell") ? "sell" : null;
    const entry = parseNumber(pick(record, ["entry price", "entryprice", "entry", "open price"]));
    const exit = parseNumber(pick(record, ["closing price", "closingprice", "close price", "exit price", "exit"]));
    const stop = parseNumber(pick(record, ["initial stop", "stop loss", "sl"]));
    const riskAmount = parseNumber(pick(record, ["initial risk", "risk amount", "risk"]));
    const quantity = parseNumber(pick(record, ["closing quantity", "quantity", "volume", "volumeinunits", "volume in units", "size"]));
    const pnl = parseNumber(pickDynamic(record, ["net profit", "netprofit", "net p/l", "net pnl", "net real."], ["net (", "net real"]));
    const gross = parseNumber(pickDynamic(record, ["gross profit", "grossprofit", "gross p/l", "gross pnl", "gross real."], ["gross (", "gross real"]));
    const commissionPnl = parseNumber(pick(record, ["commission", "commissions", "real. broker commission", "broker commission"])) ?? 0;
    const swapPnl = parseNumber(pick(record, ["swap", "swaps", "realised swaps", "realized swaps"])) ?? 0;
    const openedAtRaw = pick(record, ["entry time", "entrytime", "opening time", "opened at"]);
    const closedAtRaw = pick(record, ["close time", "closing time", "closingtime", "closed at"]);
    const openedAt = parseBrokerTime(openedAtRaw);
    const closedAt = parseBrokerTime(closedAtRaw);
    let rejected = false;

    if (!positionId) { addIssue(issues, currentRow, "ไม่พบ Position ID จึงไม่สามารถรวม lifecycle อย่างปลอดภัย", "needs-info"); rejected = true; }
    if (!symbol) { addIssue(issues, currentRow, "ไม่พบ Symbol"); rejected = true; }
    if (!side) { addIssue(issues, currentRow, "Opening direction ต้องเป็น Buy หรือ Sell"); rejected = true; }
    if (entry == null || entry <= 0 || exit == null || exit <= 0) { addIssue(issues, currentRow, "Entry/Closing price ต้องมากกว่า 0"); rejected = true; }
    if (quantity == null || quantity <= 0) { addIssue(issues, currentRow, "Closing quantity ต้องมากกว่า 0"); rejected = true; }
    if (!openedAt || !closedAt) { addIssue(issues, currentRow, "เวลาเปิด/ปิดต้องเป็น ISO พร้อม Z หรือ UTC offset"); rejected = true; }
    if (openedAt && closedAt && closedAt < openedAt) { addIssue(issues, currentRow, "เวลาปิดต้องไม่อยู่ก่อนเวลาเปิด"); rejected = true; }
    if (pnl == null) { addIssue(issues, currentRow, "ไม่มี authoritative Net P&L ระบบจะไม่เดาจาก price distance"); rejected = true; }
    if (gross != null && pnl != null && Math.abs(gross + commissionPnl + swapPnl - pnl) > 0.02) {
      addIssue(issues, currentRow, "Gross + commission + swap ไม่ reconcile กับ Net P&L");
      rejected = true;
    }
    if (rejected || !positionId || !symbol || !side || entry == null || exit == null || quantity == null || pnl == null || !openedAt || !closedAt) return;

    segments.push({
      row: currentRow,
      rowHash: fnv1a32(cells.join("|")),
      positionId,
      closingDealId,
      symbol,
      side,
      openedAt,
      closedAt,
      quantity,
      entry,
      exit,
      stop,
      riskAmount,
      grossPnl: gross ?? pnl - commissionPnl - swapPnl,
      commissionPnl,
      swapPnl,
      netPnl: pnl,
    });
  });

  return { fileName, trades: groupSegments(segments, accountId, issues), issues };
}

export const SAMPLE_CTRADER_CSV = `Position ID,Closing Deal ID,Symbol,Opening Direction,Closing Quantity,Entry Time,Closing Time,Entry Price,Closing Price,Initial Stop,Initial Risk,Gross Profit,Net Profit,Commissions,Swap
1001,501,XAUUSD,Buy,0.10,2026-07-14T08:30:00Z,2026-07-14T11:05:00Z,2405.00,2437.00,2392.00,1900,3500,3420,-80,0
1002,502,EURUSD,Sell,1.00,2026-07-13T07:10:00Z,2026-07-13T09:25:00Z,1.0860,1.0910,1.0810,1000,-960,-1000,-40,0
1003,503,NAS100,Buy,0.50,2026-07-12T13:40:00Z,2026-07-12T15:10:00Z,20150,20270,,,1260,1200,-60,0`;
