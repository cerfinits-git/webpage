const DEFAULT_JOURNAL_RETURN = "/journal";
const RETURN_TO_LIMIT = 2_048;

export function safeJournalReturnTo(value: unknown) {
  if (typeof value !== "string") return DEFAULT_JOURNAL_RETURN;

  const candidate = value.trim();
  if (
    !candidate ||
    candidate.length > RETURN_TO_LIMIT ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(candidate)
  ) {
    return DEFAULT_JOURNAL_RETURN;
  }

  try {
    const base = new URL("https://journal.cerfinits.invalid");
    const parsed = new URL(candidate, base);
    const isJournalPath =
      parsed.pathname === "/journal" || parsed.pathname.startsWith("/journal/");

    if (parsed.origin !== base.origin || !isJournalPath) {
      return DEFAULT_JOURNAL_RETURN;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_JOURNAL_RETURN;
  }
}
