const fs = require('fs');
const path = require('path');

async function downloadCities() {
  const res = await fetch('https://www.astroloji.org/data/cities.json', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await res.json();
  console.log('Downloaded cities count:', data.length);

  const targetDir1 = path.join(__dirname, '../public/data');
  const targetDir2 = path.join(__dirname, '../src/data');

  if (!fs.existsSync(targetDir1)) fs.mkdirSync(targetDir1, { recursive: true });
  if (!fs.existsSync(targetDir2)) fs.mkdirSync(targetDir2, { recursive: true });

  fs.writeFileSync(path.join(targetDir1, 'cities.json'), JSON.stringify(data, null, 2));
  fs.writeFileSync(path.join(targetDir2, 'cities.json'), JSON.stringify(data, null, 2));
  console.log('Saved to public/data/cities.json and src/data/cities.json');
}

downloadCities();
