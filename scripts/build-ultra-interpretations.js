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

// ASCENDANT INTERPRETATIONS
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

// MIDHEAVEN (MC)
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

// ULTRA ENRICHED SPOUSE ANALYSIS (EŞİN TÜM DERİN ÖZELLİKLERİ)
const SPOUSE_BY_7TH_SIGN = {
  'Koç': {
    sign: 'Koç',
    summary: 'Dinamik, cesur, doğrudan ve lider ruhlu bir eş.',
    karakter: 'Eşiniz son derece enerjik, girişimci, sözünü esirgemeyen ve hayatı hızlı yaşayan bir karakter olacaktır. Kararsızlıktan hoşlanmaz; liderlik vasıfları yüksektir ve sorunlar karşısında hızla harekete geçer. Tutkulu ve dürüst biridir.',
    fiziksel: 'Genellikle atletik veya fit vücut yapısı, belirgin kemik yapısı, keskin ve canlı bakışlar, hızlı ve kararlı yürüyüş. Sportif ve modern bir giyim tarzı.',
    meslek: 'Girişimci, şirket kurucusu, mühendis, profesyonel sporcu, asker/polis, cerrah, yönetici veya savunma sanayi uzmanı.',
    tanisma: 'Spor salonunda, bir yarışma veya etkinlikte, trafikte, anlık bir iddialaşma esnasında ya da cesurca doğrudan yanınıza gelip tanışmasıyla.',
    dinamik: 'İlişkiniz asla monoton olmaz; yüksek tutku, canlılık ve zaman zaman tatlı rekabetler evliliğinizi diri tutar.',
    memleket: 'Ateş ve hareket enerjisi taşıyan dinamik, sanayisi veya sporuyla bilinen büyük bir metropolden ya da dağlık/hareketli bir bölgeden gelecektir. Kendi köklerinden bağımsızlaşmış biridir.',
    yasFarki: 'Genellikle sizinle yaşıt veya 1-3 yaş farkı olan, ancak ruhu ve fiziksel enerjisi daima çok genç ve hareketli bir partnerdir.',
    aileYapisi: 'Bağımsız bireylerden oluşan, herkesin kendi ayakları üzerinde durduğu, hareketli, dobra ve doğrudan iletişim kuran bir aile kültürü.',
    iletisimTarzi: 'Doğrudan, net ve dolaysız. Aklındakini filtrelemeden söyler; lafı dolandırmaz. Tartışmalarda aniden parlayabilir ama kin tutmaz, kısa sürede yatışır.',
    hobiler: 'Ekstrem sporlar, fitness, araba/motor sürme, kamp, dövüş sporları ve açık hava maceraları.',
    muhtemelBurclar: ['Koç', 'Aslan', 'Yay', 'Terazi'],
    ilkIntiba: 'Onu ilk gördüğünüz an yaydığı dinamizm ve özgüven dikkatinizi çekecektir. Göz teması çok güçlüdür; size doğru kararlı yürüyüşü kalbinizi hızlandıracaktır.',
    evlilikSonrasiDegisim: 'Bu evlilikle birlikte hayatınızda muazzam bir cesaret, girişim gücü ve hareketlilik başlayacaktır. Ertelediğiniz hayalleri gerçekleştirmek için arkanızda sarsılmaz bir itici güç bulacaksınız.',
    evlilikZamanlamasi: 'Erken veya orta yaş döneminde (22-26 veya 29-33 yaş aralığında), aniden ve hızlı gelişen bir kararla evlilik ihtimali çok yüksektir.'
  },
  'Boğa': {
    sign: 'Boğa',
    summary: 'Sakin, güvenilir, estetik değerleri yüksek ve sarsılmaz bir hayat arkadaşı.',
    karakter: 'Eşiniz son derece sadık, sabırlı, huzur veren ve güvenilir bir karaktere sahiptir. Aile birliğine ve maddi güvenceye büyük önem verir. Konforu, lezzetli yemekleri ve kaliteli yaşamı sever.',
    fiziksel: 'Çekici ve dengeli vücut hatları, pürüzsüz ten, hoş ve etkileyici bir ses tonu, sakin bakışlar. Kaliteli kumaşlar ve şık, zamansız giyim tarzı.',
    meslek: 'Bankacı, finans direktörü, gayrimenkul uzmanı, mimar, gıda/gastronomi uzmanı, sanat galerisi yöneticisi veya peyzaj mimarı.',
    tanisma: 'Güzel bir restoranda, bir sanat galerisinde, doğa yürüyüşünde, finansal bir işlem esnasında veya güvenilir aile dostları aracılığıyla.',
    dinamik: 'Evliliğiniz sarsılmaz bir sadakat, fiziksel şefkat, huzur ve maddi-manevi zenginlik üzerine kurulacaktır.',
    memleket: 'Yeşillikleri, tarımı, gastronomisi veya tarihi zenginlikleriyle ünlü, bereketli ve köklü bir coğrafyadan gelir. Huzurlu bir kıyı şehri veya zengin bir ovadır.',
    yasFarki: 'Sizinle benzer yaşta veya 2-4 yaş olgun, hayatını erken düzene sokmuş, dengeli ve oturaklı bir eştir.',
    aileYapisi: 'Geleneklerine, mülklerine ve sofrasına bağlı, aile meclislerine önem veren, birbirine maddi-manevi destek olan köklü bir aile.',
    iletisimTarzi: 'Sakin, düşünerek ve tane tane konuşur. Ses tonu güven vericidir. Tartışmalarda acele etmez; inatçı olabilir ama asla kırıcı ve kaba davranmaz.',
    hobiler: 'Gurme yemekler yapmak, bahçe ve çiçek bakımı, masaj/spa, müzik dinlemek, doğa gezileri ve antika/sanat koleksiyonu.',
    muhtemelBurclar: ['Boğa', 'Başak', 'Oğlak', 'Akrep'],
    ilkIntiba: 'İlk karşılaşmada sakinliği, oturaklı duruşu ve yaydığı huzur sizi büyüleyecektir. Sanki yıllardır tanıyormuş gibi sarsılmaz bir güven hissedeceksiniz.',
    evlilikSonrasiDegisim: 'Bu evlilik maddi güvencenizi katlayacak, evinizde bereket, lüks, huzur ve sağlam bir mülk temeli oluşturacaktır. Yaşam standartlarınız belirgin şekilde yükselecektir.',
    evlilikZamanlamasi: 'Maddi temellerin ve kariyerin sağlamlaştığı 25-29 veya 31-34 yaş aralığında, iyice düşünülüp taşınılarak yapılan sağlam bir evlilik.'
  },
  'İkizler': {
    sign: 'İkizler',
    summary: 'Zeki, esprili, konuşkan ve genç ruhlu bir entelektüel.',
    karakter: 'Eşinizle asla sohbetiniz tükenmeyecektir! Çok meraklı, öğrenmeye ve aktarmaya aşık, sosyal ve zeki bir mizaca sahiptir. Espri kabiliyeti yüksektir; hayatı oyun ve macera gibi algılar.',
    fiziksel: 'İnce, çevik bir beden, genç ve dinamik yüz ifadesi, konuşurken ellerini ve mimiklerini çok kullanan hareketli bir görünüm.',
    meslek: 'Gazeteci, yazar, yazılım mühendisi, pazarlama direktörü, akademisyen, çevirmen veya dijital medya yöneticisi.',
    tanisma: 'Bir kütüphanede, eğitim veya seminerde, sosyal medyada, bir kitapçıda veya seyahat esnasında zekice bir sohbetle.',
    dinamik: 'İlişkiniz sadece bir evlilik değil, aynı zamanda harika bir dostluk, zihinsel ortaklık ve tükenmeyen bir neşe kaynağıdır.',
    memleket: 'İki yakası olan, ulaşım ağlarının kesiştiği, ticaret veya eğitimle öne çıkan hareketli bir metropolden ya da liman/köprü şehrinden gelecektir.',
    yasFarki: 'Yaşı kaç olursa olsun sizden daha genç gösteren, yaşıt veya birkaç yaş küçük olabilecek, esprili ve dinamik bir partnerdir.',
    aileYapisi: 'Eğitimli, öğretmen, tüccar veya gazeteci akrabaların bol olduğu, evde sürekli kitapların ve sohbetlerin döndüğü konuşkan bir aile.',
    iletisimTarzi: 'Zeki, esprili, kelime oyunlarıyla dolu ve çok konuşkan. Tartışmaları mantık ve argümanlarla çözer; esprileriyle ortamı yumuşatır.',
    hobiler: 'Kitap okumak, podcast dinlemek, seyahat etmek, teknolojik aletleri kurcalamak, blog yazmak ve masa oyunları.',
    muhtemelBurclar: ['İkizler', 'Terazi', 'Kova', 'Yay'],
    ilkIntiba: 'İlk anda zekası ve esprileriyle dikkatinizi çekecektir. Sohbet o kadar akıcı ve keyifli başlayacaktır ki zamanın nasıl geçtiğini unutacaksınız.',
    evlilikSonrasiDegisim: 'Bu evlilik sosyal çevrenizi genişletecek, yeni eğitimler, seyahatler ve zihinsel projelerle hayatınızı rengarenk bir bilgi ve neşe şölenine çevirecektir.',
    evlilikZamanlamasi: 'Genç yaşlarda (23-27 yaş) veya hayatın hareketli bir eğitim/kariyer döneminde (30-33 yaş) evlilik ihtimali yüksektir.'
  },
  'Yengeç': {
    sign: 'Yengeç',
    summary: 'Şefkatli, anaç/koruyucu, duygusal ve evine son derece bağlı bir eş.',
    karakter: 'Eşiniz sizi sarıp sarmalayan, duygularınızı anında hisseden ve aileyi her şeyin üstünde tutan bir karaktere sahiptir. Sevdiklerine karşı aşırı koruyucudur; evini bir kale gibi görür.',
    fiziksel: 'Yumuşak ve sevecen yüz hatları, parlak ve derin gözler, sıcak bir tebessüm ve rahatlatıcı bir vücut aurası.',
    meslek: 'Doktor, çocuk doktoru, psikolog, mimar/iç mimar, otel/restoran işletmecisi veya eğitimci.',
    tanisma: 'Bir aile meclisinde, ev ortamında, memleket ziyaretinde, sahil kenarında veya su/deniz yakınlarında duygusal bir ortamda.',
    dinamik: 'Derin duygusal bağ, evde geçirilen sıcacık akşamlar, güven dolu bir yuva ve çocuklara adanmış sevgi.',
    memleket: 'Deniz kıyısında, göl kenarında veya su kaynaklarıyla ünlü bir memleketten gelir. Aile bağlarının çok güçlü olduğu geleneksel bir kökene sahiptir.',
    yasFarki: 'Yaşıt veya yaşça olgun; fakat asıl belirgin özelliği sizi şefkatle koruyacak anaç/koruyucu olgunluğa sahip olmasıdır.',
    aileYapisi: 'Birbirine sımsıkı bağlı, anne figürünün merkezde olduğu, geleneksel, sıcak ve geniş bir aile yapısı.',
    iletisimTarzi: 'Duygusal, şefkatli ve sezgisel. Kelimelerinden çok ses tonu ve bakışlarıyla konuşur. Kırıldığında içine kapanabilir; ilgi ve şefkatle açılır.',
    hobiler: 'Ev dekorasyonu, aile yemekleri hazırlamak, deniz kenarında vakit geçirmek, fotoğraf albümleri ve nostaljik filmler.',
    muhtemelBurclar: ['Yengeç', 'Akrep', 'Balık', 'Oğlak'],
    ilkIntiba: 'Gözlerindeki derinlik, samimiyet ve şefkatli bakış ilk anda içinizi ısıtacaktır. Yanında kendinizi evinizdeymiş gibi güvende hissedeceksiniz.',
    evlilikSonrasiDegisim: 'Bu evlilik ruhsal huzurunuzu tamamlayacak, kök salmanızı ve sıcacık bir yuva kurmanızı sağlayacaktır. Çocuklar ve aile saadeti hayatınızın merkezine yerleşecektir.',
    evlilikZamanlamasi: 'Aile kurma arzusunun olgunlaştığı 24-28 veya 30-34 yaş aralıklarında duygusal evlilik dönemi.'
  },
  'Aslan': {
    sign: 'Aslan',
    summary: 'Karizmatik, asil, cömert ve gurur verici bir hayat arkadaşı.',
    karakter: 'Eşiniz toplumda parlayan, herkesin saygı duyduğu, cömert ve asil ruhlu biridir. Eşine ve ailesine büyük değer verir; onları korumak ve şımartmak için elinden geleni yapar.',
    fiziksel: 'Gür ve dikkat çekici saçlar, dik ve kendinden emin duruş, sıcak tebessüm ve girdiği yerde hemen dikkat çeken bir aura.',
    meslek: 'Üst düzey yönetici, CEO, kreatif direktör, oyuncu/sanatçı, organizatör, siyasetçi veya lüks marka kurucusu.',
    tanisma: 'Büyük bir kutlamada, tiyatro/konser salonunda, lüks bir etkinlikte veya bir ödül/başarı ortamında.',
    dinamik: 'Birbirinizle gurur duyacağınız, tutkunun, saygının ve cömertliğin hiç eksilmediği ışıltılı bir birliktelik.',
    memleket: 'Tarihi sarayları, başkent veya kültürel mirasıyla tanınan, görkemli ve merkezi bir ilden gelir. Ailesi toplumda tanınan bir geçmişe sahiptir.',
    yasFarki: 'Genellikle sizden 2-5 yaş olgun veya kariyerinde hızla yükselmiş, saygınlık kazanmış bir eştir.',
    aileYapisi: 'Toplumda saygın, prestijli, gururlu ve aile şerefine büyük önem veren, misafirperver ve cömert bir aile.',
    iletisimTarzi: 'Etkileyici, cömertçe iltifat eden ve asil. Gururu kırılmadığı sürece son derece sevgi dolu ve koruyucudur; övgüyü ve takdir edilmeyi sever.',
    hobiler: 'Tiyatro ve konserlere gitmek, lüks restoranları keşfetmek, şık davetler vermek, fotoğrafçılık ve sahne sanatları.',
    muhtemelBurclar: ['Aslan', 'Koç', 'Yay', 'Kova'],
    ilkIntiba: 'Odaya girdiği anda tüm dikkatleri üzerine çeken aurası ve ışıltısı ilk göze çarpan detay olacaktır. Gururlu ama bir o kadar da sıcak tebessümü sizi etkileyecektir.',
    evlilikSonrasiDegisim: 'Bu evlilik toplumsal statünüzü ve saygınlığınızı zirveye taşıyacaktır. Çevrenizde parlayan, takdir edilen ve örnek gösterilen prestijli bir konuma ulaşacaksınız.',
    evlilikZamanlamasi: 'Kariyerde ve toplumda kendinizi kanıtladığınız 26-30 veya 32-35 yaş aralıklarında görkemli bir evlilik.'
  },
  'Başak': {
    sign: 'Başak',
    summary: 'Titiz, zeki, güvenilir, hayatı organize eden ve çalışkan bir eş.',
    karakter: 'Eşiniz hayatınızı düzene sokan, her detayla özenle ilgilenen, alçakgönüllü ve pratik zekaya sahip biridir. Gösterişten hoşlanmaz; sevgisini sözlerle değil, hayatınızı kolaylaştırarak gösterir.',
    fiziksel: 'Zarif ve orantılı bir görünüm, temiz ve sade bir giyim, dikkatli bakan gözler ve bakımlı bir genel duruş.',
    meslek: 'Mühendis, veri analisti, doktor/eczacı, akademisyen, mali müşavir veya operasyon yöneticisi.',
    tanisma: 'İş ortamında, bir araştırma projesinde, sağlık merkezinde veya günlük hayatın rutin bir işini çözerken.',
    dinamik: 'Kaosu ortadan kaldıran, birbirine destek olan, düzenli, sağlıklı ve karşılıklı güvene dayalı sağlam bir evlilik.',
    memleket: 'Düzenli, planlı, tarım veya zanaatıyla bilinen, çalışkan ve eğitim seviyesi yüksek sakin bir ilden gelecektir.',
    yasFarki: 'Yaşıt veya 1-3 yaş olgun; hayat tecrübesi ve pratik zekasıyla sizden daha kıdemli hissettiren bir yapısı vardır.',
    aileYapisi: 'Disiplinli, alçakgönüllü, sağlığına ve çalışkanlığına önem veren, gösterişten uzak dürüst bir aile.',
    iletisimTarzi: 'Mantıklı, detaycı ve çözüm odaklı. Sorun olduğunda duygusal drama yerine pratik adımlara odaklanır. Eleştirileri daima yapıcıdır.',
    hobiler: 'Sağlıklı beslenme araştırmaları, marangozluk/el işleri, yoga, bulmaca/strateji oyunları ve kitap kulüpleri.',
    muhtemelBurclar: ['Başak', 'Boğa', 'Oğlak', 'Balık'],
    ilkIntiba: 'Özenli, temiz ve sade zarafeti ilk anda fark edilecektir. Dikkatli bakışları ve ölçülü kibar tavrı size büyük bir saygı uyandıracaktır.',
    evlilikSonrasiDegisim: 'Bu evlilik hayatınızdaki tüm düzensizlikleri ve kaosu çözecektir. Hem sağlığınız, hem kariyeriniz hem de günlük düzeniniz kusursuz bir ritme oturacaktır.',
    evlilikZamanlamasi: 'İş ve düzenin tam oturduğu 26-31 yaş aralığında, mantığın ve sevginin birleştiği olgun bir evlilik.'
  },
  'Terazi': {
    sign: 'Terazi',
    summary: 'Son derece çekici, romantik, nazik ve uyum aşığı bir eş.',
    karakter: 'Eşiniz zarafeti, nezaketi ve uzlaşmacı tavırlarıyla kalbinizi fethedecektir. Kaba davranışlardan nefret eder; ilişkide daima denge, adalet ve estetik arar. Çok romantiktir.',
    fiziksel: 'Göz alıcı bir güzellik/yakışıklılık, simetrik yüz hatları, gamzeler veya tatlı bir tebessüm, çok şık giyim tarzı.',
    meslek: 'Avukat, diplomat, moda tasarımcısı, halkla ilişkiler uzmanı, mimar veya sanat danışmanı.',
    tanisma: 'Bir düğünde, sergi açılışında, hukuk/danışmanlık ortamında veya şık bir sosyal davette.',
    dinamik: 'Aşkın, zarafetin, romantik akşam yemeklerinin ve karşılıklı saygının ömür boyu sürdüğü bir peri masalı.',
    memleket: 'Sanat, moda, turizm veya diplomasisiyle ünlü, estetik mimariye sahip bir kültür başkentinden ya da zarif bir kıyı şehrinden gelecektir.',
    yasFarki: 'Akran veya 1-2 yaş farkı olan; tam bir denklik ve eşitlik ilişkisi kuracağınız dengeli bir yaştadır.',
    aileYapisi: 'Sosyal, nazik, sanata ve görgü kurallarına dikkat eden, diplomatik ve uyumlu bir aile.',
    iletisimTarzi: 'Son derece nazik, kibar ve tatlı dilli. Tartışırken bile sesini yükseltmez; ortak bir orta yol bulmaya çalışır. Romantik sözleri çok sever.',
    hobiler: 'Sanat sergileri, moda ve stil takibi, dans, tasarım, müze gezileri ve romantik hafta sonu kaçamakları.',
    muhtemelBurclar: ['Terazi', 'İkizler', 'Kova', 'Koç'],
    ilkIntiba: 'Kusursuz nezaketi, büyüleyici tebessümü ve zarafeti karşısında adeta büyüleneceksiniz. Bir film sahnesindeymiş gibi romantik bir çekim doğacaktır.',
    evlilikSonrasiDegisim: 'Bu evlilik hayatınıza zarafet, diplomasi, güçlü ortaklıklar ve estetik katacaktır. Sosyal yaşamda büyük takdir toplayan örnek bir çift olacaksınız.',
    evlilikZamanlamasi: '24-28 yaş aralığında veya 30-33 yaş döngüsünde, romantik bir aşkla başlayan evlilik potansiyeli.'
  },
  'Akrep': {
    sign: 'Akrep',
    summary: 'Derin, tutkulu, manyetik çekimli ve sarsılmaz sadakate sahip bir eş.',
    karakter: 'Eşiniz son derece karizmatik, gizemli ve güçlü bir ruhtur. Sevgisi yüzeysel değildir; sizi tüm ruhuyla sever ve sahiplenir. Zor zamanlarınızda en güçlü sığınağınız olacaktır.',
    fiziksel: 'Derin ve delici bakışlar, karizmatik ve manyetik bir hava, gizemli ve çekici bir genel duruş.',
    meslek: 'Dedektif, cerrah, psikiyatrist, kriz yöneticisi, finans/yatırım uzmanı, istihbaratçı veya araştırmacı.',
    tanisma: 'Krizli veya dönüştürücü bir olay esnasında, gizemli bir ortamda, derin bir psikolojik sohbette veya anlık bir bakışmayla.',
    dinamik: 'Ruhların birleştiği, olağanüstü yüksek bir tutku ve sadakatle mühürlenmiş ömürlük bir bağ.',
    memleket: 'Gizemli, tarihi derinliği olan, kaplıcaları, madenleri veya antik geçmişiyle bilinen, köklü ve dönüştürücü bir coğrafyadan gelir.',
    yasFarki: 'Sizden 3-6 yaş büyük olabileceği gibi, yaşıt olsa dahi hayatın zorluklarını erken yaşta görmüş, derin bir olgunluğa sahiptir.',
    aileYapisi: 'Gizliliğe önem veren, dışarıya çok açılmayan, kendi içinde çok güçlü ve birbirine kenetli bir aile.',
    iletisimTarzi: 'Derin, anlamlı ve etkileyici. Az konuşur ama tam hedeften vurur. Gözleriyle iletişim kurar; samimiyetsizliği anında yakalar.',
    hobiler: 'Psikoloji ve gizem kitapları, meditasyon, dalış, dedektiflik dizileri, okült araştırmalar ve gece yürüyüşleri.',
    muhtemelBurclar: ['Akrep', 'Yengeç', 'Balık', 'Boğa'],
    ilkIntiba: 'Derin, delici ve gizemli bakışları adeta ruhunuzun en derin köşesine dokunacaktır. Aranızda izahı zor, elektrikli bir manyetik çekim hissedeceksiniz.',
    evlilikSonrasiDegisim: 'Bu evlilik ruhsal ve maddi anlamda büyük bir dönüşüm getirecektir. Birbirinize kattığınız güç sayesinde hem finansal hem de manevi olarak çok zenginleşeceksiniz.',
    evlilikZamanlamasi: 'Hayatınızın önemli bir dönüşüm evresinden sonra (27-32 veya 33-36 yaş aralığında) sarsılmaz bir bağlılıkla gelen evlilik.'
  },
  'Yay': {
    sign: 'Yay',
    summary: 'Gezgin, neşeli, vizyoner, felsefi ve özgür ruhlu bir hayat yoldaşı.',
    karakter: 'Eşiniz hayatı bir macera olarak gören, iyimser, dürüst ve vizyoner bir insandır. Farklı kültürlere, seyahate ve öğrenmeye aşıktır. Evliliğinizde asla sıkılmayacaksınız.',
    fiziksel: 'Uzun boylu veya atletik duruş, neşeli ve açık bir yüz ifadesi, samimi gülüş ve rahat giyim tarzı.',
    meslek: 'Akademisyen, pilot/kabin amiri, diplomat, uluslararası ihracatçı, yayıncı veya rehber/turizmci.',
    tanisma: 'Yurt dışı gezisinde, havalimanında, bir üniversite kampüsünde veya doğa kampında.',
    dinamik: 'Birlikte dünyayı gezeceğiniz, vizyonunuzu büyüteceğiniz ve her günü bayram gibi yaşayacağınız bir ortaklık.',
    memleket: 'Farklı bir şehirden, başka bir bölgeden ve hatta yabancı bir ülkeden gelme ihtimali en yüksek burçtur. Uluslararası bir kökene sahiptir.',
    yasFarki: 'Yaş farkı esnektir; ilişkide yaşa değil zihinsel ve vizyoner uyuma, ortak macera tutkusuna bakar.',
    aileYapisi: 'Özgürlükçü, farklı şehir veya ülkelere dağılmış, hoşgörülü ve vizyoner bir aile.',
    iletisimTarzi: 'Neşeli, açık sözlü, kahkahalarla dolu ve dürüst. Felsefi tartışmaları sever; niyeti daima yapıcı ve saftır.',
    hobiler: 'Dünya seyahatleri, kampçılık, at binme, yabancı diller öğrenme, felsefe seminerleri ve doğa keşifleri.',
    muhtemelBurclar: ['Yay', 'Koç', 'Aslan', 'İkizler'],
    ilkIntiba: 'Güler yüzü, pozitif yaşam enerjisi ve içten kahkahası sizi anında kendine çekecektir. Hayatınıza taze bir bahar rüzgarı esmiş gibi hissedeceksiniz.',
    evlilikSonrasiDegisim: 'Bu evlilik vizyonunuzu küresel düzeye taşıyacaktır. Birlikte yapacağınız yurt dışı seyahatleri, felsefi ve entelektüel keşifler hayatınızı baştan yaratacaktır.',
    evlilikZamanlamasi: 'Gezip gördükten, vizyonunuzu genişlettikten sonra (27-33 yaş aralığında) seyahat veya eğitim esnasında evlilik.'
  },
  'Oğlak': {
    sign: 'Oğlak',
    summary: 'Olgun, güvenilir, saygın, kariyerinde başarılı ve sarsılmaz bir kale gibi eş.',
    karakter: 'Eşiniz son derece sorumluluk sahibi, hedeflerine kilitlenen, sadık ve olgun biridir. Boş vaatlerde bulunmaz; söylediklerini mutlaka yerine getirir. Size sağlam bir gelecek sunar.',
    fiziksel: 'Asil ve kemikli yüz hatları, dik bir duruş, klasik ve kaliteli giyim, vakur ve oturaklı bir aura.',
    meslek: 'Üst düzey yönetici, şirket sahibi, mimar, mühendis, finansal denetçi veya devlet yetkilisi.',
    tanisma: 'Kariyer toplantısında, kurumsal bir konferansta, iş ilişkileri veya saygın aile büyükleri vasıtasıyla.',
    dinamik: 'Yıllar geçtikçe daha da güçlenen, toplumsal saygınlığı yüksek, güvenli ve zengin bir evlilik.',
    memleket: 'Tarihi çok eski, taş yapıları ve köklü devlet geleneğiyle bilinen, dağlık veya kışları sert bir ilden gelir. Ailesi saygın bir soyadı taşır.',
    yasFarki: 'Klasik astrolojide yaşça en olgun eş göstergesidir. Sizden 4-8 yaş büyük olabilir veya yaşıt olsa dahi büyük bir tecrübe ciddiyetindedir.',
    aileYapisi: 'Geleneksel, kuralları olan, toplumda saygın bir itibar taşıyan, disiplinli ve ciddi bir aile.',
    iletisimTarzi: 'Ölçülü, ciddi, sözünün eri ve vakur. Boş laf yapmaz; yapamayacağı şeyin sözünü vermez. Sevgisini konuşarak değil sorumluluk alarak gösterir.',
    hobiler: 'Tarih araştırmaları, mimari geziler, dağ tırmanışı, satranç, borsa/yatırım takibi ve klasik müzik.',
    muhtemelBurclar: ['Oğlak', 'Boğa', 'Başak', 'Yengeç'],
    ilkIntiba: 'Ağırbaşlı, olgun ve son derece saygın duruşu sizi derinden etkileyecektir. Boş laflar etmeyen, güven veren duruşu kalbinizi fethedecektir.',
    evlilikSonrasiDegisim: 'Bu evlilik kalıcı bir servet, büyük bir saygınlık ve sarsılmaz bir toplumsal itibar getirecektir. Yıllar geçtikçe zenginleşen ve güçlenen bir aile imparatorluğu kuracaksınız.',
    evlilikZamanlamasi: 'Kariyerin sağlamlaştığı ve olgunluğun pekiştiği 28-35 yaş aralığında (Satürn döngüsü sonrası) ömürlük bir evlilik.'
  },
  'Kova': {
    sign: 'Kova',
    summary: 'Orijinal, modern, en iyi dostunuz olan, bağımsız ve vizyoner bir eş.',
    karakter: 'Eşiniz kalıplara sığmayan, son derece zeki, hümanist ve özgürlükçü bir karaktere sahiptir. Evlilikte baskı kurmaz; önce en yakın dostunuz, sonra hayat arkadaşınız olur.',
    fiziksel: 'Sıradışı ve modern bir tarz, zeki ve aydınlık gözler, özgün saç stili ve genç bir enerji.',
    meslek: 'Yazılım mimarı, yapay zeka uzmanı, bilim insanı, pilot, sivil toplum lideri veya endüstriyel tasarımcı.',
    tanisma: 'Bir teknoloji fuarında, arkadaş grubunun buluşmasında, sosyal yardım projesinde veya dijital bir toplulukta.',
    dinamik: 'Geleneksel sınırları aşan, karşılıklı özgürlüğe saygı duyan ve geleceği birlikte inşa eden modern bir evlilik.',
    memleket: 'Modern, üniversite şehri, teknoloji merkezi veya kozmopolit, özgürlükçü bir sahil metropolünden gelir. Çağdaş bir kökene sahiptir.',
    yasFarki: 'Yaş kavramına hiç takılmaz; ruh olarak zamanın ötesinde, genç ve arkadaş canlısı biridir. Akran veya sıra dışı yaş farkı olabilir.',
    aileYapisi: 'Modern, sıra dışı, herkesin kendi özgürlüğüne sahip olduğu, entelektüel ve çağdaş bir aile.',
    iletisimTarzi: 'Entelektüel, arkadaşça, tarafsız ve esprili. Olaylara mantık ve objektiflikle bakar; duygusal baskıdan hoşlanmaz, özgür düşünceye saygılıdır.',
    hobiler: 'Astronomi ve bilimkurgu, yapay zeka, elektronik aletler, sivil toplum gönüllülüğü ve yenilikçi projeler.',
    muhtemelBurclar: ['Kova', 'İkizler', 'Terazi', 'Aslan'],
    ilkIntiba: 'Sıradışı tarzı, zeki ve orijinal fikirleri ilk anda merakınızı uyandıracaktır. Onun diğer insanlardan çok farklı olduğunu hemen anlayacaksınız.',
    evlilikSonrasiDegisim: 'Bu evlilikle birlikte hayatınızda yeni ufuklar, özgürlük ve toplumsal başarı kapıları açılacaktır. Birlikte çağın ötesinde projelere imza atacaksınız.',
    evlilikZamanlamasi: 'Geleneksel evlilik baskılarından sıyrıldığınız 26-32 yaş aralığında, dostlukla başlayıp evliliğe evrilen bir süreç.'
  },
  'Balık': {
    sign: 'Balık',
    summary: 'Ruh eşiniz, derin empatiye sahip, sanatsal, masalsı ve şifacı bir eş.',
    karakter: 'Eşiniz sizinle kelimeler olmadan dahi anlaşabilen, sınırsız bir şefkat ve sevgiyle dolu, ruhsal derinliği yüksek biridir. Sanata, müziğe ve maneviyata yatkındır.',
    fiziksel: 'Büyüleyici ve rüyamsı bakışlar, yumuşak yüz hatları, masalsı bir tebessüm ve zarafet.',
    meslek: 'Müzisyen, ressam, sinemacı, psikolog, veteriner, alternatif tıp uzmanı, denizci veya şifacı.',
    tanisma: 'Manevi bir ortamda, deniz kenarında, bir konserde, sanat atölyesinde veya kaderin mucizevi bir rastlantısıyla.',
    dinamik: 'Ruhların bütünleştiği, karşılıksız sevgi ve yüksek manevi huzurla dolu kutsal bir yuva.',
    memleket: 'Deniz kıyısı, ada, balıkçı kasabası veya mistik/manevi türbeleriyle bilinen rüyamsı bir coğrafyadan gelecektir. Ailesinde sanatçı veya denizciler bulunur.',
    yasFarki: 'Ruhsal olarak çok yaşlı (kadim ruh), fakat günlük hayatta masum ve genç bir kalbe sahip bir eştir.',
    aileYapisi: 'Şefkatli, fedakar, maneviyatı veya sanatsal yönü yüksek, duygusal bağları kuvvetli bir aile.',
    iletisimTarzi: 'Şiirsel, masalsı, empatik ve şefkatli. Sizi can kulağıyla dinler; kelimelerinizin ardındaki acıyı ve sevinci hisseder.',
    hobiler: 'Müzik aleti çalmak, resim yapmak, şiir yazmak, meditasyon, deniz kenarında yalnız yürüyüşler ve hayvan bakımı.',
    muhtemelBurclar: ['Balık', 'Yengeç', 'Akrep', 'Başak'],
    ilkIntiba: 'Gözlerindeki derin şefkat ve masalsı bakış ilk andan itibaren kalbinize işleyecektir. Ruh eşinizi bulduğunuzu fısıldayan güçlü bir sezgi hissedeceksiniz.',
    evlilikSonrasiDegisim: 'Bu evlilik ruhunuzu şifalandıracak, sanatsal ve manevi yeteneklerinizi ortaya çıkaracaktır. Dünyevi kaygılardan arınmış, sevgi dolu kutsal bir yuva inşa edeceksiniz.',
    evlilikZamanlamasi: 'Ruhsal olarak hazır olduğunuz 25-30 veya 32-36 yaş döneminde, kaderin mucizevi bir zamanlamasıyla gelen evlilik.'
  }
};

const SPOUSE_MEETING_BY_RULER_HOUSE = {
  1: '7. Ev yöneticiniz 1. Evde: Eşiniz doğrudan sizin hayatınıza adım atar; ilk adımı genellikle o atar. Fiziksel çekim ilk andan itibaren çok güçlüdür.',
  2: '7. Ev yöneticiniz 2. Evde: Eşinizle finansal ortamlarda, banka, alışveriş, lüks mekanlar veya ortak maddi hedeflerin konuşulduğu ortamlarda tanışacaksınız.',
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

const DARAKARAKA_INTERPRETATIONS = {
  'Güneş': 'Darakaraka Güneş: Eşiniz soylu bir duruşa, yüksek özgüvene ve liderlik vasıflarına sahiptir. Gururludur ve toplumda saygı görür.',
  'Ay': 'Darakaraka Ay: Eşiniz son derece şefkatli, duygusal zekası yüksek, besleyici ve koruyucu bir ruha sahiptir. Size huzur verir.',
  'Merkür': 'Darakaraka Merkür: Eşiniz zeki, esprili, çok konuşkan, genç görünümlü ve entelektüeldir. Aranızdaki iletişim kusursuzdur.',
  'Venüs': 'Darakaraka Venüs: Eşiniz büyüleyici derecede çekici, estetik zevkleri yüksek, romantik ve sanatsaldır. Aşkı doyasıya yaşatır.',
  'Mars': 'Darakaraka Mars: Eşiniz atletik, cesur, tutkulu, koruyucu ve girişimcidir. Sizi her türlü tehlikeye karşı korur.',
  'Jüpiter': 'Darakaraka Jüpiter: Eşiniz bilge, ahlaklı, eğitimli, cömert ve inançlıdır. Hayatınızda adeta bir öğretmen ve rehber olacaktır.',
  'Satürn': 'Darakaraka Satürn: Eşiniz olgun, ağırbaşlı, sarsılmaz bir sadakate sahip ve son derece güvenilirdir. Ömürlük bir hayat arkadaşıdır.'
};

// ANNUAL PROFECTIONS (YILLIK PROFEKSİYON EV TEMALARI)
const ANNUAL_PROFECTIONS = {
  1: { theme: '1. Ev Yılı (Yeni Benlik & Başlangıçlar)', desc: 'Kişisel kimlik, fiziksel beden, sağlık ve yeni hedeflere cesurca başlama yılı. Hayatınızda yepyeni bir 12 yıllık döngü başlar.' },
  2: { theme: '2. Ev Yılı (Maddi Güvence & Gelirler)', desc: 'Para kazanma, yeni gelir kapıları, finansal yatırımlar ve kişisel özdeğer odaklı bir büyüme yılıdır.' },
  3: { theme: '3. Ev Yılı (İletişim, Eğitim & Yakın Çevre)', desc: 'Yeni beceriler öğrenme, sertifikalar, yazışmalar, kısa seyahatler, kardeşler ve sosyal çevre trafiği.' },
  4: { theme: '4. Ev Yılı (Ev, Yuva & Kökler)', desc: 'Evlilik hazırlığı, ev alma/taşınma, aile kurma, gayrimenkul ve içsel huzuru inşa etme yılıdır.' },
  5: { theme: '5. Ev Yılı (Aşk, Yaratıcılık & Neşe)', desc: 'Romantizm, flört, yaratıcı yeteneklerin parlaması, çocuklar ve yaşam sevincinin zirve yaptığı yıl!' },
  6: { theme: '6. Ev Yılı (Çalışma Düzeni & Sağlık)', desc: 'Günlük rutinleri düzene sokma, iş hayatında ustalaşma, hizmet etme ve bedensel sağlık bakımı yılıdır.' },
  7: { theme: '7. Ev Yılı (İlişkiler, Ortaklık & Evlilik Yılı)', desc: 'Ciddi bir ilişkiye başlama, nişan, evlilik veya önemli bir ortaklık kurma ihtimalinin en yüksek olduğu altın yıldır!' },
  8: { theme: '8. Ev Yılı (Dönüşüm & Ortak Kaynaklar)', desc: 'Finansal dönüşümler, ortak bütçe, yatırımlar, miras/kredi ve derin psikolojik yenilenme yılıdır.' },
  9: { theme: '9. Ev Yılı (Uzak Seyahatler & Yüksek Vizyon)', desc: 'Yurt dışı seyahatleri, üniversite/akademik atılımlar, inançlar ve felsefi dünya görüşünün genişlemesi.' },
  10: { theme: '10. Ev Yılı (Kariyer Zirvesi & Toplumsal Statü)', desc: 'Toplumda saygınlık, terfi, kariyerde büyük başarı ve hedeflerin meyvesini toplama yılıdır.' },
  11: { theme: '11. Ev Yılı (Dostluklar & Büyük Hayaller)', desc: 'Sosyal çevre genişlemesi, dernekler, ortak projeler ve uzun vadeli umutların bir bir gerçekleştiği yıl.' },
  12: { theme: '12. Ev Yılı (İçsel Arınma & Maneviyat)', desc: 'Bilinçdışının şifalanması, inziva, maneviyat, eski yükleri bırakma ve döngünün tamamlanması yılıdır.' }
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

// Load extracted
const extractedPath = path.join(__dirname, 'extracted-interpretations.json');
const extracted = fs.existsSync(extractedPath)
  ? JSON.parse(fs.readFileSync(extractedPath, 'utf8'))
  : { yorumlar: {}, retroYorumlari: {} };

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

const {
  KARMIC_NODE_AXIS_INTERPRETATIONS,
  KARMIC_SATURN_INTERPRETATIONS,
  KARMIC_PLUTO_INTERPRETATIONS,
  KARMIC_CHIRON_INTERPRETATIONS,
  KARMIC_VERTEX_INTERPRETATIONS,
  KARMIC_LILITH_INTERPRETATIONS,
  SYNASTRY_KARMIC_ASPECT_INTERPRETATIONS
} = require('./data/karmic-data');

const { PLANET_HOUSE_INTERPRETATIONS } = require('./data/planet-houses-data');
const { PLANET_DEEP_INTERPRETATIONS } = require('./data/planet-deep-signs-data');

const RETROGRADE_DEEP_INTERPRETATIONS = {
  'Merkür': [
    'Merkür Retro (R): Zihin dış dünyadan ziyade içsel hakikatlere odaklanır. Kişi standart düşünce kalıplarının ötesinde derin felsefi, sezgisel ve çok boyutlu bir kavrayışa sahiptir.',
    'Geçmiş Yaşam Karması: Geçmiş yaşamlarda sözlerin sorumluluğu tam taşınmamış olabilir; bu yaşamda konuşmadan önce derinlemesine düşünme ve kelimelerin gücünü idrak etme dersi vardır.',
    'Yaşam Rehberliği: Anlaşılmadığınızı düşündüğünüzde içe kapanmak yerine yazarak, araştırarak ve sanat yoluyla derin düşüncelerinizi ifade edin; sezgisel aklınız en büyük rehberinizdir.'
  ],
  'Venüs': [
    'Venüs Retro (R): Aşkı, sevgiyi ve özdeğeri toplumun yüzeysel standartlarında değil, ruhun en derin köşelerinde arar. Sıradan flörtler yerine kadersel, zamansız ve ruhsal bağlar peşindedir.',
    'Geçmiş Yaşam Karması: Geçmiş yaşamlarda ilişkilerde fedakarlık ve özsaygı dengesi sarsılmış olabilir. Bu hayatta başkalarının onayına bağımlı olmadan kendi öz sevgisini ve değerini inşa etme dersi vardır.',
    'Yaşam Rehberliği: Sevgiyi dışarıda aramak yerine önce kendi kalbinize şefkat gösterin. Kadersel ruh eşiniz, kendi özdeğerinize tam olarak sahip çıktığınızda hayatınıza girecektir.'
  ],
  'Mars': [
    'Mars Retro (R): Öfke ve mücadele enerjisi dışarıya taşkınlıkla değil, içsel bir irade ve odaklanmış bir stratejiyle akar. Dürtüsel kavgalar yerine derin planlar yaparak hedefine ulaşır.',
    'Geçmiş Yaşam Karması: Geçmiş yaşamlarda gücün ve saldırganlığın yıkıcı sonuçları deneyimlenmiş olabilir. Bu yaşamda öfkeyi kontrol etme, pasif agresiflikten kaçınma ve cesareti yapıcı bir kudrete dönüştürme sınavı vardır.',
    'Yaşam Rehberliği: Enerjinizi bastırmak yerine spor, stratejik iş projeleri veya cerrahi bir disiplinle yapıcı hedeflere yönlendirin.'
  ],
  'Jüpiter': [
    'Jüpiter Retro (R): Şansı, bereketi ve hakikati dış dünyadaki popüler dogmalarda değil, kendi içsel felsefesinde ve vicdanında bulur. Doğuştan bilge ve mistik bir ruha sahiptir.',
    'Geçmiş Yaşam Karması: Geçmiş yaşamlarda inançları veya zenginliği sorgulamadan kabul etme deneyimi yaşamış olabilir. Bu hayatta kendi hakikatini bizzat keşfetme ve içsel ahlakı geliştirme dersi vardır.',
    'Yaşam Rehberliği: Kendi inanç pusulanıza güvenin; başkalarının hazır reçeteleri yerine kendi kalbinizin rehberliğini dinlediğinizde evrenin kapıları ardına kadar açılır.'
  ],
  'Satürn': [
    'Satürn Retro (R): Sorumluluk duygusu son derece derindir; kişi sanki omuzlarında yüz yıllık bir yükle doğmuş gibidir. Kendi kendini acımasızca eleştirme eğilimi yüksektir.',
    'Geçmiş Yaşam Karması: Geçmiş yaşamlarda otoriteyi ya kötüye kullanmış ya da ağır bir baskı altında ezilmiş bir ruhun izleridir. Bu hayatta kendi içsel babasını/otoritesini şefkatle inşa etme dersi vardır.',
    'Yaşam Rehberliği: Kusursuz olmak zorunda değilsiniz; hata yapma hakkınızı kabul edin. Sabırla ve sevgiyle çalıştığınızda zamanla aşamayacağınız hiçbir engel kalmayacaktır.'
  ],
  'Uranüs': [
    'Uranüs Retro (R): İsyanını ve devrimci doğasını dışarıda bağırmak yerine içsel bir deha ve özgün dünya görüşüyle yaşar. Sessiz ama çığır açan bir mucittir.',
    'Geçmiş Yaşam Karması: Toplumdan dışlanma ve anlaşılmama travmalarını geride bırakıp özgünlüğünü korkusuzca ama yapıcı biçimde kucaklama görevi vardır.'
  ],
  'Neptün': [
    'Neptün Retro (R): Hayal kırıklıklarından arınarak doğrudan ilahi hakikate ve saf sezgiye bağlanma kabiliyetidir. İllüzyonların ardındaki gerçeği görme gücü verir.',
    'Geçmiş Yaşam Karması: Manevi kaçışları ve kurban psikolojisini bırakıp ayaklarını yere basarak ilahi şefkati dünyada somutlaştırma dersi taşır.'
  ],
  'Plüton': [
    'Plüton Retro (R): İçsel dönüşüm ve psikolojik arınma derinliği olağanüstüdür. Kendi gölgesiyle yüzleşmekten korkmaz; içsel simya ustasıdır.',
    'Geçmiş Yaşam Karması: Güç savaşlarını, intikamı ve gizli korkuları bırakıp gücünü başkalarını şifalandırmak için kullanma ruhsal taahhüdüdür.'
  ]
};

const tsContent = `// Astroloji.org ve profesyonel astroloji tabanlı ultra-zengin kütüphane

export const NAKSHATRA_DATA = ${JSON.stringify(NAKSHATRA_DATA, null, 2)};

export const HOUSE_SYSTEM_DETAILS = ${JSON.stringify(HOUSE_SYSTEM_DETAILS, null, 2)};

export const AYANAMSA_DETAILS = ${JSON.stringify(AYANAMSA_DETAILS, null, 2)};

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
  memleket: string;
  yasFarki: string;
  aileYapisi: string;
  iletisimTarzi: string;
  hobiler: string;
  muhtemelBurclar: string[];
  ilkIntiba: string;
  evlilikSonrasiDegisim: string;
  evlilikZamanlamasi: string;
}> = ${JSON.stringify(SPOUSE_BY_7TH_SIGN, null, 2)};

export const SPOUSE_MEETING_BY_RULER_HOUSE: Record<number, string> = ${JSON.stringify(SPOUSE_MEETING_BY_RULER_HOUSE, null, 2)};

export const DARAKARAKA_INTERPRETATIONS: Record<string, string> = ${JSON.stringify(DARAKARAKA_INTERPRETATIONS, null, 2)};

export const ANNUAL_PROFECTIONS: Record<number, { theme: string; desc: string }> = ${JSON.stringify(ANNUAL_PROFECTIONS, null, 2)};

export const D9_INTERPRETATIONS = {
  title: 'Navamsha (D9) Harmoni ve Evlilik Analizi',
  overview: 'D9 Navamsha haritası, Vedik astrolojide ruhun gerçek potansiyelini, hayatın ikinci yarısını, evlilik dinamiklerini ve eşin niteliklerini gösteren en temel varga haritasıdır.',
  vargottamaDesc: 'Vargottama (D1 ve D9 haritasında aynı burçta bulunan) gezegenler olağanüstü güç, kararlılık ve ruhsal koruma kazanır; kendi burcundaymış gibi sağlam çalışır.',
  pushkaraDesc: 'Pushkara Navamsha derecelerindeki gezegenler, zayıf konumlarda dahi olsalar kişiye ilahi lütuf, şans ve yüksek şifa getirir.'
};

export const SYNASTRY_INTERPRETATIONS = ${JSON.stringify(SYNASTRY_INTERPRETATIONS, null, 2)};

export const PLANET_SIGN_INTERPRETATIONS: Record<string, Record<string, string[]>> = ${JSON.stringify(FULL_PLANET_SIGN_INTERPRETATIONS, null, 2)};

export const PLANET_HOUSE_INTERPRETATIONS: Record<string, Record<number, string>> = ${JSON.stringify(PLANET_HOUSE_INTERPRETATIONS, null, 2)};

export const PLANET_DEEP_INTERPRETATIONS: Record<string, Record<string, {
  summary: string;
  karakter: string;
  gucluYonler: string;
  golgeYonler: string;
  askVeIliskiler: string;
  kariyerVePara: string;
  karmikDers: string;
}>> = ${JSON.stringify(PLANET_DEEP_INTERPRETATIONS, null, 2)};

export const KARMIC_NODE_AXIS_INTERPRETATIONS: Record<string, {
  title: string;
  pastLifeKarma: string;
  soulMission: string;
  releaseAdvice: string;
  karmicGift: string;
}> = ${JSON.stringify(KARMIC_NODE_AXIS_INTERPRETATIONS, null, 2)};

export const KARMIC_SATURN_INTERPRETATIONS: Record<string, {
  karmicDebt: string;
  lifeLesson: string;
  masteryGift: string;
}> = ${JSON.stringify(KARMIC_SATURN_INTERPRETATIONS, null, 2)};

export const KARMIC_PLUTO_INTERPRETATIONS: Record<string, {
  transformationTheme: string;
  shadowRelease: string;
  rebirthPower: string;
}> = ${JSON.stringify(KARMIC_PLUTO_INTERPRETATIONS, null, 2)};

export const KARMIC_CHIRON_INTERPRETATIONS: Record<string, {
  coreWound: string;
  healingGift: string;
}> = ${JSON.stringify(KARMIC_CHIRON_INTERPRETATIONS, null, 2)};

export const KARMIC_VERTEX_INTERPRETATIONS: Record<string, {
  fatedEncounters: string;
  destinyCall: string;
}> = ${JSON.stringify(KARMIC_VERTEX_INTERPRETATIONS, null, 2)};

export const KARMIC_LILITH_INTERPRETATIONS: Record<string, {
  tabooTheme: string;
  rawAuthenticity: string;
}> = ${JSON.stringify(KARMIC_LILITH_INTERPRETATIONS, null, 2)};

export const SYNASTRY_KARMIC_ASPECT_INTERPRETATIONS: Record<string, {
  type: string;
  desc: string;
  significance: 'Çok Yüksek' | 'Yüksek' | 'Orta';
}> = ${JSON.stringify(SYNASTRY_KARMIC_ASPECT_INTERPRETATIONS, null, 2)};

export const RETRO_INTERPRETATIONS: Record<string, string[]> = ${JSON.stringify(RETROGRADE_DEEP_INTERPRETATIONS, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/natal-interpretations.ts'), tsContent);
console.log('Successfully written comprehensive ultra-rich src/lib/natal-interpretations.ts!');
