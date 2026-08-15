"use client";

import { useState, useEffect } from "react";
import { PlaybookSetup } from "@/lib/playbook-db";
import JournalIcon from "./JournalIcon";
import JournalAccountControl from "./JournalAccountControl";
import { useJournal } from "./JournalProvider";
import { T } from "@/components/site/LangContext";

export default function PlaybookClient() {
  const { activeAccountId, activeAccount } = useJournal();
  const [setups, setSetups] = useState<PlaybookSetup[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = `cerfinits_playbook_setups_${activeAccountId || "default"}`;

  // Load from localStorage first, then sync from Database for the active account
  useEffect(() => {
    setIsLoading(true);
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSetups(parsed);
          setSelectedId(parsed[0].id);
        } else {
          setSetups([]);
          setSelectedId("");
        }
      } else {
        setSetups([]);
        setSelectedId("");
      }
    } catch (e) {
      console.warn("LocalStorage read error:", e);
    }

    const query = activeAccountId ? `?accountId=${encodeURIComponent(activeAccountId)}` : "";
    fetch(`/api/journal/playbook${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.setups) && data.setups.length > 0) {
          setSetups(data.setups);
          setSelectedId(data.setups[0].id);
          try {
            localStorage.setItem(storageKey, JSON.stringify(data.setups));
          } catch (e) {}
        } else if (data.success && Array.isArray(data.setups) && data.setups.length === 0) {
          setSetups([]);
          setSelectedId("");
        }
      })
      .catch((err) => console.error("Failed loading playbook setups from API:", err))
      .finally(() => setIsLoading(false));
  }, [activeAccountId, storageKey]);

  const activeSetup = setups.find((s) => s.id === selectedId) || (setups.length > 0 ? setups[0] : null);

  // Save all setups to LocalStorage & Database
  const handleSaveAll = async (updatedSetups: PlaybookSetup[]) => {
    const unnamed = updatedSetups.find((setup) => !String(setup.name ?? "").trim());
    if (unnamed) {
      setSaveStatus("กรุณาตั้งชื่อ setup ก่อนบันทึก");
      setTimeout(() => setSaveStatus(""), 4000);
      return;
    }

    setIsSaving(true);
    setSaveStatus("กำลังบันทึก...");

    // 1. Save to browser localStorage immediately
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedSetups));
    } catch (e) {
      console.warn("LocalStorage write error:", e);
    }

    // 2. Save to server Database / API
    try {
      const res = await fetch('/api/journal/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: activeAccountId,
          setups: updatedSetups,
          confirmDeleteAll: updatedSetups.length === 0,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSaveStatus(data.error || "บันทึกลงฐานข้อมูลไม่สำเร็จ");
        return;
      }
      setSaveStatus("✓ บันทึกเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Server save error (saved locally):", err);
      setSaveStatus("บันทึกลงเครื่องแล้ว แต่ยังไม่ได้บันทึกลงฐานข้อมูล");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 4000);
    }
  };

  // Add new setup
  const handleAddSetup = () => {
    const newId = `setup-${Date.now()}`;
    const newSetup: PlaybookSetup = {
      id: newId,
      accountId: activeAccountId,
      name: "Setup ใหม่",
      description: "คำอธิบาย setup และกลยุทธ์การเข้าออเดอร์...",
      rules: ["Bias ชัดเจนก่อนเข้าเทรด", "มี Signal ยืนยัน"],
    };
    const updated = [...setups, newSetup];
    setSetups(updated);
    setSelectedId(newId);
    handleSaveAll(updated);
  };

  // Delete current setup
  const handleDeleteSetup = async (id: string) => {
    const updated = setups.filter((s) => s.id !== id);
    setSetups(updated);
    if (updated.length > 0) {
      setSelectedId(updated[0].id);
    } else {
      setSelectedId("");
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    try {
      const query = activeAccountId ? `?id=${encodeURIComponent(id)}&accountId=${encodeURIComponent(activeAccountId)}` : `?id=${encodeURIComponent(id)}`;
      await fetch(`/api/journal/playbook${query}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Delete error:", err);
    }
    handleSaveAll(updated);
  };

  // Update field of active setup
  const updateActiveSetup = (field: keyof PlaybookSetup, value: any) => {
    if (!activeSetup) return;
    const updated = setups.map((s) => (s.id === activeSetup.id ? { ...s, [field]: value } : s));
    setSetups(updated);
  };

  // Update rule item
  const updateRule = (index: number, newRule: string) => {
    if (!activeSetup) return;
    const newRules = [...activeSetup.rules];
    newRules[index] = newRule;
    updateActiveSetup("rules", newRules);
  };

  // Add new rule
  const handleAddRule = () => {
    if (!activeSetup) return;
    const newRules = [...activeSetup.rules, "กติกาการเข้าเทรดใหม่..."];
    updateActiveSetup("rules", newRules);
  };

  // Delete rule item
  const handleDeleteRule = (index: number) => {
    if (!activeSetup) return;
    const newRules = activeSetup.rules.filter((_, i) => i !== index);
    updateActiveSetup("rules", newRules);
  };

  return (
    <div className="j-page">
      <header className="j-page-head">
        <div>
          <h1>Playbook</h1>
          <p>
            <T
              th="นิยาม setup และ checklist กติกาการเข้าเทรด ปรับแก้ไขและบันทึกลง Database ได้ทันที"
              en="Define your setups and entry checklists — fully editable and saved to Database"
            />
          </p>
        </div>
        <div className="j-head-controls" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {saveStatus && (
            <span style={{ fontSize: "12.5px", padding: "6px 14px", background: "var(--ink)", color: "var(--bg)", borderRadius: "16px", fontWeight: 500 }}>
              {saveStatus}
            </span>
          )}
          <JournalAccountControl ariaLabel="Playbook trading account"/>
        </div>
      </header>

      {setups.length === 0 && !isLoading ? (
        <section className="j-panel j-account-empty-state" style={{ padding: "48px 24px", textAlign: "center" }}>
          <JournalIcon name="playbook" size={36} />
          <h2 style={{ marginTop: "16px", fontSize: "20px" }}>
            <T th="ยังไม่มี Playbook Setup" en="No Playbook Setups Yet" />
          </h2>
          <p style={{ margin: "8px 0 24px", color: "var(--j-muted)" }}>
            <T
              th="เริ่มสร้าง Setup และ Checklist แรกของคุณเพื่อบันทึกกลยุทธ์การเข้าเทรด"
              en="Create your first trading setup and checklist to document your trading rules"
            />
          </p>
          <button
            type="button"
            onClick={handleAddSetup}
            className="j-primary-button"
            style={{ padding: "0 24px", minHeight: "44px" }}
          >
            <JournalIcon name="plus" size={16} /> <T th="สร้าง Setup แรกของคุณ" en="Create Your First Setup" />
          </button>
        </section>
      ) : (
        <div className="j-playbook-layout">
          {/* Left Sidebar: Setup List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              type="button"
              onClick={handleAddSetup}
              className="j-primary-button"
              style={{ width: "100%", justifyContent: "center", gap: "6px", minHeight: "40px", fontSize: "13px" }}
            >
              <JournalIcon name="plus" size={14} /> <T th="เพิ่ม Setup ใหม่" en="Add New Setup" />
            </button>

            <nav className="j-setup-list" aria-label="Setup list">
              {setups.map((setup) => (
                <button
                  key={setup.id}
                  className={selectedId === setup.id ? "is-active" : ""}
                  onClick={() => setSelectedId(setup.id)}
                >
                  <span>{setup.name}</span>
                  <small>{setup.rules.length} rules</small>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Detail & Editor Section */}
          {activeSetup ? (
            <section className="j-panel j-setup-detail" key={activeSetup.id} style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span className="j-kicker">ACTIVE SETUP EDITOR</span>
                <button
                  type="button"
                  onClick={() => handleDeleteSetup(activeSetup.id)}
                  style={{ background: "transparent", border: "none", color: "var(--j-negative, #ef5350)", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <T th="ลบ Setup นี้" en="Delete Setup" />
                </button>
              </div>

              {/* Editable Name & Description */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", color: "var(--j-muted)", fontWeight: 500 }}>
                  Setup Name:
                </label>
                <input
                  type="text"
                  value={activeSetup.name}
                  onChange={(e) => updateActiveSetup("name", e.target.value)}
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    padding: "8px 12px",
                    background: "var(--j-bg, #1a1a1a)",
                    border: "1px solid var(--j-line, #333)",
                    borderRadius: "4px",
                    color: "var(--j-ink, #fff)",
                    width: "100%",
                  }}
                />

                <label style={{ fontSize: "12px", color: "var(--j-muted)", fontWeight: 500, marginTop: "6px" }}>
                  Description:
                </label>
                <textarea
                  value={activeSetup.description}
                  rows={2}
                  onChange={(e) => updateActiveSetup("description", e.target.value)}
                  style={{
                    fontSize: "14px",
                    padding: "8px 12px",
                    background: "var(--j-bg, #1a1a1a)",
                    border: "1px solid var(--j-line, #333)",
                    borderRadius: "4px",
                    color: "var(--j-ink, #fff)",
                    width: "100%",
                    resize: "vertical",
                  }}
                />
              </div>

              <div className="j-inspector-divider" style={{ margin: "20px 0" }} />

              {/* Checklist Section */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "16px" }}>Entry checklist</h3>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="j-secondary-button"
                  style={{ minHeight: "32px", padding: "0 12px", fontSize: "12px" }}
                >
                  + <T th="เพิ่มกติกา Checklist" en="Add Rule" />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activeSetup.rules.map((rule, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--j-gold, #d4af37)", width: "24px" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "var(--j-bg, #1a1a1a)",
                        border: "1px solid var(--j-line, #333)",
                        borderRadius: "4px",
                        fontSize: "14px",
                        color: "var(--j-ink, #fff)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(index)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--j-line, #333)",
                        borderRadius: "4px",
                        color: "var(--j-muted)",
                        cursor: "pointer",
                        padding: "6px 10px",
                        fontSize: "12px",
                      }}
                      title="ลบข้อนี้"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Save Button Footer */}
              <div style={{ marginTop: "28px", paddingTop: "16px", borderTop: "1px solid var(--j-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="j-readonly-note" style={{ color: "#4caf50", fontWeight: 500 }}>
                  ✓ Live Database & Local Storage Sync
                </span>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveAll(setups)}
                  className="j-primary-button"
                  style={{ padding: "0 24px", minHeight: "40px" }}
                >
                  {isSaving ? "Saving..." : "บันทึกลง Database"}
                </button>
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
