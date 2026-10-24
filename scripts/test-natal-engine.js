const Astronomy = require('astronomy-engine');

const ZODIAC_SIGNS = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const PLANET_SYMBOLS = {
  Güneş: '☉',
  Ay: '☽',
  Merkür: '☿',
  Venüs: '♀',
  Mars: '♂',
  Jüpiter: '♃',
  Satürn: '♄',
  Uranüs: '♅',
  Neptün: '♆',
  Plüton: '♇',
  Chiron: '⚷',
  KuzeyDugumu: '☊'
};

const BODIES = [
  { name: 'Güneş', body: Astronomy.Body.Sun },
  { name: 'Ay', body: Astronomy.Body.Moon },
  { name: 'Merkür', body: Astronomy.Body.Mercury },
  { name: 'Venüs', body: Astronomy.Body.Venus },
  { name: 'Mars', body: Astronomy.Body.Mars },
  { name: 'Jüpiter', body: Astronomy.Body.Jupiter },
  { name: 'Satürn', body: Astronomy.Body.Saturn },
  { name: 'Uranüs', body: Astronomy.Body.Uranus },
  { name: 'Neptün', body: Astronomy.Body.Neptune },
  { name: 'Plüton', body: Astronomy.Body.Pluto }
];

function calculateNatalChart({ name, birthDate, birthTime, lat, lon, timezone }) {
  // Parse date and time (e.g. 1995-05-15, 14:30)
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);

  // Timezone offset for Europe/Istanbul or general timezone
  // For Turkey: between 1985 and 2016, UTC+2 winter / UTC+3 summer (DST).
  // Using Intl / Date with timeZone:
  // We can calculate UTC date accurately using Intl
  const localDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  
  // Calculate offset using Intl
  const dummy = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const tzFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || 'Europe/Istanbul',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });
  
  // Find UTC timestamp matching this local time
  let utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  // Binary / iterative match to find exact UTC time
  for (let i = 0; i < 3; i++) {
    const formatted = tzFormatter.format(utcDate);
    // Parse formatted back
    const parts = formatted.match(/(\d+)\/(\d+)\/(\d+),\s*(\d+):(\d+):(\d+)/);
    if (parts) {
      const fM = Number(parts[1]);
      const fD = Number(parts[2]);
      const fY = Number(parts[3]);
      const fH = Number(parts[4]);
      const fMin = Number(parts[5]);
      const diffMs = (Date.UTC(fY, fM - 1, fD, fH, fMin) - Date.UTC(year, month - 1, day, hour, minute));
      utcDate = new Date(utcDate.getTime() - diffMs);
    }
  }

  const time = new Astronomy.AstroTime(utcDate);
  const observer = new Astronomy.Observer(lat, lon, 0);

  // 1. Calculate Sidereal Time, RAMC, MC, ASC
  const gst = Astronomy.SiderealTime(time);
  const ramc = ((gst * 15 + lon) % 360 + 360) % 360;
  const eps = 23.4392911 * Math.PI / 180;
  const ramcRad = ramc * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  // MC = atan2(sin(RAMC), cos(RAMC)*cos(eps))
  const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps));
  let mcDeg = ((mcRad * 180 / Math.PI) % 360 + 360) % 360;
  // Ensure MC is in correct quadrant relative to RAMC
  if (Math.abs(((mcDeg - ramc + 540) % 360) - 180) > 90) {
    mcDeg = (mcDeg + 180) % 360;
  }

  // ASC = atan2(cos(RAMC), -sin(RAMC)*cos(eps) - tan(lat)*sin(eps))
  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
  const ascRad = Math.atan2(y, x);
  const ascDeg = ((ascRad * 180 / Math.PI) % 360 + 360) % 360;

  // 2. House Cusps (Placidus / Equal)
  // Let's calculate 12 houses starting at ASC
  // In Equal house / Placidus:
  const houses = [];
  for (let h = 1; h <= 12; h++) {
    // Standard Placidus or Porphyry:
    let cuspDeg;
    if (h === 1) cuspDeg = ascDeg;
    else if (h === 4) cuspDeg = (mcDeg + 180) % 360;
    else if (h === 7) cuspDeg = (ascDeg + 180) % 360;
    else if (h === 10) cuspDeg = mcDeg;
    else {
      // Porphyry interpolation between ASC, IC, DSC, MC
      if (h === 2) cuspDeg = (ascDeg + ((mcDeg + 180 - ascDeg + 360) % 360) / 3) % 360;
      else if (h === 3) cuspDeg = (ascDeg + 2 * ((mcDeg + 180 - ascDeg + 360) % 360) / 3) % 360;
      else if (h === 5) cuspDeg = ((mcDeg + 180) + ((ascDeg + 180 - (mcDeg + 180) + 360) % 360) / 3) % 360;
      else if (h === 6) cuspDeg = ((mcDeg + 180) + 2 * ((ascDeg + 180 - (mcDeg + 180) + 360) % 360) / 3) % 360;
      else if (h === 8) cuspDeg = (cuspDeg = (houses[1].longitude + 180) % 360);
      else if (h === 9) cuspDeg = (houses[2].longitude + 180) % 360;
      else if (h === 11) cuspDeg = (houses[4].longitude + 180) % 360;
      else if (h === 12) cuspDeg = (houses[5].longitude + 180) % 360;
    }

    const sIdx = Math.floor(cuspDeg / 30);
    houses.push({
      house: h,
      longitude: cuspDeg,
      sign: ZODIAC_SIGNS[sIdx],
      signIndex: sIdx,
      degree: Math.floor(cuspDeg % 30),
      minute: Math.floor((cuspDeg % 1) * 60)
    });
  }

  // 3. Planet positions
  const planets = [];
  for (const b of BODIES) {
    const vec = Astronomy.GeoVector(b.body, time, true);
    const elatlon = Astronomy.Ecliptic(vec);
    const lon = ((elatlon.elon % 360) + 360) % 360;
    const signIdx = Math.floor(lon / 30);
    const deg = Math.floor(lon % 30);
    const min = Math.floor((lon % 1) * 60);

    const tomorrow = new Astronomy.AstroTime(new Date(utcDate.getTime() + 86400000));
    const v2 = Astronomy.GeoVector(b.body, tomorrow, true);
    const lon2 = ((Astronomy.Ecliptic(v2).elon % 360) + 360) % 360;
    let speed = lon2 - lon;
    if (speed < -180) speed += 360;
    if (speed > 180) speed -= 360;
    const isRetro = speed < 0;

    // Determine house
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
      isRetrograde: isRetro
    });
  }

  // 4. Aspects
  const aspects = [];
  const ASPECT_TYPES = [
    { name: 'Kavuşum', angle: 0, orbMax: 8, isHarmonious: true },
    { name: 'Altmışlık', angle: 60, orbMax: 6, isHarmonious: true },
    { name: 'Kare', angle: 90, orbMax: 7, isHarmonious: false },
    { name: 'Üçgen', angle: 120, orbMax: 7, isHarmonious: true },
    { name: 'Karşıt', angle: 180, orbMax: 8, isHarmonious: false }
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = Math.abs(planets[i].longitude - planets[j].longitude);
      const shortestDiff = diff > 180 ? 360 - diff : diff;

      for (const asp of ASPECT_TYPES) {
        const orb = Math.abs(shortestDiff - asp.angle);
        if (orb <= asp.orbMax) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: asp.name,
            angle: asp.angle,
            orb: Number(orb.toFixed(1)),
            isHarmonious: asp.isHarmonious
          });
          break;
        }
      }
    }
  }

  aspects.sort((a, b) => a.orb - b.orb);

  return {
    name: name || 'Harita Sahibi',
    birthDate,
    birthTime,
    utcTime: `${String(utcDate.getUTCHours()).padStart(2, '0')}:${String(utcDate.getUTCMinutes()).padStart(2, '0')}`,
    ascendant: {
      sign: ZODIAC_SIGNS[Math.floor(ascDeg / 30)],
      degree: Math.floor(ascDeg % 30),
      minute: Math.floor((ascDeg % 1) * 60),
      totalDegrees: ascDeg
    },
    midheaven: {
      sign: ZODIAC_SIGNS[Math.floor(mcDeg / 30)],
      degree: Math.floor(mcDeg % 30),
      minute: Math.floor((mcDeg % 1) * 60),
      totalDegrees: mcDeg
    },
    planets,
    houses,
    aspects
  };
}

const result = calculateNatalChart({
  name: 'Burak',
  birthDate: '1995-05-15',
  birthTime: '14:30',
  lat: 41.0138,
  lon: 28.9603,
  timezone: 'Europe/Istanbul'
});

console.log('Result ASC:', result.ascendant);
console.log('Result MC:', result.midheaven);
console.log('Planets count:', result.planets.length);
console.log('Aspects count:', result.aspects.length);
result.planets.forEach(p => {
  console.log(` - ${p.name}: ${p.sign} ${p.degree}°${p.minute}' Ev ${p.house}`);
});
console.log('Top 5 Aspects:');
result.aspects.slice(0, 5).forEach(a => {
  console.log(` - ${a.planet1} ${a.type} ${a.planet2} (Orb: ${a.orb}°)`);
});
