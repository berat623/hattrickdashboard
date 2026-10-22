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

    const training = await client.getTraining(session?.user?.hattrickTeamId);
    return NextResponse.json({ training });
  } catch (error: unknown) {
    console.error("Training API Error:", error);
    const message =
      error instanceof Error ? error.message : "Antrenman bilgileri yüklenemedi";
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

    const result = await client.saveTrainingAndVerify({
      teamId: session?.user?.hattrickTeamId,
      trainingType: Number(body.trainingType || 4),
      staminaTrainingPart: Number(body.staminaTrainingPart || 15),
      trainingLevel: Number(body.trainingLevel || 100),
    });

    return NextResponse.json({
      ok: result.savedToServer,
      savedToServer: result.savedToServer,
      verifiedFromServer: result.verifiedFromServer,
      requiresWriteScope: result.requiresWriteScope,
      message: result.message,
      errorDetails: result.errorDetails,
      updatedTraining: result.serverTraining || body,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Güncelleme başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
