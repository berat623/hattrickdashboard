// Tüm Gezegenlerin 1-12 Evlerdeki Detaylı Astrolojik Açıklamaları

const PLANET_HOUSE_INTERPRETATIONS = {
  'Güneş': {
    1: 'Güneş 1. evde kişiliğinize muazzam bir canlılık, doğal bir liderlik karizması ve güçlü bir benlik bilinci katar. Hayata kendi damganızı vurmak istersiniz; başkalarının gölgesinde kalmak size göre değildir. İlk izleniminizde ışıldayan, özgüvenli ve yaşam enerjisi yüksek bir duruş sergilersiniz.',
    2: 'Güneş 2. evde dikkatinizi maddi güvenceye, somut değerlere ve kendi yeteneklerinizle para kazanmaya yöneltir. Maddi bağımsızlık sizin için bir özgüven meselesidir; kendi emeğinizle zenginlik ve kalıcı bir istikrar inşa etmek temel yaşam amacınız haline gelir.',
    3: 'Güneş 3. evde zihinsel canlılık, merak, etkileyici iletişim yeteneği ve geniş bir çevre kazandırır. Fikirlerinizle parlar, yazarlık, konuşmacılık veya ticaret yoluyla kendinizi güçlü şekilde ifade edersiniz. Kardeşler ve yakın çevreyle olan bağlarınız kimliğinizi besler.',
    4: 'Güneş 4. evde köklerinize, ailenize ve içsel mahremiyetinize derin bir bağlılık verir. Gerçek gücünüzü dış dünyanın gürültüsünde değil, kendi yuvanızın huzurunda ve içsel dünyanızda bulursunuz. Yaşamın ikinci yarısında çok daha köklü ve saygın bir konuma ulaşırsınız.',
    5: 'Güneş 5. evde kendi doğal yuvasındadır! Yaratıcılık, sahne sanatları, aşk, flört ve hayattan keyif alma tutkunuz çok yüksektir. İçinizdeki çocuğu daima canlı tutar, risk almaktan ve yeteneklerinizi cömertçe sergileyip alkış toplamaktan büyük haz duyarsınız.',
    6: 'Güneş 6. evde çalışma ahlakınızı, hizmet etme bilincinizi ve günlük rutinlerdeki ustalığınızı parlatır. İşinizi mükemmel yapmak, detayları kusursuzca düzenlemek ve başkalarına somut fayda sağlamak sizin için en büyük tatmin kaynağıdır. Sağlık ve beden disiplini hayatınızın temel direğidir.',
    7: 'Güneş 7. evde kimliğinizi ve yaşam amacınızı ikili ilişkiler ve ortaklıklar aynasında keşfetmenizi sağlar. Güçlü, karizmatik ve saygın partnerlere çekilirsiniz; evlilik ve iş ortaklıkları hayatınızın en büyük büyüme ve kendini tanıma sahasıdır.',
    8: 'Güneş 8. evde derin bir psikolojik zeka, krizleri aşma gücü ve görünmeyenin ardındaki sırları çözme merakı verir. Hayatınız boyunca büyük dönüşümlerden geçer ve her krizden küllerinizden yeniden doğarak çıkarsınız. Finansal ortaklıklar ve okült konular ilginizi çeker.',
    9: 'Güneş 9. evde yüksek felsefe, uluslararası ufuklar, akademi, inanç ve uzak seyahat tutkusunu aydınlatır. Hayatın anlamını arayan bilge bir ruha sahipsinizdir; sınırları aşmak, yeni kültürler tanımak ve bir vizyon insanı olmak sizin kadersel çağrınızdır.',
    10: 'Güneş 10. evde haritanın en parlak zirvesindedir! Kariyerde başarı, toplumda yüksek saygınlık, liderlik makamı ve kalıcı bir iz bırakma arzusu çok güçlüdür. Otorite figürü olmak, kendi alanınızda en tepeye tırmanmak sizin için doğal bir varoluş biçimidir.',
    11: 'Güneş 11. evde sosyal ideallerinizi, dostluklarınızı ve kolektif projelere liderlik etme yeteneğinizi öne çıkarır. Toplumu ileriye taşıyacak dernekler, gruplar ve vizyoner hedefler içinde yer alarak ışıldarsınız. Geleceğe dair umutlarınız ve geniş bir dostluk ağınız vardır.',
    12: 'Güneş 12. evde derin bir maneviyat, güçlü sezgiler ve içsel bir inziva bilgeliği verir. Ruhunuz sessizlikte, meditasyonda, sanatta ve perde arkasında çalışırken en büyük gücüne kavuşur. Egoyu aşarak evrensel bilinçle bütünleşen mistik bir yaşam yolculuğunuz vardır.'
  },
  'Ay': {
    1: 'Ay 1. evde son derece hassas, sezgisel ve duygularını doğrudan yüzünden ve beden dilinden yansıtan bir mizaç verir. İnsanların duygusal ihtiyaçlarını anında hissedersiniz; sıcak, besleyici ve şefkatli tavrınızla girdiğiniz her ortamda güven uyandırırsınız.',
    2: 'Ay 2. evde duygusal huzurunuzun maddi güvenceye ve somut değerlere sıkı sıkıya bağlı olduğunu gösterir. Birikim yapmak ve sevdiklerinizin ihtiyaçlarını karşılamak size içsel bir sükunet verir. Gelir kaynaklarınızda zaman zaman dalgalanmalar olsa da bereketiniz yüksektir.',
    3: 'Ay 3. evde zihninizi duygularınızla ve güçlü sezgilerinizle besler. İletişim kurarken sadece mantığınızla değil, kalbinizle konuşursunuz. Hafızanız son derece kuvvetlidir; geçmiş anılar, aile hikayeleri ve yakın çevreyle olan duygusal bağlar sizin için çok kıymetlidir.',
    4: 'Ay 4. evde kendi tahtındadır! Ev, yuva, anne bağı ve kökler hayatınızın en kutsal sığınağıdır. Kendi evinizde huzurlu bir atmosfer yaratmak, sevdiklerinize güvenli bir liman sunmak ve manevi köklerinize sarılmak ruhunuzu besleyen en temel unsurdur.',
    5: 'Ay 5. evde aşka, çocuklara ve yaratıcı sanatlara çocuksu ve tutkulu bir duygusal bağ kazandırır. Aşık olduğunuzda tüm kalbinizle bağlanır, sevginizi şiirsel, sanatsal veya romantik sürprizlerle ifade edersiniz. Sevinç ve coşku ruhunuzun ilacıdır.',
    6: 'Ay 6. evde başkalarına hizmet etme, yardım eli uzatma ve günlük yaşamı düzene sokma arzusunu duygusal bir tatmine dönüştürür. Çalışma ortamınızdaki huzur sağlığınızı doğrudan etkiler. Şifacılık, beslenme, sağlık ve evcil hayvan bakımı ruhunuza çok iyi gelir.',
    7: 'Ay 7. evde duygusal dengenizi ikili ilişkilerde bulduğunuzu gösterir. Şefkatli, koruyucu ve duygularınızı anlayan bir hayat arkadaşına derin bir ihtiyaç duyarsınız. Evlilikte empati ve duygusal güvenlik sizin vazgeçilmez temel şartınızdır.',
    8: 'Ay 8. evde muazzam bir sezgisel ve telepatik güç, derin bir psikolojik algı ve gizemli duygular verir. İnsanların sakladığı niyetleri anında hissedersiniz. Duygusal krizler yaşasanız da her defasında ruhsal olarak arınır ve çok daha bilgeleşirsiniz.',
    9: 'Ay 9. evde ruhsal inançlara, felsefeye ve yabancı diyarlara duygusal bir aidiyet hissi kazandırır. Uzak seyahatler, farklı kültürler ve manevi öğretiler ruhunuzu besler. Evrensel bir hakikat arayışıyla hayatın anlamına duygusal olarak bağlanırsınız.',
    10: 'Ay 10. evde mesleğinizde ve toplumsal duruşunuzda halkın sevgisini, popülariteyi ve güven hissini getirir. İnsanlara şefkatle dokunan, kadınlarla veya halkla ilişkili alanlarda parlayan bir kariyeriniz olur. Saygınlığınız duygusal zekanızdan beslenir.',
    11: 'Ay 11. evde arkadaş gruplarında ve sosyal çevrede anaç, birleştirici ve koruyucu bir bağ kurmanızı sağlar. Dostlarınız sizin aileniz gibidir; hümanist idealler ve ortak gelecek hayalleri ruhunuzu motive eder.',
    12: 'Ay 12. evde sınırsız bir empati, derin bir rüya dünyası ve evrensel bir şefkat hazinesi saklar. Başkalarının acılarını kendi içinizde hissedebilirsiniz. Yalnız kalarak ruhunuzu dinlendirmek, dua ve meditasyon sizin en büyük şifa kaynağınızdır.'
  },
  'Merkür': {
    1: 'Merkür 1. evde keskin bir zeka, hızlı konuşma kabiliyeti, meraklı bakışlar ve genç kalan dinamik bir zihniyet verir. Her şeyi öğrenmek, sorular sormak ve fikirlerinizi anında paylaşmak istersiniz. Zihinsel çevikliğiniz kişiliğinizin en belirgin imzasıdır.',
    2: 'Merkür 2. evde ticari zeka, parayı yönetme becerisi ve fikirleri somut kazanca dönüştürme yeteneği kazandırır. Zihniniz sürekli üretken finansal planlar yapar; kelimeleriniz ve iletişim kabiliyetiniz en büyük sermayenizdir.',
    3: 'Merkür 3. evde kendi yönetim alanındadır! Üstün bir dil yeteneği, hızlı öğrenme, yazarlık dehası ve kıvrak bir zihinsel esneklik verir. Bilgi akışının merkezinde yer alır, kardeşler ve yakın çevreyle sürekli fikir alışverişinde bulunursunuz.',
    4: 'Merkür 4. evde ev ortamınızda zengin bir kütüphane, derin sohbetler ve ailevi araştırmalar yaratır. Evinizde çalışmaktan, okumaktan ve köklerinizin tarihini öğrenmekten keyif alırsınız. Zihniniz güvenlik ve huzur bulduğu ortamda en yüksek verimine ulaşır.',
    5: 'Merkür 5. evde zekanızı yaratıcı oyunlara, mizaha, sahne sanatlarına ve eğlenceli sohbetlere döker. Kelime oyunlarında ustasınızdır; aşkta flörtöz, esprili ve zihinsel olarak sizi heyecanlandıran partnerlere çekilirsiniz.',
    6: 'Merkür 6. evde üstün bir analiz kabiliyeti, detaycılık, eleştirel düşünce ve mükemmel problem çözme gücü sunar. İş ortamınızda karmaşık süreçleri basitleştirir, verimlilik ve organizasyon dehanızla aranılan vazgeçilmez bir uzman olursunuz.',
    7: 'Merkür 7. evde zihinsel uyumun evlilik ve ortaklıklardaki hayati önemini vurgular. Birlikte saatlerce konuşabileceğiniz, tartışabileceğiniz ve fikirlerinizi paylaşabileceğiniz zeki bir eş ararsınız. Müzakere ve diplomasi yeteneğiniz çok kuvvetlidir.',
    8: 'Merkür 8. evde araştırmacı bir dedektif zihni, psikolojik derinlik ve sırların ardını görme yeteneği bahşeder. Yüzeysel konuşmalardan nefret eder, tabu konuları, gizemleri ve finansal ortaklıkların matematiksel dengesini ustalıkla çözersiniz.',
    9: 'Merkür 9. evde felsefe, yabancı diller, hukuk, akademi ve uluslararası yayıncılık alanlarında geniş bir zihinsel vizyon verir. Büyük resmi görme kabiliyetiniz yüksektir; fikirlerinizi evrensel ilkelere dayandırarak aktarmayı seversiniz.',
    10: 'Merkür 10. evde kariyerinizde konuşmacılık, danışmanlık, yöneticilik veya medya alanında söz sahibi olmanızı sağlar. Toplum sizi aklınızla, stratejik kararlarınızla ve net iletişiminizle tanır ve takdir eder.',
    11: 'Merkür 11. evde vizyoner fikirleri olan gruplar, entelektüel çevreler ve toplumsal projeler içinde zihinsel liderlik verir. Arkadaşlarınızla beyin fırtınaları yapmak ve geleceğin projelerini tasarlamak sizin en büyük tutkunuzdur.',
    12: 'Merkür 12. evde telepatik bir sezgi, bilinçaltı kavrayışı ve sembollerle düşünen sanatsal bir zihin verir. Mantığınız kelimelerin ötesindeki anlamları yakalar; şiir, psikoloji, rüya analizi ve gizli araştırmalarda üstün bir kavrayışa sahipsinizdir.'
  },
  'Venüs': {
    1: 'Venüs 1. evde doğal bir güzellik, çekicilik, zarafet ve diplomatik bir tatlı dillilik verir. İnsanlar yanınızda kendilerini rahat ve değerli hisseder; estetik duruşunuz, giyim zevkiniz ve güler yüzünüz ilk andan itibaren hayranlık uyandırır.',
    2: 'Venüs 2. evde kendi burcunun gücündedir! Maddi bolluk, konfor, lüks zevkler ve sağlam bir özdeğer duygusu kazandırır. Sanat, güzellik, gastronomi ve finans yoluyla kolaylıkla servet biriktirme şansına sahipsinizdir.',
    3: 'Venüs 3. evde tatlı dilli, zarif ve barışçıl bir iletişim tarzı kazandırır. Kelimeleriniz insanları büyüler; yazarlık, müzik ve sosyal ilişkilerde büyük bir çekiciliğiniz vardır. Yakın çevreniz ve kardeşlerinizle sevgi dolu bir bağ paylaşırsınız.',
    4: 'Venüs 4. evde evinizde saray gibi zarif, estetik ve konforlu bir atmosfer kurmanızı sağlar. Ailenizle bir arada olmak, evinize güzel eşyalar seçmek ve sevdiklerinize lezzetli sofralar kurmak size derin bir huzur verir.',
    5: 'Venüs 5. evde romantizmin, aşkın, flörtün ve yaratıcı sanatların zirvesindedir! Hayatı bir sanat eseri gibi yaşarsınız; aşk sizin en büyük ilham kaynağınızdır. Çekiciliğinizle sahnede ve sosyal hayatta göz kamaştırırsınız.',
    6: 'Venüs 6. evde çalışma ortamınıza zarafet, barış ve uyum getirir. İş arkadaşlarınızla harika ilişkiler kurar, işinizi sevgiyle ve estetik bir özenle yaparsınız. Sağlık, güzellik ve bakım alanlarında başarılı olursunuz.',
    7: 'Venüs 7. evde kendi evindedir! Evlilikte, aşktan doğan kalıcı bir uyum ve karşılıklı derin bir saygı vadeder. Eşiniz genellikle çekici, zarif, adil ve hayatınıza neşe katan bir ruhtur. İkili ilişkilerde sevgiyle büyürsünüz.',
    8: 'Venüs 8. evde derin, tutkulu, manyetik ve dönüştürücü bir aşk anlayışı verir. Yüzeysel sevemezsiniz; sevdiğinizde ruhunuzun en derin köşeleriyle bağlanırsınız. Ortak finansal kaynaklarda ve miras konularında büyük şans getirir.',
    9: 'Venüs 9. evde yabancı kültürlere, uzak seyahatlere, sanata ve felsefeye derin bir sevgi verir. Farklı bir ülkeden veya kültürden biriyle evlenme veya uluslararası alanda sanat ve diplomasi yoluyla başarı yakalama potansiyeliniz yüksektir.',
    10: 'Venüs 10. evde kariyerinizde saygınlık, popülarite, diplomatik başarı ve üst düzey ilişkiler sağlar. Toplum sizi zarafetinizle ve adaletli duruşunuzla sever; moda, sanat, halkla ilişkiler veya yönetimde parıldarsınız.',
    11: 'Venüs 11. evde sosyal çevrenizde çok sevilen, popüler ve aranan bir dost olmanızı sağlar. Arkadaşlarınız genellikle sanatçı, zarif ve destekleyici insanlardır. Toplumsal iyilik ve güzellik projelerinde sevgiyle yer alırsınız.',
    12: 'Venüs 12. evde koşulsuz ve ilahi bir aşk anlayışı, mistik bir zarafet ve gizli romantizm zenginliği verir. Başkalarına karşılık beklemeden yardım eder, sevginizi sessiz ama çok derin bir şefkatle sunarsınız.'
  },
  'Mars': {
    1: 'Mars 1. evde sınırsız bir fiziksel enerji, cesaret, doğrudanlık ve savaşçı bir yaşam azmi katar. Meydan okumalardan asla kaçmaz, hedefinize dosdoğru ve hızla koşarsınız. Kararlı duruşunuz ve gözü pekliğinizle etrafınıza liderlik edersiniz.',
    2: 'Mars 2. evde para kazanma ve kendi kaynaklarını savunma konusunda hırslı ve mücadeleci bir enerji verir. Finansal hedeflerinize ulaşmak için çok çalışırsınız; ancak dürtüsel harcamalara karşı bilinçli olmanız gerekir.',
    3: 'Mars 3. evde keskin, doğrudan, tartışmacı ve cesur bir iletişim tarzı sunar. Düşündüğünüzü hiç çekinmeden söylersiniz; zihinsel hızınız ve refleksleriniz olağanüstüdür. Ticari girişimlerde ve kısa seyahatlerde çok aktifsizdir.',
    4: 'Mars 4. evde yuva ve aile alanında güçlü bir koruma içgüdüsü ama zaman zaman içsel gerilimler yaratır. Kendi hanenizin reisi ve savunucusu olursunuz; evinizde fiziksel olarak aktif olmak ve tadilat işleriyle uğraşmak enerjinizi dengeler.',
    5: 'Mars 5. evde aşka, spora, rekabete ve yaratıcı projelere muazzam bir tutku ve ateş katar. Aşkta cesur bir avcısınızdır; risk almaktan, sahnede olmaktan ve adrenalini hissetmekten büyük zevk alırsınız.',
    6: 'Mars 6. evde dur durak bilmeyen bir çalışma temposu, iş ahlakı ve zorlukları aşma kararlılığı verir. En zor görevlerin altından bile tek başınıza kalkarsınız; ancak bedeninizi aşırı yormamaya ve iş stresini kontrol etmeye dikkat etmelisiniz.',
    7: 'Mars 7. evde ikili ilişkilerde dinamik, tutkulu ama zaman zaman rekabetçi bir ortaklık yapısı gösterir. Güçlü, mücadeleci ve karakterli partnerlere çekilirsiniz; ilişkideki kıvılcımı tartışmalar yerine ortak hedeflere yönlendirmek harika sonuç verir.',
    8: 'Mars 8. evde muazzam bir psikolojik dayanıklılık, krizleri cesaretle yönetme gücü ve yüksek bir cinsel çekim verir. En zorlu hayat fırtınalarından bile yenilmeden, güçlenerek çıkarsınız; finansal mücadelelerde stratejik bir dehanız vardır.',
    9: 'Mars 9. evde inançları, idealleri ve dünya görüşü için cesurca savaşan bir hakikat savaşçısı yaratır. Uzak seyahatler, maceralar ve yüksek felsefe peşinde koşmaktan asla vazgeçmezsiniz.',
    10: 'Mars 10. evde kariyerde zirveye tırmanmak için durdurulamaz bir azim, hırs ve liderlik kudreti verir. Otorite kurar, kendi alanınızda öncü bir girişimci olur ve engelleri cesaretle aşarak kalıcı bir zafer elde edersiniz.',
    11: 'Mars 11. evde toplumsal davalar, devrimci hedefler ve arkadaş grupları içinde öncü bir eylem liderliği sunar. Geleceği inşa etmek için insanları organize eder ve haksızlıklara karşı kolektif bir cesaret sergilersiniz.',
    12: 'Mars 12. evde enerjisini perde arkasında, derin stratejilerde ve ruhsal mücadelelerde kullanan bir güç verir. Öfkenizi dışarı saçmak yerine içsel bir disipline dönüştürür; gizli rakipleri ve görünmeyen engelleri sessizce alt edersiniz.'
  },
  'Jüpiter': {
    1: 'Jüpiter 1. evde şansın, bereketin, neşenin ve bilgeliğin kişiliğinizde parlamasını sağlar. Cömert, iyimser ve etrafına umut saçan bir duruşunuz vardır; hayat size kapılarını kolaylıkla açar ve adınız saygıyla anılır.',
    2: 'Jüpiter 2. evde maddi zenginlik, kazanç kapılarının ardına kadar açılması ve kalıcı bolluk bereketi getirir. Para kazanma konusunda doğal bir şansınız vardır; cömert davrandıkça evren size fazlasıyla geri verir.',
    3: 'Jüpiter 3. evde zihinsel zenginlik, yazarlık, eğitim, medya ve ticarette büyük fırsatlar sunar. Sözleriniz insanlara umut aşılar; geniş bir network ve şanslı yolculuklar hayatınızı renklendirir.',
    4: 'Jüpiter 4. evde ailede büyük bereket, geniş ve ferah bir ev, atalardan gelen manevi ve maddi koruma sağlar. Yuvanız huzur ve bereket dolu bir mabettir; hayatınızın son dönemleri çok daha zengin geçer.',
    5: 'Jüpiter 5. evde aşkta büyük şans, yaratıcı sanatlarda parlayan başarı, sağlıklı ve hayırlı evlatlar bahşeder. Hayatın neşesini yaşamayı bilir, eğlenceli ve şanslı fırsatlarla karşılaşırsınız.',
    6: 'Jüpiter 6. evde çalışma hayatında hızla yükselme, iyi niyetli meslektaşlar ve sağlıkta güçlü bir toparlanma yeteneği verir. Başkalarına yardım eden, hizmeti bilgeliğe dönüştüren bir kariyere sahip olursunuz.',
    7: 'Jüpiter 7. evde evlilikte büyük şans, soylu, cömert, varlıklı ve bilge bir hayat arkadaşı müjdeler. Ortaklıklar yoluyla zenginleşir, ikili ilişkiler sayesinde toplumda büyük saygınlık kazanırsınız.',
    8: 'Jüpiter 8. evde ortak finansal kaynaklarda, mirasta ve krizleri aşmada ilahi bir koruma sunar. Derin okült ilimlerde ve psikolojide usta bir kavrayışınız vardır; krizler sizin için birer zenginleşme basamağıdır.',
    9: 'Jüpiter 9. evde kendi asıl tahtındadır! Uluslararası alanda büyük şans, akademik başarı, bilge bir hayat felsefesi ve ilahi bir manevi rehberlik getirir. Hayatınız bir keşif ve bilgelik yolculuğudur.',
    10: 'Jüpiter 10. evde kariyerde en yüksek makamlara ulaşma, toplum önünde büyük saygınlık ve saygı duyulan bir otorite olma şansı verir. Mesleğinizde herkesin sevdiği, adil bir lider olursunuz.',
    11: 'Jüpiter 11. evde tüm hayallerinizin ve gelecek umutlarınızın gerçekleşme potansiyelini katlar. Varlıklı ve vizyoner dostlar edinir, toplumsal projelerde büyük başarılar elde edersiniz.',
    12: 'Jüpiter 12. evde ilahi bir görünmez koruyucu melek etkisi yaratır! En zor anlarda bile mucizevi bir şekilde kurtulursunuz; manevi derinliğiniz, sezgileriniz ve içsel huzurunuz sonsuz bir hazinedir.'
  },
  'Satürn': {
    1: 'Satürn 1. evde erken yaşta olgunlaşma, ağırbaşlılık, ciddiyet ve sarsılmaz bir sorumluluk bilinci kazandırır. Hayatınızın ilk yılları sınavlarla dolu olsa da zaman geçtikçe büyük bir saygınlık, bilgelik ve kalıcı bir otorite inşa edersiniz.',
    2: 'Satürn 2. evde maddi kaynakları yönetirken sabrı, tutumluluğu ve özdeğeri inşa etmeyi öğretir. Emek vermeden gelen paraya güvenmez, adım adım biriktirerek ömür boyu yıkılmayacak kalıcı bir servet kurarsınız.',
    3: 'Satürn 3. evde zihinsel disiplin, derin ve analitik düşünme, ciddiyetle konuşma ve doğru bilgiye odaklanma yeteneği verir. Sözleriniz ağırlık taşır; usta bir araştırmacı, yazar veya uzman olursunuz.',
    4: 'Satürn 4. evde aile sorumluluklarının erken yaşta omuzlarınıza binmesini simgeler. Kendi içsel güvenliğinizi ve yuvanızı sabırla inşa edersiniz; olgunluk döneminde ailenin en güvenilir direği haline gelirsiniz.',
    5: 'Satürn 5. evde aşka ve eğlenceye karşı ciddiyetle yaklaşmanızı sağlar. Geçici hevesler peşinde koşmaz, kalıcı ve derin sevgiler ararsınız. Yaratıcı yetenekleriniz disiplinli çalışmayla olgunlaşarak büyük bir ustalığa dönüşür.',
    6: 'Satürn 6. evde iş ahlakının, göreve adanmışlığın ve çalışma disiplininin doruk noktasıdır. En zorlu görevleri sabırla tamamlar, işinizde benzersiz bir uzmanlık kazanır ve vazgeçilmez bir yönetici olursunuz.',
    7: 'Satürn 7. evde evliliğe ve ortaklıklara kutsal bir sorumluluk gibi yaklaşmanızı sağlar. Genellikle olgun yaşta veya kendinizden yaşça büyük, sorumluluk sahibi biriyle evlenirsiniz; bu evlilik zamanla çelik gibi sağlamlaşır.',
    8: 'Satürn 8. evde derin korkularla yüzleşme, ortak kaynakları titizlikle yönetme ve ruhsal krizleri aşma sabrı verir. Yaşamın karanlık ve gizemli yönlerini ciddiyetle araştırır ve içsel bir çelik zırh kazanırsınız.',
    9: 'Satürn 9. evde inançları ve hayat görüşünü sağlam temellere oturtma disiplini getirir. Dogmatik inanışları reddeder, bilgelik yolunda adım adım yürüyerek saygın bir akademisyen veya felsefeci olursunuz.',
    10: 'Satürn 10. evde kendi burcunun kudretindedir! Kariyerde zirveye ulaşmak için muazzam bir azim, sabır ve ahlak verir. Kolay yoldan değil, alın teriyle en tepeye tırmanır ve toplumda silinmez bir iz bırakırsınız.',
    11: 'Satürn 11. evde az ama öz, sarsılmaz dostluklar kurmanızı sağlar. Sosyal hedeflerinize ve ideallerinize sabırla yürür, kurumsal yapılarda veya toplumsal organizasyonlarda güvenilir bir yapı kurucu olursunuz.',
    12: 'Satürn 12. evde geçmiş karmik borçların arınmasını, içsel yalnızlıkta güçlenmeyi ve derin bir manevi disiplini gösterir. Yalnız kaldığınızda ruhunuzun efendisi olur, perde arkasında büyük işler başarırsınız.'
  },
  'Uranüs': {
    1: 'Uranüs 1. evde son derece özgün, sıra dışı, bağımsız ve kuralları yıkan devrimci bir kişilik verir. Kimseye benzemezsiniz; elektrikli auranız, yenilikçi fikirleriniz ve ani kararlarınızla insanları şaşırtırsınız.',
    2: 'Uranüs 2. evde finansal alanda ani iniş çıkışlar, beklenmedik kazanç kapıları ve teknoloji veya yenilikçi yollarla para kazanma fırsatları sunar. Geleneksel para sistemlerine bağlı kalmaz, özgürlüğünüzü her şeyin üstünde tutarsınız.',
    3: 'Uranüs 3. evde deha düzeyinde zihinsel kıvılcımlar, vizyoner fikirler ve kalıpların ötesinde bir iletişim tarzı verir. Yazılım, yapay zeka, bilim ve icatlara büyük ilgi duyarsınız.',
    4: 'Uranüs 4. evde geleneksel aile kalıplarının ötesinde, özgür ve sıradışı bir ev ortamı yaratır. Evinizde teknoloji ve modernlik hakimdir; sık sık yer değiştirme veya sıradışı bir mekanda yaşama isteği duyabilirsiniz.',
    5: 'Uranüs 5. evde aşkta ani başlangıçlar, sıradışı partnerler ve tabuları yıkan sanatsal yaratıcılık verir. Aşkta özgürlüğünüz kısıtlandığında kaçarsınız; yaratıcı projeleriniz çığır açıcıdır.',
    6: 'Uranüs 6. evde geleneksel 9-5 mesai düzenine başkaldırı ve teknolojik, serbest çalışma ortamlarında başarı getirir. Alternatif sağlık yöntemleri ve teknolojik inovasyonlar işinizin parçası olur.',
    7: 'Uranüs 7. evde evlilikte ve ortaklıklarda bağımsızlığın ve karşılıklı özgürlük alanının korunmasını şart koşar. Partneriniz genellikle sıradışı, dahi ruhlu, entelektüel ve özgürlüğüne düşkün biridir.',
    8: 'Uranüs 8. evde metafizik uyanışlar, okült alanlarda ani aydınlanmalar ve ortak finansal kaynaklarda beklenmedik sürprizler yaratır. Krizleri beklenmedik yaratıcı çözümlerle aşarsınız.',
    9: 'Uranüs 9. evde dogmatik inançları yıkan, evrensel bilinci ve uzay çağının felsefesini kucaklayan devrimci bir zihin sunar. Sıradışı uzak seyahatler ufkunuzu açar.',
    10: 'Uranüs 10. evde kariyerinizde ani sıçramalar, teknoloji, havacılık, bilim veya devrimci sektörlerde öncülük vadeder. Otoriteye boyun eğmez, kendi kurallarınızı koyarak fark yaratırsınız.',
    11: 'Uranüs 11. evde kendi asıl yuvasındadır! Küresel vizyon, insaniyet idealleri, aktivizm ve vizyoner dostlukların merkezinde yer alırsınız. Geleceğin dünyasını inşa eden grupların liderisinizdir.',
    12: 'Uranüs 12. evde bilinçaltında ani aydınlanmalar, geleceği sezen rüyalar ve özgürleşme tutkusu saklar. Gizli sezgisel dehanızla krizleri mucizevi şekilde öngörürsünüz.'
  },
  'Neptün': {
    1: 'Neptün 1. evde büyüleyici, gizemli, rüya gibi bir aura ve tarifsiz bir çekicilik kazandırır. Bakışlarınız derin ve anlamlıdır; sınırları belirsiz bir empatiyle herkesin hissiyatını üzerinize çekersiniz.',
    2: 'Neptün 2. evde paraya ruhsal ve manevi bir anlam yüklemenizi sağlar. Sanat, müzik, sinema ve şifa yoluyla sezgisel kazançlar elde edersiniz; ancak maddi konularda gerçekçi hesaplar yapmaya özen göstermelisiniz.',
    3: 'Neptün 3. evde şiirsel bir zihin, telepatik bir sezgi ve kelimelerle büyüleme yeteneği bahşeder. Düşünceleriniz mantıktan ziyade hayaller ve sembollerle işler; sanatsal yazarlıkta parıldarsınız.',
    4: 'Neptün 4. evde evinizde huzurlu bir tapınak ve ruhsal bir sığınak arayışı verir. Ailenize karşı koşulsuz bir sevgi beslersiniz; su kenarında veya mistik bir atmosferde yaşamak ruhunuza iyi gelir.',
    5: 'Neptün 5. evde romantizmin ve sanatsal ilhamın doruk noktasıdır. Aşkı bir masal gibi yaşamak istersiniz; sinema, müzik, resim veya tiyatroda muazzam bir ilham akışına sahipsinizdir.',
    6: 'Neptün 6. evde çalışma hayatında şifa, sanat ve başkalarına fedakarca yardım etme isteği verir. Alternatif tıp, psikoloji ve şifa sanatlarında usta olursunuz; stresli ortamlardan uzak durmalısınız.',
    7: 'Neptün 7. evde ruh eşinizi arama arzusu çok güçlüdür. Evlilikte koşulsuz sevgi ve ruhsal bir bütünleşme beklersiniz; partnerinizi idealleştirmeden, olduğu gibi sevmeyi öğrenmek en büyük dersinizdir.',
    8: 'Neptün 8. evde derin okült sezgiler, görünmeyenin ardındaki mistik sırlar ve psişik yetenekler sunar. Ortak paylaşımlarda sınırların eridiği, ruhsal olarak birbirine karışan derin bir bağ ararsınız.',
    9: 'Neptün 9. evde evrensel sevgiye dayanan yüksek bir inanç, mistik felsefeler ve sınırları aşan ilahi teslimiyet getirir. Uzak diyarlarda ruhsal aydınlanmalar yaşarsınız.',
    10: 'Neptün 10. evde kariyerinizde sanat, sinema, müzik, fotoğrafçılık, hayır kurumları veya şifa alanlarında ilham veren bir figür olmanızı sağlar. Toplum sizi ideallerinizle ve merhametinizle tanır.',
    11: 'Neptün 11. evde evrensel kardeşlik, insani yardım projeleri ve manevi idealleri paylaşan dostluklar kurmanızı sağlar. Dünyayı daha şefkatli bir yer yapma hayaliniz vardır.',
    12: 'Neptün 12. evde kendi kutsal mabedindedir! Sınırsız bir ilahi koruma, rüyalarda gelen rehberlikler, evrensel sevgi ve derin bir mistik deha bahşeder. Ruhunuz evrenle birdir.'
  },
  'Plüton': {
    1: 'Plüton 1. evde manyetik, sarsıcı, son derece güçlü ve gözleriyle insanın ruhunu delen bir varoluş verir. Bulunduğunuz odayı auranızla doldurursunuz; hiçbir kriz sizi yıkamaz, her darbeden sonra katbekat güçlenerek küllerinizden doğarsınız.',
    2: 'Plüton 2. evde maddi kaynaklar, servet ve özdeğer konusunda radikal dönüşümler yaratır. Yokluktan bile muazzam finansal imparatorluklar kurma kudretine sahipsinizdir; kendi değerinizi kimseden onay beklemeden tayin edersiniz.',
    3: 'Plüton 3. evde kelimeleriyle insanları dönüştüren, hipnotik bir konuşma ve derin bir psikolojik dedektif zihni verir. Yalanı milisaniyeler içinde anlarsınız; gizli araştırmalarda ve stratejik analizlerde rakipsizsinizdir.',
    4: 'Plüton 4. evde köklerin, ailenin ve bilinçaltının derin dönüşümünü simgeler. Ailenin geçmişten gelen karmik düğümlerini çözerek kendi içsel ve bağımsız kalenizi inşa edersiniz.',
    5: 'Plüton 5. evde aşkta derin, tutkulu, kıskanç ve dönüştürücü bir dinamik yaratır. Yüzeysel flörtler size göre değildir; aşık olduğunuzda hayatınız kökten değişir. Yaratıcılığınız sarsıcı ve büyüleyicidir.',
    6: 'Plüton 6. evde çalışma ortamında derin bir kontrol, dayanıklılık ve sistemleri kökten yenileme kudreti verir. Sağlığınızda krizleri mucizevi bir şekilde iyileştiren derin bir rejenerasyon gücünüz vardır.',
    7: 'Plüton 7. evde evlilik ve ortaklıklar yoluyla hayatınızın baştan aşağı dönüştüğünü gösterir. Güçlü, karizmatik ve ruhunuzu derinden sarsan partnerlere çekilirsiniz; güç savaşlarını aşıp saf güven inşa etmek ilişkinizi ölümsüzleştirir.',
    8: 'Plüton 8. evde kendi tahtındadır! Krizleri yönetme, okült sırlar, miraslar ve büyük finansal güç alanında sınırsız bir kudret verir. Korkusuz bir ruhunuz vardır; ölümün ötesindeki yeniden doğuş gerçeğini içsel olarak bilirsiniz.',
    9: 'Plüton 9. evde inanç sistemlerini, felsefi tabuları ve dünya görüşünü kökünden yıkarak dönüştürür. Hakikati en derinine kadar araştırır, felsefi dogmaları yıkan güçlü bir rehber olursunuz.',
    10: 'Plüton 10. evde kariyerde muazzam bir güç, karizma, liderlik ve zirveye ulaşma kudreti bahşeder. Çürümüş sistemleri yıkar, yerine sarsılmaz yeni yapılar kurarsınız; toplumda büyük bir otorite figürü haline gelirsiniz.',
    11: 'Plüton 11. evde toplumsal hareketler, devrimci gruplar ve kitlesel dönüşümlerde kilit bir güç olmanızı sağlar. Geleceği şekillendiren güçlü ve etkili insanlarla kadersel bağlar kurarsınız.',
    12: 'Plüton 12. evde bilinçaltındaki tüm korkuları, gölge benliği ve geçmiş yaşam karmalarını kökten arındırma gücü verir. En karanlık içsel süreçlerden muazzam bir aydınlanma ve manevi kudretle çıkarsınız.'
  }
};

module.exports = {
  PLANET_HOUSE_INTERPRETATIONS
};
