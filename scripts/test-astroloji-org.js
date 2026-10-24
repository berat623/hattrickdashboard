const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testSign(sign) {
  const url = `https://www.astroloji.org/?burc=${sign}`;
  const res = await fetch(url, { headers });
  const html = await res.text();
  console.log(`=== Sign: ${sign} ===`);

  // Look for headings
  const hMatches = html.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi) || [];
  hMatches.forEach((h) => {
    console.log('Heading:', h.replace(/<[^>]+>/g, '').trim());
  });

  // Look for text in articles or containers
  const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  pMatches.forEach((p, i) => {
    const text = p.replace(/<[^>]+>/g, '').trim();
    if (text.length > 40 && !text.includes('Cookie') && !text.includes('gizlilik') && !text.includes('Telif')) {
      console.log(`[P${i}]:`, text);
    }
  });
}

testSign('boga');
