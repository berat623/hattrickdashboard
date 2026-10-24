const fs = require('fs');
const path = require('path');

function extractInterpretations() {
  const content = fs.readFileSync('C:/Users/Burak/.gemini/antigravity/brain/2a222165-ef20-4899-89f4-f28c38735c27/scratch/script7_full.js', 'utf8');

  const start = content.indexOf('const yorumlar = {');
  const end = content.indexOf('async function anlikGezegen()');
  const code = content.substring(start, end);

  const fn = new Function(`${code}; return { yorumlar, retroYorumlari };`);
  const data = fn();
  console.log('Planets with interpretations:', Object.keys(data.yorumlar));
  for (const p of Object.keys(data.yorumlar)) {
    console.log(` - ${p}:`, Object.keys(data.yorumlar[p]).length, 'signs');
  }
  console.log('Retro yorumları:', Object.keys(data.retroYorumlari));

  const targetPath = path.join(__dirname, 'extracted-interpretations.json');
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
  console.log('Saved extracted-interpretations.json to:', targetPath);
}

extractInterpretations();
