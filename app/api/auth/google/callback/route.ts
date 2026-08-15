import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  if (error || !code) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${siteUrl}/?error=google_auth_failed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Google OAuth credentials missing in environment" },
      { status: 500 }
    );
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(`${siteUrl}/?error=token_exchange_failed`);
    }

    // 2. Fetch user profile from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userRes.json();

    if (!userRes.ok || !googleUser.email) {
      console.error("Failed to fetch Google user profile:", googleUser);
      return NextResponse.redirect(`${siteUrl}/?error=user_info_failed`);
    }

    // 3. Save/Sync user directly into Supabase Database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Auto-add user email to allowed_emails in Supabase
        await supabase.from("allowed_emails").upsert(
          [{ email: googleUser.email.toLowerCase(), note: "Google Login User" }],
          { onConflict: "email" }
        );

        // Auto-add user profile to users table in Supabase
        await supabase.from("users").upsert(
          [{
            username: googleUser.email.toLowerCase(),
            email: googleUser.email,
            name: googleUser.name || googleUser.email,
            picture: googleUser.picture,
            google_id: googleUser.id,
            is_premium: true,
          }],
          { onConflict: "username" }
        );

        console.log(`Successfully synced ${googleUser.email} to Supabase!`);
      } catch (sbErr) {
        console.error("Failed to sync user to Supabase:", sbErr);
      }
    }

    // 5. Set HttpOnly auth cookie
    const cookieStore = await cookies();
    cookieStore.set("cerfinits_auth", googleUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // 6. Return self-closing HTML script to notify parent window and close popup
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Logging in...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f9f9fb;
      color: #1a1a1a;
    }
    .card {
      background: #ffffff;
      padding: 24px 32px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      text-align: center;
    }
    h2 { margin: 0 0 8px 0; color: #16a34a; font-size: 20px; }
    p { margin: 0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>✓ Login Successful</h2>
    <p>Returning to Cerfinits...</p>
  </div>
  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.location.href = "${siteUrl}/?login=success";
        window.close();
      } else {
        window.location.href = "${siteUrl}/?login=success";
      }
    } catch (e) {
      window.location.href = "${siteUrl}/?login=success";
    }
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Google Callback Exception:", err);
    return NextResponse.redirect(`${siteUrl}/?error=google_callback_exception`);
  }
}
