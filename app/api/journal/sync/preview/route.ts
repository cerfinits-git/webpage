import { NextResponse } from "next/server";
import { readJournalSyncConfig } from "@/lib/journal/sync-config";
import {
  createRemoteJournalSyncFingerprint,
  parseJournalSyncManifest,
  reconcileJournalSync,
} from "@/lib/journal/sync";
import { readRemoteJournalRows } from "@/lib/journal/supabase-read";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_MANIFEST_BYTES = 64 * 1024;

function noStoreJson(body: Record<string, unknown>, status = 200) {
  const response = NextResponse.json(
    { ...body, writesPerformed: 0 },
    { status },
  );
  response.headers.set(
    "Cache-Control",
    "private, no-store, no-cache, max-age=0, must-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function POST(request: Request) {
  const sync = readJournalSyncConfig();
  if (sync.mode !== "dry-run" || !sync.access.supabase) {
    return noStoreJson({ error: "Staging comparison is unavailable" }, 404);
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return noStoreJson({ error: "Expected application/json" }, 415);
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_MANIFEST_BYTES) {
    return noStoreJson({ error: "Manifest is too large" }, 413);
  }

  const supabase = await createSupabaseServerClient(sync.access.supabase);
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const subject = claimsData?.claims?.sub;
  if (claimsError || typeof subject !== "string" || subject.trim() === "") {
    return noStoreJson({ error: "Authentication required" }, 401);
  }

  let manifest;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_MANIFEST_BYTES) {
      return noStoreJson({ error: "Manifest is too large" }, 413);
    }
    manifest = parseJournalSyncManifest(JSON.parse(raw));
  } catch (error) {
    return noStoreJson({
      error: error instanceof Error ? error.message : "Manifest is invalid",
    }, 400);
  }

  try {
    const rows = await readRemoteJournalRows(supabase, subject);
    const remote = await createRemoteJournalSyncFingerprint(rows, subject);
    const comparison = reconcileJournalSync(manifest, remote);
    return noStoreJson({
      mode: "dry-run",
      ...comparison,
      remote,
    });
  } catch {
    return noStoreJson({ error: "Staging comparison failed safely" }, 502);
  }
}
