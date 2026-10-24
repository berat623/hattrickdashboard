function generateNatalChartSvg({ ascendant, midheaven, houses, planets }) {
  const width = 400;
  const height = 400;
  const cx = 200;
  const cy = 200;

  // Circles
  let svg = `<svg width="100%" height="auto" viewBox="0 0 ${width} ${height}" style="background:#fff;border-radius:50%;display:block;max-width:100%;font-family:sans-serif;" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="185" fill="none" stroke="#993300" stroke-width="2"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="155" fill="none" stroke="#f0e0c0" stroke-width="1"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="125" fill="none" stroke="#ffefca" stroke-width="1"/>`;

  // Signs around the ring
  const ZODIAC_SIGNS = [
    'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
    'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
  ];

  // In astroloji.org, Aries center is at ~27.5 degrees
  // Radius for sign names is 170
  for (let i = 0; i < 12; i++) {
    const angleDeg = 27.5 + i * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + 170 * Math.cos(angleRad);
    const y = cy + 170 * Math.sin(angleRad);
    svg += `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="10" text-anchor="middle" fill="#993300" font-weight="600">${ZODIAC_SIGNS[i]}</text>`;
  }

  // House dividing lines & numbers
  houses.forEach((h, idx) => {
    // Map house cusp longitude to wheel angle:
    // Aries 0° is at 12.5°
    const wheelAngleDeg = 12.5 + h.longitude;
    const rad = (wheelAngleDeg * Math.PI) / 180;
    const x1 = cx + 125 * Math.cos(rad);
    const y1 = cy + 125 * Math.sin(rad);
    const x2 = cx + 185 * Math.cos(rad);
    const y2 = cy + 185 * Math.sin(rad);

    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#bbb" stroke-width="0.8" stroke-dasharray="2,2"/>`;

    // House number placed midway
    const numAngleDeg = wheelAngleDeg + 15;
    const numRad = (numAngleDeg * Math.PI) / 180;
    const nx = cx + 140 * Math.cos(numRad);
    const ny = cy + 140 * Math.sin(numRad);
    svg += `<text x="${nx.toFixed(1)}" y="${(ny + 3).toFixed(1)}" font-size="9" text-anchor="middle" fill="#888">${h.house}</text>`;
  });

  // Center watermark
  svg += `<text x="200" y="205" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#993300" fill-opacity="0.12" font-weight="bold" transform="rotate(-28 200 200)">AstroVeda</text>`;

  // Planets
  planets.forEach((p) => {
    const wheelAngleDeg = 12.5 + p.longitude;
    const rad = (wheelAngleDeg * Math.PI) / 180;
    const r = 95; // planet radius inside
    const px = cx + r * Math.cos(rad);
    const py = cy + r * Math.sin(rad);
    const strokeColor = p.isRetrograde ? '#FF9933' : '#993300';

    svg += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="12" fill="#fff" stroke="${strokeColor}" stroke-width="1.8"/>`;
    svg += `<text x="${px.toFixed(1)}" y="${(py + 4).toFixed(1)}" font-size="13" text-anchor="middle" dominant-baseline="middle" fill="${strokeColor}" font-weight="bold">${p.symbol}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

console.log('SVG Generator defined, length sample:', generateNatalChartSvg({
  ascendant: { sign: 'Başak', degree: 17, minute: 29 },
  midheaven: { sign: 'İkizler', degree: 15, minute: 26 },
  houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, longitude: i * 30 })),
  planets: [{ name: 'Güneş', symbol: '☉', longitude: 54.16, isRetrograde: false }]
}).length);
