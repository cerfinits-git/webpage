import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.CTRADER_CLIENT_ID || '';
  const redirectUri = process.env.CTRADER_REDIRECT_URI || 'http://localhost:3000/api/ctrader/callback';
  
  if (!clientId) {
    return NextResponse.json({ error: 'CTRADER_CLIENT_ID is not configured in .env' }, { status: 500 });
  }

  // Get tradingAccountId from query
  const url = new URL(request.url);
  const tradingAccountId = url.searchParams.get('tradingAccountId') || '';

  // Generate the cTrader OAuth URL
  const authUrl = new URL('https://openapi.ctrader.com/apps/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', 'trading'); // Required scope for trading history
  if (tradingAccountId) {
    authUrl.searchParams.append('state', tradingAccountId);
  }

  // Redirect the user to the cTrader login page
  const response = NextResponse.redirect(authUrl.toString());
  
  if (tradingAccountId) {
    response.cookies.set('pendingTradingAccountId', tradingAccountId, { maxAge: 3600, path: '/' });
  }
  
  return response;
}
