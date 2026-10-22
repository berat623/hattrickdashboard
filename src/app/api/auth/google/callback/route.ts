import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const origin = req.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=Google+kodu+alınamadı", origin));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${origin}/api/auth/google/callback`;

    // 1. Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("Google token takası başarısız");
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profile = await userRes.json();

    // 3. Save into session
    await createSession({
      user: {
        id: profile.id || "google-user",
        email: profile.email || "kullanici@gmail.com",
        name: profile.name || "Google Kullanıcısı",
        image: profile.picture,
        googleLoggedIn: true,
        hattrickConnected: false,
      },
    });

    return NextResponse.redirect(new URL("/?google_connected=true", origin));
  } catch (error: unknown) {
    console.error("Google Callback Error:", error);
    return NextResponse.redirect(new URL("/?auth_error=Google+girişi+başarısız", origin));
  }
}
