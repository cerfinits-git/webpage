"use client";

import JournalIcon from "./JournalIcon";
import { useJournal } from "./JournalProvider";

export default function JournalAccountControl({
  ariaLabel = "Trading account",
  onChanged,
}: {
  ariaLabel?: string;
  onChanged?: (accountId: string) => void;
}) {
  const { accounts, activeAccountId, selectAccount, isReadOnly } = useJournal();

  return (
    <label className="j-select-like j-select-control">
      <JournalIcon name="account"/>
      <select
        aria-label={ariaLabel}
        value={activeAccountId}
        disabled={isReadOnly}
        onChange={(event) => {
          const accountId = event.target.value;
          const result = selectAccount(accountId);
          if (result.ok) onChanged?.(accountId);
        }}
      >
        {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
      </select>
      <JournalIcon name="chevron"/>
    </label>
  );
}
