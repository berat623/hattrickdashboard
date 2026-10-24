import * as Astronomy from "astronomy-engine";
import {
  Aspect,
  HouseCusp,
  NatalChartData,
  PlanetPosition,
} from "@/types/natal";
import { SIGN_MOTTOS } from "./natal-interpretations";

export const ZODIAC_SIGNS = [
  "Koç",
  "Boğa",
  "İkizler",
  "Yengeç",
  "Aslan",
  "Başak",
  "Terazi",
  "Akrep",
  "Yay",
  "Oğlak",
  "Kova",
  "Balık",
];

export const ZODIAC_SYMBOLS = [
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
];

export const PLANET_SYMBOLS: Record<string, string> = {
  Güneş: "☉",
  Ay: "☽",
  Merkür: "☿",
  Venüs: "♀",
  Mars: "♂",
  Jüpiter: "♃",
  Satürn: "♄",
  Uranüs: "♅",
  Neptün: "♆",
  Plüton: "♇",
};

const BODIES = [
  { name: "Güneş", body: Astronomy.Body.Sun },
  { name: "Ay", body: Astronomy.Body.Moon },
  { name: "Merkür", body: Astronomy.Body.Mercury },
  { name: "Venüs", body: Astronomy.Body.Venus },
  { name: "Mars", body: Astronomy.Body.Mars },
  { name: "Jüpiter", body: Astronomy.Body.Jupiter },
  { name: "Satürn", body: Astronomy.Body.Saturn },
  { name: "Uranüs", body: Astronomy.Body.Uranus },
  { name: "Neptün", body: Astronomy.Body.Neptune },
  { name: "Plüton", body: Astronomy.Body.Pluto },
];

export interface CalculateChartParams {
  name?: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  city: string;
  lat: number;
  lon: number;
  timezone?: string;
}

/**
 * Calculates Natal Chart (Doğum Haritası) matching astroloji.org mathematical formulas.
 */
export function calculateNatalChart(
  params: CalculateChartParams
): NatalChartData {
  const { name = "Harita Sahibi", birthDate, birthTime, city, lat, lon } = params;
  const timezone = params.timezone || "Europe/Istanbul";

  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);

  // Convert Local time to UTC based on exact timezone rules
  let utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  try {
    const tzFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    for (let i = 0; i < 3; i++) {
      const formatted = tzFormatter.format(utcDate);
      const parts = formatted.match(/(\d+)\/(\d+)\/(\d+),\s*(\d+):(\d+):(\d+)/);
      if (parts) {
        const fM = Number(parts[1]);
        const fD = Number(parts[2]);
        const fY = Number(parts[3]);
        const fH = Number(parts[4]);
        const fMin = Number(parts[5]);
        const diffMs =
          Date.UTC(fY, fM - 1, fD, fH, fMin) -
          Date.UTC(year, month - 1, day, hour, minute);
        utcDate = new Date(utcDate.getTime() - diffMs);
      }
    }
  } catch {
    // Fallback Turkey offset (UTC+3)
    utcDate = new Date(Date.UTC(year, month - 1, day, hour - 3, minute));
  }

  const time = new Astronomy.AstroTime(utcDate);

  // 1. Sidereal Time, RAMC, MC, Ascendant
  const gst = Astronomy.SiderealTime(time);
  const ramc = ((gst * 15 + lon) % 360 + 360) % 360;
  const eps = (23.4392911 * Math.PI) / 180;
  const ramcRad = (ramc * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // MC
  const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps));
  let mcDeg = (((mcRad * 180) / Math.PI) % 360 + 360) % 360;
  if (Math.abs(((mcDeg - ramc + 540) % 360) - 180) > 90) {
    mcDeg = (mcDeg + 180) % 360;
  }

  // ASC
  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
  const ascRad = Math.atan2(y, x);
  const ascDeg = (((ascRad * 180) / Math.PI) % 360 + 360) % 360;

  // 2. House Cusps (12 Ev)
  const houses: HouseCusp[] = [];
  for (let h = 1; h <= 12; h++) {
    let cuspDeg: number;
    if (h === 1) cuspDeg = ascDeg;
    else if (h === 4) cuspDeg = (mcDeg + 180) % 360;
    else if (h === 7) cuspDeg = (ascDeg + 180) % 360;
    else if (h === 10) cuspDeg = mcDeg;
    else {
      // Porphyry quadrant trisection
      if (h === 2) {
        cuspDeg = (ascDeg + ((mcDeg + 180 - ascDeg + 360) % 360) / 3) % 360;
      } else if (h === 3) {
        cuspDeg = (ascDeg + (2 * ((mcDeg + 180 - ascDeg + 360) % 360)) / 3) % 360;
      } else if (h === 5) {
        cuspDeg =
          (mcDeg + 180 + ((ascDeg + 180 - (mcDeg + 180) + 360) % 360) / 3) % 360;
      } else if (h === 6) {
        cuspDeg =
          (mcDeg + 180 + (2 * ((ascDeg + 180 - (mcDeg + 180) + 360)) / 3)) % 360;
      } else if (h === 8) {
        cuspDeg = (houses[1].longitude + 180) % 360;
      } else if (h === 9) {
        cuspDeg = (houses[2].longitude + 180) % 360;
      } else if (h === 11) {
        cuspDeg = (houses[4].longitude + 180) % 360;
      } else {
        // h === 12
        cuspDeg = (houses[5].longitude + 180) % 360;
      }
    }

    const sIdx = Math.floor(cuspDeg / 30);
    houses.push({
      house: h,
      longitude: cuspDeg,
      sign: ZODIAC_SIGNS[sIdx],
      signIndex: sIdx,
      degree: Math.floor(cuspDeg % 30),
      minute: Math.floor((cuspDeg % 1) * 60),
    });
  }

  // 3. Planetary positions
  const planets: PlanetPosition[] = [];
  for (const b of BODIES) {
    const vec = Astronomy.GeoVector(b.body, time, true);
    const elatlon = Astronomy.Ecliptic(vec);
    const lon = ((elatlon.elon % 360) + 360) % 360;
    const signIdx = Math.floor(lon / 30);
    const deg = Math.floor(lon % 30);
    const min = Math.floor((lon % 1) * 60);

    const tomorrow = new Astronomy.AstroTime(
      new Date(utcDate.getTime() + 86400000)
    );
    const v2 = Astronomy.GeoVector(b.body, tomorrow, true);
    const lon2 = ((Astronomy.Ecliptic(v2).elon % 360) + 360) % 360;
    let speed = lon2 - lon;
    if (speed < -180) speed += 360;
    if (speed > 180) speed -= 360;
    const isRetro = speed < 0;

    // Determine House
    let planetHouse = 1;
    for (let h = 0; h < 12; h++) {
      const currentCusp = houses[h].longitude;
      const nextCusp = houses[(h + 1) % 12].longitude;
      const span = (nextCusp - currentCusp + 360) % 360;
      const dist = (lon - currentCusp + 360) % 360;
      if (dist < span) {
        planetHouse = h + 1;
        break;
      }
    }

    planets.push({
      name: b.name,
      symbol: PLANET_SYMBOLS[b.name],
      longitude: lon,
      sign: ZODIAC_SIGNS[signIdx],
      signIndex: signIdx,
      signSymbol: ZODIAC_SYMBOLS[signIdx],
      degree: deg,
      minute: min,
      house: planetHouse,
      speed: Number(speed.toFixed(2)),
      isRetrograde: isRetro,
    });
  }

  // 4. Aspects
  const aspects: Aspect[] = [];
  const ASPECT_CONFIG = [
    { name: "Kavuşum" as const, angle: 0, orbMax: 8, isHarmonious: true },
    { name: "Altmışlık" as const, angle: 60, orbMax: 6, isHarmonious: true },
    { name: "Kare" as const, angle: 90, orbMax: 7, isHarmonious: false },
    { name: "Üçgen" as const, angle: 120, orbMax: 7, isHarmonious: true },
    { name: "Karşıt" as const, angle: 180, orbMax: 8, isHarmonious: false },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = Math.abs(planets[i].longitude - planets[j].longitude);
      const shortestDiff = diff > 180 ? 360 - diff : diff;

      for (const asp of ASPECT_CONFIG) {
        const orb = Math.abs(shortestDiff - asp.angle);
        if (orb <= asp.orbMax) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: asp.name,
            angle: asp.angle,
            orb: Number(orb.toFixed(1)),
            isHarmonious: asp.isHarmonious,
          });
          break;
        }
      }
    }
  }

  aspects.sort((a, b) => a.orb - b.orb);

  // 5. Summary Info
  const sun = planets.find((p) => p.name === "Güneş") || planets[0];
  const moon = planets.find((p) => p.name === "Ay") || planets[1];
  const ascSign = ZODIAC_SIGNS[Math.floor(ascDeg / 30)];

  const birthDateFormatted = `${String(day).padStart(2, "0")}.${String(
    month
  ).padStart(2, "0")}.${year}`;
  const utcFormatted = `${String(utcDate.getUTCHours()).padStart(
    2,
    "0"
  )}:${String(utcDate.getUTCMinutes()).padStart(2, "0")}`;

  const chartData: NatalChartData = {
    name,
    birthDate,
    birthDateFormatted,
    birthTime,
    city,
    latitude: lat,
    longitude: lon,
    timezone,
    utcTime: utcFormatted,
    ascendant: {
      sign: ascSign,
      degree: Math.floor(ascDeg % 30),
      minute: Math.floor((ascDeg % 1) * 60),
      totalDegrees: ascDeg,
    },
    midheaven: {
      sign: ZODIAC_SIGNS[Math.floor(mcDeg / 30)],
      degree: Math.floor(mcDeg % 30),
      minute: Math.floor((mcDeg % 1) * 60),
      totalDegrees: mcDeg,
    },
    planets,
    houses,
    aspects,
    summary: {
      sunSign: sun.sign,
      sunHouse: sun.house,
      sunMotto: SIGN_MOTTOS[sun.sign] || "Karakter ve yaşam gücü.",
      moonSign: moon.sign,
      moonHouse: moon.house,
      moonMotto: SIGN_MOTTOS[moon.sign] || "Duygusal dünya ve içsel ihtiyaçlar.",
      ascendantSign: ascSign,
      ascendantMotto: SIGN_MOTTOS[ascSign] || "Dış dünyaya yansıyan enerji.",
    },
    svgWheel: "",
  };

  chartData.svgWheel = generateNatalChartSvg(chartData);
  return chartData;
}

/**
 * Generates the clean SVG birth chart wheel matching astroloji.org's geometry and colors.
 */
export function generateNatalChartSvg(data: NatalChartData): string {
  const width = 400;
  const height = 400;
  const cx = 200;
  const cy = 200;

  let svg = `<svg width="100%" height="auto" viewBox="0 0 ${width} ${height}" style="background:#fff;border-radius:50%;display:block;max-width:100%;font-family:sans-serif;" xmlns="http://www.w3.org/2000/svg">`;

  // Concentric rings
  svg += `<circle cx="${cx}" cy="${cy}" r="185" fill="none" stroke="#993300" stroke-width="2"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="155" fill="none" stroke="#f0e0c0" stroke-width="1"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="125" fill="none" stroke="#ffefca" stroke-width="1"/>`;

  // 12 Sign labels around the outer ring (r=170)
  for (let i = 0; i < 12; i++) {
    const angleDeg = 27.5 + i * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + 170 * Math.cos(angleRad);
    const y = cy + 170 * Math.sin(angleRad);
    svg += `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(
      1
    )}" font-size="10" text-anchor="middle" fill="#993300" font-weight="600">${
      ZODIAC_SIGNS[i]
    }</text>`;
  }

  // 12 House Dividing lines
  data.houses.forEach((h) => {
    const wheelAngleDeg = 12.5 + h.longitude;
    const rad = (wheelAngleDeg * Math.PI) / 180;
    const x1 = cx + 125 * Math.cos(rad);
    const y1 = cy + 125 * Math.sin(rad);
    const x2 = cx + 185 * Math.cos(rad);
    const y2 = cy + 185 * Math.sin(rad);

    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(
      1
    )}" y2="${y2.toFixed(
      1
    )}" stroke="#bbb" stroke-width="0.8" stroke-dasharray="2,2"/>`;

    // House number
    const numAngleDeg = wheelAngleDeg + 15;
    const numRad = (numAngleDeg * Math.PI) / 180;
    const nx = cx + 140 * Math.cos(numRad);
    const ny = cy + 140 * Math.sin(numRad);
    svg += `<text x="${nx.toFixed(1)}" y="${(ny + 3).toFixed(
      1
    )}" font-size="9" text-anchor="middle" fill="#888">${h.house}</text>`;
  });

  // Watermark
  svg += `<text x="200" y="205" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#993300" fill-opacity="0.12" font-weight="bold" transform="rotate(-28 200 200)">AstroVeda</text>`;

  // Planets with slight radial staggering to prevent visual overlap when conjunct
  data.planets.forEach((p, idx) => {
    const wheelAngleDeg = 12.5 + p.longitude;
    const rad = (wheelAngleDeg * Math.PI) / 180;

    // Check collision with previous planets
    let r = 95;
    for (let j = 0; j < idx; j++) {
      const otherAngle = 12.5 + data.planets[j].longitude;
      const angleDiff = Math.abs(wheelAngleDeg - otherAngle) % 360;
      const shortestDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff;
      if (shortestDiff < 10) {
        r = r === 95 ? 72 : 95;
        break;
      }
    }

    const px = cx + r * Math.cos(rad);
    const py = cy + r * Math.sin(rad);
    const strokeColor = p.isRetrograde ? "#FF9933" : "#993300";

    svg += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(
      1
    )}" r="12" fill="#fff" stroke="${strokeColor}" stroke-width="1.8"/>`;
    svg += `<text x="${px.toFixed(1)}" y="${(py + 4).toFixed(
      1
    )}" font-size="13" text-anchor="middle" dominant-baseline="middle" fill="${strokeColor}" font-weight="bold">${
      p.symbol
    }</text>`;
  });

  svg += `</svg>`;
  return svg;
}
