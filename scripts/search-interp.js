const fs = require('fs');

function searchInterpretations() {
  const html = fs.readFileSync('C:/Users/Burak/.gemini/antigravity/brain/2a222165-ef20-4899-89f4-f28c38735c27/scratch/post_result.html', 'utf8');

  // Search for keywords
  const keywords = ['Sabırla inşa etmek', 'Anlam aramak', 'Düzenleyerek'];
  keywords.forEach(k => {
    console.log(`Found "${k}":`, html.includes(k));
  });

  // Let's check if there are other interpretations in the HTML
  const matches = [...html.matchAll(/<b>([^<]+(?:Güneş|Ay|Yükselen)[^<]*)<\/b><br><span[^>]*>([^<]+)<\/span>/gi)];
  console.log('Found summary cards:', matches.map(m => `${m[1]} -> ${m[2]}`));
}

searchInterpretations();
