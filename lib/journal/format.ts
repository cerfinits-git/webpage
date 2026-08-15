export function createCurrencyFormatter(currency: string) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export function createDateTimeFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });
}

export function createShortDateFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "2-digit",
    month: "short",
    timeZone,
  });
}

export function formatR(value: number | null, digits = 2) {
  if (value == null || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}R`;
}

export function formatPrice(value: number) {
  return value >= 100 ? value.toLocaleString("en-US", { maximumFractionDigits: 2 }) : value.toFixed(5);
}
