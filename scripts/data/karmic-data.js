// Kadersel Bağlar, Karmik Eksenler ve Ruhsal Evrim Kütüphanesi

const KARMIC_NODE_AXIS_INTERPRETATIONS = {
  'Koç': {
    title: 'Kuzey Düğüm Koç / Güney Düğüm Terazi: Bağımsızlık ve Cesaret İnisiyatifi',
    pastLifeKarma: 'Geçmiş yaşamlarda sürekli başkalarının beklentilerini karşılamaya çalışmış, ilişkilerde onay bağımlılığı geliştirmiş ve yalnız kalma korkusuyla kendi isteklerinizi feda etmişsiniz. Adalet ve uyum sağlama adına kendi kimliğinizden vazgeçme karması taşımaktasınız.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; kendi ayaklarınız üzerinde durmayı öğrenmek, cesaretle inisiyatif almak, gerektiğinde çatışmaktan korkmamak ve bağımsız bireysel kimliğinizi inşa etmektir. Kendi kaderinizin kahramanı olmalısınız.',
    releaseAdvice: 'Sürekli onay arayışını, aşırı kararsızlığı, başkalarını memnun etme takıntısını ve yalnız kalma korkusunu geride bırakmalısınız.',
    karmicGift: 'Adil, bağımsız, öncü ve başkalarına cesaret aşılayan ilham verici bir liderlik gücü.'
  },
  'Boğa': {
    title: 'Kuzey Düğüm Boğa / Güney Düğüm Akrep: İçsel Güven ve Kendi Değerini İnşa Etme',
    pastLifeKarma: 'Geçmiş yaşamlarda yoğun krizler, güç savaşları, ihanetler, travmatik kayıplar ve başkalarının kaynaklarına aşırı bağımlılık deneyimlemişsiniz. Her an bir tehlike kapıdaymış gibi tetikte olma ve krizlerden beslenme karması getirmişsiniz.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; sükuneti, huzuru, doğallığı ve kendi öz kaynaklarınızla sağlam bir güven alanı inşa etmeyi öğrenmektir. Kendi emeğinizle üretmeli, hayata güvenmeli ve basit mutlulukların kıymetini bilmelisiniz.',
    releaseAdvice: 'Sürekli kriz ve şüphe üretmeyi, başkalarını kontrol etme takıntısını, intikam duygusunu ve kurban-kurtarıcı rollerini bırakmalısınız.',
    karmicGift: 'Sarsılmaz bir içsel huzur, üretkenlik bereketi, sağlam karakter ve güven veren güvenilirlik.'
  },
  'İkizler': {
    title: 'Kuzey Düğüm İkizler / Güney Düğüm Yay: Dinleme Sanatı, Merak ve Zihinsel Esneklik',
    pastLifeKarma: 'Geçmiş yaşamlarda bilge, din adamı, filozof veya gezgin olarak yaşamış; her şeyi bildiğini varsayan dogmatik ve yargılayıcı bir zihniyet geliştirmişsiniz. İnsanların arasına karışmak yerine yüksek fildişi kulelerden ahkam kesme karması bulunmaktadır.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; dinlemeyi öğrenmek, peşin hükümlerden sıyrılmak, çocuksu bir merakla soru sormak ve insanlarla doğrudan, samimi iletişim köprüleri kurmaktır. Gerçeği tekeline almak yerine her fikirden öğrenmeye açık olmalısınız.',
    releaseAdvice: 'Fanatizmi, kibirli bilgelik taslamayı, genellemelerle insanları etiketlemeyi ve detayları küçümsemeyi bırakmalısınız.',
    karmicGift: 'Kelimelerin büyücüsü olma, insanları bir araya getiren köprü zihniyet ve esnek problem çözme kabiliyeti.'
  },
  'Yengeç': {
    title: 'Kuzey Düğüm Yengeç / Güney Düğüm Oğlak: Kalbini Açmak, Şefkat ve Duygusal Yuva',
    pastLifeKarma: 'Geçmiş yaşamlarda katı görev insanı, yüksek rütbeli yönetici veya otorite figürü olarak yaşamış; duyguları bir zayıflık olarak görüp bastırmışsınız. Sadece statü, başarı ve saygınlık için duygusal sıcaklıktan feragat etme karması taşımaktasınız.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; duygularınızı özgürce ifade etmek, kalbinizi açmak, şefkat göstermek ve ruhsal olarak besleyici bir aile ve yuva ortamı kurmaktır. Savunmasız olmanın en büyük cesaret olduğunu kavramalısınız.',
    releaseAdvice: 'Duygusal duvarları, aşırı işkolikliği, insanları kontrol etme ihtiyacını ve zayıf görünme korkusunu bırakmalısınız.',
    karmicGift: 'Muazzam bir sezgisel bilgelik, derin bir şefkat, koşulsuz sevgi ve ruhları sarıp sarmalayan anaç koruyuculuk.'
  },
  'Aslan': {
    title: 'Kuzey Düğüm Aslan / Güney Düğüm Kova: Sahneye Çıkmak, Yaratıcı Özgüven ve Kalpten Yaşamak',
    pastLifeKarma: 'Geçmiş yaşamlarda kalabalıklar arasında kaybolmuş, kendinizi bir grubun veya davanın arkasına saklamış, duygusal olarak mesafeli ve entelektüel olarak soğuk kalmışsınız. Kendi bireysel ışığınızı parlatmaktan çekinme karması getirmişsiniz.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; sahnenin merkezine geçmek, kalbinizin sesini dinlemek, yaratıcılığınızı cesurca sergilemek ve bireysel varlığınızla parıldamaktır. Başkalarının takdirine bağımlı olmadan kendi değerinizi kutlamalısınız.',
    releaseAdvice: 'Duygusal soğukluğu, kalabalıkların arkasına saklanmayı, alaycı mesafeliliği ve sıradanlığa sığınmayı bırakmalısınız.',
    karmicGift: 'Cömert bir yürek, insanları peşinden sürükleyen karizma, sanatsal deha ve ilham verici sıcak liderlik.'
  },
  'Başak': {
    title: 'Kuzey Düğüm Başak / Güney Düğüm Balık: Gerçekçilik, Somut Düzen ve Hizmet Ustalığı',
    pastLifeKarma: 'Geçmiş yaşamlarda dünyevi sorumluluklardan kaçmış, hayaller dünyasında veya manastırlarda kaybolmuş, kurban rolünü benimsemişsiniz. Sınır çizememe, aşırı fedakarlık yüzünden tükenme ve somut dünyayı reddetme karması taşımaktasınız.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; ayaklarınızı yere sağlam basmak, hayatınıza pratik bir düzen getirmek, detaylara özen göstermek ve somut olarak insanlara faydalı olacak bir zanaat ve hizmet alanı geliştirmektir.',
    releaseAdvice: 'Kurban psikolojisini, gerçeklerden kaçış bağımlılıklarını, dağınıklığı ve sınır koyamamayı bırakmalısınız.',
    karmicGift: 'Üstün analiz yeteneği, şifacı eller, pratik problem çözme dehası ve hayatı kusursuzca düzenleme ustalığı.'
  },
  'Terazi': {
    title: 'Kuzey Düğüm Terazi / Güney Düğüm Koç: Biz Bilinci, Diplomasi ve Ortaklık Erdemi',
    pastLifeKarma: 'Geçmiş yaşamlarda yalnız bir savaşçı, bencil bir lider veya tek başına mücadele eden biri olarak yaşamış; başkalarının duygularını ve ihtiyaçlarını göz ardı etmişsiniz. "Önce ben" diyerek ilişkileri yıpratma karması getirdiniz.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; ortaklık kurmayı, dinlemeyi, empati yapmayı, diplomasiyi ve gerçek bir sevgi bağı içinde "biz" olmayı öğrenmektir. Hayatınızı tamamlayacak ruhla eşit ve adil bir paylaşım kurmalısınız.',
    releaseAdvice: 'Bencil sabırsızlığı, her şeyi tek başına yapma inadını, fevriliği ve başkalarının fikirlerini hiçe saymayı bırakmalısınız.',
    karmicGift: 'Zarif bir diplomasi, estetik zevk, adaletli rehberlik ve hayat boyu sürecek derin, dengeli ortaklıklar.'
  },
  'Akrep': {
    title: 'Kuzey Düğüm Akrep / Güney Düğüm Boğa: Ruhsal Dönüşüm, Maddi Bağımlılıkları Bırakma ve Derinleşme',
    pastLifeKarma: 'Geçmiş yaşamlarda sadece konfora, maddi mala, lükse ve statükoya yapışmış; değişime direnmişsiniz. Güvende hissetmek için ruhsal derinleşmeyi reddetme ve madde dünyasında uyuşma karması getirdiniz.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; kontrolü bırakıp ruhsal dönüşüme teslim olmak, görünmeyenin ardındaki psikolojik hakikatleri keşfetmek ve küllerinizden yeniden doğmayı öğrenmektir. Krizleri manevi büyümenin bir aracı yapmalısınız.',
    releaseAdvice: 'Maddi takıntıları, değişime karşı katı direnci, cimriliği ve yüzeysel konfor alanına hapsolmayı bırakmalısınız.',
    karmicGift: 'Dönüştürücü bir sezgi, muazzam bir içsel dayanıklılık, okült bilgelik ve başkalarının krizlerini iyileştirme gücü.'
  },
  'Yay': {
    title: 'Kuzey Düğüm Yay / Güney Düğüm İkizler: Yüksek Vizyon, İnanç ve Hayata Güven',
    pastLifeKarma: 'Geçmiş yaşamlarda dedikodularla, yüzeysel dedikodu ve bilgi kırıntılarıyla vakit kaybetmiş, derinleşememiş ve hiçbir şeye tam olarak inanamamışsınız. Kararsızlık ve zihinsel kararsızlık içinde oradan oraya savrulma karması taşımaktasınız.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; hayatınıza bir anlam ve yüksek felsefe katmak, sezgilerinize ve evrene güvenmek, büyük resmi görmek ve sınırların ötesine açılmaktır. Kendi inanç sisteminizi inşa edip bilgeliğe yürümelisiniz.',
    releaseAdvice: 'Yüzeysel kararsızlığı, dedikoduyu, zihinsel şüpheciliği ve küçük detaylarda boğulup büyük resmi kaçırmayı bırakmalısınız.',
    karmicGift: 'Engin bir dünya görüşü, iyimserlik, manevi vizyon, uluslararası başarı ve bilgece bir hayat felsefesi.'
  },
  'Oğlak': {
    title: 'Kuzey Düğüm Oğlak / Güney Düğüm Yengeç: Duygusal Olgunluk, Sorumluluk ve Hayatın Liderliği',
    pastLifeKarma: 'Geçmiş yaşamlarda aşırı bağımlı, çocuksu bir ruh haliyle başkalarının kanatları altına sığınmış, sorumluluk almaktan kaçmışsınız. Sürekli geçmişe ve nostaljiye takılıp bugünü inşa etmeme karması getirdiniz.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; kendi hayatınızın sorumluluğunu elinize almak, duygusal olgunluğa erişmek, sabırla hedeflerinize yürümek ve toplumda kalıcı bir saygınlık ve eser bırakmaktır. Kendi kendinizin koruyucusu olmalısınız.',
    releaseAdvice: 'Çocuksu alınganlıkları, geçmişe takılı kalmayı, kurban rolünü ve sorumluluklardan kaçmayı bırakmalısınız.',
    karmicGift: 'Kalıcı bir başarı, sarsılmaz bir saygınlık, kriz anlarında sığınılacak güvenli bir liman ve liderlik ustalığı.'
  },
  'Kova': {
    title: 'Kuzey Düğüm Kova / Güney Düğüm Aslan: Kolektif Vizyon, Birlik Bilinci ve İnsaniyet',
    pastLifeKarma: 'Geçmiş yaşamlarda kral, kraliçe veya ayrıcalıklı bir soylu olarak yaşamış; herkesin size hizmet etmesini beklemişsiniz. Özel muamele görme isteği, aşırı ego ve kibri besleme karması taşımaktasınız.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; egonuzu kolektifin hayrına sunmak, insanlığa hizmet eden ideallere katılmak, herkesle eşit ve kardeşçe bağlar kurmak ve dünyayı daha adil bir geleceğe taşımaktır. Bir grubun değerli bir parçası olmayı öğrenmelisiniz.',
    releaseAdvice: 'Kibri, aşırı gururu, sadece kendi çıkarını düşünmeyi ve başkalarından üstün olduğunu sanma yanılgısını bırakmalısınız.',
    karmicGift: 'Çığır açan vizyonerlik, hümanist bir adalet duygusu, dahi düzeyinde yenilikçi fikirler ve dostluk gücü.'
  },
  'Balık': {
    title: 'Kuzey Düğüm Balık / Güney Düğüm Başak: İlahi Teslimiyet, Sezgi ve Koşulsuz Şefkat',
    pastLifeKarma: 'Geçmiş yaşamlarda aşırı eleştirel, takıntılı, her şeyi kusursuz yapmaya çalışan ve kaygılarla kendini tüketen biri olarak yaşamışsınız. Kontrol edemediğiniz her şeyden korkma ve ruhsal alemi inkar etme karması getirdiniz.',
    soulMission: 'Bu yaşamdaki kadersel rotanız; akışa teslim olmayı öğrenmek, evrensel plana güvenmek, mantığın bittiği yerde kalbin ve sezgilerin bilgeliğine sarılmak ve insanlara koşulsuz şefkat göstermektir. Kusurluluğun içindeki ilahi güzelliği görmelisiniz.',
    releaseAdvice: 'Aşırı eleştirelliği, vesveseyi, mükemmeliyetçilik takıntısını ve her şeyi kontrol etme çabasını bırakmalısınız.',
    karmicGift: 'Derin bir mistik sezgi, evrensel empati, sanat ve şifa yeteneği, ruhları teskin eden saf manevi ışık.'
  }
};

const KARMIC_SATURN_INTERPRETATIONS = {
  'Koç': {
    karmicDebt: 'Geçmiş yaşamlarda öfke, saldırganlık veya sabırsızlıkla başkalarına zarar vermiş olma karması. Kendi gücünü yıkıcı kullanmış olmanın bedeli olarak bu hayatta inisiyatif alırken korku veya engellerle karşılaşma.',
    lifeLesson: 'Öfkeyi ve dürtüleri disipline etmek, cesareti akılla birleştirmek ve yıkmadan, yapıcı bir şekilde öncülük etmeyi öğrenmek.',
    masteryGift: 'Zamanla çelik gibi sağlam bir irade, sarsılmaz bir sabır ve asla pes etmeyen bilge bir savaşçı ruhu.'
  },
  'Boğa': {
    karmicDebt: 'Geçmiş yaşamlarda maddi kaynakları kötüye kullanma, aşırı cimrilik veya iflas deneyimleri. Maddi güvensizlik ve yokluk korkusu karması.',
    lifeLesson: 'Kendi öz değerini dışsal maddiyatla değil, içsel erdemle ölçmeyi öğrenmek; sabırla, helal ve kalıcı zenginlik inşa etmek.',
    masteryGift: 'Finansal deha, krizlerde bile batmayan sağlam bir ekonomi ve sarsılmaz bir özgüven kalesi.'
  },
  'İkizler': {
    karmicDebt: 'Geçmişte sözlerle insanları aldatma, dedikoduyla fitne çıkarma veya zihinsel yetenekleri kötüye kullanma karması. Anlaşılmama ve iletişimde engeller yaşama.',
    lifeLesson: 'Sözlerin sorumluluğunu almak, derin ve doğru bilgiye odaklanmak ve yüzeysel gevezelikten uzak durmak.',
    masteryGift: 'Usta bir yazar, bilge bir öğretmen, ciddiyetle dinlenen ve derin saygı uyandıran bir entelektüel otorite.'
  },
  'Yengeç': {
    karmicDebt: 'Geçmiş yaşamlarda aileyi terk etme, çocukları ihmal etme veya duygusal sorumluluklardan kaçma karması. Ailede soğukluk veya erken yaşta olgunlaşma mecburiyeti.',
    lifeLesson: 'Kendi içindeki anne-baba şefkatini inşa etmek, duygusal sınırları sağlıklı korumak ve güvenli bir yuva kurmak.',
    masteryGift: 'Ailesine ve sevdiklerine sarsılmaz bir güvenlik sunan, derin bir duygusal bilgelik ve koruyucu güç.'
  },
  'Aslan': {
    karmicDebt: 'Geçmişte kibirli bir tiran gibi davranma, alkış ve ilgiye bağımlı olma, başkalarının ışığını söndürme karması. Takdir görememe veya çocuklarla ilgili sınavlar.',
    lifeLesson: 'Egoyu terbiye etmek, dış onay beklemeden kendi ışığını kalpten yaymak ve alçakgönüllü bir cömertlik geliştirmek.',
    masteryGift: 'Gerçek, saygın, gösterişsiz ve etrafına ilham veren asil ve adil bir liderlik mevkii.'
  },
  'Başak': {
    karmicDebt: 'Geçmiş yaşamlarda çalışanları ezme, kibirli bir şekilde insanları kusurlu bulup aşağılama veya sağlığı ihmal etme karması.',
    lifeLesson: 'Hizmet etmenin kutsallığını anlamak, mükemmeliyetçilik kaygısını bırakıp tevazu ile işini en iyi şekilde icra etmek.',
    masteryGift: 'Eşsiz bir zanaatkarlık, şifa ilimleri ustalığı, kusursuz bir organizasyon yeteneği ve aranılan bir uzmanlık.'
  },
  'Terazi': {
    karmicDebt: 'Geçmişte evlilik yeminlerini bozma, adaletsiz yargılarda bulunma veya ortaklıkları suiistimal etme karması. İlişkilerde gecikmeler veya ağır sorumluluklar.',
    lifeLesson: 'Evlilikte ve ortaklıklarda eşitlik, dürüstlük ve sadakatle bağ kurmak; geçici hevesler yerine kalıcı taahhütler vermek.',
    masteryGift: 'Satürn burada yücelir! Örnek gösterilen, sarsılmaz bir evlilik, saygın bir adalet ve diplomasi kariyeri.'
  },
  'Akrep': {
    karmicDebt: 'Geçmişte okült güçleri, cinselliği veya başkalarının parasını manipülatif kullanma, ihanet etme veya intikam alma karması.',
    lifeLesson: 'Korkularla yüzleşmek, şüpheciliği bırakıp güven inşa etmek, küllerinden arınarak doğmak ve ilahi adalete teslim olmak.',
    masteryGift: 'Psikolojik deha, krizleri zenginliğe ve bilgeliğe dönüştürme mucizesi, yenilmez bir ruhsal dayanıklılık.'
  },
  'Yay': {
    karmicDebt: 'Geçmişte dini veya felsefi fanatizm, başkalarının inançlarını zorla bastırma veya boş vaatlerle insanları kandırma karması.',
    lifeLesson: 'Kendi inancını sorgulayarak sağlam temellere oturtmak, hakikat yolunda sabırla yürümek ve dogmatizmden arınmak.',
    masteryGift: 'Evrensel saygı duyulan bilge bir filozof, dürüst bir akademisyen ve yol gösterici bir ruhsal rehber.'
  },
  'Oğlak': {
    karmicDebt: 'Kendi burcunda! Geçmişte ağır sorumluluklar almış ama belki katılık yüzünden yalnız kalmış bir ruh. Başarıyı sadece kariyer ve statü sanma yanılgısı.',
    lifeLesson: 'Zirveye giden yolda sabırla, ahlakla ve vicdanla yürümek; başarının yanında insanı ve kalbi de unutmamak.',
    masteryGift: 'Zirvede kalıcı bir başarı, devlet veya kurumsal alanda büyük bir otorite, nesiller boyu anılacak kalıcı eserler.'
  },
  'Kova': {
    karmicDebt: 'Geçmişte dostlara ihanet etme, toplumsal davaları satma veya insanlara yukarıdan bakan kibirli bir yalnızlık yaşama karması.',
    lifeLesson: 'Toplumun ve insanlığın iyiliği için yapı kurmak, vizyoner fikirleri somut projelere dönüştürmek ve gerçek dostluklar edinmek.',
    masteryGift: 'Geleceği inşa eden bir dahi, sarsılmaz bir toplumsal itibar, küresel vizyon ve devrimci bir sistem kurucu.'
  },
  'Balık': {
    karmicDebt: 'Geçmişte kurban rolüne sığınarak sorumluluklardan kaçma, bağımlılıklara kapılma veya başkalarının sırtından geçinme karması.',
    lifeLesson: 'Ruhsal sınırları net çizmek, sahte gurulardan uzak durup kalbindeki ilahi şefkati somut dünyada yapıcı bir şifaya dönüştürmek.',
    masteryGift: 'Ermişlik mertebesinde bir ruhsal olgunluk, derin bir mistik bilgelik, koşulsuz sevgi ve ilahi bir iç huzur.'
  }
};

const KARMIC_PLUTO_INTERPRETATIONS = {
  'Koç': {
    transformationTheme: 'Bireysel irade ve savaşçı gücün kökten dönüşümü.',
    shadowRelease: 'Baskı kurma, saldırganlık ve öfkeyle dünyayı dize getirme takıntısını bırakmak.',
    rebirthPower: 'Korkusuz, ilkeli ve ilahi bir cesaretle adaleti savunan yenilmez bir güç.'
  },
  'Boğa': {
    transformationTheme: 'Maddi değerlerin, servetin ve özsaygının ölüm-yeniden doğum döngüsü.',
    shadowRelease: 'Maddeye saplantılı bağlanma, kaybetme korkusu ve kontrol hırsından arınmak.',
    rebirthPower: 'Yokluktan bile muazzam kalıcı zenginlik ve sarsılmaz bir içsel değer yaratma gücü.'
  },
  'İkizler': {
    transformationTheme: 'Düşünce biçiminin, zihnin ve iletişimin radikal dönüşümü.',
    shadowRelease: 'Manipülatif sözler, bilgiyle başkalarını yönetme hırsı ve şüphecilikten kurtulmak.',
    rebirthPower: 'Kelimeleriyle kitleleri uyandıran, tabuları yıkan dönüştürücü zihinsel deha.'
  },
  'Yengeç': {
    transformationTheme: 'Atalardan gelen duygusal travmaların ve köklerin şifalanması.',
    shadowRelease: 'Duygusal şantaj, geçmişe bağımlılık ve kurban rolünü geride bırakmak.',
    rebirthPower: 'Nesiller boyu aktarılan karmik yaraları iyileştiren derin bir koruyucu şifa gücü.'
  },
  'Aslan': {
    transformationTheme: 'Ego, güç arzusu ve yaratıcı otoritenin arınması.',
    shadowRelease: 'Kibir, alkış bağımlılığı ve başkalarını gölgede bırakma hırsını bırakmak.',
    rebirthPower: 'Saf kalpten doğan, kitleleri dönüştüren karizmatik ve cömert bir liderlik nuru.'
  },
  'Başak': {
    transformationTheme: 'Çalışma sistemlerinin, bedenin ve hizmet bilincinin kökten yenilenmesi.',
    shadowRelease: 'Yıkıcı mükemmeliyetçilik, takıntılı eleştiri ve bedensel kaygılardan arınmak.',
    rebirthPower: 'Tıbbi, biyolojik veya zihinsel düzeyde mucizevi şifa ve kusursuz yenilenme ustalığı.'
  },
  'Terazi': {
    transformationTheme: 'İlişkiler, evlilik ve ortaklık anlayışının köklü dönüşümü.',
    shadowRelease: 'İlişkide kontrol ve güç savaşları, kıskançlık ve kaybetme korkusunu bırakmak.',
    rebirthPower: 'İki ruhun birbirini küllerinden yeniden yarattığı derin, dönüştürücü ve kutsal bir birliktelik.'
  },
  'Akrep': {
    transformationTheme: 'Kendi burcunda! Küllerinden doğmanın, okültizmin ve psikolojik derinleşmenin zirvesi.',
    shadowRelease: 'İntikam arzusu, şüphe, ölüm korkusu ve gizli manipülasyonları geride bırakmak.',
    rebirthPower: 'Ölümün ötesine geçen bir ruhsal diriliş, muazzam sezgisel kavrayış ve başkalarını iyileştirme gücü.'
  },
  'Yay': {
    transformationTheme: 'İnanç sistemlerinin, dünya görüşünün ve felsefi tabuların yıkılıp yeniden doğuşu.',
    shadowRelease: 'Fanatizm, ahlaki üstünlük taslama ve kendi doğrusunu herkese dayatma takıntısı.',
    rebirthPower: 'Evrensel hakikati arayan, kitleleri aydınlatan ve yeni ufuklar açan vizyoner bir bilgelik.'
  },
  'Oğlak': {
    transformationTheme: 'Devlet, kurumsal yapılar, kariyer ve geleneksel otoritenin köklü yıkımı ve inşası.',
    shadowRelease: 'Statü bağımlılığı, güç için duyguları ezme ve katı kontrolcülüğü bırakmak.',
    rebirthPower: 'Çürümüş yapıları yıkıp yerine sağlam, ahlaklı ve kalıcı yeni bir sistem kurma kudreti.'
  },
  'Kova': {
    transformationTheme: 'Kolektif güç, teknoloji, özgürlük ve insanlık bilincinde devrim.',
    shadowRelease: 'İnsanları soyutlaştırma, duygulardan kopuk teknolojik zorbalık ve dışlanma korkusu.',
    rebirthPower: 'Toplumları özgürleştiren, eşitlik ve bilimin ışığında geleceği inşa eden öncü bir güç.'
  },
  'Balık': {
    transformationTheme: 'Kolektif bilinçaltının arınması, mistisizm ve ruhsal uyanış.',
    shadowRelease: 'Manevi yanılsamalar, sahte peygamberler, kurban psikolojisi ve kaçış bağımlılıkları.',
    rebirthPower: 'İlahi sevgiyle tüm yaraları saran, sınırsız empati ve evrensel bir aydınlanma.'
  }
};

const KARMIC_CHIRON_INTERPRETATIONS = {
  'Koç': {
    coreWound: 'Var olma hakkı ve benlik yarası. "Ben kimim, kendi istediğim gibi yaşamaya hakkım var mı?" sorgulaması.',
    healingGift: 'Başkalarının kendi cesaretlerini ve özgüvenlerini bulmalarına yardım eden eşsiz bir rehberlik gücü.'
  },
  'Boğa': {
    coreWound: 'Özdeğer ve maddi güvenlik yarası. Kendini yetersiz hissetme, sevilmeye layık görmeme veya yokluk korkusu.',
    healingGift: 'İnsanlara kendi içsel değerlerini ve zenginliklerini hatırlatan güven verici bir şifa enerjisi.'
  },
  'İkizler': {
    coreWound: 'İletişim ve zeka yarası. "Beni kimse dinlemiyor, söylediklerim anlaşılmıyor veya aptal görünüyorum" korkusu.',
    healingGift: 'İfade güçlüğü çekenlerin sesi olma, kelimelerle ruhları iyileştirme ve usta bir dinleyicilik.'
  },
  'Yengeç': {
    coreWound: 'Aidiyet, kökler ve anaçlık yarası. Sevgisiz kalma, duygusal olarak terk edilme ve güvensizlik acısı.',
    healingGift: 'Herkese güvenli bir liman sunabilen, kimsesizlerin ruhunu saran derin bir şefkat ve anaçlık.'
  },
  'Aslan': {
    coreWound: 'Yaratıcılık, görülme ve onaylanma yarası. Kendi ışığını göstermekten utanma, sahnede küçük düşme korkusu.',
    healingGift: 'Başkalarının içindeki eşsiz yetenekleri ve yaratıcı cevheri parlatma, onları alkışlama ustalığı.'
  },
  'Başak': {
    coreWound: 'Kusursuzluk ve beden sağlığı yarası. Kendini sürekli eksik, yetersiz ve kusurlu hissetme vesvesesi.',
    healingGift: 'İnsanların bedensel ve ruhsal yaralarını saran, alternatif tıp ve şifa sanatlarında usta bir şifacılık.'
  },
  'Terazi': {
    coreWound: 'İlişkiler ve ortaklık yarası. Yalnız kalma korkusu yüzünden adaletsiz ilişkilerde kendini kaybetme.',
    healingGift: 'İnsanlar arasında barış, uzlaşma ve adil ilişkiler inşa eden zarif bir arabuluculuk gücü.'
  },
  'Akrep': {
    coreWound: 'Güven, ihanet ve kayıp yarası. En sevdikleri tarafından sırtından vurulma veya derin ölüm acısı.',
    healingGift: 'En karanlık psikolojik krizleri aydınlatma, travma yaşamış insanları küllerinden ayağa kaldırma gücü.'
  },
  'Yay': {
    coreWound: 'İnanç, anlam ve hayat görüşü yarası. Hayatın anlamsız olduğu hissine kapılma veya inancını yitirme.',
    healingGift: 'Umutsuz kalplere yeniden yaşama sevinci ve ilahi inanç aşılayan bilgece bir felsefi rehberlik.'
  },
  'Oğlak': {
    coreWound: 'Başarı, yetersizlik ve statü yarası. Ne kadar çalışırsa çalışsın hiçbir zaman yetmeyeceği yanılgısı.',
    healingGift: 'Zorluklarla mücadele eden insanlara sabır, dayanıklılık ve zirveye giden yolu gösteren ustalık.'
  },
  'Kova': {
    coreWound: 'Aidiyet ve dışlanma yarası. Kendini hiçbir yere ait hissedememe, "tuhaf ve yabancı" görülme acısı.',
    healingGift: 'Dışlanmış, farklı ve ezilmiş ruhlara kucak açan, onları geleceğin ışığıyla birleştiren hümanizm.'
  },
  'Balık': {
    coreWound: 'Evrensel acı ve sınır çekememe yarası. Tüm dünyanın acısını kendi içinde hissetme ve kurban olma.',
    healingGift: 'İlahi boyuttan gelen saf şefkat, müzik, sanat ve dua ile ruhları arındıran mucizevi bir şifacılık.'
  }
};

const KARMIC_VERTEX_INTERPRETATIONS = {
  'Koç': {
    fatedEncounters: 'Hayatınıza aniden giren, sizi uykunuzdan uyandıran ve cesaretinizi sınayan öncü ve kararlı insanlar.',
    destinyCall: 'Kendi liderliğinizi ilan etmeniz, korkularınızı aşıp tek başınıza adım atmanız gereken kadersel dönüm noktaları.'
  },
  'Boğa': {
    fatedEncounters: 'Sizi maddi ve manevi olarak köklendiren, huzur ve güven aşılayan, ayakları yere basan kadersel ortaklar.',
    destinyCall: 'Kendi üretkenliğinize ve değerinize sahip çıkarak kalıcı bir hayat kurma yönünde kaçınılmaz kader çağrısı.'
  },
  'İkizler': {
    fatedEncounters: 'Sizi zihinsel olarak dönüştüren, yeni bilgiler getiren ve hayat yolunuzu bir sohbetle değiştiren insanlar.',
    destinyCall: 'İletişim, yazarlık veya eğitim yoluyla kitlelerle bağ kurmanız için önünüze çıkan kadersel fırsatlar.'
  },
  'Yengeç': {
    fatedEncounters: 'Sizi duygusal olarak besleyen, aile bağı gibi derin bir sevgiyle bağlanan ruh eşleri ve manevi koruyucular.',
    destinyCall: 'Kendi ruhsal yuvanızı ve koruyucu merhametinizi keşfetmeniz için hayatınıza dahil olan kadersel süreçler.'
  },
  'Aslan': {
    fatedEncounters: 'Sizi sahneye iten, yeteneklerinizi fark ettiren, yaratıcı ve ilham verici karizmatik figürler.',
    destinyCall: 'Kendi özgün ışığınızı parlatmanız ve kalbinizin tutkusunu takip etmeniz için yaşanan kadersel uyanışlar.'
  },
  'Başak': {
    fatedEncounters: 'Hayatınıza düzen, şifa ve ustalık getiren, sizi pratik sorumluluklarla geliştiren insanlar.',
    destinyCall: 'Bir uzmanlık ve hizmet alanında yeteneklerinizi mükemmelleştirmeniz için karşınıza çıkan kader kapıları.'
  },
  'Terazi': {
    fatedEncounters: 'Evlilik veya kadersel ortaklık yoluyla hayatınızı 180 derece değiştiren adil ve zarif ruh ortakları.',
    destinyCall: 'İkili bir bağ içinde dengeyi, sevgiyi ve uzlaşmayı öğrenmeniz için düzenlenen ilahi karşılaşmalar.'
  },
  'Akrep': {
    fatedEncounters: 'Sizi ruhsal olarak sarsan, karanlık taraflarınızla yüzleştiren ve küllerinizden doğuran tutkulu ve güçlü ruhlar.',
    destinyCall: 'Korkuları geride bırakıp derin bir ruhsal evrime adım atmanız için hazırlanan kadersel krizler.'
  },
  'Yay': {
    fatedEncounters: 'Ufkunuzu açan, yabancı kültürlerden veya uzak diyarlardan gelen bilge öğretmenler ve rehberler.',
    destinyCall: 'Büyük resmi görmeniz, inancınızı tazelemeniz ve dünya çapında bir vizyona kavuşmanız için kaderin müdahalesi.'
  },
  'Oğlak': {
    fatedEncounters: 'Sizi olgunlaştıran, kariyerinizde dönüm noktası yaratan kıdemli, otoriter ve bilge kişiler.',
    destinyCall: 'Kendi hayatınızın mimarı olmanız ve kalıcı bir miras bırakmanız için önünüze çıkan kadersel görevler.'
  },
  'Kova': {
    fatedEncounters: 'Sıradışı, vizyoner, devrimci ve sizi tabularınızdan özgürleştiren yenilikçi dostlar ve gruplar.',
    destinyCall: 'Toplumsal bir amaca hizmet etmeniz ve bireysel özgürlüğünüzü kazanmanız için açılan kadersel kapılar.'
  },
  'Balık': {
    fatedEncounters: 'Ruhsal bağı olan, telepatik bir çekim hissettiğiniz, sanki bin yıldır tanıdığınız mistik insanlar.',
    destinyCall: 'İlahi sevgiye teslim olmanız, affetmeniz ve evrensel bir şifa yolculuğuna çıkmanız için kadersel çağrılar.'
  }
};

const KARMIC_LILITH_INTERPRETATIONS = {
  'Koç': {
    tabooTheme: 'Bastırılmış öfke, tavizsiz savaşçı ruh ve bağımsızlık isyanı.',
    rawAuthenticity: 'Korkusuzca hayır diyebilme, kendi arzularının peşinden gitme ve kimseye boyun eğmeme gücü.'
  },
  'Boğa': {
    tabooTheme: 'Tensel zevkler, beden tabuları ve mülkiyet sınırlarını aşma isteği.',
    rawAuthenticity: 'Kendi bedenine ve zevklerine sahip çıkma, maddi bağımlılıklara meydan okuyan özgür bir özdeğer.'
  },
  'İkizler': {
    tabooTheme: 'Yasak fikirler, tabuları yıkan sözler ve sansüre karşı isyan.',
    rawAuthenticity: 'Düşüncelerini korkusuzca dile getirme, toplumun tabu saydığı hakikatleri seslendirme cesareti.'
  },
  'Yengeç': {
    tabooTheme: 'Geleneksel anne-çocuk rollerini reddetme, aile tabularına başkaldırı.',
    rawAuthenticity: 'Kalıplaşmış fedakarlığı reddedip kendi duygusal özgürlüğünü ve hakiki şefkatini yaşama gücü.'
  },
  'Aslan': {
    tabooTheme: 'Kendi parlaklığını bastırmayı reddetme, sahte alçakgönüllülüğe isyan.',
    rawAuthenticity: 'Göz kamaştırıcı bir özgünlük, tavizsiz bir yaratıcılık ve gururla kendi krallığını kurma hakkı.'
  },
  'Başak': {
    tabooTheme: 'Hizmetçi rolünü reddetme, sahte düzene ve dayatılan kurallara isyan.',
    rawAuthenticity: 'Kendi aklına güvenme, mükemmeliyetçilik baskısını kırıp ham doğallığı kucaklama cesareti.'
  },
  'Terazi': {
    tabooTheme: 'Sahte uyum için susmayı reddetme, evlilik ve ilişki tabularını yıkma.',
    rawAuthenticity: 'Boyun eğmeyen bir adalet arayışı, eşit ve maskesiz bir aşk için sahte dengeleri bozma gücü.'
  },
  'Akrep': {
    tabooTheme: 'Yasak arzular, ölüm ve cinsellik tabuları, gücü doğrudan talep etme.',
    rawAuthenticity: 'Büyüleyici bir manyetizma, manipülasyonlara boyun eğmeme ve karanlığı aydınlatma kudreti.'
  },
  'Yay': {
    tabooTheme: 'Dogmalara, din adamlarına ve dar kalıplı inanç sistemlerine isyan.',
    rawAuthenticity: 'Sınır tanımayan bir özgürlük, kendi hakikatini arama cesareti ve evrensel bir göçebe ruh.'
  },
  'Oğlak': {
    tabooTheme: 'Geleneksel otoriteye ve katı bürokrasiye başkaldırı, statü oyunlarını reddetme.',
    rawAuthenticity: 'Kendi kurallarını koyma, kimseden onay beklemeden kendi zirvesini tek başına inşa etme kudreti.'
  },
  'Kova': {
    tabooTheme: 'Sürü psikolojisine isyan, normallik dayatmasını paramparça etme.',
    rawAuthenticity: 'Radikal bir özgünlük, toplumun ötesinde bir deha ve tavizsiz bir bireysel bağımsızlık.'
  },
  'Balık': {
    tabooTheme: 'Kurban rolünü reddetme, manevi manipülasyonlara ve suçluluk duygusuna başkaldırı.',
    rawAuthenticity: 'Sınırsız mistik güç, sezgilerini kimsenin onayına sunmama ve saf ilahi özgürlük.'
  }
};

const SYNASTRY_KARMIC_ASPECT_INTERPRETATIONS = {
  'Güneş-Kuzey Düğüm': {
    type: 'Ruh Eşi / İkiz Alev',
    desc: 'Güneş sahibi partner, Düğüm sahibinin bu hayattaki kadersel tekamülünü hızlandırır. Birlikteyken kendinizi geleceğe doğru büyüyor ve asıl kaderinizi yaşıyor gibi hissedersiniz.',
    significance: 'Çok Yüksek'
  },
  'Ay-Kuzey Düğüm': {
    type: 'Ruh Eşi / İkiz Alev',
    desc: 'Derin bir duygusal kadersel çekim. Ay partneri, Düğüm sahibine ruhsal huzur ve kadersel yuva hissi sunar; ilişkinin ilk anından itibaren birbirinizi çok iyi tanıyor gibi hissedersiniz.',
    significance: 'Çok Yüksek'
  },
  'Venüs-Kuzey Düğüm': {
    type: 'Ruh Eşi / İkiz Alev',
    desc: 'Klasik kadersel aşk işareti! Aşkınız sadece bir çekim değil, her iki ruhun da tekamülü için evren tarafından tasarlanmış ilahi bir hediyedir.',
    significance: 'Çok Yüksek'
  },
  'Güneş-Güney Düğüm': {
    type: 'Geçmiş Yaşam Bağlantısı',
    desc: 'Çok güçlü bir geçmiş yaşam tanışıklığı. Birbirinizi ilk gördüğünüz anda gelen aşinalık hissi; ancak bu hayatta eski bağımlılıkları aşmak ve yeni bir bilinçle sevmek sınavınızdır.',
    significance: 'Yüksek'
  },
  'Ay-Güney Düğüm': {
    type: 'Geçmiş Yaşam Bağlantısı',
    desc: 'Geçmiş yaşamlarda aile, eş veya çok yakın bir duygusal bağ paylaşılmış. Telepatik düzeyde bir anlayış vardır ancak geçmişin yaralarını birbirine yansıtmama dengesi kurulmalıdır.',
    significance: 'Yüksek'
  },
  'Venüs-Güney Düğüm': {
    type: 'Geçmiş Yaşam Bağlantısı',
    desc: 'Geçmiş yaşamda yarım kalmış bir aşk veya evlilik sözleşmesi. Bu hayatta o sevgiyi tamamlamak, borçları helalleşerek şifalandırmak için bir aradasınız.',
    significance: 'Yüksek'
  },
  'Satürn-Güneş': {
    type: 'Karmik Borç & Sınav',
    desc: 'Ciddi, ağırbaşlı ve zamanın testine tabi tutulan bir ilişki. Satürn partneri sorumluluk aşılar; sabır ve dürüstlük gösterildiğinde ömür boyu sürecek sarsılmaz bir kale inşa edilir.',
    significance: 'Yüksek'
  },
  'Satürn-Venüs': {
    type: 'Karmik Borç & Sınav',
    desc: 'Sonsuz sadakat ve evlilik taahhüdü işareti. Kolay ve yüzeysel bir flört değildir; karşılıklı olgunlaşma ve fedakarlıkla zaman geçtikçe kıymeti katlanan bir bağdır.',
    significance: 'Yüksek'
  },
  'Plüton-Güneş': {
    type: 'Kadersel Dönüşüm',
    desc: 'Karşı konulamaz, hipnotik bir manyetik çekim! Birbirinizin hayatına girdiğiniz andan itibaren hiçbir şey eskisi gibi kalmaz; egolar yıkılır ve ruhlar küllerinden doğar.',
    significance: 'Çok Yüksek'
  },
  'Plüton-Ay': {
    type: 'Kadersel Dönüşüm',
    desc: 'Duygusal derinliğin doruk noktası. Birbirinizin en gizli yaralarını ve bilinçaltı sırlarını anında görürsünüz; derin bir psikolojik şifa veya yoğun bir tutku bağıdır.',
    significance: 'Yüksek'
  },
  'Plüton-Venüs': {
    type: 'Kadersel Dönüşüm',
    desc: 'Aşkın en tutkulu, manyetik ve unutulmaz hali! Uzak kalamayacağınız kadar yoğun bir çekim vardır; güç savaşlarına girmeden saf sevgiye teslim olmak gerekir.',
    significance: 'Çok Yüksek'
  },
  'Şiron-Venüs': {
    type: 'Ruhsal Şifa',
    desc: 'Karşılıklı kalp yaralarını saran ilahi bir şifa bağı. Partneriniz sizin sevgiye olan inancınızı tazeler, geçmişteki aşk acılarını unutturur ve kalbinizi yeniden açar.',
    significance: 'Yüksek'
  },
  'Vertex-Güneş': {
    type: 'Ruh Eşi / İkiz Alev',
    desc: 'Kaderin kapısının açıldığı o an! Tesadüf süsü verilmiş kadersel bir karşılaşma; hayatınız bu insanla tanıştıktan sonra tamamen yeni bir yöne evrilir.',
    significance: 'Çok Yüksek'
  },
  'Vertex-Venüs': {
    type: 'Ruh Eşi / İkiz Alev',
    desc: 'Kaderin bir araya getirdiği iki aşık. Karşılaşma anından itibaren kaçınılmaz bir ruh sözleşmesi yürürlüğe girer.',
    significance: 'Çok Yüksek'
  }
};

module.exports = {
  KARMIC_NODE_AXIS_INTERPRETATIONS,
  KARMIC_SATURN_INTERPRETATIONS,
  KARMIC_PLUTO_INTERPRETATIONS,
  KARMIC_CHIRON_INTERPRETATIONS,
  KARMIC_VERTEX_INTERPRETATIONS,
  KARMIC_LILITH_INTERPRETATIONS,
  SYNASTRY_KARMIC_ASPECT_INTERPRETATIONS
};
