import { NextRequest, NextResponse } from "next/server";
import { getRequestToken } from "@/lib/chpp/oauth";
import { createSession, getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;
    const callbackUrl = `${origin}/api/auth/hattrick/callback`;

    // 1. Get request token from Hattrick CHPP
    const { oauthToken, oauthTokenSecret, authorizeUrl } = await getRequestToken(callbackUrl);

    // 2. Temporarily store requestTokenSecret in secure session cookie
    const jwt = await createSession({
      requestTokenSecret: oauthTokenSecret,
    });

    // 3. Redirect user to Hattrick CHPP authorization page
    const response = NextResponse.redirect(authorizeUrl);
    response.cookies.set("ht_session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error: unknown) {
    console.error("Hattrick OAuth Connect Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
    
    // Redirect to home with error parameter
    const errorUrl = new URL("/?auth_error=" + encodeURIComponent(errorMessage), req.nextUrl.origin);
    return NextResponse.redirect(errorUrl);
  }
}
