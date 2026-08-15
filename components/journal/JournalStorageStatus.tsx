"use client";

import { useJournal } from "./JournalProvider";
import { T, useLang } from "@/components/site/LangContext";

export function JournalStorageBadge() {
  const { storageStatus } = useJournal();
  const { lang } = useLang();
  const label = storageStatus === "loading"
    ? (lang === "en" ? "Checking data" : "กำลังตรวจข้อมูล")
    : storageStatus === "ready"
      ? "Local · Verified"
      : storageStatus === "conflict"
        ? "Revision conflict"
        : "Read-only recovery";

  return <span className={`j-topbar-status is-${storageStatus}`}>{label}</span>;
}

export function JournalStorageNotice() {
  const { storageStatus, storageMessage, isReadOnly } = useJournal();
  if (storageStatus === "loading" || (storageStatus === "ready" && !storageMessage)) return null;

  return (
    <div className={`j-storage-notice is-${storageStatus}`} role={storageStatus === "error" || storageStatus === "conflict" ? "alert" : "status"}>
      <div>
        <strong>
          {isReadOnly
            ? <T th="Journal หยุดการบันทึกเพื่อป้องกันข้อมูล" en="Journal has paused saving to protect your data"/>
            : <T th="Journal พร้อมใช้งาน" en="Journal is ready"/>}
        </strong>
        <span>{storageMessage}</span>
      </div>
      {isReadOnly ? <a href="/journal/settings#data-safety"><T th="ไปที่ Data safety" en="Go to Data safety"/></a> : null}
    </div>
  );
}
