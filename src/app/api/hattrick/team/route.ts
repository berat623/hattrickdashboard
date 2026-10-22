import { NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    const team = await client.getTeamDetails(session?.user?.hattrickTeamId);
    return NextResponse.json({ team });
  } catch (error: unknown) {
    console.error("Team API Error:", error);
    const message = error instanceof Error ? error.message : "Takım bilgileri yüklenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
