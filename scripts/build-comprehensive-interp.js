const fs = require('fs');
const path = require('path');

const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted-interpretations.json'), 'utf8'));

const SIGN_MOTTOS = {
  'Koç': 'Öncülük etmek, cesaret ve girişim ruhu.',
  'Boğa': 'Sabırla inşa etmek, kalıcılık ve güven.',
  'İkizler': 'Öğrenmek, aktarmak, merak ve iletişim.',
  'Yengeç': 'Korumak, beslemek, şefkat ve duygusal bağlar.',
  'Aslan': 'Işıldamak, yönetmek, yaratıcılık ve özgüven.',
  'Başak': 'Düzenleyerek iyileştirmek, ustalık ve analiz.',
  'Terazi': 'Uyum ve denge aramak, estetik ve adalet.',
  'Akrep': 'Dönüştürmek ve derinleşmek, tutku ve sezgi.',
  'Yay': 'Anlam aramak, vizyon ve keşif.',
  'Oğlak': 'Sorumluluk almak, disiplin ve zirveye odaklanmak.',
  'Kova': 'Yenilik getirmek, özgür düşünce ve vizyonerlik.',
  'Balık': 'Bütünleşmek, empati, hayal gücü ve teslimiyet.'
};

const HOUSE_MEANINGS = {
  1: { title: '1. Ev (Yükselen)', desc: 'Kişilik, dış görünüş, ilk izlenim ve hayata yaklaşım tarzı.' },
  2: { title: '2. Ev', desc: 'Maddi kaynaklar, kişisel değerler, kazanma kapasitesi ve güven ihtiyacı.' },
  3: { title: '3. Ev', desc: 'İletişim, yakın çevre, kardeşler, düşünce yapısı ve kısa yolculuklar.' },
  4: { title: '4. Ev (Dip Noktası - IC)', desc: 'Ev, yuva, aile, kökler, içsel huzur ve geçmiş temelleri.' },
  5: { title: '5. Ev', desc: 'Aşk, yaratıcılık, kendini ifade etme, çocuklar ve yaşam neşesi.' },
  6: { title: '6. Ev', desc: 'Günlük rutinler, çalışma ortamı, sağlık ve hizmet etme bilinci.' },
  7: { title: '7. Ev (Alçalan - DSC)', desc: 'İkili ilişkiler, evlilik, ortaklıklar ve karşılıklı taahhütler.' },
  8: { title: '8. Ev', desc: 'Dönüşüm, ortak paylaşılan kaynaklar, krizler ve içsel güç.' },
  9: { title: '9. Ev', desc: 'Yüksek öğrenim, felsefe, dünya görüşü, inançlar ve uzak seyahatler.' },
  10: { title: '10. Ev (Tepe Noktası - MC)', desc: 'Kariyer, toplumsal statü, hedefler ve toplumdaki saygınlık.' },
  11: { title: '11. Ev', desc: 'Sosyal çevre, arkadaş grupları, toplumsal idealler ve gelecek umutları.' },
  12: { title: '12. Ev', desc: 'Bilinçdışı, içe çekilme, maneviyat, gizli yetenekler ve ruhsal şifa.' }
};

const ASPECT_MEANINGS = {
  'Kavuşum': 'İki gezegen enerjisinin birleşmesi, yoğun odaklanma ve güç birliği.',
  'Altmışlık': 'Fırsatlar, yeteneklerin kolayca akması ve uyumlu iş birliği.',
  'Kare': 'İçsel gerilim, dinamizm, aşılması gereken engeller ve motivasyon.',
  'Üçgen': 'Doğal akış, yetenekler, şans ve zahmetsiz uyum.',
  'Karşıt': 'Farkındalık, zıtlıkların dengelenmesi ve ilişkilerde ayna etkisi.'
};

const NAKSHATRA_DATA = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', desc: 'Hızlı iyileşme, öncülük, canlılık ve yeni girişimler.' },
  { name: 'Bharani', lord: 'Venüs', deity: 'Yama', desc: 'Dönüşüm, derin tutku, sabır ve yaratıcı doğum enerjisi.' },
  { name: 'Krittika', lord: 'Güneş', deity: 'Agni', desc: 'Keskin zeka, arındırıcı ateş, kararlılık ve liderlik.' },
  { name: 'Rohini', lord: 'Ay', deity: 'Brahma', desc: 'Güzellik, çekicilik, bereket, sanatsal incelik ve duygusal derinlik.' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', desc: 'Arayış, merak, araştırma tutkusu ve zihinsel çeviklik.' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', desc: 'Fırtınalı aydınlanma, dönüşüm, entelektüel derinlik ve gözyaşından doğan güç.' },
  { name: 'Punarvasu', lord: 'Jüpiter', deity: 'Aditi', desc: 'Yeniden doğuş, bereket, affedicilik ve ruhsal koruma.' },
  { name: 'Pushya', lord: 'Satürn', deity: 'Brihaspati', desc: 'En hayırlı ay konağı; besleyicilik, maneviyat, bilgelik ve istikrar.' },
  { name: 'Ashlesha', lord: 'Merkür', deity: 'Nagas', desc: 'Sezgisel zeka, derin psikolojik kavrayış ve koruyucu enerji.' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris', desc: 'Soy bağı, asalet, ataların mirası, otorite ve gurur.' },
  { name: 'Purva Phalguni', lord: 'Venüs', deity: 'Bhaga', desc: 'Romantizm, dinlenme, aşk, şans ve sosyal zevkler.' },
  { name: 'Uttara Phalguni', lord: 'Güneş', deity: 'Aryaman', desc: 'Dostluk, kalıcı ittifaklar, cömertlik ve nezaket.' },
  { name: 'Hasta', lord: 'Ay', deity: 'Savitr', desc: 'Becerikli eller, zanaatkarlık, şifa, mizah ve usta detaycılık.' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishvakarma', desc: 'Göz kamaştırıcı estetik, mimari zeka, tasarım ve görsel yetenek.' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', desc: 'Özgür rüzgar, bağımsızlık, ticaret kabiliyeti ve esneklik.' },
  { name: 'Vishakha', lord: 'Jüpiter', deity: 'Indra-Agni', desc: 'Odaklanmış hedef, amaca adanmışlık, zafer ve kararlılık.' },
  { name: 'Anuradha', lord: 'Satürn', deity: 'Mitra', desc: 'Sadakat, dostluk, derin bağlılık ve zorlukları aşan kalp.' },
  { name: 'Jyeshtha', lord: 'Merkür', deity: 'Indra', desc: 'Kıdem, koruyucu liderlik, zihinsel güç ve cesaret.' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', desc: 'Kökleri araştırma, derin gerçekleri ortaya çıkarma ve felsefi radikallik.' },
  { name: 'Purva Ashadha', lord: 'Venüs', deity: 'Apas', desc: 'Yenilmezlik, inanç, arındırıcı sular ve popülerlik.' },
  { name: 'Uttara Ashadha', lord: 'Güneş', deity: 'Vishwadevas', desc: 'Kalıcı zafer, erdem, dürüstlük ve sarsılmaz ilkeler.' },
  { name: 'Shravana', lord: 'Ay', deity: 'Vishnu', desc: 'Dinleme sanatı, öğrenme, bilgelik ve sözlü aktarım.' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Eight Vasus', desc: 'Ritim, müzik yeteneği, zenginlik ve topluluk liderliği.' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', desc: 'Yüz şifacı, gizem, alternatif tıp, vizyonerlik ve bağımsızlık.' },
  { name: 'Purva Bhadrapada', lord: 'Jüpiter', deity: 'Aja Ekapada', desc: 'Derin mistisizm, ruhsal tutku ve dönüştürücü zeka.' },
  { name: 'Uttara Bhadrapada', lord: 'Satürn', deity: 'Ahirbudhnya', desc: 'Derin denizler, içsel huzur, bilgelik, sabır ve aydınlanma.' },
  { name: 'Revati', lord: 'Merkür', deity: 'Pushan', desc: 'Zodyakın son konağı; yol göstericilik, şefkat, bolluk ve ruhsal tamamlanma.' }
];

const HOUSE_SYSTEM_DETAILS = {
  placidus: { name: 'Placidus', desc: 'Modern astrolojinin en yaygın sistemi. Gündüz ve gece yarı-yaylarının zamana göre bölünmesine dayanır.' },
  whole_sign: { name: 'Whole Sign (Tüm Burç)', desc: 'Hellenistik ve Vedik astrolojinin en eski sistemi. Yükselen burcun tamamını 1. ev kabul eder.' },
  equal: { name: 'Equal House (Eşit Ev)', desc: 'Yükselen derecesinden itibaren her evi tam 30 derecelik eşit aralıklarla böler.' },
  porphyry: { name: 'Porphyry', desc: 'ASC ve MC arasındaki 4 kadranı tam 3 eşit dilime bölerek ev sınırlarını hesaplar.' },
  koch: { name: 'Koch (Doğum Yeri)', desc: 'Doğum enlemine göre gök ekvatoru yükseliş farklarına dayanan hassas kadran sistemi.' },
  regiomontanus: { name: 'Regiomontanus', desc: 'Gök ekvatorunu ufuk düzlemine göre 12 eşit parçaya bölen Rönesans sistemi.' },
  campanus: { name: 'Campanus', desc: 'Birincil düşey çemberi (Prime Vertical) 12 parçaya bölen uzamsal sistem.' }
};

const AYANAMSA_DETAILS = {
  tropical: { name: 'Tropikal (Batı)', desc: 'İlkbahar ekinoksunu (0° Koç) başlangıç kabul eder. Mevsimsel döngülere dayanır.' },
  lahiri: { name: 'Lahiri (Chitrapaksha - Vedik)', desc: 'Hint hükümeti ve klasik Vedik astrolojinin resmi sidereal ayanamsa standardı.' },
  kp: { name: 'Krishnamurti Paddhati (KP)', desc: 'KP Vedik astrolojisi için optimize edilmiş, olay zamanlamasında çok kullanılan ayanamsa.' },
  raman: { name: 'B.V. Raman', desc: 'Ünlü astrolog B.V. Raman tarafından geliştirilen geleneksel Vedik ayanamsa.' },
  fagan_bradley: { name: 'Fagan / Bradley', desc: 'Batı sidereal astrolojisinin öncüsü, Aldebaran ve Antares yıldızlarına sabitlenmiş sistem.' },
  yukteshwar: { name: 'Sri Yukteshwar', desc: 'Yuga döngüleri ve kadim manevi astronomi öğretilerine dayanan kutsal ayanamsa.' }
};

const D9_INTERPRETATIONS = {
  title: 'Navamsha (D9) Harmoni ve Evlilik Analizi',
  overview: 'D9 Navamsha haritası, Vedik astrolojide ruhun gerçek potansiyelini, hayatın ikinci yarısını, evlilik dinamiklerini ve eşin niteliklerini gösteren en temel varga haritasıdır.',
  vargottamaDesc: 'Vargottama (D1 ve D9 haritasında aynı burçta bulunan) gezegenler olağanüstü güç, kararlılık ve ruhsal koruma kazanır; kendi burcundaymış gibi sağlam çalışır.',
  pushkaraDesc: 'Pushkara Navamsha derecelerindeki gezegenler, zayıf konumlarda dahi olsalar kişiye ilahi lütuf, şans ve yüksek şifa getirir.'
};

const SYNASTRY_INTERPRETATIONS = {
  'Güneş-Güneş': {
    Kavuşum: 'Kişiliklerin ve temel yaşam amaçlarının mükemmel uyumu. Birbirinizi doğal bir şekilde anlarsınız.',
    Üçgen: 'Zahmetsiz saygı, ortak vizyon ve hayat enerjilerinin birbirini beslemesi.',
    Kare: 'Bireysel egolar ve liderlik mücadeleleri; ancak karşılıklı sabırla büyük kişisel büyüme sağlar.',
    Karşıt: 'Zıt kutupların çekimi; birbirinizi tamamlama potansiyeli yüksektir fakat uzlaşma gerektirir.'
  },
  'Güneş-Ay': {
    Kavuşum: 'Klasik ruh eşi işareti! Güneşin bilinçli iradesi ile Ayın duygusal dünyası tek bir yürekte buluşur.',
    Üçgen: 'Doğal bir duygusal uyum, evlilik ve uzun vadeli bağlılık için en destekleyici açılardan biridir.',
    Kare: 'Biri mantık diğeri duyguyla hareket eder; karşılıklı empati geliştirildiğinde bağ kuvvetlenir.',
    Karşıt: 'Büyük manyetik çekim; aradaki farklılıklar ilişkiyi canlı tutar.'
  },
  'Venüs-Mars': {
    Kavuşum: 'Çok yoğun fiziksel ve romantik çekim! Aranızdaki kıvılcım ilk andan itibaren hissedilir.',
    Üçgen: 'Zarif bir çekim, tutkunun ve romantizmin doğal dengesi. İlişki daima taze kalır.',
    Kare: 'Yüksek voltajlı tutku ve zaman zaman kıskançlık; tutkulu ama dengelenmesi gereken bir dinamik.',
    Karşıt: 'Manyetik bir mıknatıs etkisi; uzak duramayacağınız kadar güçlü bir cinsel ve romantik bağ.'
  },
  'Ay-Ay': {
    Kavuşum: 'Duygusal telepatik bağ; aynı anda aynı şeyleri hissetme ve evde derin huzur bulma.',
    Üçgen: 'Ev yaşamında, alışkanlıklarda ve ruhsal ihtiyaçlarda kusursuz uyum.',
    Kare: 'Duygusal tepkilerin farklılığı; biri içine kapanırken diğeri konuşmak isteyebilir.',
    Karşıt: 'Birbirinizin eksik duygusal yönlerini aynalarsınız; karşılıklı şefkatle derin bağ kurulur.'
  },
  'Merkür-Merkür': {
    Kavuşum: 'Saatlerce bitmeyen sohbetler, zihinsel dalga boyu eşitliği ve hızlı fikir alışverişi.',
    Üçgen: 'Birbirinizin düşüncelerini kelimelere dökmeden anlama; mükemmel iletişim.',
    Kare: 'Fikir ayrılıkları ve tartışmalar; ancak zihinsel olarak birbirinizi geliştirirsiniz.',
    Karşıt: 'Olaylara tamamen farklı perspektiflerden bakış; genişletici bir zihinsel ortaklık.'
  }
};

const tsContent = `// Astroloji.org ve profesyonel astroloji tabanlı detaylı yorum ve hesaplama kütüphanesi

export const SIGN_MOTTOS: Record<string, string> = ${JSON.stringify(SIGN_MOTTOS, null, 2)};

export const HOUSE_MEANINGS: Record<number, { title: string; desc: string }> = ${JSON.stringify(HOUSE_MEANINGS, null, 2)};

export const ASPECT_MEANINGS: Record<string, string> = ${JSON.stringify(ASPECT_MEANINGS, null, 2)};

export const NAKSHATRA_DATA = ${JSON.stringify(NAKSHATRA_DATA, null, 2)};

export const HOUSE_SYSTEM_DETAILS = ${JSON.stringify(HOUSE_SYSTEM_DETAILS, null, 2)};

export const AYANAMSA_DETAILS = ${JSON.stringify(AYANAMSA_DETAILS, null, 2)};

export const D9_INTERPRETATIONS = ${JSON.stringify(D9_INTERPRETATIONS, null, 2)};

export const SYNASTRY_INTERPRETATIONS = ${JSON.stringify(SYNASTRY_INTERPRETATIONS, null, 2)};

export const PLANET_SIGN_INTERPRETATIONS: Record<string, Record<string, string[]>> = ${JSON.stringify(extracted.yorumlar, null, 2)};

export const RETRO_INTERPRETATIONS: Record<string, string[]> = ${JSON.stringify(extracted.retroYorumlari, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/natal-interpretations.ts'), tsContent);
console.log('Successfully written comprehensive src/lib/natal-interpretations.ts');
