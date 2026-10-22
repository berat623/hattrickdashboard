import { NextRequest, NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const session = await getSession();

  const currentMode = session?.user?.demoMode ?? true;
  const newMode = typeof body.demoMode === "boolean" ? body.demoMode : !currentMode;

  await createSession({
    user: {
      ...(session?.user || {
        id: "user-1",
        email: "demo@hattrickdashboard.com",
        name: "Burak Berat",
        googleLoggedIn: true,
        hattrickConnected: false,
        demoMode: true,
      }),
      demoMode: newMode,
    },
  });

  return NextResponse.json({ ok: true, demoMode: newMode });
}
