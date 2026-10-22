import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  await createSession({
    user: {
      id: "google-demo-user-1",
      email: "berat.torun@gmail.com",
      name: "Berat Torun",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      googleLoggedIn: true,
      hattrickConnected: true,
      hattrickUsername: "berat623",
      hattrickTeamId: 1042319,
      hattrickTeamName: "Anadolu Kartalları SK",
      demoMode: true,
    },
  });

  return NextResponse.redirect(new URL("/?google_connected=true", req.nextUrl.origin));
}
