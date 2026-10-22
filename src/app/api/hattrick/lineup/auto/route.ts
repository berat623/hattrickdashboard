import { NextRequest, NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";
import { generateAutoLineup, SupportedFormation } from "@/lib/algorithms/lineup";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const preferredFormation = body.formation as SupportedFormation | undefined;

    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    const players = await client.getPlayers(session?.user?.hattrickTeamId);
    const optimalLineup = generateAutoLineup(players, preferredFormation);

    return NextResponse.json({
      ok: true,
      lineup: optimalLineup,
      message: `En yüksek reytingli ${optimalLineup.formation} kadrosu otomatik oluşturuldu!`,
    });
  } catch (error: unknown) {
    console.error("Auto Lineup Error:", error);
    const message = error instanceof Error ? error.message : "Otomatik kadro oluşturulurken hata meydana geldi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
