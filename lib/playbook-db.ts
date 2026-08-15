import { getSupabaseClient } from './ctrader-db';

export type PlaybookSetup = {
  id: string;
  accountId?: string;
  name: string;
  description: string;
  rules: string[];
  createdAt?: string;
  updatedAt?: string;
};

function normaliseUser(userId: string): string {
  return String(userId ?? '').trim().toLowerCase();
}

export async function getPlaybookSetups(rawUserId: string, accountId?: string): Promise<PlaybookSetup[]> {
  const userId = normaliseUser(rawUserId);
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('playbook_setups')
      .select('*')
      .or(`user_id.eq.${userId},user_id.eq.admin`);

    if (!error && data && data.length > 0) {
      // Filter by account_id if specified (include setups specific to this account or generic/unassigned)
      const filtered = accountId
        ? data.filter((row: any) => !row.account_id || row.account_id === accountId)
        : data;

      return filtered.map((row: any) => ({
        id: String(row.id),
        accountId: row.account_id ? String(row.account_id) : undefined,
        name: String(row.name),
        description: String(row.description || ''),
        rules: Array.isArray(row.rules) ? row.rules : [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.error('Supabase getPlaybookSetups error:', err);
  }

  return [];
}

export async function savePlaybookSetups(rawUserId: string, setups: PlaybookSetup[], accountId?: string): Promise<void> {
  const userId = normaliseUser(rawUserId);
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // 1. Clean up deleted setups if any
    const { data: existing, error: selectErr } = await supabase
      .from('playbook_setups')
      .select('id, account_id')
      .eq('user_id', userId);

    if (!selectErr && existing && existing.length > 0) {
      const currentIds = new Set(setups.map(s => s.id));
      const toDelete = existing
        .filter((row: any) => (!accountId || !row.account_id || row.account_id === accountId) && !currentIds.has(String(row.id)))
        .map((row: any) => row.id);

      if (toDelete.length > 0) {
        await supabase.from('playbook_setups').delete().in('id', toDelete);
      }
    }

    // 2. Upsert setups into Supabase
    if (setups.length > 0) {
      const rowsWithAccount = setups.map(s => ({
        id: String(s.id),
        user_id: userId,
        account_id: accountId || s.accountId || null,
        name: String(s.name),
        description: String(s.description || ''),
        rules: Array.isArray(s.rules) ? s.rules : [],
        updated_at: new Date().toISOString(),
      }));

      const { data: upsertedData, error: upsertErr } = await supabase
        .from('playbook_setups')
        .upsert(rowsWithAccount, { onConflict: 'id' })
        .select();

      if (upsertErr) {
        // If account_id column doesn't exist on Supabase table yet, fallback without account_id
        const rowsFallback = setups.map(s => ({
          id: String(s.id),
          user_id: userId,
          name: String(s.name),
          description: String(s.description || ''),
          rules: Array.isArray(s.rules) ? s.rules : [],
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('playbook_setups').upsert(rowsFallback, { onConflict: 'id' });
      } else {
        console.log('[savePlaybookSetups] Successfully upserted setups to Supabase:', upsertedData?.length);
      }
    }
  } catch (err) {
    console.error('[savePlaybookSetups] Catch error:', err);
  }
}

export async function deletePlaybookSetup(rawUserId: string, setupId: string, accountId?: string): Promise<void> {
  const userId = normaliseUser(rawUserId);
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase
      .from('playbook_setups')
      .delete()
      .eq('id', setupId)
      .eq('user_id', userId);
  } catch (err) {
    console.error('Supabase deletePlaybookSetup error:', err);
  }
}
