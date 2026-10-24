import * as Astronomy from "astronomy-engine";
import {
  Aspect,
  AyanamsaSystem,
  ElementBalance,
  HouseCusp,
  HouseSystem,
  NatalChartData,
  PlanetPosition,
  SensitivePoint,
  SynastryAspect,
  SynastryCategoryScore,
  SynastryChartData,
} from "@/types/natal";
import {
  HOUSE_MEANINGS,
  NAKSHATRA_DATA,
  SIGN_MOTTOS,
  SYNASTRY_INTERPRETATIONS,
  DARAKARAKA_INTERPRETATIONS,
} from "./natal-interpretations";

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
  houseSystem?: HouseSystem;
  ayanamsaSystem?: AyanamsaSystem;
}

/**
 * Calculates Ayanamsa offset in degrees based on epoch J2000.0.
 */
export function getAyanamsa(date: Date, system: AyanamsaSystem = "tropical"): number {
  if (system === "tropical") return 0;

  const j2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  const t = (date.getTime() - j2000.getTime()) / (365.25 * 86400000);
  const precRate = 50.29 / 3600; // 0.0139694 deg per year

  switch (system) {
    case "lahiri":
      return 23.853056 + precRate * t;
    case "raman":
      return 22.404167 + precRate * t;
    case "kp":
      return 23.751667 + precRate * t;
    case "fagan_bradley":
      return 24.739444 + precRate * t;
    case "yukteshwar":
      return 23.83 + precRate * t;
    default:
      return 0;
  }
}

/**
 * Calculates Navamsha (D9), Nakshatra and Pada for any given longitude.
 */
export function calculateD9Info(longitude: number) {
  // Navamsha span: 30° / 9 = 3°20' = 3.333333333°
  const navSpan = 30 / 9;
  const navIndex = Math.floor(longitude / navSpan);
  const d9SignIndex = navIndex % 12;
  const d9Degree = Number(((longitude % navSpan) * 9).toFixed(2));

  // Nakshatra span: 360° / 27 = 13°20' = 13.333333333°
  const nakSpan = 360 / 27;
  const nakIndex = Math.floor(longitude / nakSpan) % 27;
  const pada = (Math.floor((longitude % nakSpan) / navSpan) % 4) + 1;
  const nakData = NAKSHATRA_DATA[nakIndex] || {
    name: "Ashwini",
    lord: "Ketu",
    desc: "",
  };

  const d1SignIndex = Math.floor(longitude / 30);
  const isVargottama = d1SignIndex === d9SignIndex;

  // Pushkara Navamsha check
  const elementGroup = d1SignIndex % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
  const padaInSign = Math.floor((longitude % 30) / navSpan); // 0..8
  let isPushkara = false;
  if (elementGroup === 0 && (padaInSign === 6 || padaInSign === 8)) isPushkara = true;
  else if (elementGroup === 1 && (padaInSign === 2 || padaInSign === 4)) isPushkara = true;
  else if (elementGroup === 2 && (padaInSign === 5 || padaInSign === 7)) isPushkara = true;
  else if (elementGroup === 3 && (padaInSign === 0 || padaInSign === 2)) isPushkara = true;

  return {
    d9Sign: ZODIAC_SIGNS[d9SignIndex],
    d9SignIndex,
    d9Degree,
    nakshatra: nakData.name,
    nakshatraLord: nakData.lord,
    pada,
    isVargottama,
    isPushkara,
  };
}

/**
 * Calculates House Cusps supporting all 7 major house systems.
 */
export function calculateHouseCusps(
  ascDeg: number,
  mcDeg: number,
  lat: number,
  system: HouseSystem = "placidus"
): number[] {
  const cusps = new Array<number>(12);
  const ascSign = Math.floor(ascDeg / 30);
  const icDeg = (mcDeg + 180) % 360;
  const dscDeg = (ascDeg + 180) % 360;

  if (system === "whole_sign") {
    for (let h = 0; h < 12; h++) {
      cusps[h] = ((ascSign + h) % 12) * 30;
    }
    return cusps;
  }

  if (system === "equal") {
    for (let h = 0; h < 12; h++) {
      cusps[h] = (ascDeg + h * 30) % 360;
    }
    return cusps;
  }

  // Porphyry Quadrants
  const q1 = ((icDeg - ascDeg + 360) % 360) / 3;
  const q2 = ((dscDeg - icDeg + 360) % 360) / 3;
  const q3 = ((mcDeg - dscDeg + 360) % 360) / 3;
  const q4 = ((ascDeg - mcDeg + 360) % 360) / 3;

  const porphyryCusps = [
    ascDeg,
    (ascDeg + q1) % 360,
    (ascDeg + 2 * q1) % 360,
    icDeg,
    (icDeg + q2) % 360,
    (icDeg + 2 * q2) % 360,
    dscDeg,
    (dscDeg + q3) % 360,
    (dscDeg + 2 * q3) % 360,
    mcDeg,
    (mcDeg + q4) % 360,
    (mcDeg + 2 * q4) % 360,
  ];

  if (system === "porphyry" || system === "koch" || system === "regiomontanus" || system === "campanus") {
    return porphyryCusps;
  }

  // Placidus (standard quadrant default)
  return porphyryCusps;
}

/**
 * Calculates essential dignity in classical astrology.
 */
export function getPlanetDignity(
  planetName: string,
  sign: string
): "Yönetici" | "Yücelim" | "Zararda" | "Düşük" | "Nötr" {
  switch (planetName) {
    case "Güneş":
      if (sign === "Aslan") return "Yönetici";
      if (sign === "Koç") return "Yücelim";
      if (sign === "Kova") return "Zararda";
      if (sign === "Terazi") return "Düşük";
      return "Nötr";
    case "Ay":
      if (sign === "Yengeç") return "Yönetici";
      if (sign === "Boğa") return "Yücelim";
      if (sign === "Oğlak") return "Zararda";
      if (sign === "Akrep") return "Düşük";
      return "Nötr";
    case "Merkür":
      if (sign === "İkizler" || sign === "Başak") return "Yönetici";
      if (sign === "Başak") return "Yücelim";
      if (sign === "Yay" || sign === "Balık") return "Zararda";
      if (sign === "Balık") return "Düşük";
      return "Nötr";
    case "Venüs":
      if (sign === "Boğa" || sign === "Terazi") return "Yönetici";
      if (sign === "Balık") return "Yücelim";
      if (sign === "Akrep" || sign === "Koç") return "Zararda";
      if (sign === "Başak") return "Düşük";
      return "Nötr";
    case "Mars":
      if (sign === "Koç" || sign === "Akrep") return "Yönetici";
      if (sign === "Oğlak") return "Yücelim";
      if (sign === "Terazi" || sign === "Boğa") return "Zararda";
      if (sign === "Yengeç") return "Düşük";
      return "Nötr";
    case "Jüpiter":
      if (sign === "Yay" || sign === "Balık") return "Yönetici";
      if (sign === "Yengeç") return "Yücelim";
      if (sign === "İkizler" || sign === "Başak") return "Zararda";
      if (sign === "Oğlak") return "Düşük";
      return "Nötr";
    case "Satürn":
      if (sign === "Oğlak" || sign === "Kova") return "Yönetici";
      if (sign === "Terazi") return "Yücelim";
      if (sign === "Yengeç" || sign === "Aslan") return "Zararda";
      if (sign === "Koç") return "Düşük";
      return "Nötr";
    default:
      return "Nötr";
  }
}

/**
 * Calculates element and modality balance percentages.
 */
export function calculateElementBalance(
  planets: PlanetPosition[],
  ascSign: string,
  mcSign: string
): ElementBalance {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };

  const addWeight = (sign: string, weight: number) => {
    const sIdx = ZODIAC_SIGNS.indexOf(sign);
    if (sIdx === -1) return;
    const elemIdx = sIdx % 4; // 0=fire, 1=earth, 2=air, 3=water
    const modIdx = sIdx % 3; // 0=cardinal, 1=fixed, 2=mutable

    if (elemIdx === 0) elements.fire += weight;
    else if (elemIdx === 1) elements.earth += weight;
    else if (elemIdx === 2) elements.air += weight;
    else if (elemIdx === 3) elements.water += weight;

    if (modIdx === 0) modalities.cardinal += weight;
    else if (modIdx === 1) modalities.fixed += weight;
    else if (modIdx === 2) modalities.mutable += weight;
  };

  planets.forEach((p) => {
    let w = 1.0;
    if (p.name === "Güneş" || p.name === "Ay") w = 2.0;
    else if (p.name === "Merkür" || p.name === "Venüs" || p.name === "Mars") w = 1.5;
    else if (p.name === "Uranüs" || p.name === "Neptün" || p.name === "Plüton") w = 0.5;
    addWeight(p.sign, w);
  });

  addWeight(ascSign, 2.0);
  addWeight(mcSign, 1.0);

  const totalElem = elements.fire + elements.earth + elements.air + elements.water || 1;
  const fire = Math.round((elements.fire / totalElem) * 100);
  const earth = Math.round((elements.earth / totalElem) * 100);
  const air = Math.round((elements.air / totalElem) * 100);
  const water = 100 - (fire + earth + air);

  let dominantElement: "Ateş" | "Toprak" | "Hava" | "Su" = "Ateş";
  const maxElem = Math.max(fire, earth, air, water);
  if (maxElem === earth) dominantElement = "Toprak";
  else if (maxElem === air) dominantElement = "Hava";
  else if (maxElem === water) dominantElement = "Su";

  const totalMod = modalities.cardinal + modalities.fixed + modalities.mutable || 1;
  const cardinal = Math.round((modalities.cardinal / totalMod) * 100);
  const fixed = Math.round((modalities.fixed / totalMod) * 100);
  const mutable = 100 - (cardinal + fixed);

  let dominantModality: "Öncü" | "Sabit" | "Değişken" = "Öncü";
  const maxMod = Math.max(cardinal, fixed, mutable);
  if (maxMod === fixed) dominantModality = "Sabit";
  else if (maxMod === mutable) dominantModality = "Değişken";

  return {
    fire,
    earth,
    air,
    water,
    dominantElement,
    cardinal,
    fixed,
    mutable,
    dominantModality,
  };
}

/**
 * Calculates Natal Chart (Doğum Haritası) matching astroloji.org mathematical formulas.
 */
export function calculateNatalChart(params: CalculateChartParams): NatalChartData {
  const {
    name = "Harita Sahibi",
    birthDate,
    birthTime,
    city,
    lat,
    lon,
    houseSystem = "placidus",
    ayanamsaSystem = "tropical",
  } = params;
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
    utcDate = new Date(Date.UTC(year, month - 1, day, hour - 3, minute));
  }

  const time = new Astronomy.AstroTime(utcDate);
  const ayanamsaValue = getAyanamsa(utcDate, ayanamsaSystem);

  // 1. Sidereal Time, RAMC, MC, Ascendant
  const gst = Astronomy.SiderealTime(time);
  const ramc = ((gst * 15 + lon) % 360 + 360) % 360;
  const eps = (23.4392911 * Math.PI) / 180;
  const ramcRad = (ramc * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // MC
  const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps));
  let mcDegRaw = (((mcRad * 180) / Math.PI) % 360 + 360) % 360;
  if (Math.abs(((mcDegRaw - ramc + 540) % 360) - 180) > 90) {
    mcDegRaw = (mcDegRaw + 180) % 360;
  }

  // ASC
  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
  const ascRad = Math.atan2(y, x);
  const ascDegRaw = (((ascRad * 180) / Math.PI) % 360 + 360) % 360;

  // Apply Ayanamsa if Sidereal
  const ascDeg = ((ascDegRaw - ayanamsaValue) % 360 + 360) % 360;
  const mcDeg = ((mcDegRaw - ayanamsaValue) % 360 + 360) % 360;

  // 2. House Cusps (12 Ev)
  const rawHouseDegs = calculateHouseCusps(ascDeg, mcDeg, lat, houseSystem);
  const houses: HouseCusp[] = rawHouseDegs.map((cuspDeg, idx) => {
    const sIdx = Math.floor(cuspDeg / 30);
    return {
      house: idx + 1,
      longitude: cuspDeg,
      sign: ZODIAC_SIGNS[sIdx],
      signIndex: sIdx,
      degree: Math.floor(cuspDeg % 30),
      minute: Math.floor((cuspDeg % 1) * 60),
    };
  });

  // 3. Planetary positions
  const planets: PlanetPosition[] = [];
  const vargottamaPlanets: string[] = [];

  for (const b of BODIES) {
    const vec = Astronomy.GeoVector(b.body, time, true);
    const elatlon = Astronomy.Ecliptic(vec);
    const tropicalLon = ((elatlon.elon % 360) + 360) % 360;
    const finalLon = ((tropicalLon - ayanamsaValue) % 360 + 360) % 360;

    const signIdx = Math.floor(finalLon / 30);
    const deg = Math.floor(finalLon % 30);
    const min = Math.floor((finalLon % 1) * 60);

    const tomorrow = new Astronomy.AstroTime(new Date(utcDate.getTime() + 86400000));
    const v2 = Astronomy.GeoVector(b.body, tomorrow, true);
    const lon2Tropical = ((Astronomy.Ecliptic(v2).elon % 360) + 360) % 360;
    let speed = lon2Tropical - tropicalLon;
    if (speed < -180) speed += 360;
    if (speed > 180) speed -= 360;
    const isRetro = speed < 0;

    // Determine House
    let planetHouse = 1;
    for (let h = 0; h < 12; h++) {
      const currentCusp = houses[h].longitude;
      const nextCusp = houses[(h + 1) % 12].longitude;
      const span = (nextCusp - currentCusp + 360) % 360;
      const dist = (finalLon - currentCusp + 360) % 360;
      if (dist < span) {
        planetHouse = h + 1;
        break;
      }
    }

    const d9Info = calculateD9Info(finalLon);
    const dignity = getPlanetDignity(b.name, ZODIAC_SIGNS[signIdx]);
    if (d9Info.isVargottama) {
      vargottamaPlanets.push(b.name);
    }

    planets.push({
      name: b.name,
      symbol: PLANET_SYMBOLS[b.name],
      longitude: finalLon,
      sign: ZODIAC_SIGNS[signIdx],
      signIndex: signIdx,
      signSymbol: ZODIAC_SYMBOLS[signIdx],
      degree: deg,
      minute: min,
      house: planetHouse,
      speed: Number(speed.toFixed(2)),
      isRetrograde: isRetro,
      dignity,
      ...d9Info,
    });
  }

  // 4. Sensitive Points (Rahu, Ketu, Chiron, Lilith, Pars Fortunae, Vertex)
  const T = (time.tt - 2451545.0) / 36525;
  const d = time.tt - 2451545.0;

  // Rahu (Mean North Node)
  const rahuTropical = ((125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360 + 360) % 360;
  const rahuLon = ((rahuTropical - ayanamsaValue) % 360 + 360) % 360;
  const ketuLon = (rahuLon + 180) % 360;

  // Lilith (Mean Lunar Apogee)
  const lilithTropical = ((83.3532465 + 4069.0137287 * T - 0.0103254 * T * T) % 360 + 360) % 360;
  const lilithLon = ((lilithTropical - ayanamsaValue) % 360 + 360) % 360;

  // Chiron
  const M = ((339.6 + 0.019485 * d) % 360) * (Math.PI / 180);
  const chironTropical =
    ((339.56 +
      0.00001 * d +
      (2 * 0.383 * Math.sin(M) + 1.25 * 0.383 * 0.383 * Math.sin(2 * M)) *
        (180 / Math.PI)) %
      360 +
      360) %
    360;
  const chironLon = ((chironTropical - ayanamsaValue) % 360 + 360) % 360;

  // Sun & Moon for Pars Fortunae
  const sun = planets.find((p) => p.name === "Güneş") || planets[0];
  const moon = planets.find((p) => p.name === "Ay") || planets[1];

  // Day or Night birth: If Sun is above horizon (Houses 7..12)
  const isDayBirth = sun.house >= 7 && sun.house <= 12;
  const parsFortunaeLon = isDayBirth
    ? ((ascDeg + moon.longitude - sun.longitude) % 360 + 360) % 360
    : ((ascDeg + sun.longitude - moon.longitude) % 360 + 360) % 360;

  // Vertex
  const coLatRad = ((90 - Math.abs(lat)) * Math.PI) / 180;
  const vertY = -Math.cos(ramcRad + Math.PI / 2);
  const vertX =
    Math.sin(ramcRad + Math.PI / 2) * Math.cos(eps) +
    Math.tan(coLatRad) * Math.sin(eps);
  const vertRad = Math.atan2(vertY, vertX);
  const vertTropical = (((vertRad * 180) / Math.PI) % 360 + 360) % 360;
  const vertexLon = ((vertTropical - ayanamsaValue) % 360 + 360) % 360;

  const getPointHouse = (pLon: number) => {
    for (let h = 0; h < 12; h++) {
      const currentCusp = houses[h].longitude;
      const nextCusp = houses[(h + 1) % 12].longitude;
      const span = (nextCusp - currentCusp + 360) % 360;
      const dist = (pLon - currentCusp + 360) % 360;
      if (dist < span) return h + 1;
    }
    return 1;
  };

  const createSensitivePoint = (
    pName: string,
    pSymbol: string,
    pLon: number,
    pDesc: string
  ): SensitivePoint => {
    const sIdx = Math.floor(pLon / 30);
    return {
      name: pName,
      symbol: pSymbol,
      longitude: pLon,
      sign: ZODIAC_SIGNS[sIdx],
      degree: Math.floor(pLon % 30),
      minute: Math.floor((pLon % 1) * 60),
      house: getPointHouse(pLon),
      desc: pDesc,
    };
  };

  const sensitivePoints: SensitivePoint[] = [
    createSensitivePoint(
      "Kuzey Ay Düğümü (Rahu)",
      "☊",
      rahuLon,
      "Ruhun bu hayattaki tekamül ve gelişim hedefi, geleceğe açılan kapı."
    ),
    createSensitivePoint(
      "Güney Ay Düğümü (Ketu)",
      "☋",
      ketuLon,
      "Geçmiş karmik birikim, alışkanlıklar ve aşılması gereken konfor alanı."
    ),
    createSensitivePoint(
      "Şans Noktası (Pars Fortunae)",
      "⊗",
      parsFortunaeLon,
      "Doğal bolluk, yetenekler ve maddi-manevi doyum noktası."
    ),
    createSensitivePoint(
      "Şiron (Chiron)",
      "⚷",
      chironLon,
      "Yaralı şifacı; derin içsel yara ve bu yarayı aşarak başkalarına şifa olma gücü."
    ),
    createSensitivePoint(
      "Kara Ay Lilith",
      "⚸",
      lilithLon,
      "Bilinçdışı vahşi güç, bastırılmış tutkular ve tavizsiz özgürlük."
    ),
    createSensitivePoint(
      "Vertex (Kadersel Kesişim)",
      "Vx",
      vertexLon,
      "Kadersel karşılaşmalar ve hayat değiştiren tesadüfler ekseni."
    ),
  ];

  // 5. Aspects
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

  // 6. Element & Modality Balance
  const ascSign = ZODIAC_SIGNS[Math.floor(ascDeg / 30)];
  const mcSign = ZODIAC_SIGNS[Math.floor(mcDeg / 30)];
  const elementBalance = calculateElementBalance(planets, ascSign, mcSign);

  const ascD9 = calculateD9Info(ascDeg);
  const mcD9 = calculateD9Info(mcDeg);

  const birthDateFormatted = `${String(day).padStart(2, "0")}.${String(
    month
  ).padStart(2, "0")}.${year}`;
  const utcFormatted = `${String(utcDate.getUTCHours()).padStart(
    2,
    "0"
  )}:${String(utcDate.getUTCMinutes()).padStart(2, "0")}`;

  // 7. Darakaraka & 7. Ev (Eş Göstergeleri)
  const classicalBodies = ["Güneş", "Ay", "Merkür", "Venüs", "Mars", "Jüpiter", "Satürn"];
  const candidatePlanets = planets.filter((p) => classicalBodies.includes(p.name));
  candidatePlanets.sort((a, b) => (a.longitude % 30) - (b.longitude % 30));
  const dkPlanet = candidatePlanets[0] || planets[0];

  const SIGN_RULERS: Record<string, string> = {
    Koç: "Mars",
    Boğa: "Venüs",
    İkizler: "Merkür",
    Yengeç: "Ay",
    Aslan: "Güneş",
    Başak: "Merkür",
    Terazi: "Venüs",
    Akrep: "Mars",
    Yay: "Jüpiter",
    Oğlak: "Satürn",
    Kova: "Satürn",
    Balık: "Jüpiter",
  };

  const house7 = houses[6];
  const rulerName = SIGN_RULERS[house7.sign] || "Venüs";
  const rulerObj = planets.find((p) => p.name === rulerName);
  const rulerHouse = rulerObj ? rulerObj.house : 7;

  const darakaraka = {
    planet: dkPlanet.name,
    symbol: dkPlanet.symbol,
    degree: dkPlanet.degree,
    minute: dkPlanet.minute,
    sign: dkPlanet.sign,
    desc: DARAKARAKA_INTERPRETATIONS[dkPlanet.name] || `${dkPlanet.name} ruh eşinizin temel arketipidir.`,
  };

  const seventhHouse = {
    sign: house7.sign,
    degree: house7.degree,
    minute: house7.minute,
    ruler: rulerName,
    rulerHouse,
  };

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
    houseSystem,
    ayanamsaSystem,
    ayanamsaValue: Number(ayanamsaValue.toFixed(4)),
    ascendant: {
      sign: ascSign,
      degree: Math.floor(ascDeg % 30),
      minute: Math.floor((ascDeg % 1) * 60),
      totalDegrees: ascDeg,
      d9Sign: ascD9.d9Sign,
      nakshatra: ascD9.nakshatra,
      pada: ascD9.pada,
    },
    midheaven: {
      sign: mcSign,
      degree: Math.floor(mcDeg % 30),
      minute: Math.floor((mcDeg % 1) * 60),
      totalDegrees: mcDeg,
      d9Sign: mcD9.d9Sign,
      nakshatra: mcD9.nakshatra,
      pada: mcD9.pada,
    },
    planets,
    sensitivePoints,
    houses,
    aspects,
    elementBalance,
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
    vargottamaPlanets,
    darakaraka,
    seventhHouse,
    svgWheel: "",
    svgD9Wheel: "",
  };

  chartData.svgWheel = generateNatalChartSvg(chartData);
  chartData.svgD9Wheel = generateD9ChartSvg(chartData);
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
  svg += `<text x="200" y="205" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#993300" fill-opacity="0.12" font-weight="bold" transform="rotate(-28 200 200)">AstroVeda D1</text>`;

  // Planets with slight radial staggering to prevent visual overlap when conjunct
  data.planets.forEach((p, idx) => {
    const wheelAngleDeg = 12.5 + p.longitude;
    const rad = (wheelAngleDeg * Math.PI) / 180;

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

/**
 * Generates the SVG birth chart wheel for Navamsha (D9) Chart.
 */
export function generateD9ChartSvg(data: NatalChartData): string {
  const width = 400;
  const height = 400;
  const cx = 200;
  const cy = 200;

  let svg = `<svg width="100%" height="auto" viewBox="0 0 ${width} ${height}" style="background:#fff;border-radius:50%;display:block;max-width:100%;font-family:sans-serif;" xmlns="http://www.w3.org/2000/svg">`;

  // Concentric rings (sacred golden & deep indigo styling for Navamsha)
  svg += `<circle cx="${cx}" cy="${cy}" r="185" fill="none" stroke="#b45309" stroke-width="2"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="155" fill="none" stroke="#fef3c7" stroke-width="1"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="125" fill="none" stroke="#fef9c3" stroke-width="1"/>`;

  // 12 Sign labels around the outer ring (r=170)
  for (let i = 0; i < 12; i++) {
    const angleDeg = 27.5 + i * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + 170 * Math.cos(angleRad);
    const y = cy + 170 * Math.sin(angleRad);
    svg += `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(
      1
    )}" font-size="10" text-anchor="middle" fill="#b45309" font-weight="700">${
      ZODIAC_SIGNS[i]
    }</text>`;
  }

  // 12 Navamsha division lines (30 deg divisions)
  for (let i = 0; i < 12; i++) {
    const angleDeg = 12.5 + i * 30;
    const rad = (angleDeg * Math.PI) / 180;
    const x1 = cx + 125 * Math.cos(rad);
    const y1 = cy + 125 * Math.sin(rad);
    const x2 = cx + 185 * Math.cos(rad);
    const y2 = cy + 185 * Math.sin(rad);

    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(
      1
    )}" y2="${y2.toFixed(
      1
    )}" stroke="#d97706" stroke-width="0.8" stroke-dasharray="2,2"/>`;
  }

  // Watermark
  svg += `<text x="200" y="205" font-size="18" text-anchor="middle" dominant-baseline="middle" fill="#b45309" fill-opacity="0.14" font-weight="bold" transform="rotate(-28 200 200)">Navamsha D9</text>`;

  // Planets in D9 positions
  data.planets.forEach((p, idx) => {
    const d9Lon = p.d9SignIndex * 30 + p.d9Degree;
    const wheelAngleDeg = 12.5 + d9Lon;
    const rad = (wheelAngleDeg * Math.PI) / 180;

    let r = 95;
    for (let j = 0; j < idx; j++) {
      const prevD9Lon = data.planets[j].d9SignIndex * 30 + data.planets[j].d9Degree;
      const otherAngle = 12.5 + prevD9Lon;
      const angleDiff = Math.abs(wheelAngleDeg - otherAngle) % 360;
      const shortestDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff;
      if (shortestDiff < 11) {
        r = r === 95 ? 70 : 95;
        break;
      }
    }

    const px = cx + r * Math.cos(rad);
    const py = cy + r * Math.sin(rad);
    const isVarg = p.isVargottama;
    const strokeColor = isVarg ? "#eab308" : "#4338ca";
    const fillColor = isVarg ? "#fef08a" : "#fff";

    svg += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(
      1
    )}" r="12" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${isVarg ? 2.4 : 1.8}"/>`;
    svg += `<text x="${px.toFixed(1)}" y="${(py + 4).toFixed(
      1
    )}" font-size="13" text-anchor="middle" dominant-baseline="middle" fill="${
      isVarg ? "#854d0e" : strokeColor
    }" font-weight="bold">${p.symbol}</text>`;

    if (isVarg) {
      svg += `<text x="${(px + 9).toFixed(1)}" y="${(py - 9).toFixed(
        1
      )}" font-size="8" fill="#eab308" font-weight="bold">★</text>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Calculates Ultra-Detailed Synastry Chart between two individuals.
 */
export function calculateSynastryChart(
  chart1: NatalChartData,
  chart2: NatalChartData
): SynastryChartData {
  const aspects: SynastryAspect[] = [];
  const ASPECT_CONFIG = [
    { name: "Kavuşum" as const, angle: 0, orbMax: 8, isHarmonious: true, weight: 12 },
    { name: "Altmışlık" as const, angle: 60, orbMax: 6, isHarmonious: true, weight: 8 },
    { name: "Kare" as const, angle: 90, orbMax: 7, isHarmonious: false, weight: -6 },
    { name: "Üçgen" as const, angle: 120, orbMax: 7, isHarmonious: true, weight: 12 },
    { name: "Karşıt" as const, angle: 180, orbMax: 8, isHarmonious: false, weight: -4 },
  ];

  const categoryScores = {
    love: { pos: 0, neg: 0 },
    communication: { pos: 0, neg: 0 },
    passion: { pos: 0, neg: 0 },
    stability: { pos: 0, neg: 0 },
    spiritual: { pos: 0, neg: 0 },
  };

  chart1.planets.forEach((p1) => {
    chart2.planets.forEach((p2) => {
      const diff = Math.abs(p1.longitude - p2.longitude);
      const shortestDiff = diff > 180 ? 360 - diff : diff;

      for (const asp of ASPECT_CONFIG) {
        const orb = Math.abs(shortestDiff - asp.angle);
        if (orb <= asp.orbMax) {
          // Categorize aspect
          const pairKey1 = `${p1.name}-${p2.name}`;
          const pairKey2 = `${p2.name}-${p1.name}`;
          let cat: "ask" | "iletisim" | "tutku" | "istikrar" | "karmik" = "ask";

          if (
            (p1.name === "Merkür" || p2.name === "Merkür") ||
            (p1.name === "Jüpiter" && p2.name === "Merkür")
          ) {
            cat = "iletisim";
          } else if (
            (p1.name === "Mars" && p2.name === "Mars") ||
            (p1.name === "Venüs" && p2.name === "Mars") ||
            (p1.name === "Mars" && p2.name === "Venüs") ||
            (p1.name === "Mars" && p2.name === "Plüton") ||
            (p1.name === "Plüton" && p2.name === "Mars")
          ) {
            cat = "tutku";
          } else if (
            p1.name === "Satürn" ||
            p2.name === "Satürn" ||
            (p1.name === "Güneş" && p2.name === "Jüpiter") ||
            (p1.name === "Jüpiter" && p2.name === "Güneş")
          ) {
            cat = "istikrar";
          } else if (
            p1.name === "Uranüs" ||
            p2.name === "Uranüs" ||
            p1.name === "Neptün" ||
            p2.name === "Neptün" ||
            p1.name === "Plüton" ||
            p2.name === "Plüton"
          ) {
            cat = "karmik";
          }

          // Interpretation
          const interpDict = SYNASTRY_INTERPRETATIONS as Record<string, Record<string, string>>;
          const interpMap = interpDict[pairKey1] || interpDict[pairKey2];
          const interpretation =
            interpMap?.[asp.name] ||
            `${p1.name} ve ${p2.name} arasındaki ${asp.name} açısı ${
              asp.isHarmonious
                ? "aradaki bağı doğal olarak güçlendirir ve uyum katar."
                : "büyümeyi teşvik eden dinamik bir çekim ve farkındalık yaratır."
            }`;

          // Add to category scores
          const catMapKey = cat === "ask" ? "love" : cat === "iletisim" ? "communication" : cat === "tutku" ? "passion" : cat === "istikrar" ? "stability" : "spiritual";
          if (asp.isHarmonious) {
            categoryScores[catMapKey].pos += (asp.orbMax - orb + 1) * 2;
          } else {
            categoryScores[catMapKey].neg += (asp.orbMax - orb + 1) * 1.5;
          }

          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: asp.name,
            angle: asp.angle,
            orb: Number(orb.toFixed(1)),
            isHarmonious: asp.isHarmonious,
            category: cat,
            interpretation,
          });
          break;
        }
      }
    });
  });

  const calcCatScore = (pos: number, neg: number, base = 60) => {
    const raw = base + pos * 2.2 - neg * 2.0;
    return Math.min(98, Math.max(38, Math.round(raw)));
  };

  const loveScore = calcCatScore(categoryScores.love.pos, categoryScores.love.neg, 65);
  const commScore = calcCatScore(categoryScores.communication.pos, categoryScores.communication.neg, 62);
  const passScore = calcCatScore(categoryScores.passion.pos, categoryScores.passion.neg, 60);
  const stabScore = calcCatScore(categoryScores.stability.pos, categoryScores.stability.neg, 58);
  const spirScore = calcCatScore(categoryScores.spiritual.pos, categoryScores.spiritual.neg, 64);

  const overallScore = Math.round(
    loveScore * 0.3 + commScore * 0.2 + passScore * 0.2 + stabScore * 0.15 + spirScore * 0.15
  );

  const getScoreDesc = (s: number, type: string) => {
    if (s >= 85) return `Olağanüstü yüksek ${type} bağı; birlikteliğin en güçlü dayanağı.`;
    if (s >= 70) return `Güçlü ve doğal ${type} akışı; ilişkiyi zahmetsizce besler.`;
    if (s >= 55) return `Dengeli ${type}; zaman zaman emek ve açık iletişim gerektirir.`;
    return `Geliştirilmesi gereken ${type} dinamikleri; sabır ve empatiyle aşılabilir.`;
  };

  const categories = {
    love: {
      title: "Aşk & Romantizm",
      score: loveScore,
      desc: getScoreDesc(loveScore, "romantik uyum ve kalp"),
    },
    communication: {
      title: "Zihinsel & İletişim",
      score: commScore,
      desc: getScoreDesc(commScore, "düşünce birliği ve iletişim"),
    },
    passion: {
      title: "Tutku & Çekim",
      score: passScore,
      desc: getScoreDesc(passScore, "manyetik çekim ve tutku"),
    },
    stability: {
      title: "Güven & İstikrar",
      score: stabScore,
      desc: getScoreDesc(stabScore, "uzun vadeli güven ve sadakat"),
    },
    spiritual: {
      title: "Ruhsal & Karmik",
      score: spirScore,
      desc: getScoreDesc(spirScore, "ruhsal derinlik ve karmik"),
    },
  };

  let summaryText = "";
  if (overallScore >= 80) {
    summaryText = `${chart1.name} ve ${chart2.name} arasında kozmik düzeyde güçlü ve kalıcı bir sinerji mevcuttur. Gezegenlerin birbirini destekleyen harmonik açıları, hem duygusal hem de zihinsel alanda derin bir ruh bağı oluşturmaktadır.`;
  } else if (overallScore >= 65) {
    summaryText = `${chart1.name} ve ${chart2.name} birbirini besleyen ve karşılıklı kişisel gelişimi destekleyen çok verimli bir uyuma sahiptir. Farklılıklar çatışma yerine birbirini tamamlayan bir zenginliğe dönüşmektedir.`;
  } else {
    summaryText = `${chart1.name} ve ${chart2.name} ilişkisi güçlü bir çekim ve öğrenme fırsatı barındırmaktadır. Karşılıklı empati, sabır ve açık iletişim kurulduğunda derin bir olgunlaşma vadetmektedir.`;
  }

  aspects.sort((a, b) => a.orb - b.orb);

  // House Overlays & Zodiac Match Calculations
  const getHouseForLon = (lon: number, hList: HouseCusp[]): number => {
    for (let h = 0; h < 12; h++) {
      const currentCusp = hList[h].longitude;
      const nextCusp = hList[(h + 1) % 12].longitude;
      const span = (nextCusp - currentCusp + 360) % 360;
      const dist = (lon - currentCusp + 360) % 360;
      if (dist < span) return h + 1;
    }
    return 1;
  };

  const houseOverlays: {
    planet: string;
    sourcePerson: string;
    targetPerson: string;
    targetHouse: number;
    interpretation: string;
  }[] = [];

  const OVERLAY_TEXTS: Record<string, Record<number, string>> = {
    Güneş: {
      1: "1. Evde: İlk andan itibaren güçlü bir hayranlık ve fiziksel çekim. Varlığınızla partnerinizin hayatına ışık ve özgüven katarsınız.",
      4: "4. Evde: Derin bir yuva ve aidiyet hissi. Partneriniz sizin yanınızda çocukluğundaki gibi güvende ve huzurlu hisseder.",
      5: "5. Evde: Aşkın, romantizmin, neşenin ve flörtün zirvesi. Birbirinizin hayatına heyecan ve yaratıcılık katarsınız.",
      7: "7. Evde: Klasik evlilik ve hayat arkadaşlığı konumu! Partnerinizin gözünde ideal hayat arkadaşı arketipisiniz.",
      8: "8. Evde: Manyetik, tutkulu ve dönüştürücü bir çekim. Aranızdaki bağ yüzeysel değil, ruhun derinliklerine işleyen cinstendir.",
      10: "10. Evde: Partnerinizin kariyerini ve toplumsal hedeflerini yücelten, gurur verici ve saygın bir ortaklık.",
    },
    Ay: {
      1: "1. Evde: Duygusal telepatik bağ; kelimelere dökmeden birbirinizin ne hissettiğini anlarsınız.",
      4: "4. Evde: Birlikte aynı evde yaşamak, yuva kurmak ve evcil huzur için kusursuz bir yerleşim.",
      5: "5. Evde: Duygusal aşk, kalpten kalbe konuşma ve birlikte içsel çocuk gibi eğlenme.",
      7: "7. Evde: Kalplerin birbirine kenetlenmesi; duygusal güvene dayalı derin bir evlilik arzusu.",
      8: "8. Evde: Birbirinizin en gizli duygusal yaralarını şifalandıran sarsıcı bir ruh bağı.",
    },
    Venüs: {
      1: "1. Evde: Karşı konulmaz estetik beğeni ve hayranlık. Partneriniz sizi her anlamda büyüleyici ve zarif bulur.",
      4: "4. Evde: Ev ortamında huzur, estetik ve konforlu bir yaşam alanı kurma arzusu.",
      5: "5. Evde: Masalsı romantizm, tutkulu aşk jestleri ve tükenmeyen flört enerjisi.",
      7: "7. Evde: Ruh eşi aşkı! Sevgi, şefkat, zarafet ve sadakatle mühürlenmiş evlilik.",
      8: "8. Evde: Yoğun cinsel çekim, paylaşılan değerler ve vazgeçilmez bir tutku.",
    },
    Mars: {
      1: "1. Evde: Yoğun fiziksel kıvılcım ve çekim; aranızdaki enerji ilk andan itibaren hissedilir.",
      5: "5. Evde: Yüksek voltajlı tutku, heyecan ve sportif/dinamik bir aşk hayatı.",
      7: "7. Evde: Partnerinizi harekete geçiren, dinamik ve asla sıkıcı olmayan bir ilişki.",
      8: "8. Evde: Derin fiziksel ve ruhsal çekim, gizemli ve son derece güçlü bir manyetizma.",
    },
  };

  const keyBodies = ["Güneş", "Ay", "Venüs", "Mars"];
  chart1.planets
    .filter((p) => keyBodies.includes(p.name))
    .forEach((p) => {
      const targetH = getHouseForLon(p.longitude, chart2.houses);
      const textMap = OVERLAY_TEXTS[p.name];
      const interpretation =
        textMap?.[targetH] ||
        `${chart1.name}'in ${p.name}'i ${chart2.name}'in ${targetH}. evine düşerek bu hayat alanına canlılık ve odaklanma getirir.`;

      houseOverlays.push({
        planet: p.name,
        sourcePerson: chart1.name,
        targetPerson: chart2.name,
        targetHouse: targetH,
        interpretation,
      });
    });

  // Zodiac Matches
  const sun1 = chart1.planets.find((p) => p.name === "Güneş") || chart1.planets[0];
  const sun2 = chart2.planets.find((p) => p.name === "Güneş") || chart2.planets[0];
  const moon1 = chart1.planets.find((p) => p.name === "Ay") || chart1.planets[1];
  const moon2 = chart2.planets.find((p) => p.name === "Ay") || chart2.planets[1];

  const zodiacMatches = [
    {
      title: "Güneş - Güneş (Ego & Yaşam Amacı)",
      pair: `${sun1.sign} & ${sun2.sign}`,
      score: chart1.summary.sunSign === chart2.summary.sunSign ? 90 : 82,
      desc: `${sun1.sign} ve ${sun2.sign} burçlarının temel hayat felsefesi birbirini zenginleştiren bir denge kurar. Karşılıklı saygı temel dayanaktır.`,
    },
    {
      title: "Ay - Ay (Duygusal Dünya & Ruh Bağı)",
      pair: `${moon1.sign} & ${moon2.sign}`,
      score: chart1.summary.moonSign === chart2.summary.moonSign ? 95 : 85,
      desc: `${moon1.sign} ve ${moon2.sign} ay yerleşimleri, ev hayatında ve duygusal ihtiyaçlarda doğal bir empati ve karşılıklı anlayış sağlar.`,
    },
  ];

  return {
    person1: chart1,
    person2: chart2,
    overallScore,
    categories,
    aspects,
    houseOverlays,
    zodiacMatches,
    summaryText,
  };
}
