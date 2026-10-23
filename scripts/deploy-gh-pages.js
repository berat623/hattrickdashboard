const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ghpages = require('gh-pages');

console.log('🚀 GitHub Pages için statik derleme başlatılıyor...');

try {
  // Build Next.js
  execSync('npx next build', { stdio: 'inherit' });

  console.log('Publishing to gh-pages...');
  // Check if out exists, else build normal
  if (fs.existsSync(path.join(__dirname, '..', 'out'))) {
    fs.writeFileSync(path.join(__dirname, '..', 'out', '.nojekyll'), '');
    ghpages.publish(path.join(__dirname, '..', 'out'), {
      branch: 'gh-pages',
      dotfiles: true
    }, (err) => {
      if (err) {
        console.error('gh-pages error:', err);
      } else {
        console.log('🎉 Başarıyla gh-pages dalına yüklendi!');
      }
    });
  }
} catch (e) {
  console.error('Build/Deploy error:', e.message);
}
