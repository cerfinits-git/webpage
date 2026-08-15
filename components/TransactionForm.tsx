"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { AssetType, Currency, TradePrefill } from "@/lib/types";
import { T, useLang } from "@/components/site/LangContext";
import JournalIcon from "@/components/journal/JournalIcon";

const TYPE_OPTIONS: { value: AssetType; label: string; labelEn: string }[] = [
  { value: "stock", label: "หุ้น", labelEn: "Stock" },
  { value: "etf", label: "ETF", labelEn: "ETF" },
  { value: "fund", label: "กองทุนรวม", labelEn: "Mutual Fund" },
  { value: "crypto", label: "คริปโต", labelEn: "Crypto" },
  { value: "gold", label: "ทองคำ", labelEn: "Gold" },
];

const PRESETS: (Omit<TradePrefill, "side" | "price"> & { label: string; labelEn: string })[] = [
  { label: "VOO", labelEn: "VOO", assetType: "etf", symbol: "VOO", name: "VOO · ETF", currency: "USD" },
  { label: "PTT.BK", labelEn: "PTT.BK", assetType: "stock", symbol: "PTT.BK", name: "PTT · หุ้นไทย", currency: "THB" },
  { label: "BTC", labelEn: "BTC", assetType: "crypto", symbol: "BTC", name: "BTC · crypto", currency: "USD" },
  { label: "ETH", labelEn: "ETH", assetType: "crypto", symbol: "ETH", name: "ETH · crypto", currency: "USD" },
  { label: "ทองคำ", labelEn: "Gold", assetType: "gold", symbol: "GOLD96.5", name: "ทองคำ 96.5%", currency: "THB" },
];

const TODAY = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  side: "buy" as "buy" | "sell",
  symbol: "",
  name: "",
  quantity: "",
  price: "",
  fee: "0",
  tradedAt: TODAY(),
};

export default function TransactionForm() {
  const router = useRouter();
  const { lang } = useLang();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const [assetType, setAssetType] = useState<AssetType>("stock");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [f, setF] = useState(EMPTY);
  const busy = saving || pending;

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [key]: e.target.value }));

  function applyPrefill(d: Partial<TradePrefill>) {
    if (d.assetType) setAssetType(d.assetType);
    if (d.currency) setCurrency(d.currency);
    setF((p) => ({
      ...p,
      side: d.side ?? p.side,
      symbol: d.symbol ?? p.symbol,
      name: d.name ?? p.name,
      price: d.price != null ? String(d.price) : "",
      quantity: "",
      tradedAt: TODAY(),
    }));
    setError("");
    setOpen(true);
    setTimeout(() => {
      (document.getElementById("tx-quantity") as HTMLInputElement | null)?.focus();
    }, 60);
  }

  useEffect(() => {
    const handler = (e: Event) => applyPrefill((e as CustomEvent).detail);
    window.addEventListener("prefill-tx", handler);
    return () => window.removeEventListener("prefill-tx", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        assetType,
        side: f.side,
        symbol: f.symbol.trim().toUpperCase(),
        name: f.name.trim() || undefined,
        quantity: Number(f.quantity),
        price: Number(f.price),
        currency,
        fee: Number(f.fee) || 0,
        tradedAt: f.tradedAt,
      };

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? (lang === "en" ? "Save failed" : "บันทึกไม่สำเร็จ"));
        return;
      }
      setF({ ...EMPTY, tradedAt: TODAY() });
      setOpen(false);
      startTransition(() => router.refresh());
    } catch {
      setError(lang === "en" ? "Connection failed" : "เชื่อมต่อไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="j-primary-button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          minHeight: "36px",
          height: "36px",
          padding: "0 14px",
          borderRadius: "4px",
          fontSize: "13px",
          fontWeight: 500,
          background: "var(--j-ink)",
          color: "var(--j-ink-contrast)",
          border: "1px solid var(--j-ink)",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        <JournalIcon name="plus" size={14} />
        <span>
          <T th="บันทึกธุรกรรม" en="Log Transaction" />
        </span>
      </button>

      {open && (
        <div
          className="p-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.68)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "var(--panel, #262523)",
              border: "1px solid var(--line, rgba(255,255,255,0.12))",
              borderRadius: "10px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              padding: "22px 24px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--ink)" }}>
                <T th="บันทึกธุรกรรมใหม่" en="Log New Transaction" />
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            <form
              ref={formRef}
              className="card form-card"
              style={{ padding: 0, border: "none", background: "transparent", boxShadow: "none" }}
              onSubmit={onSubmit}
            >
              <div className="presets" style={{ marginBottom: "16px" }}>
                <span className="section-label">QUICK</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.symbol}
                    type="button"
                    className="pill"
                    onClick={() => applyPrefill({ ...p, side: f.side })}
                  >
                    {lang === "en" ? p.labelEn : p.label}
                  </button>
                ))}
              </div>

              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label htmlFor="tx-type">
                    <T th="ประเภท" en="Type" />
                  </label>
                  <select
                    id="tx-type"
                    value={assetType}
                    onChange={(e) => {
                      const t = e.target.value as AssetType;
                      setAssetType(t);
                      setCurrency(t === "gold" || t === "fund" ? "THB" : "USD");
                    }}
                  >
                    {TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {lang === "en" ? o.labelEn : o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="tx-side">
                    <T th="ฝั่ง" en="Side" />
                  </label>
                  <select id="tx-side" value={f.side} onChange={set("side")}>
                    <option value="buy">{lang === "en" ? "Buy" : "ซื้อ"}</option>
                    <option value="sell">{lang === "en" ? "Sell" : "ขาย"}</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="tx-symbol">Symbol</label>
                  <input
                    id="tx-symbol"
                    value={f.symbol}
                    onChange={set("symbol")}
                    required
                    placeholder={
                      assetType === "gold"
                        ? "GOLD96.5"
                        : assetType === "crypto"
                          ? "BTC"
                          : assetType === "fund"
                            ? "K-CHANGE-A"
                            : assetType === "etf"
                              ? "VOO, QQQ"
                              : lang === "en"
                                ? "AAPL or PTT.BK"
                                : "AAPL หรือ PTT.BK"
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="tx-name">
                    <T th="ชื่อ (ไม่บังคับ)" en="Name (optional)" />
                  </label>
                  <input
                    id="tx-name"
                    value={f.name}
                    onChange={set("name")}
                    placeholder={assetType === "gold" ? "ทองคำ 96.5%" : ""}
                  />
                </div>

                <div className="field">
                  <label htmlFor="tx-quantity">
                    <T th="จำนวน" en="Quantity" />
                  </label>
                  <input
                    id="tx-quantity"
                    value={f.quantity}
                    onChange={set("quantity")}
                    type="number"
                    step="any"
                    min="0"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="tx-price">
                    <T th="ราคา/หน่วย" en="Price/unit" />
                  </label>
                  <input
                    id="tx-price"
                    value={f.price}
                    onChange={set("price")}
                    type="number"
                    step="any"
                    min="0"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="tx-currency">
                    <T th="สกุลเงิน" en="Currency" />
                  </label>
                  <select
                    id="tx-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                  >
                    <option value="USD">USD</option>
                    <option value="THB">THB</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="tx-fee">
                    <T th="ค่าธรรมเนียม" en="Fee" />
                  </label>
                  <input id="tx-fee" value={f.fee} onChange={set("fee")} type="number" step="any" min="0" />
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="tx-date">
                    <T th="วันที่" en="Date" />
                  </label>
                  <input id="tx-date" value={f.tradedAt} onChange={set("tradedAt")} type="date" required />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: "18px", display: "flex", gap: "10px" }}>
                <button className="btn" type="submit" disabled={busy} style={{ background: "var(--ink)", color: "var(--bg)", border: "none" }}>
                  {busy ? <T th="กำลังบันทึก…" en="Saving…" /> : <T th="บันทึก" en="Save" />}
                </button>
                <button className="btn ghost" type="button" onClick={() => setOpen(false)}>
                  <T th="ยกเลิก" en="Cancel" />
                </button>
                {error && <span className="form-error" style={{ color: "#ef4444", fontSize: "12px", alignSelf: "center" }}>{error}</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
