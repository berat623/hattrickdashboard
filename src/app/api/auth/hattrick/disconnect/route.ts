import { NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Oturum bulunamadı" }, { status: 401 });
  }

  await createSession({
    hattrickOAuth: undefined,
    user: {
      ...session.user,
      hattrickConnected: false,
      hattrickTeamId: undefined,
      hattrickTeamName: undefined,
    },
  });

  return NextResponse.json({ ok: true, message: "Hattrick CHPP bağlantısı kesildi." });
}
