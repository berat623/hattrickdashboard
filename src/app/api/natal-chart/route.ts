import { NextRequest, NextResponse } from "next/server";
import { calculateNatalChart } from "@/lib/natal-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      birthDate,
      birthTime,
      city,
      lat,
      lon,
      timezone,
      houseSystem,
      ayanamsaSystem,
    } = body;

    if (!birthDate || !birthTime || lat === undefined || lon === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Doğum tarihi, saati ve doğum yeri (koordinatlar) zorunludur.",
        },
        { status: 400 }
      );
    }

    const chart = calculateNatalChart({
      name: name || "Harita Sahibi",
      birthDate,
      birthTime,
      city: city || "İstanbul",
      lat: Number(lat),
      lon: Number(lon),
      timezone: timezone || "Europe/Istanbul",
      houseSystem,
      ayanamsaSystem,
    });

    return NextResponse.json({
      success: true,
      data: chart,
    });
  } catch (err) {
    console.error("Natal Chart API Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Doğum haritası hesaplanırken beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const birthDate = sp.get("date") || "1995-05-15";
    const birthTime = sp.get("time") || "14:30";
    const city = sp.get("city") || "İstanbul";
    const lat = Number(sp.get("lat") || 41.0138);
    const lon = Number(sp.get("lon") || 28.9603);
    const timezone = sp.get("tz") || "Europe/Istanbul";
    const name = sp.get("name") || "Harita Sahibi";

    const chart = calculateNatalChart({
      name,
      birthDate,
      birthTime,
      city,
      lat,
      lon,
      timezone,
    });

    return NextResponse.json({
      success: true,
      data: chart,
    });
  } catch (err) {
    console.error("Natal Chart API GET Error:", err);
    return NextResponse.json(
      { success: false, error: "Hesaplama hatası." },
      { status: 500 }
    );
  }
}
