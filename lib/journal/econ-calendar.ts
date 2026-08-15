import { zonedDateTimeInputToIso } from "./timezone.ts";
import { dayKeyInTimeZone } from "./daily.ts";

/**
 * Curated high-impact USD economic calendar (the movers for FX/Gold):
 * FOMC rate decisions, CPI, and Nonfarm Payrolls.
 *
 * Static dataset by design for v1 (S5/S6): no API key to leak client-side,
 * no scraping, zero running cost. Times are stored as US Eastern wall time
 * and converted through Intl at runtime, so EST/EDT is handled correctly and
 * each event lands on the right calendar day in the account's reporting
 * timezone (a 14:00 ET FOMC statement is the small hours of the NEXT day in
 * Asia/Bangkok — that is the day Thai traders live through it).
 *
 * Sources (verified 2026-07-17):
 * - FOMC: federalreserve.gov/monetarypolicy/fomccalendars.htm (all 8 meetings;
 *   date below = decision day 2, statement 14:00 ET)
 * - CPI: BLS schedule via usinflationcalculator.com mirror, cross-checked
 *   against bls.gov search results for Jul 14 + Aug 12 (08:30 ET)
 * - NFP: bls.gov news-release archive filenames for released dates (incl. the
 *   delayed Jan-data release on Feb 11); Sep-Dec follow the official
 *   first-Friday pattern and are flagged `tentative` until BLS confirms.
 *
 * Yearly maintenance: refresh this table each December for the coming year.
 */

export type EconEventType = "FOMC" | "CPI" | "NFP";

export interface EconEvent {
  id: string;
  /** Calendar date of the release in US Eastern time (YYYY-MM-DD). */
  dateET: string;
  /** Wall-clock release time in US Eastern (HH:mm). */
  timeET: string;
  type: EconEventType;
  nameTh: string;
  nameEn: string;
  currency: "USD";
  impact: "high";
  /** Scheduled by pattern but not yet confirmed by the source. */
  tentative?: boolean;
}

const NAMES: Record<EconEventType, { th: string; en: string }> = {
  FOMC: { th: "ผลประชุม FOMC (ดอกเบี้ย Fed)", en: "FOMC Rate Decision" },
  CPI: { th: "เงินเฟ้อสหรัฐ (CPI)", en: "US CPI" },
  NFP: { th: "การจ้างงานสหรัฐ (Nonfarm Payrolls)", en: "US Nonfarm Payrolls" },
};

function make(type: EconEventType, dateET: string, timeET: string, tentative = false): EconEvent {
  return {
    id: `${type.toLowerCase()}-${dateET}`,
    dateET,
    timeET,
    type,
    nameTh: NAMES[type].th,
    nameEn: NAMES[type].en,
    currency: "USD",
    impact: "high",
    ...(tentative ? { tentative: true } : {}),
  };
}

export const ECON_EVENTS_2026: EconEvent[] = [
  // FOMC decision days (day 2 of each meeting), statement 14:00 ET
  make("FOMC", "2026-01-28", "14:00"),
  make("FOMC", "2026-03-18", "14:00"),
  make("FOMC", "2026-04-29", "14:00"),
  make("FOMC", "2026-06-17", "14:00"),
  make("FOMC", "2026-07-29", "14:00"),
  make("FOMC", "2026-09-16", "14:00"),
  make("FOMC", "2026-10-28", "14:00"),
  make("FOMC", "2026-12-09", "14:00"),
  // CPI, 08:30 ET
  make("CPI", "2026-01-13", "08:30"),
  make("CPI", "2026-02-13", "08:30"),
  make("CPI", "2026-03-11", "08:30"),
  make("CPI", "2026-04-10", "08:30"),
  make("CPI", "2026-05-12", "08:30"),
  make("CPI", "2026-06-10", "08:30"),
  make("CPI", "2026-07-14", "08:30"),
  make("CPI", "2026-08-12", "08:30"),
  make("CPI", "2026-09-11", "08:30"),
  make("CPI", "2026-10-14", "08:30"),
  make("CPI", "2026-11-10", "08:30"),
  make("CPI", "2026-12-10", "08:30"),
  // NFP, 08:30 ET
  make("NFP", "2026-01-09", "08:30"),
  make("NFP", "2026-02-11", "08:30"), // Jan data — released late (delayed schedule)
  make("NFP", "2026-03-06", "08:30"),
  make("NFP", "2026-04-03", "08:30"),
  make("NFP", "2026-05-08", "08:30"),
  make("NFP", "2026-06-05", "08:30"),
  make("NFP", "2026-07-02", "08:30"),
  make("NFP", "2026-08-07", "08:30"),
  make("NFP", "2026-09-04", "08:30", true),
  make("NFP", "2026-10-02", "08:30", true),
  make("NFP", "2026-11-06", "08:30", true),
  make("NFP", "2026-12-04", "08:30", true),
];

/** UTC instant of an event (null only if the dataset entry is malformed). */
export function econEventInstant(event: EconEvent): string | null {
  return zonedDateTimeInputToIso(`${event.dateET}T${event.timeET}`, "America/New_York");
}

export interface EconDayEvent extends EconEvent {
  /** ISO instant of the release. */
  at: string;
}

/**
 * All events keyed by the calendar day they fall on in the given timezone.
 * Cached per timezone — the dataset is static.
 */
const byDayCache = new Map<string, Map<string, EconDayEvent[]>>();

export function econEventsByDay(timeZone: string): Map<string, EconDayEvent[]> {
  const cached = byDayCache.get(timeZone);
  if (cached) return cached;
  const map = new Map<string, EconDayEvent[]>();
  for (const event of ECON_EVENTS_2026) {
    const at = econEventInstant(event);
    if (!at) continue;
    const key = dayKeyInTimeZone(at, timeZone);
    if (!key) continue;
    const list = map.get(key) ?? [];
    list.push({ ...event, at });
    list.sort((a, b) => a.at.localeCompare(b.at));
    map.set(key, list);
  }
  byDayCache.set(timeZone, map);
  return map;
}
