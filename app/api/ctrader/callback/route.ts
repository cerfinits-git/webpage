import { NextResponse } from 'next/server';
import { saveConnection, CTraderConnection } from '@/lib/ctrader-db';
import { fetchCTraderAccounts } from '@/lib/ctrader-api';
import { cookies } from 'next/headers';
import { getSessionUserId } from '@/lib/auth/session';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const cookieStore = await cookies();
  const cookieTradingAccountId = cookieStore.get('pendingTradingAccountId')?.value;
  const tradingAccountId = url.searchParams.get('state') || cookieTradingAccountId; 
  
  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }

  const clientId = process.env.CTRADER_CLIENT_ID || '';
  const clientSecret = process.env.CTRADER_CLIENT_SECRET || '';
  const redirectUri = process.env.CTRADER_REDIRECT_URI || 'http://localhost:3000/api/ctrader/callback';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'CTRADER API keys are missing in .env' }, { status: 500 });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://openapi.ctrader.com/apps/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.errorCode || tokenData.error) {
      console.error("cTrader Token Error:", tokenData);
      return NextResponse.json({ error: 'Failed to get token', details: tokenData }, { status: 400 });
    }

    // The broker tokens about to be stored belong to whoever started this flow.
    // With no session there is nobody to attach them to, and defaulting to the
    // admin account would hand one person's broker access to another. This is a
    // browser redirect rather than an API call, so send them to sign in.
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/journal/settings', request.url));
    }

    // Auto-fetch account IDs linked to this cTrader token
    let ctraderAccountId = tokenData.cTraderId || 'unknown_id';
    try {
      const fetchedAccounts = await fetchCTraderAccounts(clientId, clientSecret, tokenData.accessToken);
      if (fetchedAccounts && fetchedAccounts.length > 0) {
        ctraderAccountId = fetchedAccounts.map((a: any) => a.ctidTraderAccountId).join(', ');
      }
    } catch (e) {
      console.error("Failed auto-fetching cTrader accounts during callback:", e);
    }

    // Save connection to database / Supabase
    const newConnection: CTraderConnection = {
      userId,
      tradingAccountId: tradingAccountId || undefined,
      ctraderAccountId: String(ctraderAccountId),
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
    };
    
    await saveConnection(newConnection);

    // Auto-redirect to journal overview and trigger immediate trade sync
    return NextResponse.redirect(new URL('/journal?autoSync=true', request.url));
  } catch (error) {
    console.error("cTrader Callback Exception:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
