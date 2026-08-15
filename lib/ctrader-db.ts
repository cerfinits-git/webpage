import { createClient } from '@supabase/supabase-js';
import { readSupabasePublicConfig } from './supabase/config';
import { encryptToken, decryptToken } from './crypto/token-cipher';

export function getSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(config.url, serviceKey || config.key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function normaliseUser(userId: string): string {
  return String(userId ?? '').trim().toLowerCase();
}

export interface CTraderConnection {
  userId: string;
  tradingAccountId?: string;
  ctraderAccountId: string;
  accessToken: string;
  refreshToken: string;
  lastSyncAt?: string;
}

export interface CTraderTrade {
  ticket: string;
  userId: string;
  cTraderAccountId?: number;
  symbol: string;
  volume: number;
  openTime: string;
  closeTime: string;
  profit: number;
  grossProfit?: number;
  commission?: number;
  swap?: number;
  balance?: number;
  side?: 'buy' | 'sell';
  entryPrice?: number;
  exitPrice?: number;
}

export async function getConnections(): Promise<CTraderConnection[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.from('ctrader_connections').select('*');
    if (!error && data) {
      return data.map((row: any) => ({
        userId: String(row.user_id),
        tradingAccountId: row.trading_account_id ? String(row.trading_account_id) : undefined,
        ctraderAccountId: String(row.ctrader_account_id),
        accessToken: decryptToken(String(row.access_token)),
        refreshToken: decryptToken(String(row.refresh_token)),
        lastSyncAt: row.last_sync_at ? String(row.last_sync_at) : undefined,
      }));
    }
  } catch (err) {
    console.error('Supabase getConnections error:', err);
  }

  return [];
}

export async function saveConnection(incoming: CTraderConnection): Promise<void> {
  const connection: CTraderConnection = { ...incoming, userId: normaliseUser(incoming.userId) };
  const encAccess = encryptToken(connection.accessToken);
  const encRefresh = encryptToken(connection.refreshToken);

  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    let existingQuery = supabase
      .from('ctrader_connections')
      .select('id')
      .eq('user_id', connection.userId);

    if (connection.tradingAccountId) {
      existingQuery = existingQuery.eq('trading_account_id', connection.tradingAccountId);
    }

    const { data: existing } = await existingQuery.limit(1);

    if (existing && existing.length > 0) {
      const { error: updateErr } = await supabase
        .from('ctrader_connections')
        .update({
          trading_account_id: connection.tradingAccountId || null,
          ctrader_account_id: connection.ctraderAccountId,
          access_token: encAccess,
          refresh_token: encRefresh,
          last_sync_at: connection.lastSyncAt || new Date().toISOString(),
        })
        .eq('id', existing[0].id);

      if (updateErr) console.error('Supabase update connection error:', updateErr);
    } else {
      const { error: insertErr } = await supabase
        .from('ctrader_connections')
        .insert({
          user_id: connection.userId,
          trading_account_id: connection.tradingAccountId || null,
          ctrader_account_id: connection.ctraderAccountId,
          access_token: encAccess,
          refresh_token: encRefresh,
          last_sync_at: connection.lastSyncAt || new Date().toISOString(),
        });

      if (insertErr) console.error('Supabase insert connection error:', insertErr);
    }
  } catch (err) {
    console.error('Supabase saveConnection error:', err);
  }
}

export async function getConnection(userId: string, tradingAccountId?: string): Promise<CTraderConnection | undefined> {
  const connections = await getConnectionsForUser(userId, tradingAccountId);
  return connections[0];
}

export async function getConnectionsForUser(rawUserId: string, tradingAccountId?: string): Promise<CTraderConnection[]> {
  const userId = normaliseUser(rawUserId);
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('ctrader_connections')
      .select('*')
      .or(`user_id.eq.${userId},user_id.eq.admin`);

    if (tradingAccountId) {
      query = query.eq('trading_account_id', tradingAccountId);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        userId: String(row.user_id),
        tradingAccountId: row.trading_account_id ? String(row.trading_account_id) : undefined,
        ctraderAccountId: String(row.ctrader_account_id),
        accessToken: decryptToken(String(row.access_token)),
        refreshToken: decryptToken(String(row.refresh_token)),
        lastSyncAt: row.last_sync_at ? String(row.last_sync_at) : undefined,
      }));
    }
  } catch (err) {
    console.error('Supabase getConnectionsForUser error:', err);
  }

  return [];
}

export async function getTrades(rawUserId: string, ctraderAccountId?: number | string): Promise<CTraderTrade[]> {
  const userId = normaliseUser(rawUserId);
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('ctrader_trades')
      .select('*')
      .eq('user_id', userId);

    if (ctraderAccountId) {
      query = query.eq('ctrader_account_id', Number(ctraderAccountId));
    }

    const { data, error } = await query.order('close_time', { ascending: false });

    if (!error && data) {
      return data.map((row: any) => ({
        ticket: String(row.ticket),
        userId: String(row.user_id),
        cTraderAccountId: row.ctrader_account_id != null ? Number(row.ctrader_account_id) : undefined,
        symbol: String(row.symbol),
        volume: Number(row.volume ?? 0),
        openTime: String(row.open_time),
        closeTime: String(row.close_time),
        profit: Number(row.profit ?? 0),
        grossProfit: row.gross_profit != null ? Number(row.gross_profit) : undefined,
        commission: row.commission != null ? Number(row.commission) : undefined,
        swap: row.swap != null ? Number(row.swap) : undefined,
        balance: row.balance != null ? Number(row.balance) : undefined,
        side: row.side ? (row.side as 'buy' | 'sell') : undefined,
        entryPrice: row.entry_price != null ? Number(row.entry_price) : undefined,
        exitPrice: row.exit_price != null ? Number(row.exit_price) : undefined,
      }));
    }
  } catch (err) {
    console.error('Supabase getTrades error:', err);
  }

  return [];
}

export async function saveTrades(incoming: CTraderTrade[]): Promise<void> {
  if (incoming.length === 0) return;
  const newTrades = incoming.map((t) => ({ ...t, userId: normaliseUser(t.userId) }));

  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const rows = newTrades.map((t) => ({
      ticket: String(t.ticket),
      user_id: String(t.userId),
      ctrader_account_id: t.cTraderAccountId ?? null,
      symbol: t.symbol,
      volume: t.volume,
      side: t.side || null,
      entry_price: t.entryPrice ?? null,
      exit_price: t.exitPrice ?? null,
      profit: t.profit,
      gross_profit: t.grossProfit ?? null,
      commission: t.commission ?? null,
      swap: t.swap ?? null,
      balance: t.balance ?? null,
      open_time: t.openTime,
      close_time: t.closeTime,
    }));

    const { error: upsertErr } = await supabase.from('ctrader_trades').upsert(rows, { onConflict: 'ticket' });
    if (upsertErr) console.error('Supabase saveTrades UPSERT error:', JSON.stringify(upsertErr));
  } catch (err) {
    console.error('Supabase saveTrades error:', err);
  }
}

export async function deleteConnectionByTradingAccountId(rawUserId: string, tradingAccountId: string): Promise<void> {
  const userId = normaliseUser(rawUserId);
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // 1. Fetch connected broker account ID(s) associated with this tradingAccountId
    const { data: conns } = await supabase
      .from('ctrader_connections')
      .select('ctrader_account_id')
      .eq('user_id', userId)
      .eq('trading_account_id', tradingAccountId);

    const ctraderAccountIds = conns
      ? conns.map((c: any) => c.ctrader_account_id).filter(Boolean)
      : [];

    // 2. Delete connection record from ctrader_connections
    await supabase
      .from('ctrader_connections')
      .delete()
      .eq('user_id', userId)
      .eq('trading_account_id', tradingAccountId);

    // 3. Delete from public.accounts table in Supabase
    await supabase
      .from('accounts')
      .delete()
      .eq('id', tradingAccountId);

    // 4. Delete all trades from ctrader_trades belonging to this account
    if (ctraderAccountIds.length > 0) {
      await supabase
        .from('ctrader_trades')
        .delete()
        .eq('user_id', userId)
        .in('ctrader_account_id', ctraderAccountIds);
    }
  } catch (err) {
    console.error('Supabase deleteConnection error:', err);
  }
}

export async function clearAllUserData(rawUserId: string): Promise<void> {
  const userId = normaliseUser(rawUserId);
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase.from('ctrader_connections').delete().eq('user_id', userId);
    await supabase.from('ctrader_trades').delete().eq('user_id', userId);
  } catch (err) {
    console.error('Supabase clearAllUserData error:', err);
  }
}
