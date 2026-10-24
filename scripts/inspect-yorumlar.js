const fs = require('fs');

function inspectAllYorumlar() {
  const content = fs.readFileSync('C:/Users/Burak/.gemini/antigravity/brain/2a222165-ef20-4899-89f4-f28c38735c27/scratch/script7_full.js', 'utf8');

  // Extract yorumlar object
  const start = content.indexOf('const yorumlar =');
  const end = content.indexOf('const retroYorumlari =') !== -1 ? content.indexOf('const retroYorumlari =') : content.indexOf('async function anlikGezegen');
  
  if (start !== -1) {
    const snippet = content.substring(start, end !== -1 ? end + 1000 : start + 3000);
    console.log('Snippet length:', snippet.length);
    console.log(snippet.slice(0, 1000));
  }
}

inspectAllYorumlar();
