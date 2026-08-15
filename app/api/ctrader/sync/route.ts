import { NextResponse } from 'next/server';
import { getConnectionsForUser, saveConnection, saveTrades, getTrades, CTraderTrade } from '@/lib/ctrader-db';
import { fetchCTraderAccounts, fetchCTraderDeals, mapProtoDealToCTraderTrade } from '@/lib/ctrader-api';
import { getSessionUserId } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    let targetAccountIds: number[] = [];
    let tradingAccountId: string | undefined = undefined;
    try {
      const body = await request.json();
      if (body.tradingAccountId) {
        tradingAccountId = String(body.tradingAccountId);
      }
      if (body.cTraderAccountId) {
        const idString = String(body.cTraderAccountId);
        targetAccountIds = idString.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0);
      }
    } catch (e) {
      // Body might be empty or invalid JSON
    }

    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }
    
    // Check if the user has a cTrader connection for this tradingAccountId
    let connections = await getConnectionsForUser(userId, tradingAccountId);
    if (tradingAccountId) {
      connections = connections.filter(c => c.tradingAccountId === tradingAccountId);
    }
    
    if (connections.length === 0) {
      return NextResponse.json({ error: 'Not connected to cTrader for this account' }, { status: 401 });
    }

    const clientId = process.env.CTRADER_CLIENT_ID || '';
    const clientSecret = process.env.CTRADER_CLIENT_SECRET || '';

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'cTrader API credentials not configured' }, { status: 500 });
    }

    let rawDeals: any[] = [];

    // Loop over all connections and fetch deals for ALL trader accounts under each connection
    for (const connection of connections) {
      try {
        let accountIdsToFetch = targetAccountIds;

        // If no specific account ID specified, fetch ALL account IDs registered under this cTrader token
        if (accountIdsToFetch.length === 0) {
          const fetchedAccs = await fetchCTraderAccounts(clientId, clientSecret, connection.accessToken);
          if (fetchedAccs && fetchedAccs.length > 0) {
            accountIdsToFetch = fetchedAccs.map((a: any) => a.ctidTraderAccountId);
          }
        }

        // Fetch deals for every single trader account
        for (const targetAccountId of accountIdsToFetch) {
          try {
            const deals = await fetchCTraderDeals(
              clientId,
              clientSecret,
              connection.accessToken,
              undefined, // 1 year back
              undefined,
              targetAccountId
            );
            deals.forEach((d: any) => (d._cTraderAccountId = targetAccountId));
            rawDeals.push(...deals);
          } catch (e: any) {
            console.error(`Failed to fetch deals for cTrader account ${targetAccountId}:`, e);
          }
        }
      } catch (connErr) {
        console.error(`Failed fetching accounts for connection:`, connErr);
      }
    }
    
    const newTrades: CTraderTrade[] = rawDeals
      .filter((d: any) => d.closePositionDetail) // Only keep closing deals
      .map((d: any) => mapProtoDealToCTraderTrade(d, d._cTraderAccountId));

    if (newTrades.length > 0) {
      // Assign the userId to the trades
      newTrades.forEach(t => t.userId = userId);
      
      // Save the new trades to the database
      await saveTrades(newTrades);
      
      // Update last sync time
      if (connections[0]) {
        connections[0].lastSyncAt = new Date().toISOString();
        await saveConnection(connections[0]);
      }
    }
    
    const allTrades = await getTrades(userId);
    
    return NextResponse.json({ 
      success: true, 
      message: `Synced ${newTrades.length} new trades across all accounts`, 
      newTradesCount: newTrades.length,
      trades: allTrades
    });
    
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: 'Sync failed: ' + error.message }, { status: 500 });
  }
}
