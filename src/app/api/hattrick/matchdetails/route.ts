import { NextRequest, NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const matchIdParam = req.nextUrl.searchParams.get("matchId");
    const matchId = Number(matchIdParam || 0);

    if (!matchId) {
      return NextResponse.json(
        { error: "Geçerli bir matchId parametresi gereklidir." },
        { status: 400 }
      );
    }

    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    const details = await client.getMatchDetails(
      matchId,
      session?.user?.hattrickTeamId
    );

    return NextResponse.json({ details });
  } catch (error: unknown) {
    console.error("MatchDetails API Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Maç detayları Hattrick sunucusundan alınamadı";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
