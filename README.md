# ⚽ Hattrick Dashboard (CHPP OAuth 1.0a & Otomatik Menajer)

Modern, yüksek performanslı ve Türkçe Hattrick yönetim asistanı. Ultimate Hattrick (`ultimatehattrick.com`) mimarisi örnek alınarak geliştirilmiş olup; yapay zeka destekli **otomatik kadro dizilimi**, **antrenman optimizasyonu**, **maç kazanma/kaybetme ihtimal simülatörü**, **Google OAuth 2.0** ve **Hattrick CHPP OAuth 1.0a** entegrasyonu sunar.

![Hattrick Dashboard](https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Öne Çıkan Özellikler

- **Hattrick CHPP OAuth 1.0a Akışı:**
  - `request_token.ashx` -> Kullanıcı Onay Ekranı -> `access_token.ashx` takası.
  - Token'lar güvenli, şifreli (AES/JWT) çerezlerde (`ht_session`) saklanır.
  - Kadro (`file=players`), takım bilgileri (`file=teamdetails`), maçlar (`file=matches`) ve antrenman (`file=training`) verilerini çeken tam tipli istemci katmanı.
- **Google ile Giriş (OAuth 2.0):**
  - Tek tıkla Google hesabıyla oturum açma veya hızlı demo girişi.
- **⚡ Otomatik Kadro Dizilimi (AI Auto Lineup):**
  - Oyuncuların yeteneklerini, formunu, kondisyonunu ve tecrübesini analiz ederek en yüksek verimi veren mevkileri hesaplar.
  - `4-4-2`, `3-5-2`, `4-3-3`, `4-5-1`, `3-4-3`, `5-3-2` taktiklerine göre otomatik ilk 11 ve 5 yedek oyuncuyu dizer.
  - En uygun Kaptan ve Duran Top kullanıcısını belirler.
  - Bölgesel güçleri (Sol/Merkez/Sağ Savunma, Orta Saha, Sol/Merkez/Sağ Forvet) anında hesaplar.
- **2 Boyutlu İnteraktif Taktik Tahtası (Pitch Board):**
  - Yeşil çim, saha çizgileri ve forma numaralarıyla görsel saha dizilimi.
- **⚡ Otomatik Antrenman Optimizasyonu:**
  - 17-21 yaş arası genç yetenek havuzunu tarar.
  - Kadroya en çok değer ve TSI kazandıracak antrenman türünü (Oyun Kuruculuk, Defans, Kanat, Golcülük) ve ideal kondisyon oranını belirler.
  - Haftalık seviye atlama projeksiyonunu sunar.
- **🏆 Maç Tahmin Motoru & Kazanma/Kaybetme Oranları (Ultimate Hattrick Modeli):**
  - Topa sahip olma oranını hesaplar (Orta saha gücü kübik modeli).
  - Poisson dağılımı ile Galibiyet %, Beraberlik %, Kaybetme % ve beklenen gol (xG) hesaplaması yapar.
  - Sektör sektör güç karşılaştırma tablosu.
- **🌓 Beyaz ve Siyah Tema Desteği:**
  - Açık ve Karanlık modlar arasında anında yumuşak geçiş.
- **🇹🇷 Tamamen Türkçe Arayüz:**
  - Tüm mevkiler, yetenekler ve menajerlik terimleri Türkçeleştirilmiştir.
- **⚡ Demo Modu Desteği:**
  - CHPP geliştirici anahtarınız onaylanana kadar tüm özellikleri zengin simülasyon verisiyle anında test edebilmeniz için tek tıkla açılıp kapanabilen Demo Modu.

---

## 🛠️ Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/berat623/hattrickdashboard.git
cd hattrickdashboard
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın
`.env.local` dosyasını oluşturun veya düzenleyin:

```env
# Hattrick CHPP API (OAuth 1.0a)
# Başvuru: https://www.hattrick.org/goto.aspx?path=/Community/CHPP/
HATTRICK_CONSUMER_KEY="BURAYA_HATTRICK_KEY_YAZIN"
HATTRICK_CONSUMER_SECRET="BURAYA_HATTRICK_SECRET_YAZIN"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="BURAYA_GOOGLE_CLIENT_ID_YAZIN"
GOOGLE_CLIENT_SECRET="BURAYA_GOOGLE_CLIENT_SECRET_YAZIN"

# Güvenli Oturum Anahtarı
SESSION_SECRET="hattrick-super-secret-dashboard-key-32chars-min!!"
```

*(Not: Bu anahtarları girmeseniz dahi uygulama hazır "Demo Modu" ile tüm özellikleri test etmenizi sağlar.)*

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda açın: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Proje Dizin Yapısı

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── google/          # Google OAuth rotaları (login, callback, demo)
│   │   │   ├── hattrick/        # Hattrick CHPP OAuth 1.0a (connect, callback, disconnect)
│   │   │   └── me/              # Oturum sorgulama ve çıkış
│   │   └── hattrick/
│   │       ├── players/         # file=players XML çekici
│   │       ├── team/            # file=teamdetails XML çekici
│   │       ├── matches/         # file=matches XML çekici
│   │       ├── training/        # file=training XML çekici & güncelleme
│   │       ├── lineup/auto/     # Otomatik kadro dizme API'si
│   │       └── training/optimize/# Antrenman tavsiye API'si
│   ├── globals.css              # Tailwind CSS v4 ve Tema değişkenleri
│   ├── layout.tsx               # Root Layout & ThemeProvider
│   └── page.tsx                 # Ana Dashboard Paneli
├── components/
│   ├── Navbar.tsx               # Üst gezinme çubuğu ve durum rozetleri
│   ├── PitchBoard.tsx           # 2D Görsel Taktik Futbol Sahası
│   ├── FormationSelector.tsx    # Diziliş seçici ve Tek Tıkla Kadro Diz düğmesi
│   ├── PlayersTable.tsx         # Arama ve filtreli oyuncu tablosu
│   ├── TrainingOptimizerCard.tsx# Antrenman tavsiye ve genç yetenek tablosu
│   ├── MatchCenter.tsx          # Kazanma/Kaybetme oranları ve maç tahmin motoru
│   ├── DashboardOverview.tsx    # Genel bakış özeti
│   ├── ThemeToggle.tsx          # Beyaz / Siyah tema geçiş düğmesi
│   ├── ThemeProvider.tsx        # Next-themes sağlayıcısı
│   └── HattrickConnectModal.tsx # CHPP ve Google bağlantı modalı
├── lib/
│   ├── algorithms/
│   │   ├── lineup.ts            # Otomatik mevki puanlama ve kadro algoritması
│   │   ├── training.ts          # Genç oyuncu potansiyel ve antrenman algoritması
│   │   └── match-predictor.ts   # Poisson maç simülasyonu ve kazanma oranları
│   ├── chpp/
│   │   ├── oauth.ts             # OAuth 1.0a HMAC-SHA1 imzalayıcı
│   │   ├── client.ts            # CHPP XML API istemcisi (fast-xml-parser)
│   │   └── mock-data.ts         # Zengin Türkçe demo verisi
│   └── session.ts               # Şifreli JWT çerez oturum yönetimi (jose)
└── types/
    └── hattrick.ts              # TypeScript arayüz ve veri modelleri
```

---

## 📜 Lisans
MIT License.
Hattrick ve CHPP, Hattrick Ltd.'nin tescilli ticari markalarıdır.
