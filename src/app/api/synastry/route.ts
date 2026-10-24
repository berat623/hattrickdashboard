import { NextRequest, NextResponse } from "next/server";
import {
  calculateNatalChart,
  calculateSynastryChart,
  CalculateChartParams,
} from "@/lib/natal-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { person1, person2 } = body;

    if (!person1 || !person2) {
      return NextResponse.json(
        {
          success: false,
          error: "Sinastri analizi için 1. ve 2. kişinin bilgileri zorunludur.",
        },
        { status: 400 }
      );
    }

    const chart1 = calculateNatalChart(person1 as CalculateChartParams);
    const chart2 = calculateNatalChart(person2 as CalculateChartParams);
    const synastry = calculateSynastryChart(chart1, chart2);

    return NextResponse.json({
      success: true,
      data: synastry,
    });
  } catch (err) {
    console.error("Synastry API Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Sinastri haritası hesaplanırken beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
