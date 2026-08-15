"use client";

import { useMemo, useState, useEffect } from "react";
import type { TradingAccount } from "@/lib/journal/types";
import JournalIcon from "./JournalIcon";
import { useJournal } from "./JournalProvider";
import { T, useLang } from "@/components/site/LangContext";

type AccountDraft = Omit<TradingAccount, "id">;

const EMPTY_ACCOUNT: AccountDraft = {
  name: "",
  broker: "cTrader",
  externalAccountId: null,
  baseCurrency: "USD",
  reportingTimezone: "Asia/Bangkok",
  defaultRiskAmount: undefined,
};

export default function AccountSettingsClient({ onMessage }: { onMessage: (message: string) => void }) {
  const {
    accounts,
    activeAccount,
    activeAccountId,
    trades,
    createAccount,
    updateAccount,
    deleteAccount,
    selectAccount,
    isReadOnly,
  } = useJournal();
  const { lang } = useLang();
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [draft, setDraft] = useState<AccountDraft>(EMPTY_ACCOUNT);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const tradeCount = useMemo(
    () => trades.filter((trade) => trade.accountId === activeAccountId).length,
    [trades, activeAccountId],
  );

  const updateDraft = <Key extends keyof AccountDraft>(key: Key, value: AccountDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const beginCreate = () => {
    setDraft({ ...EMPTY_ACCOUNT });
    setConfirmDelete(false);
    setMode("create");
  };

  const beginEdit = () => {
    const { id: _id, ...editable } = activeAccount;
    setDraft(editable);
    setConfirmDelete(false);
    setMode("edit");
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft.name?.trim()) {
      onMessage(lang === "en" ? "Enter an account name" : "กรุณากรอกชื่อบัญชี");
      return;
    }

    const result = mode === "edit"
      ? updateAccount({ id: activeAccountId, ...draft })
      : createAccount(draft);

    const targetAccountId = mode === "edit" ? activeAccountId : result.accountId;

    // Sync to Supabase public.accounts table
    if (result.ok && targetAccountId) {
      try {
        await fetch("/api/accounts", {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: targetAccountId,
            name: draft.name,
            bank: draft.broker || "cTrader",
            openingBalance: draft.defaultRiskAmount || 0,
          }),
        });
      } catch (e) {
        console.warn("Could not sync account to Supabase public.accounts", e);
      }
    }

    onMessage(result.message);
    if (result.ok) setMode(null);
  };

  const remove = async () => {
    try {
      await fetch(`/api/ctrader/accounts?tradingAccountId=${activeAccountId}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to clear backend data for account", e);
    }

    const result = deleteAccount(activeAccountId);
    onMessage(result.message);
    if (result.ok) {
      setConfirmDelete(false);
      setMode(null);
    }
  };

  useEffect(() => {
    if (accounts.length === 0 && mode !== "create") {
      beginCreate();
    }
  }, [accounts.length, mode]);

  return (
    <section className="j-panel j-settings-section" id="accounts">
      <div className="j-panel-head">
        <div>
          <h2><T th="บัญชีเทรด (Trading Accounts)" en="Trading accounts"/></h2>
          <p><T th="จัดการบัญชีเทรด แยกประวัติการเทรด, ค่าเงิน, และ Timezone ออกจากกันอย่างเป็นอิสระ" en="Manage your trading accounts, analytics, currency, and timezone"/></p>
        </div>
        <button
          className="j-primary-button"
          type="button"
          disabled={isReadOnly || accounts.length === 0}
          onClick={beginCreate}
          style={{ padding: "8px 16px", fontSize: "12.5px" }}
        >
          <JournalIcon name="plus" size={14}/>
          <T th="เพิ่มบัญชีใหม่" en="New account"/>
        </button>
      </div>

      {accounts.length > 0 ? (
        <div className="j-account-card">
          <div className="j-account-toolbar">
            <label className="j-field">
              <span style={{ fontSize: "11px", color: "var(--j-muted)", marginBottom: "4px", display: "block" }}>
                <T th="เลือกบัญชีที่กำลังใช้งาน (Active Account)" en="Active Account"/>
              </span>
              <select
                aria-label="Settings active trading account"
                value={activeAccountId}
                disabled={isReadOnly}
                onChange={(event) => {
                  const result = selectAccount(event.target.value);
                  onMessage(result.message);
                  setMode(null);
                  setConfirmDelete(false);
                }}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.broker || "cTrader"})
                  </option>
                ))}
              </select>
            </label>
            <div className="j-inline-actions" style={{ marginBottom: "2px" }}>
              <button
                className="j-secondary-button"
                type="button"
                disabled={isReadOnly}
                onClick={beginEdit}
                style={{ padding: "8px 14px", fontSize: "12.5px" }}
              >
                <T th="แก้ไขข้อมูล" en="Edit"/>
              </button>
              <button
                className="j-secondary-button"
                type="button"
                disabled={isReadOnly}
                onClick={() => setConfirmDelete(true)}
                style={{ padding: "8px 14px", fontSize: "12.5px", color: "var(--j-ink, #e5e5ea)" }}
              >
                <T th="ลบบัญชี" en="Delete"/>
              </button>
            </div>
          </div>

          {/* Account Details Summary Grid */}
          <div className="j-account-summary-grid">
            <div className="j-account-summary-item">
              <span><T th="โบรคเกอร์ / แพลตฟอร์ม" en="Broker / Platform"/></span>
              <strong>{activeAccount.broker || "cTrader"}</strong>
            </div>
            <div className="j-account-summary-item">
              <span><T th="สกุลเงินหลัก" en="Base Currency"/></span>
              <strong>{activeAccount.baseCurrency || "USD"}</strong>
            </div>
            <div className="j-account-summary-item">
              <span><T th="เขตเวลา (Timezone)" en="Reporting Timezone"/></span>
              <strong style={{ fontSize: "12px" }}>{activeAccount.reportingTimezone || "Asia/Bangkok"}</strong>
            </div>
            <div className="j-account-summary-item">
              <span><T th="ความเสี่ยงเริ่มต้น (Default Risk)" en="Default Risk Amount"/></span>
              <strong>{activeAccount.defaultRiskAmount ? `$${activeAccount.defaultRiskAmount}` : "None"}</strong>
            </div>
            <div className="j-account-summary-item">
              <span><T th="จำนวนออเดอร์ในบัญชี" en="Total Trades Logged"/></span>
              <strong style={{ color: "var(--j-ink, #ffffff)" }}>{tradeCount} trades</strong>
            </div>
          </div>

          {activeAccount.externalAccountId ? (
            <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--j-muted)" }}>
              <T th="รหัสบัญชีโบรกเกอร์ที่เชื่อมต่อ: " en="Connected Broker Account ID: "/>
              <code style={{ background: "var(--j-panel)", padding: "2px 6px", borderRadius: "4px" }}>
                {activeAccount.externalAccountId}
              </code>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Account Edit / Create Form */}
      {mode ? (
        <form className="j-account-form" onSubmit={save} noValidate>
          <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "14px" }}>
            {mode === "create" ? <T th="เพิ่มบัญชีเทรดใหม่" en="Create New Trading Account"/> : <T th="แก้ไขข้อมูลบัญชีเทรด" en="Edit Trading Account Details"/>}
          </h3>
          <div className="j-form-grid">
            <label className="j-field">
              <span style={{ fontSize: "11.5px", color: "var(--j-muted)", display: "block", marginBottom: "4px" }}>
                <T th="ชื่อบัญชี (Account Name)" en="Account Name"/>
              </span>
              <input
                value={draft.name}
                maxLength={120}
                required
                autoFocus
                onChange={(event) => updateDraft("name", event.target.value)}
                placeholder={lang === "en" ? "e.g. cTrader Live, FTMO 100k, IC Markets" : "เช่น cTrader Live, FTMO 100k, IC Markets"}
              />
            </label>

            <label className="j-field">
              <span style={{ fontSize: "11.5px", color: "var(--j-muted)", display: "block", marginBottom: "4px" }}>
                <T th="โบรคเกอร์ (Broker / App)" en="Broker / Platform"/>
              </span>
              <input
                value={draft.broker}
                maxLength={80}
                required
                onChange={(event) => updateDraft("broker", event.target.value)}
                placeholder="cTrader"
              />
            </label>

            <label className="j-field">
              <span style={{ fontSize: "11.5px", color: "var(--j-muted)", display: "block", marginBottom: "4px" }}>
                <T th="สกุลเงินหลัก (Base Currency)" en="Base Currency"/>
              </span>
              <input
                value={draft.baseCurrency}
                maxLength={8}
                required
                onChange={(event) => updateDraft("baseCurrency", event.target.value.toUpperCase())}
                placeholder="USD"
              />
            </label>

            <label className="j-field">
              <span style={{ fontSize: "11.5px", color: "var(--j-muted)", display: "block", marginBottom: "4px" }}>
                <T th="เขตเวลา (Timezone)" en="Reporting Timezone"/>
              </span>
              <input
                value={draft.reportingTimezone}
                required
                onChange={(event) => updateDraft("reportingTimezone", event.target.value)}
                placeholder="Asia/Bangkok"
              />
            </label>

            <label className="j-field j-span-2">
              <span style={{ fontSize: "11.5px", color: "var(--j-muted)", display: "block", marginBottom: "4px" }}>
                <T th="จำนวนเงินเสี่ยงเริ่มต้นต่อไม้ ($) — ตัวเลือกเสริม" en="Default Risk Amount per Trade ($) — Optional"/>
              </span>
              <input
                type="number"
                value={draft.defaultRiskAmount ?? ""}
                onChange={(event) => updateDraft("defaultRiskAmount", event.target.value ? Number(event.target.value) : undefined)}
                placeholder={lang === "en"
                  ? "e.g. 50 or 100 — used to compute R-multiple on sync"
                  : "เช่น 50 หรือ 100 (ใช้คำนวณ R-Multiple อัตโนมัติเมื่อซิงค์)"}
                min="0"
                step="any"
              />
            </label>
          </div>

          <div className="j-inline-actions" style={{ gap: "10px" }}>
            <button className="j-primary-button" type="submit" style={{ padding: "8px 18px" }}>
              {mode === "create" ? <T th="บันทึกและเพิ่มบัญชี" en="Add account"/> : <T th="บันทึกการเปลี่ยนแปลง" en="Save changes"/>}
            </button>
            <button className="j-secondary-button" type="button" onClick={() => setMode(null)} style={{ padding: "8px 18px" }}>
              <T th="ยกเลิก" en="Cancel"/>
            </button>
          </div>
        </form>
      ) : null}

      {/* Delete Confirmation Box */}
      {confirmDelete ? (
        <div className="j-confirm-action" role="group" aria-label="Confirm delete account" style={{ marginTop: "16px", border: "1px solid var(--j-negative, #f43f5e)", background: "var(--j-down-tint, rgba(244, 63, 94, 0.08))" }}>
          <div>
            <strong style={{ color: "var(--j-negative, #f43f5e)", fontSize: "14px" }}>
              <T th={`ยืนยันการลบบัญชี ${activeAccount.name}?`} en={`Delete account ${activeAccount.name}?`}/>
            </strong>
            <p style={{ marginTop: "4px", fontSize: "12.5px" }}>
              {tradeCount > 0
                ? <T th={`การลบบัญชีนี้จะลบรายการเทรดทั้งหมด ${tradeCount} trades ในบัญชีนี้ด้วย (สามารถกดปุ่ม Undo กู้คืนได้ทันทีหลังลบ)`} en={`Deleting this account will also remove all ${tradeCount} trades in it (can be undone immediately).`}/>
                : <T th="การลบบัญชีนี้จะนำบัญชีออกจากระบบ (กู้กลับได้ด้วยปุ่ม Undo ทันที)" en="Deleting this account will remove it from storage (can be undone)."/>}
            </p>
          </div>
          <div className="j-inline-actions" style={{ gap: "10px" }}>
            <button className="j-secondary-button" type="button" autoFocus onClick={() => setConfirmDelete(false)} style={{ padding: "8px 16px" }}>
              <T th="ยกเลิก" en="Cancel"/>
            </button>
            <button
              className="j-primary-button"
              type="button"
              onClick={remove}
              style={{
                padding: "8px 18px",
                background: "var(--j-negative, #f43f5e)",
                borderColor: "var(--j-negative, #f43f5e)",
                color: "#ffffff",
                boxShadow: "0 0 12px rgba(244, 63, 94, 0.35)",
              }}
            >
              <T th="ยืนยันการลบ" en="Delete account"/>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
