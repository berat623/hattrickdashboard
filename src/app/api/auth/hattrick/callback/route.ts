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
      throw new Error("Oturum zaman aşımına uğradı veya istek anahtarı bulunamadı.");
    }

    // 1. Exchange request token for access token & secret
    const { oauthToken: accessToken, oauthTokenSecret: accessTokenSecret } = await getAccessToken(
      oauthToken,
      requestTokenSecret,
      oauthVerifier
    );

    // 2. Fetch basic team info with new credentials
    const client = new CHPPClient({
      accessToken,
      accessTokenSecret,
    });

    let teamName = "Hattrick Takımı";
    let teamId = 0;
    try {
      const teamDetails = await client.getTeamDetails();
      teamName = teamDetails.name;
      teamId = teamDetails.id;
    } catch {
      // fallback
    }

    // 3. Store permanent access token in encrypted cookie session
    await createSession({
      hattrickOAuth: {
        accessToken,
        accessTokenSecret,
      },
      user: {
        ...(session?.user || {
          id: "ht-user-" + teamId,
          email: "hattrick-user@chpp.org",
          name: teamName,
          googleLoggedIn: false,
          hattrickConnected: true,
        }),
        hattrickConnected: true,
        hattrickTeamId: teamId,
        hattrickTeamName: teamName,
      },
      requestTokenSecret: undefined, // cleanup
    });

    return NextResponse.redirect(new URL("/?ht_connected=true", req.nextUrl.origin));
  } catch (error: unknown) {
    console.error("Hattrick Callback Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Onay işlemi başarısız oldu";
    return NextResponse.redirect(new URL("/?auth_error=" + encodeURIComponent(errorMessage), req.nextUrl.origin));
  }
}
