import { NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";
import { simulateMatch } from "@/lib/algorithms/match-predictor";

export async function GET() {
  try {
    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
      demoMode: session?.user?.demoMode ?? true,
    });

    const matches = await client.getMatches(session?.user?.hattrickTeamId);

    // Enhance matches with sector comparison and win probabilities if ratings are available
    const enrichedMatches = matches.map((m) => {
      if (m.homeRatings && m.awayRatings) {
        const sim = simulateMatch(m.homeRatings, m.awayRatings);
        const winProb = m.myTeamIsHome ? sim.homeWinProb : sim.awayWinProb;
        const lossProb = m.myTeamIsHome ? sim.awayWinProb : sim.homeWinProb;
        return {
          ...m,
          winProbability: winProb,
          drawProbability: sim.drawProb,
          lossProbability: lossProb,
          simulation: sim,
        };
      }
      return m;
    });

    return NextResponse.json({ matches: enrichedMatches });
  } catch (error: unknown) {
    console.error("Matches API Error:", error);
    const message = error instanceof Error ? error.message : "Maçlar yüklenirken hata oluştu";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
