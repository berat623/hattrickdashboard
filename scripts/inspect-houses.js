const fs = require('fs');

function inspectHousesAndAspects() {
  const html = fs.readFileSync('C:/Users/Burak/.gemini/antigravity/brain/2a222165-ef20-4899-89f4-f28c38735c27/scratch/result_section.html', 'utf8');

  // Find all aspect divs
  const aspectMatches = [...html.matchAll(/<b style='color:[^']*'>([^<]+)<\/b><br>Orb:\s*([^<]+)/gi)];
  console.log('Aspect count:', aspectMatches.length);
  for (const m of aspectMatches) {
    console.log('  Aspect:', m[1], '| Orb:', m[2]);
  }

  // Find house angles from SVG lines if any
  // <line x1=... y1=... x2=... y2=...
  const lines = [...html.matchAll(/<line x1='([^']+)' y1='([^']+)' x2='([^']+)' y2='([^']+)'/gi)];
  console.log('SVG House lines count:', lines.length);
  lines.forEach((l, idx) => {
    const dx = parseFloat(l[3]) - 200;
    const dy = parseFloat(l[4]) - 200;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = ((angleRad * 180 / Math.PI) % 360 + 360) % 360;
    console.log(`  Line ${idx + 1}: angle around center = ${angleDeg.toFixed(1)}°`);
  });
}

inspectHousesAndAspects();
