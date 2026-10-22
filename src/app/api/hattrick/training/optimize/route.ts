import { NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";
import { analyzeAndOptimizeTraining } from "@/lib/algorithms/training";

export async function GET() {
  try {
    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    const players = await client.getPlayers(session?.user?.hattrickTeamId);
    const recommendation = analyzeAndOptimizeTraining(players);

    return NextResponse.json({
      ok: true,
      recommendation,
    });
  } catch (error: unknown) {
    console.error("Training Optimize Error:", error);
    const message = error instanceof Error ? error.message : "Antrenman analizi yapılırken hata oluştu";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
