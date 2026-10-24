const Astronomy = require('astronomy-engine');

// Test Ayanamsa formulas
function getAyanamsa(date, system = 'lahiri') {
  // Years from J2000.0 (2000-01-01 12:00 UTC)
  const j2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  const t = (date.getTime() - j2000.getTime()) / (365.25 * 86400000);
  const precRate = 50.29 / 3600; // deg per year ~ 0.013969

  switch (system.toLowerCase()) {
    case 'lahiri':
      return 23.853056 + precRate * t;
    case 'raman':
      return 22.404167 + precRate * t;
    case 'kp':
    case 'krishnamurti':
      return 23.751667 + precRate * t;
    case 'fagan_bradley':
      return 24.739444 + precRate * t;
    case 'yukteshwar':
      return 23.830000 + precRate * t;
    case 'tropical':
    default:
      return 0;
  }
}

// Test D9 Navamsha calculation
const ZODIAC_SIGNS = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

function calculateD9(longitude) {
  // 1 Navamsha = 3° 20' = 3.333333333 degrees
  const navamshaSpan = 30 / 9;
  const navIndex = Math.floor(longitude / navamshaSpan);
  const d9SignIndex = navIndex % 12;
  const degreeInNav = (longitude % navamshaSpan) * 9;

  // Nakshatra & Pada
  const nakshatraSpan = 360 / 27; // 13.333333°
  const nakIndex = Math.floor(longitude / nakshatraSpan);
  const pada = Math.floor((longitude % nakshatraSpan) / navamshaSpan) + 1;

  // Check Vargottama (D1 sign == D9 sign)
  const d1SignIndex = Math.floor(longitude / 30);
  const isVargottama = d1SignIndex === d9SignIndex;

  return {
    d1Sign: ZODIAC_SIGNS[d1SignIndex],
    d9Sign: ZODIAC_SIGNS[d9SignIndex],
    degreeInNav: Number(degreeInNav.toFixed(2)),
    nakshatra: NAKSHATRAS[nakIndex],
    pada,
    isVargottama
  };
}

console.log('--- TEST D9 NAVAMSHA ---');
// Test with sample longitudes:
// Sun at Taurus 24°10' (lon = 54.1667)
console.log('Sun at 54.1667:', calculateD9(54.1667));
// Moon at Sagittarius 2°51' (lon = 242.85)
console.log('Moon at 242.85:', calculateD9(242.85));
// Test a known Vargottama (e.g. Leo 12° -> Leo in D1 and Leo in D9!)
console.log('Leo 12° (lon = 132):', calculateD9(132));
