"use client";

import { useState } from "react";
import { useJournal } from "./JournalProvider";
import AccountSettingsClient from "./AccountSettingsClient";
import { T } from "@/components/site/LangContext";

// Holds the journal behind an onboarding step: while the store hydrates we show
// a status line (avoids a flash of default-account UI), and if the user ends up
// with no trading accounts we surface account creation instead of an empty
// journal. Under the current default-account model accounts is never empty, so
// this normally just renders children — it earns its keep once accounts can
// start empty (the Supabase account cutover).
export default function JournalAccountGuard({ children }: { children: React.ReactNode }) {
  const { accounts, isHydrated } = useJournal();
  const [message, setMessage] = useState("");

  if (!isHydrated) {
    return <div className="j-journal-loading" role="status"><T th="กำลังตรวจข้อมูล Journal…" en="Checking journal data…"/></div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="j-page">
        <header className="j-page-head">
          <div>
            <h1>Welcome to Cerfinits Journal</h1>
            <p><T th="กรุณาสร้าง Trading Account เพื่อเริ่มต้นการใช้งาน" en="Create a trading account to get started"/></p>
          </div>
        </header>
        {message && <p className="j-success-message" role="status">{message}</p>}
        <div style={{ maxWidth: 800 }}>
          <AccountSettingsClient onMessage={setMessage} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
