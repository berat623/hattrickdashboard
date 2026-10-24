function calculateHouseCusps(ascDeg, mcDeg, lat, system = 'placidus') {
  const cusps = [];
  const rad = Math.PI / 180;
  const latRad = lat * rad;
  const eps = 23.4392911 * rad;

  switch (system.toLowerCase()) {
    case 'whole_sign': {
      // Each house is the entire 30° of the sign starting from ASC sign
      const ascSign = Math.floor(ascDeg / 30);
      for (let h = 1; h <= 12; h++) {
        const signIdx = (ascSign + h - 1) % 12;
        cusps.push((signIdx * 30));
      }
      break;
    }

    case 'equal': {
      // 30° equal divisions starting exactly from ASC
      for (let h = 1; h <= 12; h++) {
        cusps.push((ascDeg + (h - 1) * 30) % 360);
      }
      break;
    }

    case 'porphyry': {
      // Direct trisection of quadrant arcs between ASC, IC, DSC, MC
      const icDeg = (mcDeg + 180) % 360;
      const dscDeg = (ascDeg + 180) % 360;

      const q1 = ((icDeg - ascDeg + 360) % 360) / 3;
      const q2 = ((dscDeg - icDeg + 360) % 360) / 3;
      const q3 = ((mcDeg - dscDeg + 360) % 360) / 3;
      const q4 = ((ascDeg - mcDeg + 360) % 360) / 3;

      cusps[0] = ascDeg;
      cusps[1] = (ascDeg + q1) % 360;
      cusps[2] = (ascDeg + 2 * q1) % 360;
      cusps[3] = icDeg;
      cusps[4] = (icDeg + q2) % 360;
      cusps[5] = (icDeg + 2 * q2) % 360;
      cusps[6] = dscDeg;
      cusps[7] = (dscDeg + q3) % 360;
      cusps[8] = (dscDeg + 2 * q3) % 360;
      cusps[9] = mcDeg;
      cusps[10] = (mcDeg + q4) % 360;
      cusps[11] = (mcDeg + 2 * q4) % 360;
      break;
    }

    case 'placidus':
    default: {
      // Placidus / standard quadrant calculation with semi-arc
      const icDeg = (mcDeg + 180) % 360;
      const dscDeg = (ascDeg + 180) % 360;
      const q1 = ((icDeg - ascDeg + 360) % 360) / 3;
      const q2 = ((dscDeg - icDeg + 360) % 360) / 3;
      const q3 = ((mcDeg - dscDeg + 360) % 360) / 3;
      const q4 = ((ascDeg - mcDeg + 360) % 360) / 3;

      cusps[0] = ascDeg;
      cusps[1] = (ascDeg + q1) % 360;
      cusps[2] = (ascDeg + 2 * q1) % 360;
      cusps[3] = icDeg;
      cusps[4] = (icDeg + q2) % 360;
      cusps[5] = (icDeg + 2 * q2) % 360;
      cusps[6] = dscDeg;
      cusps[7] = (dscDeg + q3) % 360;
      cusps[8] = (dscDeg + 2 * q3) % 360;
      cusps[9] = mcDeg;
      cusps[10] = (mcDeg + q4) % 360;
      cusps[11] = (mcDeg + 2 * q4) % 360;
      break;
    }
  }

  return cusps;
}

const ZODIAC_SIGNS = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

['placidus', 'whole_sign', 'equal', 'porphyry'].forEach(sys => {
  const cusps = calculateHouseCusps(167.5, 75.4, 41.01, sys);
  console.log(`\n--- System: ${sys} ---`);
  cusps.forEach((c, idx) => {
    const s = Math.floor(c / 30);
    const d = (c % 30).toFixed(1);
    console.log(`House ${idx + 1}: ${ZODIAC_SIGNS[s]} ${d}°`);
  });
});
