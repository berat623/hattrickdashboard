import { NextRequest, NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    const serverState = await client.getServerLineupState(
      session?.user?.hattrickTeamId
    );

    return NextResponse.json({ serverState });
  } catch (error: unknown) {
    console.error("Server Lineup GET Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Sunucu taktik durumu okunamadı";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    let matchId = Number(body.matchId || 0);
    if (!matchId) {
      const matches = await client.getMatches(session?.user?.hattrickTeamId);
      const nextUpcoming = matches
        .filter((m) => m.status === "UPCOMING")
        .sort(
          (a, b) =>
            new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
        )[0];
      if (nextUpcoming) {
        matchId = nextUpcoming.id;
      }
    }

    if (!matchId) {
      return NextResponse.json(
        {
          savedToServer: false,
          verifiedFromServer: false,
          message:
            "Yaklaşan resmi/dostluk maçınız bulunamadığı için Hattrick sunucusuna maç emri gönderilemedi.",
        },
        { status: 200 }
      );
    }

    const result = await client.saveMatchOrdersAndVerify({
      matchId,
      teamId: session?.user?.hattrickTeamId,
      formation: String(body.formation || "4-4-2"),
      tactic: String(body.tactic || "Normal"),
      attitude: String(body.attitude || "Normal"),
      captainId: body.captainId ? Number(body.captainId) : undefined,
      setPiecesTakerId: body.setPiecesTakerId
        ? Number(body.setPiecesTakerId)
        : undefined,
      positions: Array.isArray(body.positions) ? body.positions : [],
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Server Lineup POST Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Kadro Hattrick sunucusuna kaydedilirken hata oluştu";
    return NextResponse.json(
      {
        savedToServer: false,
        verifiedFromServer: false,
        message,
      },
      { status: 500 }
    );
  }
}
