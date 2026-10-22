import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/chpp/oauth";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession, createSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const oauthToken = searchParams.get("oauth_token");
    const oauthVerifier = searchParams.get("oauth_verifier");

    if (!oauthToken || !oauthVerifier) {
      throw new Error("Geçersiz Hattrick onay yanıtı (token veya verifier eksik).");
    }

    const session = await getSession();
    const requestTokenSecret = session?.requestTokenSecret;

    if (!requestTokenSecret) {
      throw new Error("Oturum zaman aşımına uğradı veya istek anahtarı bulunamadı. Lütfen tekrar giriş yapın.");
    }

    // 1. Exchange request token for access token & secret
    const { oauthToken: accessToken, oauthTokenSecret: accessTokenSecret } = await getAccessToken(
      oauthToken,
      requestTokenSecret,
      oauthVerifier
    );

    // 2. Fetch real team info with new credentials
    const client = new CHPPClient({
      accessToken,
      accessTokenSecret,
    });

    let teamName = "Hattrick Takımı";
    let teamId = 0;
    let loginname = "Hattrick Menajeri";
    try {
      const teamDetails = await client.getTeamDetails();
      teamName = teamDetails.name;
      teamId = teamDetails.id;
      if (teamDetails.loginname) {
        loginname = teamDetails.loginname;
      }
    } catch (e) {
      console.error("Team details fetch warning in callback:", e);
    }

    // 3. Store permanent access token in encrypted cookie session
    const jwt = await createSession({
      hattrickOAuth: {
        accessToken,
        accessTokenSecret,
      },
      user: {
        id: "ht-user-" + (teamId || Date.now()),
        email: session?.user?.email || `${loginname}@hattrick.org`,
        name: session?.user?.googleLoggedIn ? session.user.name : loginname,
        image: session?.user?.image,
        googleLoggedIn: session?.user?.googleLoggedIn || false,
        hattrickConnected: true,
        hattrickUsername: loginname,
        hattrickTeamId: teamId,
        hattrickTeamName: teamName,
      },
      requestTokenSecret: undefined,
    });

    const response = NextResponse.redirect(new URL("/?ht_connected=true", req.nextUrl.origin));
    response.cookies.set("ht_session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error: unknown) {
    console.error("Hattrick Callback Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Onay işlemi başarısız oldu";
    return NextResponse.redirect(new URL("/?auth_error=" + encodeURIComponent(errorMessage), req.nextUrl.origin));
  }
}
