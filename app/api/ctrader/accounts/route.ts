import { NextResponse } from 'next/server';
import {
  getConnectionsForUser,
  deleteConnectionByTradingAccountId,
  clearAllUserData,
} from '@/lib/ctrader-db';
import { fetchCTraderAccounts } from '@/lib/ctrader-api';
import { getSessionUserId } from '@/lib/auth/session';

// Short-lived cache so repeated dashboard loads don't hit the cTrader API on
// every render. Keyed per user + trading account; 60s is well inside a session.
const accountsCache = new Map<string, { timestamp: number; accounts: MappedAccount[] }>();
const CACHE_TTL_MS = 60_000;

type MappedAccount = { id: number; isLive: boolean; connectionId: string; tradingAccountId?: string };

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const url = new URL(request.url);
    const tradingAccountId = url.searchParams.get('tradingAccountId');

    let connections = await getConnectionsForUser(userId, tradingAccountId || undefined);
    if (tradingAccountId) {
      connections = connections.filter(c => c.tradingAccountId === tradingAccountId);
    }

    if (connections.length === 0) {
      return NextResponse.json({ success: true, hasConnection: false, accounts: [] });
    }

    const cacheKey = `${userId}:${tradingAccountId || 'all'}`;
    const cached = accountsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, hasConnection: true, accounts: cached.accounts });
    }

    const clientId = process.env.CTRADER_CLIENT_ID || '';
    const clientSecret = process.env.CTRADER_CLIENT_SECRET || '';

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'cTrader API credentials not configured' }, { status: 500 });
    }

    const allMappedAccounts: MappedAccount[] = [];
    const seenIds = new Set<number>();

    for (const connection of connections) {
      const connectionId = connection.ctraderAccountId && connection.ctraderAccountId !== 'unknown_id' 
        ? connection.ctraderAccountId 
        : connection.accessToken.substring(0, 8);
        
      try {
        const accounts = await fetchCTraderAccounts(
          clientId, 
          clientSecret, 
          connection.accessToken
        );
        for (const acc of accounts) {
          if (!seenIds.has(acc.ctidTraderAccountId)) {
            seenIds.add(acc.ctidTraderAccountId);
            allMappedAccounts.push({
              id: acc.ctidTraderAccountId,
              isLive: acc.isLive,
              connectionId,
              tradingAccountId: connection.tradingAccountId
            });
          }
        }
      } catch (e) {
        console.error(`Failed to fetch accounts for connection ${connection.accessToken.slice(-4)}:`, e);
      }
    }

    if (allMappedAccounts.length > 0) {
      accountsCache.set(cacheKey, { timestamp: Date.now(), accounts: allMappedAccounts });
    }

    return NextResponse.json({
      success: true,
      hasConnection: connections.length > 0,
      accounts: allMappedAccounts
    });

  } catch (error: any) {
    console.error("Fetch Accounts Error:", error);
    return NextResponse.json({ error: 'Fetch accounts failed: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const url = new URL(request.url);
    const tradingAccountId = url.searchParams.get('tradingAccountId');
    const clearAll = url.searchParams.get('clearAll') === 'true';

    if (clearAll) {
      await clearAllUserData(userId);
      accountsCache.clear();
      return NextResponse.json({ success: true, message: 'All backend user data cleared' });
    }

    if (tradingAccountId) {
      await deleteConnectionByTradingAccountId(userId, tradingAccountId);
      accountsCache.delete(`${userId}:${tradingAccountId}`);
      accountsCache.delete(`${userId}:all`);
      return NextResponse.json({ success: true, message: `Connection for account ${tradingAccountId} cleared` });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    console.error("Delete Accounts Error:", error);
    return NextResponse.json({ error: 'Delete accounts failed: ' + error.message }, { status: 500 });
  }
}
