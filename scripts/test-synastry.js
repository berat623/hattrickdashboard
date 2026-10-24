function calculateSynastry(chart1, chart2) {
  const aspects = [];
  const ASPECT_CONFIG = [
    { name: 'Kavuşum', angle: 0, orbMax: 8, isHarmonious: true, score: 10 },
    { name: 'Altmışlık', angle: 60, orbMax: 6, isHarmonious: true, score: 7 },
    { name: 'Kare', angle: 90, orbMax: 6, isHarmonious: false, score: -5 },
    { name: 'Üçgen', angle: 120, orbMax: 7, isHarmonious: true, score: 10 },
    { name: 'Karşıt', angle: 180, orbMax: 8, isHarmonious: false, score: -3 }
  ];

  let totalScore = 50; // base score

  chart1.planets.forEach(p1 => {
    chart2.planets.forEach(p2 => {
      const diff = Math.abs(p1.longitude - p2.longitude);
      const shortestDiff = diff > 180 ? 360 - diff : diff;

      for (const asp of ASPECT_CONFIG) {
        const orb = Math.abs(shortestDiff - asp.angle);
        if (orb <= asp.orbMax) {
          totalScore += asp.score;
          aspects.push({
            p1: p1.name,
            p2: p2.name,
            type: asp.name,
            orb: Number(orb.toFixed(1)),
            isHarmonious: asp.isHarmonious
          });
          break;
        }
      }
    });
  });

  const finalScore = Math.min(99, Math.max(35, Math.round(totalScore)));

  return {
    compatibilityScore: finalScore,
    totalAspects: aspects.length,
    aspects: aspects.sort((a, b) => a.orb - b.orb)
  };
}

console.log('Synastry logic ready');
