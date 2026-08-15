import type { JournalTrade } from "./types";
import { validateJournalTrade, withDerivedTradeValues } from "./validation.ts";

const MONEY_TOLERANCE = 0.02;

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
}

function normalizedForChecksum(trade: JournalTrade) {
  return {
    ...trade,
    executions: [...trade.executions]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map(({ sourceRow: _sourceRow, ...execution }) => execution),
  };
}

export function canonicalJournalJson(trades: JournalTrade[]) {
  const ordered = [...trades]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(normalizedForChecksum);
  return JSON.stringify(canonicalize(ordered));
}

export function fnv1a32(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function journalDatasetChecksum(trades: JournalTrade[]) {
  return fnv1a32(canonicalJournalJson(trades));
}

export async function journalDatasetSha256(trades: JournalTrade[]) {
  const bytes = new TextEncoder().encode(canonicalJournalJson(trades));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export interface DatasetValidationResult {
  valid: boolean;
  trades: JournalTrade[];
  issues: string[];
}

export function validateJournalDataset(trades: JournalTrade[]): DatasetValidationResult {
  const issues: string[] = [];
  const tradeIds = new Set<string>();
  const executionIds = new Set<string>();
  const normalized = trades.map(withDerivedTradeValues);

  normalized.forEach((trade) => {
    if (tradeIds.has(trade.id)) issues.push(`Duplicate trade ID: ${trade.id}`);
    tradeIds.add(trade.id);

    for (const issue of validateJournalTrade(trade)) {
      issues.push(`${trade.id}: ${issue.message}`);
    }

    const expectedR = trade.initialRiskAmount == null ? null : trade.netPnl / trade.initialRiskAmount;
    if ((expectedR == null) !== (trade.rMultiple == null)
      || (expectedR != null && trade.rMultiple != null && Math.abs(expectedR - trade.rMultiple) > 1e-9)) {
      issues.push(`${trade.id}: R multiple does not match Net P&L / Initial Risk`);
    }

    const commissionPnl = trade.commissionPnl ?? -trade.fees;
    const expectedNet = trade.grossPnl + commissionPnl + trade.swap;
    if (Math.abs(expectedNet - trade.netPnl) > MONEY_TOLERANCE) {
      issues.push(`${trade.id}: Gross P&L, commission, swap, and Net P&L do not reconcile`);
    }

    trade.executions.forEach((execution) => {
      if (executionIds.has(execution.id)) issues.push(`Duplicate execution ID: ${execution.id}`);
      executionIds.add(execution.id);
      if (execution.tradeId !== trade.id) issues.push(`${execution.id}: execution ownership does not match trade`);
      if (!(execution.quantity > 0) || !Number.isFinite(execution.quantity)) issues.push(`${execution.id}: invalid quantity`);
      if (!(execution.price > 0) || !Number.isFinite(execution.price)) issues.push(`${execution.id}: invalid price`);
      if (!Number.isFinite(Date.parse(execution.executedAt))) issues.push(`${execution.id}: invalid execution time`);
    });
  });

  return { valid: issues.length === 0, trades: normalized, issues };
}
