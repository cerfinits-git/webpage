export function thb(value: number): string {
  return "฿" + Math.round(value).toLocaleString("en-US");
}

export function signedThb(value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return sign + thb(Math.abs(value)).slice(0);
}

export function pct(value: number, digits = 1): string {
  const sign = value >= 0 ? "+" : "−";
  return sign + (Math.abs(value) * 100).toFixed(digits) + "%";
}

export function money(value: number, currency: "USD" | "THB"): string {
  const formatted = value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return (currency === "USD" ? "$" : "฿") + formatted;
}

export function qty(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 8 });
}
