export type JournalSidebarPrimaryAction = "add" | "import";

export function journalSidebarPrimaryAction(
  trades: readonly { accountId: string }[],
  activeAccountId: string,
): JournalSidebarPrimaryAction {
  return trades.some((trade) => trade.accountId === activeAccountId) ? "add" : "import";
}

