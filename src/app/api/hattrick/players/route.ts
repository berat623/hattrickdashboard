import { NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
      demoMode: session?.user?.demoMode ?? true,
    });

    const players = await client.getPlayers(session?.user?.hattrickTeamId);
    return NextResponse.json({ players });
  } catch (error: unknown) {
    console.error("Players API Error:", error);
    const message = error instanceof Error ? error.message : "Oyuncular yüklenirken hata oluştu";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
