import { NextRequest, NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { createSession, getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessToken, accessTokenSecret } = body;

    if (!accessToken || !accessTokenSecret) {
      return NextResponse.json(
        { error: "Access Token ve Access Token Secret gereklidir." },
        { status: 400 }
      );
    }

    const client = new CHPPClient({
      accessToken,
      accessTokenSecret,
    });

    const teamDetails = await client.getTeamDetails();
    const session = await getSession();
    const loginname = teamDetails.loginname || "Hattrick Menajeri";

    await createSession({
      hattrickOAuth: {
        accessToken,
        accessTokenSecret,
      },
      user: {
        id: "ht-user-" + teamDetails.id,
        email: session?.user?.email || `${loginname}@hattrick.org`,
        name: loginname,
        image: session?.user?.image,
        googleLoggedIn: session?.user?.googleLoggedIn || false,
        hattrickConnected: true,
        hattrickUsername: loginname,
        hattrickTeamId: teamDetails.id,
        hattrickTeamName: teamDetails.name,
      },
    });

    return NextResponse.json({
      ok: true,
      team: teamDetails,
    });
  } catch (error: unknown) {
    console.error("Manual CHPP Token Error:", error);
    const message = error instanceof Error ? error.message : "Token doğrulanamadı";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
