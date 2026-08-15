import SettingsClient from "@/components/journal/SettingsClient";
import { readJournalSyncConfig } from "@/lib/journal/sync-config";

export default function JournalSettingsPage() {
  const sync = readJournalSyncConfig();
  return <SettingsClient syncPreviewAvailable={sync.mode === "dry-run"}/>;
}
