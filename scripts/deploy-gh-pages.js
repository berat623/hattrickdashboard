const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const apiPath = path.join(__dirname, "../src/app/api");
const backupPath = path.join(__dirname, "../src/api_backup");

console.log("🚀 GitHub Pages için statik derleme başlatılıyor...");

try {
  console.log("🔄 Günlük burç verileri canlı olarak çekiliyor...");
  execSync("npx tsx scripts/update-daily-horoscopes.ts", { stdio: "inherit" });
} catch (e) {
  console.warn("⚠️ Canlı burç çekimi uyarısı (mevcut veri kullanılacak):", e.message);
}

let movedApi = false;
try {
  if (fs.existsSync(apiPath)) {
    fs.renameSync(apiPath, backupPath);
    movedApi = true;
  }

  process.env.GITHUB_PAGES = "true";
  console.log("📦 Next.js statik export yapılıyor (basePath: /hattrickdashboard)...");
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });

  // Create .nojekyll in out/
  const noJekyllPath = path.join(__dirname, "../out/.nojekyll");
  fs.writeFileSync(noJekyllPath, "");
  console.log("✅ .nojekyll oluşturuldu.");

  // Deploy to gh-pages branch
  console.log("🚀 out/ klasörü gh-pages dalına yükleniyor...");
  execSync("npx gh-pages -d out --dotfiles -b gh-pages", { stdio: "inherit" });

  console.log("🎉 Başarıyla gh-pages dalına yüklendi!");
} catch (error) {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
} finally {
  if (movedApi && fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, apiPath);
    console.log("🔄 API rotaları geri yüklendi.");
  }
}
