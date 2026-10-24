const fs = require('fs');
const path = require('path');

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
const extractedPath = path.join(__dirname, 'extracted-interpretations.json');
const extracted = fs.existsSync(extractedPath)
  ? JSON.parse(fs.readFileSync(extractedPath, 'utf8'))
  : { yorumlar: {}, retroYorumlari: {} };

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
  1: { title: '1. Ev (Yükselen - ASC)', desc: 'Kişilik, dış görünüş, ilk izlenim, beden dili ve hayata başlama tarzı.' },
  2: { title: '2. Ev', desc: 'Maddi kaynaklar, kişisel değerler, para kazanma kapasitesi ve güven duygusu.' },
  3: { title: '3. Ev', desc: 'İletişim, düşünce yapısı, kardeşler, yakın çevre, kısa seyahatler ve eğitim.' },
  4: { title: '4. Ev (Dip Noktası - IC)', desc: 'Ev, yuva, aile, kökler, iç huzur, mahremiyet ve yaşam temelleri.' },
  5: { title: '5. Ev', desc: 'Aşk, romantizm, yaratıcılık, kendini ifade etme, çocuklar ve hobiler.' },
  6: { title: '6. Ev', desc: 'Günlük rutinler, çalışma ortamı, hizmet etme, sağlık ve beden bakımı.' },
  7: { title: '7. Ev (Alçalan - DSC)', desc: 'İkili ilişkiler, evlilik, ortaklıklar, eşin nitelikleri ve yasal taahhütler.' },
  8: { title: '8. Ev', desc: 'Dönüşüm, ortak paylaşılan kaynaklar, krizler, miras ve derin psikoloji.' },
  9: { title: '9. Ev', desc: 'Yüksek öğrenim, felsefe, dünya görüşü, uzak seyahatler, inanç ve vizyon.' },
  10: { title: '10. Ev (Tepe Noktası - MC)', desc: 'Kariyer, toplumsal statü, hedefler, saygınlık ve toplumdaki iz.' },
  11: { title: '11. Ev', desc: 'Sosyal çevre, arkadaş grupları, toplumsal idealler ve gelecek umutları.' },
  12: { title: '12. Ev', desc: 'Bilinçdışı, içe çekilme, maneviyat, gizli yetenekler, fedakarlık ve ruhsal şifa.' }
};

const ASPECT_MEANINGS = {
  'Kavuşum': 'İki gezegen enerjisinin birleşmesi, yoğun odaklanma ve güç birliği.',
  'Altmışlık': 'Fırsatlar, yeteneklerin kolayca akması ve uyumlu iş birliği.',
  'Kare': 'İçsel gerilim, dinamizm, aşılması gereken engeller ve motivasyon.',
  'Üçgen': 'Doğal akış, yetenekler, şans ve zahmetsiz uyum.',
  'Karşıt': 'Farkındalık, zıtlıkların dengelenmesi ve ilişkilerde ayna etkisi.'
};

// ASCENDANT INTERPRETATIONS (YÜKSELEN BURÇ YORUMLARI)
const ASCENDANT_INTERPRETATIONS = {
  'Koç': {
    title: 'Yükselen Koç',
    summary: 'Cesur, doğrudan, enerjik ve öncü bir yaşam duruşu.',
    detail: 'Yükselen Koç olarak hayata karşı son derece dinamik, hızlı ve cesur bir tavır sergilersiniz. Bir ortama girdiğinizde enerjiniz hemen hissedilir; beklemekten ve kararsızlıktan hoşlanmazsınız. Girişimci ruhunuz sayesinde yeni projelere ilk adımı atmaktan çekinmezsiniz. Fiziksel olarak genellikle atletik, hareketli, yürüyüşü kararlı ve göz teması keskin bir yapıya sahipsinizdir. İçinizdeki lider ruhu dış dünyaya doğrudan yansır.',
    traits: ['Hızlı karar alma', 'Öncülük etme tutkusu', 'Dürüst ve samimi tavır', 'Sabırsızlık ve rekabetçilik']
  },
  'Boğa': {
    title: 'Yükselen Boğa',
    summary: 'Sakin, güven veren, estetik ve sağlam adımlarla ilerleyen bir duruş.',
    detail: 'Yükselen Boğa olarak dış dünyaya sarsılmaz bir güven, huzur ve zarafet yayarsınız. İnsanlar sizin yanınızda kendilerini güvende hisseder. Acele kararlar vermez, her şeyi tartarak, ölçerek ve sağlam temellere oturtarak inşa edersiniz. Fiziksel olarak dengeli bir duruş, hoş bir ses tonu ve estetik giyim tarzı göze çarpar. Konfor, kalite ve duyusal zevkler sizin için önemlidir; sabrınız ve sadakatiniz en belirgin gücünüzdür.',
    traits: ['Sarsılmaz güvenilirlik', 'Estetik ve zarafet', 'Sabırlı ve kararlı ilerleyiş', 'Değişime karşı temkinlilik']
  },
  'İkizler': {
    title: 'Yükselen İkizler',
    summary: 'Zeki, meraklı, konuşkan ve genç enerjili bir iletişim ustası.',
    detail: 'Yükselen İkizler olarak etrafınıza kıvrak bir zeka, merak ve canlılık saçarsınız. Yeni insanlarla kolayca iletişim kurar, her konuda bir şeyler öğrenmek ve anlatmak istersiniz. Fiziksel olarak genellikle çevik, canlı bakışlı, ellerini ve mimiklerini ustalıkla kullanan bir görünüme sahipsinizdir. Yaşınız kaç olursa olsun içinizdeki genç ve neşeli ruhu korursunuz. Zihniniz durmaksızın fikir üretir.',
    traits: ['Hızlı ve esprili zeka', 'Güçlü iletişim kabiliyeti', 'Çok yönlülük', 'Rutinlerden çabuk sıkılma']
  },
  'Yengeç': {
    title: 'Yükselen Yengeç',
    summary: 'Şefkatli, koruyucu, sezgisel ve derin duygusal auraya sahip bir yapı.',
    detail: 'Yükselen Yengeç olarak dış dünyaya şefkatli, anaç ve güven arayan bir enerji yayarsınız. İlk bakışta biraz çekingen veya mesafeli görünebilirsiniz; kabuğunuz sizi dış dünyanın kırıcı etkilerinden koruyan kalkandır. Ancak güven duyduğunuzda sıcacık ve fedakar kalbiniz açılır. Fiziksel olarak genellikle yumuşak yüz hatları, derin ve anlamlı bakışlar dikkati çeker. Sezgileriniz son derece keskindir; insanların ruh hallerini anında hissedersiniz.',
    traits: ['Derin empati ve koruma içgüdüsü', 'Güçlü sezgisel algı', 'Ev ve sevdiklerine bağlılık', 'Duygusal dalgalanmalar']
  },
  'Aslan': {
    title: 'Yükselen Aslan',
    summary: 'Karizmatik, asil, ışıltılı ve doğal bir liderlik aurası.',
    detail: 'Yükselen Aslan olarak girdiğiniz her ortamda varlığınız hemen fark edilir. Doğal bir sahne ışığına ve özgüvene sahipsinizdir. İnsanlara cömert, sıcak ve koruyucu yaklaşırsınız; ancak saygısızlığa asla tahammülünüz yoktur. Fiziksel olarak belirgin saçlar, dik bir duruş, gururlu bir yürüyüş ve etkileyici bir tebessüm karakteristiktir. Yaşamı büyük ve tutkulu yaşamayı seversiniz; yaratıcılığınız ve kalbinizin büyüklüğü etrafınızdakilere ilham verir.',
    traits: ['Işıltılı karizma ve özgüven', 'Cömertlik ve asalet', 'Yaratıcı liderlik', 'Gurur ve onaylanma arzusu']
  },
  'Başak': {
    title: 'Yükselen Başak',
    summary: 'Düzenli, titiz, zeki, alçakgönüllü ve analitik bir zarafet.',
    detail: 'Yükselen Başak olarak dış dünyaya sade, temiz, organize ve son derece güvenilir bir intiba bırakırsınız. Detayları hiç kimsenin görmediği kadar hızlı fark eder, kaosu düzenleme ve her şeyi iyileştirme arzusuyla hareket edersiniz. Fiziksel olarak genellikle zarif, dinç, ölçülü ve özenli bir giyim tarzına sahipsinizdir. İnsanlara faydalı olmak, problemleri pratikçe çözmek sizin doğal yeteneğinizdir.',
    traits: ['Üstün analiz ve gözlem kabiliyeti', 'Pratik problem çözme', 'Mükemmeliyetçilik ve düzen', 'Aşırı öz eleştiri eğilimi']
  },
  'Terazi': {
    title: 'Yükselen Terazi',
    summary: 'Nazik, diplomatik, estetik, uyumlu ve çekici bir sosyal duruş.',
    detail: 'Yükselen Terazi olarak etrafınıza zarafet, barış ve çekicilik saçarsınız. İkili ilişkilerde denge kurma, insanları uzlaştırma ve adil davranma konusunda doğuştan bir ustalığınız vardır. Çatışmalardan kaçınır, nezaketi ve güzelliği ön planda tutarsınız. Fiziksel olarak simetrik yüz hatları, tatlı bir gülümseme ve kusursuz bir stil duygusu göze çarpar. İnsanların sizin yanınızda kendilerini değerli hissetmesini sağlarsınız.',
    traits: ['Doğuştan diplomasi ve nezaket', 'Estetik ve sanatsal bakış', 'Adalet ve denge tutkusu', 'Kararsızlık ve onay ihtiyacı']
  },
  'Akrep': {
    title: 'Yükselen Akrep',
    summary: 'Gizemli, manyetik, derin, sarsılmaz iradeli ve dönüştürücü güç.',
    detail: 'Yükselen Akrep olarak son derece güçlü, büyüleyici ve gizemli bir auraya sahipsinizdir. Bakışlarınız karşınızdakinin ruhunun derinliklerine işler; yüzeysel hiçbir şeye tahammül etmezsiniz. İlk anda her şeyinizi ortaya dökmez, insanları gözlemleyerek sadakatlerini test edersiniz. Fiziksel olarak delici bakışlar, karizmatik ve sessiz bir otorite belirgindir. Zorluklar karşısında küllerinden yeniden doğma gücünüz benzersizdir.',
    traits: ['Derin ve delici sezgiler', 'Manyetik çekim gücü', 'Tavizsiz sadakat ve kararlılık', 'Aşırı kontrolcülük ve ketumluk']
  },
  'Yay': {
    title: 'Yükselen Yay',
    summary: 'İyimser, maceracı, neşeli, vizyoner ve özgür ruhlu bir yaşam tarzı.',
    detail: 'Yükselen Yay olarak hayata geniş bir perspektiften, neşeyle ve umutla bakarsınız. Sizin için hayat keşfedilecek bir macera ve öğrenilecek bir felsefedir. Yeni kültürler tanımak, seyahat etmek ve vizyonunuzu genişletmek en büyük tutkunuzdur. Fiziksel olarak genellikle uzun adımlı, atletik, güler yüzlü ve rahat bir duruş sergilersiniz. Dürüstlüğünüz ve içtenliğiniz insanları size çeker; sınırlandırılmaktan asla hoşlanmazsınız.',
    traits: ['Tükenmeyen iyimserlik ve yaşam neşesi', 'Özgürlük ve seyahat tutkusu', 'Geniş felsefi vizyon', 'Aşırı dobra ve patavatsız olabilme']
  },
  'Oğlak': {
    title: 'Yükselen Oğlak',
    summary: 'Olgun, sorumluluk sahibi, disiplinli, saygın ve zirveye odaklı bir duruş.',
    detail: 'Yükselen Oğlak olarak genç yaşta dahi olgun, vakur ve ciddi bir duruş sergilersiniz. İnsanlar sizin sözünüze ve sorumluluk duygunuza sonuna kadar güvenir. Hayatta hiçbir şeyin bedava olmadığını bilir, hedeflerinize adım adım, sabır ve sarsılmaz bir disiplinle tırmanırsınız. Fiziksel olarak kemikli yüz hatları, dik ve asil bir duruş, klasik ve kaliteli bir giyim tarzı dikkati çeker. Saygınlık ve kalıcı başarı sizin imzanızdır.',
    traits: ['Üstün disiplin ve azim', 'Kalıcı başarıya odaklanma', 'Güvenilirlik ve ciddiyet', 'Duyguları geri planda tutma']
  },
  'Kova': {
    title: 'Yükselen Kova',
    summary: 'Orijinal, vizyoner, bağımsız, hümanist ve geleceğe yön veren bir ruh.',
    detail: 'Yükselen Kova olarak geleneksel kalıplara sığmayan, tamamen kendine özgü ve bağımsız bir auraya sahipsinizdir. Toplumsal eşitlik, adalet, teknoloji ve geleceğin fikirleri sizi heyecanlandırır. Herkesle arkadaş olabilirsiniz ama kimseye bağımlı olmazsınız. Fiziksel olarak sıradışı, modern, orijinal ve zeki bakışlara sahip bir görünümünüz vardır. Farklılığınız sizin en büyük çekim gücünüzdür.',
    traits: ['Orijinal ve yenilikçi düşünce', 'Bağımsızlık ve özgürlük tutkusu', 'Hümanist dünya görüşü', 'Duygusal mesafelilik']
  },
  'Balık': {
    title: 'Yükselen Balık',
    summary: 'Empatik, büyüleyici, sanatsal, masalsı ve derin ruhsal bağ kuran bir aura.',
    detail: 'Yükselen Balık olarak dış dünyaya yumuşak, masalsı ve rüyamsı bir enerji yayarsınız. Çevrenizdeki insanların duygularını, acılarını ve sevinçlerini bir sünger gibi çekersiniz. Sanatsal yetenekleriniz, hayal gücünüz ve teslimiyet duygunuz çok gelişmiştir. Fiziksel olarak genellikle nemli ve derin gözler, büyüleyici bir yüz ifadesi ve zarafet göze çarpar. Ruhsal derinliğiniz insanları şifalandırır.',
    traits: ['Sonsuz empati ve şefkat', 'Yüksek hayal gücü ve sanatsal ilham', 'Mistik ve ruhsal derinlik', 'Sınır koymakta zorlanma']
  }
};

// MIDHEAVEN (MC) INTERPRETATIONS (TEPE NOKTASI - KARİYER VE STATÜ)
const MIDHEAVEN_INTERPRETATIONS = {
  'Koç': { title: 'MC Koç', desc: 'Kariyerde öncü, lider, kendi işini kuran, cesur girişimci veya rekabetçi sektörlerde liderlik rolü.' },
  'Boğa': { title: 'MC Boğa', desc: 'Finans, gayrimenkul, sanat, lüks tüketim veya gastronomi alanında kalıcı, güvenli ve zenginlik getiren bir kariyer.' },
  'İkizler': { title: 'MC İkizler', desc: 'Medya, yayıncılık, iletişim, pazarlama, yazarlık veya ticaret alanında çok yönlü ve hareketli kariyer.' },
  'Yengeç': { title: 'MC Yengeç', desc: 'Halka hizmet, eğitim, sağlık, gıda, otelcilik veya toplumu koruyan/besleyen kurumlarda saygın bir rol.' },
  'Aslan': { title: 'MC Aslan', desc: 'Yönetici, sahne sanatçısı, halkla ilişkiler lideri veya saygın, parlak ve dikkat çeken bir üst düzey kariyer.' },
  'Başak': { title: 'MC Başak', desc: 'Sağlık, mühendislik, analiz, muhasebe, danışmanlık veya ustalık gerektiren kusursuz hizmet alanları.' },
  'Terazi': { title: 'MC Terazi', desc: 'Hukuk, diplomasi, adalet, moda, tasarım, halkla ilişkiler veya ortaklıklarda denge sağlayan saygın kariyer.' },
  'Akrep': { title: 'MC Akrep', desc: 'Araştırma, cerrahi, psikoloji, kriz yönetimi, dedektiflik, finans veya dönüşüm liderliği.' },
  'Yay': { title: 'MC Yay', desc: 'Akademisyenlik, uluslararası ticaret, yayıncılık, felsefe, turizm veya diplomatik kariyer.' },
  'Oğlak': { title: 'MC Oğlak', desc: 'Büyük kurumsal yönetim, devlet kademesi, mimarlık, finansal otorite veya adım adım inşa edilen zirve.' },
  'Kova': { title: 'MC Kova', desc: 'Teknoloji, bilim, yazılım, havacılık, toplumsal projeler, astroloji veya yenilikçi vizyoner alanlar.' },
  'Balık': { title: 'MC Balık', desc: 'Sinema, müzik, fotoğrafçılık, psikolojik danışmanlık, tıp, şifa sanatları veya hayır kurumları.' }
};

// SPOUSE ANALYSIS (EŞİN NASIL BİRİ OLACAK? - 7. EV & NAVAMSHA)
const SPOUSE_BY_7TH_SIGN = {
  'Koç': {
    sign: 'Koç',
    summary: 'Dinamik, cesur, doğrudan ve lider ruhlu bir eş.',
    karakter: 'Eşiniz son derece enerjik, girişimci, sözünü esirgemeyen ve hayatı hızlı yaşayan bir karakter olacaktır. Kararsızlıktan hoşlanmaz; liderlik vasıfları yüksektir ve sorunlar karşısında hızla harekete geçer. Tutkulu ve dürüst biridir.',
    fiziksel: 'Genellikle atletik veya fit vücut yapısı, belirgin kemik yapısı, keskin ve canlı bakışlar, hızlı ve kararlı yürüyüş. Sportif ve modern bir giyim tarzı.',
    meslek: 'Girişimci, şirket kurucusu, mühendis, sporcu, asker/polis, cerrah veya bağımsız yönetici.',
    tanisma: 'Spor salonunda, bir yarışma veya etkinlikte, trafikte, anlık bir tartışma/iddialaşma esnasında ya da cesurca doğrudan yanınıza gelip tanışmasıyla.',
    dinamik: 'İlişkiniz asla monoton olmaz; yüksek tutku, canlılık ve zaman zaman tatlı rekabetler evliliğinizi diri tutar.'
  },
  'Boğa': {
    sign: 'Boğa',
    summary: 'Sakin, güvenilir, estetik değerleri yüksek ve sarsılmaz bir hayat arkadaşı.',
    karakter: 'Eşiniz son derece sadık, sabırlı, huzur veren ve güvenilir bir karaktere sahiptir. Aile birliğine ve maddi güvenceye büyük önem verir. Konforu, lezzetli yemekleri ve kaliteli yaşamı sever.',
    fiziksel: 'Çekici ve dengeli vücut hatları, pürüzsüz ten, hoş bir ses tonu ve sakin/dingin bakışlar. Kaliteli kumaşlar ve şık, zamansız giyim tarzı.',
    meslek: 'Bankacı, finansçı, gayrimenkul uzmanı, mimar, gıda/gastronomi uzmanı, sanatçı veya peyzaj mimarı.',
    tanisma: 'Güzel bir restoranda, bir sanat galerisinde, doğa yürüyüşünde, finansal bir işlem esnasında veya güvenilir aile dostları aracılığıyla.',
    dinamik: 'Evliliğiniz sarsılmaz bir sadakat, fiziksel şefkat, huzur ve maddi-manevi zenginlik üzerine kurulacaktır.'
  },
  'İkizler': {
    sign: 'İkizler',
    summary: 'Zeki, esprili, konuşkan ve genç ruhlu bir entelektüel.',
    karakter: 'Eşinizle asla sohbetiniz tükenmeyecektir! Çok meraklı, öğrenmeye ve aktarmaya aşık, sosyal ve zeki bir mizaca sahiptir. Espri kabiliyeti yüksektir; hayatı oyun ve macera gibi algılar.',
    fiziksel: 'İnce, çevik bir beden, genç ve dinamik yüz ifadesi, konuşurken ellerini ve mimiklerini çok kullanan hareketli bir görünüm.',
    meslek: 'Gazeteci, yazar, yazılımcı, pazarlama uzmanı, öğretmen, tercüman veya dijital medya yöneticisi.',
    tanisma: 'Bir kütüphanede, eğitim veya seminerde, sosyal medyada, bir kitapçıda veya seyahat esnasında zekice bir sohbetle.',
    dinamik: 'İlişkiniz sadece bir evlilik değil, aynı zamanda harika bir dostluk, zihinsel ortaklık ve tükenmeyen bir neşe kaynağıdır.'
  },
  'Yengeç': {
    sign: 'Yengeç',
    summary: 'Şefkatli, anaç/koruyucu, duygusal ve evine son derece bağlı bir eş.',
    karakter: 'Eşiniz sizi sarıp sarmalayan, duygularınızı anında hisseden ve aileyi her şeyin üstünde tutan bir karaktere sahiptir. Sevdiklerine karşı aşırı koruyucudur; evini bir kale gibi görür.',
    fiziksel: 'Yumuşak ve sevecen yüz hatları, parlak ve derin gözler, sıcak bir tebessüm ve rahatlatıcı bir vücut aurası.',
    meslek: 'Doktor, hemşire, pedagog/öğretmen, mimar/dekoratör, aşçı/otel yöneticisi veya tarihçi.',
    tanisma: 'Bir aile meclisinde, ev ortamında, memleket ziyaretinde, sahil kenarında veya su/deniz yakınlarında duygusal bir ortamda.',
    dinamik: 'Derin duygusal bağ, evde geçirilen sıcacık akşamlar, güven dolu bir yuva ve çocuklara adanmış sevgi.'
  },
  'Aslan': {
    sign: 'Aslan',
    summary: 'Karizmatik, asil, cömert ve gurur verici bir hayat arkadaşı.',
    karakter: 'Eşiniz toplumda parlayan, herkesin saygı duyduğu, cömert ve asil ruhlu biridir. Eşine ve ailesine büyük değer verir; onları korumak ve şımartmak için elinden geleni yapar.',
    fiziksel: 'Gür ve dikkat çekici saçlar, dik ve kendinden emin duruş, sıcak tebessüm ve girdiği yerde hemen dikkat çeken bir aura.',
    meslek: 'Yönetici, CEO, sahne/sanat lideri, oyuncu, organizatör, siyasetçi veya mücevher/lüks marka uzmanı.',
    tanisma: 'Büyük bir kutlamada, tiyatro/konser salonunda, lüks bir etkinlikte veya bir ödül/başarı ortamında.',
    dinamik: 'Birbirinizle gurur duyacağınız, tutkunun, saygının ve cömertliğin hiç eksilmediği ışıltılı bir birliktelik.'
  },
  'Başak': {
    sign: 'Başak',
    summary: 'Titiz, zeki, güvenilir, hayatı organize eden ve çalışkan bir eş.',
    karakter: 'Eşiniz hayatınızı düzene sokan, her detayla özenle ilgilenen, alçakgönüllü ve pratik zekaya sahip biridir. Gösterişten hoşlanmaz; sevgisini sözlerle değil, hayatınızı kolaylaştırarak gösterir.',
    fiziksel: 'Zarif ve orantılı bir görünüm, temiz ve sade bir giyim, dikkatli bakan gözler ve bakımlı bir genel duruş.',
    meslek: 'Mühendis, veri analisti, doktor/eczacı, akademisyen, muhasebeci veya operasyon yöneticisi.',
    tanisma: 'İş ortamında, bir araştırma projesinde, sağlık merkezinde veya günlük hayatın rutin bir işini çözerken.',
    dinamik: 'Kaosu ortadan kaldıran, birbirine destek olan, düzenli, sağlıklı ve karşılıklı güvene dayalı sağlam bir evlilik.'
  },
  'Terazi': {
    sign: 'Terazi',
    summary: 'Son derece çekici, romantik, nazik ve uyum aşığı bir eş.',
    karakter: 'Eşiniz zarafeti, nezaketi ve uzlaşmacı tavırlarıyla kalbinizi fethedecektir. Kaba davranışlardan nefret eder; ilişkide daima denge, adalet ve estetik arar. Çok romantiktir.',
    fiziksel: 'Göz alıcı bir güzellik/yakışıklılık, simetrik yüz hatları, gamzeler veya tatlı bir tebessüm, çok şık giyim tarzı.',
    meslek: 'Avukat, diplomat, moda tasarımcısı, halkla ilişkiler uzmanı, mimar veya sanat danışmanı.',
    tanisma: 'Bir düğünde, sergi açılışında, hukuk/danışmanlık ortamında veya şık bir sosyal davette.',
    dinamik: 'Aşkın, zarafetin, romantik akşam yemeklerinin ve karşılıklı saygının ömür boyu sürdüğü bir peri masalı.'
  },
  'Akrep': {
    sign: 'Akrep',
    summary: 'Derin, tutkulu, manyetik çekimli ve sarsılmaz sadakate sahip bir eş.',
    karakter: 'Eşiniz son derece karizmatik, gizemli ve güçlü bir ruhtur. Sevgisi yüzeysel değildir; sizi tüm ruhuyla sever ve sahiplenir. Zor zamanlarınızda en güçlü sığınağınız olacaktır.',
    fiziksel: 'Derin ve delici bakışlar, karizmatik ve manyetik bir hava, gizemli ve çekici bir genel duruş.',
    meslek: 'Dedektif, cerrah, psikiyatrist, kriz yöneticisi, finans/yatırım uzmanı veya araştırmacı.',
    tanisma: 'Krizli veya dönüştürücü bir olay esnasında, gizemli bir ortamda, derin bir psikolojik sohbette veya anlık bir bakışmayla.',
    dinamik: 'Ruhların birleştiği, olağanüstü yüksek bir tutku ve sadakatle mühürlenmiş ömürlük bir bağ.'
  },
  'Yay': {
    sign: 'Yay',
    summary: 'Gezgin, neşeli, vizyoner, felsefi ve özgür ruhlu bir hayat yoldaşı.',
    karakter: 'Eşiniz hayatı bir macera olarak gören, iyimser, dürüst ve vizyoner bir insandır. Farklı kültürlere, seyahate ve öğrenmeye aşıktır. Evliliğinizde asla sıkılmayacaksınız.',
    fiziksel: 'Uzun boylu veya atletik duruş, neşeli ve açık bir yüz ifadesi, samimi gülüş ve rahat giyim tarzı.',
    meslek: 'Akademisyen, pilot/kabin amiri, diplomat, uluslararası ihracatçı, yayıncı veya rehber/turizmci.',
    tanisma: 'Yurt dışı gezisinde, havalimanında, bir üniversite kampüsünde veya doğa kampında.',
    dinamik: 'Birlikte dünyayı gezeceğiniz, vizyonunuzu büyüteceğiniz ve her günü bayram gibi yaşayacağınız bir ortaklık.'
  },
  'Oğlak': {
    sign: 'Oğlak',
    summary: 'Olgun, güvenilir, saygın, kariyerinde başarılı ve sarsılmaz bir kale gibi eş.',
    karakter: 'Eşiniz son derece sorumluluk sahibi, hedeflerine kilitlenen, sadık ve olgun biridir. Boş vaatlerde bulunmaz; söylediklerini mutlaka yerine getirir. Size sağlam bir gelecek sunar.',
    fiziksel: 'Asil ve kemikli yüz hatları, dik bir duruş, klasik ve kaliteli giyim, vakur ve oturaklı bir aura.',
    meslek: 'Üst düzey yönetici, şirket sahibi, mimar, mühendis, finansal denetçi veya devlet yetkilisi.',
    tanisma: 'Kariyer toplantısında, kurumsal bir konferansta, iş ilişkileri veya saygın aile büyükleri vasıtasıyla.',
    dinamik: 'Yıllar geçtikçe daha da güçlenen, toplumsal saygınlığı yüksek, güvenli ve zengin bir evlilik.'
  },
  'Kova': {
    sign: 'Kova',
    summary: 'Orijinal, modern, en iyi dostunuz olan, bağımsız ve vizyoner bir eş.',
    karakter: 'Eşiniz kalıplara sığmayan, son derece zeki, hümanist ve özgürlükçü bir karaktere sahiptir. Evlilikte baskı kurmaz; önce en yakın dostunuz, sonra hayat arkadaşınız olur.',
    fiziksel: 'Sıradışı ve modern bir tarz, zeki ve aydınlık gözler, özgün saç stili ve genç bir enerji.',
    meslek: 'Yazılım mühendisi, yapay zeka uzmanı, bilim insanı, pilot, sivil toplum lideri veya tasarımcı.',
    tanisma: 'Bir teknoloji fuarında, arkadaş grubunun buluşmasında, sosyal yardım projesinde veya dijital bir toplulukta.',
    dinamik: 'Geleneksel sınırları aşan, karşılıklı özgürlüğe saygı duyan ve geleceği birlikte inşa eden modern bir evlilik.'
  },
  'Balık': {
    sign: 'Balık',
    summary: 'Ruh eşiniz, derin empatiye sahip, sanatsal, masalsı ve şifacı bir eş.',
    karakter: 'Eşiniz sizinle kelimeler olmadan dahi anlaşabilen, sınırsız bir şefkat ve sevgiyle dolu, ruhsal derinliği yüksek biridir. Sanata, müziğe ve maneviyata yatkındır.',
    fiziksel: 'Büyüleyici ve rüyamsı bakışlar, yumuşak yüz hatları, masalsı bir tebessüm ve zarafet.',
    meslek: 'Müzisyen, ressam, sinemacı, psikolog, veteriner, alternatif tıp uzmanı veya denizci.',
    tanisma: 'Manevi bir ortamda, deniz kenarında, bir konserde, sanat atölyesinde veya kaderin mucizevi bir rastlantısıyla.',
    dinamik: 'Ruhların bütünleştiği, karşılıksız sevgi ve yüksek manevi huzurla dolu kutsal bir yuva.'
  }
};

// 7th HOUSE RULER IN HOUSES (EŞLE NEREDE VE NASIL TANIŞILACAK?)
const SPOUSE_MEETING_BY_RULER_HOUSE = {
  1: '7. Ev yöneticiniz 1. Evde: Eşiniz doğrudan sizin hayatınıza adım atar; ilk adımı genellikle o atar. Fiziksel çekim ilk andan itibaren çok güçlüdür.',
  2: '7. Ev yöneticiniz 2. Evde: Eşinizle finansal ortamlarda, banka, alışveriş, lüks mekanlar veya ortak maddi hedefler vesilesiyle tanışacaksınız.',
  3: '7. Ev yöneticiniz 3. Evde: Eşinizle bir eğitim kursunda, kısa bir seyahatte, sosyal medyada veya kardeşler/komşular vasıtasıyla tanışacaksınız.',
  4: '7. Ev yöneticiniz 4. Evde: Eşinizle aile ortamında, memleketinizde, ev partisinde veya gayrimenkul/inşaat konuları vesilesiyle karşılaşacaksınız.',
  5: '7. Ev yöneticiniz 5. Evde: Eşinizle tatilde, eğlence mekanında, bir konserde, hobilerinizle ilgilenirken veya romantik bir ortamda tanışacaksınız.',
  6: '7. Ev yöneticiniz 6. Evde: Eşinizle günlük iş yerinde, ofiste, bir sağlık merkezinde veya evcil hayvanlar vesilesiyle tanışacaksınız.',
  7: '7. Ev yöneticiniz 7. Evde: Eşiniz doğrudan ikili bir iş ortaklığı, açık sosyal davetler veya evlilik niyetiyle organize edilmiş ortamlar vasıtasıyla hayatınıza girecektir.',
  8: '7. Ev yöneticiniz 8. Evde: Eşinizle hayatınızın krizli bir döneminde, derin bir terapi/araştırma ortamında veya finansal ortaklıklar vasıtasıyla karşılaşacaksınız.',
  9: '7. Ev yöneticiniz 9. Evde: Eşinizle üniversite/yüksek lisans ortamında, uzak bir yurt dışı seyahatinde veya felsefi/hukuki bir mecliste tanışacaksınız. Farklı bir kültürden olabilir.',
  10: '7. Ev yöneticiniz 10. Evde: Eşinizle kariyerinizin zirvesinde, prestijli bir iş toplantısında, patron veya üst düzey yetkililer vasıtasıyla tanışacaksınız.',
  11: '7. Ev yöneticiniz 11. Evde: Eşinizle ortak arkadaş grubunun organizasyonunda, bir dernekte, kulüpte veya toplumsal bir projede tanışacaksınız.',
  12: '7. Ev yöneticiniz 12. Evde: Eşinizle manevi bir merkezde, inziva ortamında, hastanede veya kaderin tamamen gizli ve beklenmedik bir rastlantısıyla karşılaşacaksınız.'
};

// DARAKARAKA (VEDİK RUH EŞİ GÖSTERGESİ)
const DARAKARAKA_INTERPRETATIONS = {
  'Güneş': 'Darakaraka Güneş: Eşiniz soylu bir duruşa, yüksek özgüvene ve liderlik vasıflarına sahiptir. Gururludur ve toplumda saygı görür.',
  'Ay': 'Darakaraka Ay: Eşiniz son derece şefkatli, duygusal zekası yüksek, besleyici ve koruyucu bir ruha sahiptir. Size huzur verir.',
  'Merkür': 'Darakaraka Merkür: Eşiniz zeki, esprili, çok konuşkan, genç görünümlü ve entelektüeldir. Aranızdaki iletişim kusursuzdur.',
  'Venüs': 'Darakaraka Venüs: Eşiniz büyüleyici derecede çekici, estetik zevkleri yüksek, romantik ve sanatsaldır. Aşkı doyasıya yaşatır.',
  'Mars': 'Darakaraka Mars: Eşiniz atletik, cesur, tutkulu, koruyucu ve girişimcidir. Sizi her türlü tehlikeye karşı korur.',
  'Jüpiter': 'Darakaraka Jüpiter: Eşiniz bilge, ahlaklı, eğitimli, cömert ve inançlıdır. Hayatınızda adeta bir öğretmen ve rehber olacaktır.',
  'Satürn': 'Darakaraka Satürn: Eşiniz olgun, ağırbaşlı, sarsılmaz bir sadakate sahip ve son derece güvenilirdir. Ömürlük bir hayat arkadaşıdır.'
};

// FULL PLANET SIGN INTERPRETATIONS (GÜNEŞ'TEN PLÜTON'A TÜM GEZEGENLER)
const FULL_PLANET_SIGN_INTERPRETATIONS = {
  ...extracted.yorumlar,
  'Jüpiter': {
    'Koç': ['Yeni girişimlerde büyük şans, cesaretle büyüyen fırsatlar.', 'Liderlik alanında başarı ve vizyonerlik.'],
    'Boğa': ['Maddi konularda bereket, gayrimenkul ve yatırımlarda genişleme.', 'Konfor ve sağlam temelli zenginlik.'],
    'İkizler': ['İletişim, eğitim ve yazarlık alanında fırsatlar.', 'Geniş bir sosyal ağ ve çok yönlü bilgi birikimi.'],
    'Yengeç': ['Jüpiter burada yücelimdedir! Ailede büyük bereket, manevi koruma ve şefkat.', 'İçsel zenginlik.'],
    'Aslan': ['Yaratıcılıkta parlayan şans, sahne ve yönetimde büyüme.', 'Cömertlik ve saygınlık getiren fırsatlar.'],
    'Başak': ['Hizmet, sağlık ve ustalık alanında bereket.', 'Detayları iyi yöneterek gelen başarı.'],
    'Terazi': ['İkili ilişkiler ve ortaklıklarda şans.', 'Hukuk, adalet ve diplomaside itibar.'],
    'Akrep': ['Krizleri fırsata çevirme gücü, finansal ve okült alanlarda derin genişleme.', 'Dönüştürücü bilgelik.'],
    'Yay': ['Kendi burcunda! Uluslararası alanda şans, yüksek felsefe ve seyahat bereketi.', 'Geniş dünya görüşü.'],
    'Oğlak': ['Kariyerde adım adım inşa edilen kalıcı zenginlik ve saygınlık.', 'Disiplinle gelen başarı.'],
    'Kova': ['Teknoloji, bilim ve toplumsal projelerde büyük vizyon.', 'Yenilikçi fikirlerle gelen genişleme.'],
    'Balık': ['Kendi kadim burcunda! Yüksek sezgisel bilgelik, manevi koruma ve ilahi şans.', 'Sınırsız şefkat.']
  },
  'Satürn': {
    'Koç': ['Öfke ve sabırsızlığı kontrol etme sınavı.', 'Zamanla inşa edilen sağlam cesaret.'],
    'Boğa': ['Maddi güvenlik ve özdeğer sınavları.', 'Sabırla biriktirilen kalıcı servet.'],
    'İkizler': ['Zihinsel disiplin ve odaklanma dersi.', 'Ciddi ve derinlemesine öğrenme yeteneği.'],
    'Yengeç': ['Duygusal olgunlaşma ve aile sorumlulukları.', 'İçsel dayanıklılık kazanma.'],
    'Aslan': ['Ego ve gururu terbiye etme sınavı.', 'Gerçek ve sağlam liderlik inşası.'],
    'Başak': ['Çalışma hayatı ve sağlık disiplini.', 'Ustalık ve mükemmel iş ahlakı.'],
    'Terazi': ['Satürn burada yücelimdedir! Adil, sarsılmaz ve kalıcı ortaklıklar.', 'Hukuk ve diplomasi dehası.'],
    'Akrep': ['Korkularla yüzleşme ve psikolojik dönüşüm.', 'Yenilmez içsel güç.'],
    'Yay': ['İnançları sağlam temellere oturtma ve felsefi olgunluk.', 'Sorumluluk bilinci.'],
    'Oğlak': ['Kendi burcunda! Üstün organizasyon, zirveye ulaşan kariyer ve büyük saygınlık.'],
    'Kova': ['Toplumsal sorumluluk ve kolektif projelerde yapı kurma.', 'Geleceğin mimarı olma.'],
    'Balık': ['Ruhsal sınırları çizme ve manevi olgunlaşma.', 'Fedakarlığı bilgeliğe dönüştürme.']
  },
  'Uranüs': {
    'Koç': ['Bireysel özgürlükte devrim, ani çıkışlar.'],
    'Boğa': ['Finansal ve tarımsal sistemlerde radikal yenilikler.'],
    'İkizler': ['İletişim ve yapay zeka alanında devrimci fikirler.'],
    'Yengeç': ['Aile ve yuva kavramlarında sıradışılık.'],
    'Aslan': ['Yaratıcı sanatlarda çığır açan orijinallik.'],
    'Başak': ['Teknolojik sağlık ve iş devrimleri.'],
    'Terazi': ['İlişkiler ve evlilikte özgürlükçü bakış.'],
    'Akrep': ['Derin psikoloji ve okült alanlarda sarsıcı uyanış.'],
    'Yay': ['Felsefe ve yüksek bilinçte devrimsel sıçrama.'],
    'Oğlak': ['Devlet ve kurumsal yapılarda teknolojik dönüşüm.'],
    'Kova': ['Kendi burcunda! Küresel uyanış ve deha düzeyinde yenilikçilik.'],
    'Balık': ['Mistik ve ruhsal alanlarda sıradışı aydınlanma.']
  },
  'Neptün': {
    'Koç': ['Ruhsal idealler için cesaret ve öncülük.'],
    'Boğa': ['Maddeye ruhsal ve sanatsal anlam yükleme.'],
    'İkizler': ['Telepatik ve sezgisel iletişim yeteneği.'],
    'Yengeç': ['Köklerde ve ailede derin mistik bağlar.'],
    'Aslan': ['Sanatta ve sahnede büyüleyici hayal gücü.'],
    'Başak': ['Şifa sanatları ve bitkisel tıp yeteneği.'],
    'Terazi': ['İlişkilerde koşulsuz ve romantik aşk arayışı.'],
    'Akrep': ['Gizemli ve dönüştürücü ruhsal sezgiler.'],
    'Yay': ['Yüksek inanç ve evrensel felsefi teslimiyet.'],
    'Oğlak': ['Maddi hedeflere manevi vizyon katma.'],
    'Kova': ['Evrensel kardeşlik ve ütopik idealler.'],
    'Balık': ['Kendi burcunda! Saf ilahi sevgi, sınırsız empati ve mistik deha.']
  },
  'Plüton': {
    'Koç': ['Bireysel güç ve iradenin kökten dönüşümü.'],
    'Boğa': ['Maddi kaynakların ve değerlerin yeniden doğuşu.'],
    'İkizler': ['Zihinsel manipülasyon ve düşünce gücü devrimi.'],
    'Yengeç': ['Duygusal köklerin ve ataların karmasının şifası.'],
    'Aslan': ['Kişisel karizma ve otoritenin sarsıcı gücü.'],
    'Başak': ['Sağlık ve hizmet sistemlerinin köklü dönüşümü.'],
    'Terazi': ['Evlilik ve adalet kavramlarının kökten değişimi.'],
    'Akrep': ['Kendi burcunda! Muazzam yenilenme, küllerinden doğma gücü.'],
    'Yay': ['İnanç sistemlerinin ve tabuların yıkılıp yeniden inşası.'],
    'Oğlak': ['Otorite, devlet ve güç dengelerinin köklü dönüşümü.'],
    'Kova': ['Toplumsal güç, teknoloji ve halkın egemenliği devrimi.'],
    'Balık': ['Kolektif bilinçaltının arınması ve ruhsal dönüşüm.']
  }
};

const tsContent = `// Astroloji.org ve profesyonel astroloji tabanlı ultra-detaylı kütüphane

export const SIGN_MOTTOS: Record<string, string> = ${JSON.stringify(SIGN_MOTTOS, null, 2)};

export const HOUSE_MEANINGS: Record<number, { title: string; desc: string }> = ${JSON.stringify(HOUSE_MEANINGS, null, 2)};

export const ASPECT_MEANINGS: Record<string, string> = ${JSON.stringify(ASPECT_MEANINGS, null, 2)};

export const ASCENDANT_INTERPRETATIONS: Record<string, { title: string; summary: string; detail: string; traits: string[] }> = ${JSON.stringify(ASCENDANT_INTERPRETATIONS, null, 2)};

export const MIDHEAVEN_INTERPRETATIONS: Record<string, { title: string; desc: string }> = ${JSON.stringify(MIDHEAVEN_INTERPRETATIONS, null, 2)};

export const SPOUSE_BY_7TH_SIGN: Record<string, {
  sign: string;
  summary: string;
  karakter: string;
  fiziksel: string;
  meslek: string;
  tanisma: string;
  dinamik: string;
}> = ${JSON.stringify(SPOUSE_BY_7TH_SIGN, null, 2)};

export const SPOUSE_MEETING_BY_RULER_HOUSE: Record<number, string> = ${JSON.stringify(SPOUSE_MEETING_BY_RULER_HOUSE, null, 2)};

export const DARAKARAKA_INTERPRETATIONS: Record<string, string> = ${JSON.stringify(DARAKARAKA_INTERPRETATIONS, null, 2)};

export const NAKSHATRA_DATA = ${JSON.stringify(NAKSHATRA_DATA, null, 2)};

export const HOUSE_SYSTEM_DETAILS = ${JSON.stringify(HOUSE_SYSTEM_DETAILS, null, 2)};

export const AYANAMSA_DETAILS = ${JSON.stringify(AYANAMSA_DETAILS, null, 2)};

export const D9_INTERPRETATIONS = {
  title: 'Navamsha (D9) Harmoni ve Evlilik Analizi',
  overview: 'D9 Navamsha haritası, Vedik astrolojide ruhun gerçek potansiyelini, hayatın ikinci yarısını, evlilik dinamiklerini ve eşin niteliklerini gösteren en temel varga haritasıdır.',
  vargottamaDesc: 'Vargottama (D1 ve D9 haritasında aynı burçta bulunan) gezegenler olağanüstü güç, kararlılık ve ruhsal koruma kazanır; kendi burcundaymış gibi sağlam çalışır.',
  pushkaraDesc: 'Pushkara Navamsha derecelerindeki gezegenler, zayıf konumlarda dahi olsalar kişiye ilahi lütuf, şans ve yüksek şifa getirir.'
};

export const SYNASTRY_INTERPRETATIONS = ${JSON.stringify(SYNASTRY_INTERPRETATIONS, null, 2)};

export const PLANET_SIGN_INTERPRETATIONS: Record<string, Record<string, string[]>> = ${JSON.stringify(FULL_PLANET_SIGN_INTERPRETATIONS, null, 2)};

export const RETRO_INTERPRETATIONS: Record<string, string[]> = ${JSON.stringify(extracted.retroYorumlari || {}, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/natal-interpretations.ts'), tsContent);
console.log('Successfully written ultra-rich src/lib/natal-interpretations.ts!');
