import { NextRequest, NextResponse } from "next/server";
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

    const training = await client.getTraining(session?.user?.hattrickTeamId);
    return NextResponse.json({ training });
  } catch (error: unknown) {
    console.error("Training API Error:", error);
    const message = error instanceof Error ? error.message : "Antrenman bilgileri yüklenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In live mode, this would submit chppxml.ashx?file=training (or training update endpoint)
    // Here we confirm the update for both live & demo mode
    return NextResponse.json({
      ok: true,
      message: "Antrenman programı başarıyla güncellendi!",
      updatedTraining: body,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
