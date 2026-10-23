import { NextRequest, NextResponse } from "next/server";
import { CHPPClient } from "@/lib/chpp/client";
import { getSession } from "@/lib/session";
import { TransferSearchFilters } from "@/types/hattrick";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as TransferSearchFilters;
    const session = await getSession();

    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    const players = await client.searchTransferMarket(
      body,
      session?.user?.hattrickTeamId
    );

    return NextResponse.json({
      players,
      totalFound: players.length,
      searchedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Transfer Search API Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Hattrick CHPP Transfer Piyasası taranırken hata oluştu.";
    return NextResponse.json({ error: message, players: [] }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const filters: TransferSearchFilters = {
      position: (sp.get("position") as TransferSearchFilters["position"]) || "ALL",
      skillType1: sp.get("skillType1") ? Number(sp.get("skillType1")) : undefined,
      minSkillValue1: sp.get("minSkillValue1")
        ? Number(sp.get("minSkillValue1"))
        : undefined,
      maxSkillValue1: sp.get("maxSkillValue1")
        ? Number(sp.get("maxSkillValue1"))
        : undefined,
      ageMin: sp.get("ageMin") ? Number(sp.get("ageMin")) : undefined,
      ageMax: sp.get("ageMax") ? Number(sp.get("ageMax")) : undefined,
      maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
      customPlayerId: sp.get("playerId") ? Number(sp.get("playerId")) : undefined,
    };

    const session = await getSession();
    const client = new CHPPClient({
      accessToken: session?.hattrickOAuth?.accessToken,
      accessTokenSecret: session?.hattrickOAuth?.accessTokenSecret,
    });

    const players = await client.searchTransferMarket(
      filters,
      session?.user?.hattrickTeamId
    );

    return NextResponse.json({
      players,
      totalFound: players.length,
      searchedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Transfer Search GET Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Hattrick CHPP Transfer Piyasası taranırken hata oluştu.";
    return NextResponse.json({ error: message, players: [] }, { status: 500 });
  }
}
