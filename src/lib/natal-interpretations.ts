// Astroloji.org tabanlı doğum haritası yorum arşivi

export const SIGN_MOTTOS: Record<string, string> = {
  "Koç": "Öncülük etmek, cesaret ve girişim ruhu.",
  "Boğa": "Sabırla inşa etmek, kalıcılık ve güven.",
  "İkizler": "Öğrenmek, aktarmak, merak ve iletişim.",
  "Yengeç": "Korumak, beslemek, şefkat ve duygusal bağlar.",
  "Aslan": "Işıldamak, yönetmek, yaratıcılık ve özgüven.",
  "Başak": "Düzenleyerek iyileştirmek, ustalık ve analiz.",
  "Terazi": "Uyum ve denge aramak, estetik ve adalet.",
  "Akrep": "Dönüştürmek ve derinleşmek, tutku ve sezgi.",
  "Yay": "Anlam aramak, vizyon ve keşif.",
  "Oğlak": "Sorumluluk almak, disiplin ve zirveye odaklanmak.",
  "Kova": "Yenilik getirmek, özgür düşünce ve vizyonerlik.",
  "Balık": "Bütünleşmek, empati, hayal gücü ve teslimiyet."
};

export const HOUSE_MEANINGS: Record<number, { title: string; desc: string }> = {
  "1": {
    "title": "1. Ev (Yükselen)",
    "desc": "Kişilik, dış görünüş, ilk izlenim ve hayata yaklaşım tarzı."
  },
  "2": {
    "title": "2. Ev",
    "desc": "Maddi kaynaklar, kişisel değerler, kazanma kapasitesi ve güven ihtiyacı."
  },
  "3": {
    "title": "3. Ev",
    "desc": "İletişim, yakın çevre, kardeşler, düşünce yapısı ve kısa yolculuklar."
  },
  "4": {
    "title": "4. Ev (Dip Noktası - IC)",
    "desc": "Ev, yuva, aile, kökler, içsel huzur ve geçmiş temelleri."
  },
  "5": {
    "title": "5. Ev",
    "desc": "Aşk, yaratıcılık, kendini ifade etme, çocuklar ve yaşam neşesi."
  },
  "6": {
    "title": "6. Ev",
    "desc": "Günlük rutinler, çalışma ortamı, sağlık ve hizmet etme bilinci."
  },
  "7": {
    "title": "7. Ev (Alçalan - DSC)",
    "desc": "İkili ilişkiler, evlilik, ortaklıklar ve karşılıklı taahhütler."
  },
  "8": {
    "title": "8. Ev",
    "desc": "Dönüşüm, ortak paylaşılan kaynaklar, krizler ve içsel güç."
  },
  "9": {
    "title": "9. Ev",
    "desc": "Yüksek öğrenim, felsefe, dünya görüşü, inançlar ve uzak seyahatler."
  },
  "10": {
    "title": "10. Ev (Tepe Noktası - MC)",
    "desc": "Kariyer, toplumsal statü, hedefler ve toplumdaki saygınlık."
  },
  "11": {
    "title": "11. Ev",
    "desc": "Sosyal çevre, arkadaş grupları, toplumsal idealler ve gelecek umutları."
  },
  "12": {
    "title": "12. Ev",
    "desc": "Bilinçdışı, içe çekilme, maneviyat, gizli yetenekler ve ruhsal şifa."
  }
};

export const ASPECT_MEANINGS: Record<string, string> = {
  "Kavuşum": "İki gezegenin enerjilerinin birleştiği, en güçlü ve doğrudan ifade bulan açı.",
  "Altmışlık": "Fırsatlar ve yeteneklerin rahatça aktığı, destekleyici ve uyumlu bir etkileşim.",
  "Kare": "Büyüme ve gelişim getiren, harekete geçirici yapıcı gerilim açısı.",
  "Üçgen": "Doğal akış, şans, ilham ve zahmetsizce çalışan yetenekler.",
  "Karşıt": "İki farklı kutup arasında denge kurma ve ilişkilerde farkındalık açısı."
};

export const PLANET_SIGN_INTERPRETATIONS: Record<string, Record<string, string[]>> = {
  "Güneş": {
    "Koç": [
      "Güneş Koç burcundayken girişim isteği ve hızlı hareket etme eğilimi artabilir.",
      "Bu süreçte bireysel kararlar ve cesaret gerektiren konular öne çıkabilir.",
      "Yeni başlangıçlar için cesaret daha kolay bulunabilir.",
      "Sabırsızlık artarken beklemek zorlaşabilir.",
      "Kendi yolunu çizme isteği güçlenebilir."
    ],
    "Boğa": [
      "Güneş Boğa burcundayken güvenlik ve istikrar ihtiyacı daha belirgin olabilir.",
      "Maddi konular ve konfor alanı daha fazla önem kazanabilir.",
      "Sakin ilerleme isteği hızdan daha önemli hale gelebilir.",
      "Sahip olunanları koruma eğilimi artabilir.",
      "Keyif veren rutinlere yönelim görülebilir."
    ],
    "İkizler": [
      "Güneş İkizler geçişlerinde iletişim ve bilgi akışı hızlanabilir.",
      "Merak duygusu artarken dikkat dağınıklığı da görülebilir.",
      "Öğrenme isteği artarken bir konuya odaklanmak zorlaşabilir.",
      "Sosyal çevreyle etkileşim ihtiyacı yükselebilir.",
      "Kısa seyahatler ve görüşmeler artabilir."
    ],
    "Yengeç": [
      "Güneş Yengeç burcundayken aile ve duygusal güven temaları öne çıkabilir.",
      "Geçmişle ilgili konular daha fazla gündeme gelebilir.",
      "Ev ve yuva konularına hassasiyet artabilir.",
      "Koruma içgüdüsü güçlenebilir.",
      "Duygusal bağlar daha fazla önem kazanabilir."
    ],
    "Aslan": [
      "Güneş Aslan burcundayken görünür olma ve kendini ifade etme isteği artabilir.",
      "Yaratıcılık ve özgüven daha güçlü hissedilebilir.",
      "Takdir edilme ihtiyacı yükselebilir.",
      "Sahneye çıkma cesareti artabilir.",
      "Kendi değerini gösterme isteği öne çıkabilir."
    ],
    "Başak": [
      "Güneş Başak etkisi düzen kurma ve detaylara odaklanma ihtiyacını artırabilir.",
      "Günlük yaşamı organize etme isteği güçlenebilir.",
      "Pratik çözümler arama eğilimi artabilir.",
      "Sağlık ve rutinlere dikkat yükselebilir.",
      "Küçük işleri tamamlama motivasyonu görülebilir."
    ],
    "Terazi": [
      "Güneş Terazi geçişlerinde ilişkiler ve denge arayışı öne çıkabilir.",
      "Ortak kararlar ve sosyal ilişkiler daha fazla önem kazanabilir.",
      "Uyum sağlama çabası artabilir.",
      "Estetik ve güzellik konularına ilgi yükselebilir.",
      "Kararsızlık zaman zaman görülebilir."
    ],
    "Akrep": [
      "Güneş Akrep burcundayken duygusal yoğunluk ve içsel dönüşüm temaları güçlenebilir.",
      "Gizli kalan konular daha görünür hale gelebilir.",
      "Derinleşme isteği artabilir.",
      "Sezgiler güçlenebilir.",
      "Kontrol ihtiyacı yükselebilir."
    ],
    "Yay": [
      "Güneş Yay burcundayken özgürlük isteği ve yeni deneyim arayışı artabilir.",
      "Eğitim, seyahat ve keşif temaları daha fazla dikkat çekebilir.",
      "İyimserlik artabilir.",
      "Ufku genişletme arzusu güçlenebilir.",
      "Detaylardan sıkılma eğilimi görülebilir."
    ],
    "Oğlak": [
      "Güneş Oğlak etkisi sorumluluk bilinci ve uzun vadeli hedefleri öne çıkarabilir.",
      "Disiplinli çalışma isteği güçlenebilir.",
      "Ciddiyet artabilir.",
      "Somut sonuç alma ihtiyacı yükselebilir.",
      "Sabırlı ilerleme eğilimi görülebilir."
    ],
    "Kova": [
      "Güneş Kova burcundayken yenilikçi fikirler ve özgür düşünce öne çıkabilir.",
      "Sosyal çevre ve topluluk konuları daha fazla önem kazanabilir.",
      "Bağımsızlık ihtiyacı artabilir.",
      "Farklı bakış açıları ilgi çekebilir.",
      "Geleneksel olana mesafe görülebilir."
    ],
    "Balık": [
      "Güneş Balık geçişlerinde sezgiler ve duygusal hassasiyet güçlenebilir.",
      "Hayal gücü ve içe dönüş ihtiyacı artabilir.",
      "Empati artabilir.",
      "Gerçeklerden uzaklaşma eğilimi görülebilir.",
      "Sanatsal ilham yükselebilir."
    ]
  },
  "Merkür": {
    "Koç": [
      "Merkür Koç burcundayken düşünceler daha hızlı ifade edilebilir.",
      "İletişimde doğrudanlık artarken sabırsız tepkiler görülebilir.",
      "Karar verme hızlanabilir.",
      "Tartışmalarda ani çıkışlar görülebilir.",
      "Fikirleri hemen uygulama isteği artabilir."
    ],
    "Boğa": [
      "Merkür Boğa etkisi daha sakin ve pratik düşünmeyi destekleyebilir.",
      "Karar süreçleri yavaş ama daha sağlam ilerleyebilir.",
      "Sabit fikirli yaklaşım görülebilir.",
      "Somut konulara odaklanma artabilir.",
      "Konuşmada yavaş ama net ifade görülebilir."
    ],
    "İkizler": [
      "Merkür İkizler geçişlerinde iletişim trafiği hızlanabilir.",
      "Yeni bilgiler öğrenme ve paylaşma isteği artabilir.",
      "Çoklu görev eğilimi görülebilir.",
      "Merak artabilir.",
      "Yüzeysel bilgi toplama riski oluşabilir."
    ],
    "Yengeç": [
      "Merkür Yengeç burcundayken duygusal düşünme eğilimi güçlenebilir.",
      "Geçmiş konuşmalar ve aile meseleleri gündeme gelebilir.",
      "Sezgisel iletişim artabilir.",
      "Alınganlık görülebilir.",
      "Hatıralara odaklanma yükselebilir."
    ],
    "Aslan": [
      "Merkür Aslan etkisi kendini daha güçlü ifade etme isteği yaratabilir.",
      "Düşünceler daha dramatik ve dikkat çekici şekilde aktarılabilir.",
      "Özgüvenli konuşma artabilir.",
      "Fikirleri savunma isteği güçlenebilir.",
      "Abartılı ifade görülebilir."
    ],
    "Başak": [
      "Merkür Başak geçişlerinde analiz gücü ve detaylara dikkat artabilir.",
      "Planlama ve organizasyon daha verimli ilerleyebilir.",
      "Eleştirel düşünme yükselebilir.",
      "Pratik çözümler bulunabilir.",
      "Mükemmeliyetçilik artabilir."
    ],
    "Terazi": [
      "Merkür Terazi burcundayken uzlaşma ve denge arayışı iletişime yansıyabilir.",
      "Karar vermek ise biraz daha uzun sürebilir.",
      "Diplomatik dil artabilir.",
      "Karşı tarafı dinleme isteği güçlenebilir.",
      "Tarafsız kalma çabası görülebilir."
    ],
    "Akrep": [
      "Merkür Akrep etkisi derin düşünme ve araştırma isteğini artırabilir.",
      "Gizli kalan bilgiler ortaya çıkabilir.",
      "Şüpheci yaklaşım görülebilir.",
      "Odaklanma güçlenebilir.",
      "Sır saklama eğilimi artabilir."
    ],
    "Yay": [
      "Merkür Yay burcundayken büyük fikirler ve uzak hedefler öne çıkabilir.",
      "Detaylardan çok genel bakış açısı önem kazanabilir.",
      "İyimser konuşma artabilir.",
      "Felsefi konulara ilgi yükselebilir.",
      "Dağınıklık görülebilir."
    ],
    "Oğlak": [
      "Merkür Oğlak geçişlerinde daha ciddi ve planlı düşünme eğilimi görülebilir.",
      "Uzun vadeli kararlar daha fazla önem kazanabilir.",
      "Kısa ve net iletişim artabilir.",
      "Ciddiyet görülebilir.",
      "Hedef odaklı konuşma yükselebilir."
    ],
    "Kova": [
      "Merkür Kova etkisi sıra dışı fikirleri ve farklı bakış açılarını güçlendirebilir.",
      "Teknoloji ve sosyal konular daha fazla konuşulabilir.",
      "Özgür düşünce artabilir.",
      "Geleneksel olana itiraz görülebilir.",
      "Geleceğe dönük fikirler yükselebilir."
    ],
    "Balık": [
      "Merkür Balık burcundayken sezgisel düşünme ve hayal gücü artabilir.",
      "Dalgınlık ve odak kaybı daha sık görülebilir.",
      "Empatik iletişim artabilir.",
      "Kararsızlık görülebilir.",
      "Sanatsal ifade güçlenebilir."
    ]
  },
  "Venüs": {
    "Koç": [
      "Venüs Koç burcundayken ilişkilerde hız ve heyecan arayışı artabilir.",
      "İlk adımı atma cesareti yükselebilir.",
      "Sabırsız sevgi gösterisi görülebilir."
    ],
    "Boğa": [
      "Venüs Boğa geçişlerinde güven ve duygusal istikrar ihtiyacı güçlenebilir.",
      "Konfor ve dokunsallık önem kazanabilir.",
      "Sadakat arayışı artabilir."
    ],
    "İkizler": [
      "Venüs İkizler etkisi sosyal iletişimi ve flört enerjisini artırabilir.",
      "Meraklı sohbetler ilişkileri canlandırabilir.",
      "Hafif ve eğlenceli bağlar tercih edilebilir."
    ],
    "Yengeç": [
      "Venüs Yengeç burcundayken duygusal yakınlık ihtiyacı artabilir.",
      "Sevdiklerinize daha fazla zaman ayırma isteği güçlenebilir.",
      "Koruyucu sevgi gösterisi görülebilir."
    ],
    "Aslan": [
      "Venüs Aslan geçişlerinde ilgi görme ve romantik jestler öne çıkabilir.",
      "Cömert sevgi ifadesi artabilir.",
      "Takdir edilme ihtiyacı yükselebilir."
    ],
    "Başak": [
      "Venüs Başak etkisi ilişkilerde detaylara ve küçük davranışlara önem verebilir.",
      "Hizmetle sevgi gösterme eğilimi görülebilir.",
      "Pratik destek önem kazanabilir."
    ],
    "Terazi": [
      "Venüs Terazi burcundayken ilişkilerde uyum ve denge arayışı güçlenebilir.",
      "Zarif etkileşimler artabilir.",
      "Ortak zevkler önem kazanabilir."
    ],
    "Akrep": [
      "Venüs Akrep geçişlerinde ilişkiler daha yoğun ve tutkulu hissedilebilir.",
      "Derin bağ kurma isteği artabilir.",
      "Kıskançlık görülebilir."
    ],
    "Yay": [
      "Venüs Yay burcundayken özgürlük ihtiyacı ve spontane davranışlar artabilir.",
      "Eğlenceli birliktelikler tercih edilebilir.",
      "Maceracı ruh yükselebilir."
    ],
    "Oğlak": [
      "Venüs Oğlak etkisi ilişkilerde ciddiyet ve güven arayışını artırabilir.",
      "Uzun vadeli bağlar önem kazanabilir.",
      "Sorumlulukla sevgi gösterme görülebilir."
    ],
    "Kova": [
      "Venüs Kova geçişlerinde bireysel alan ihtiyacı daha belirgin olabilir.",
      "Arkadaşça sevgi ön planda olabilir.",
      "Farklılıklara tolerans artabilir."
    ],
    "Balık": [
      "Venüs Balık burcundayken romantizm ve duygusal hassasiyet güçlenebilir.",
      "Fedakar sevgi eğilimi görülebilir.",
      "Hayalperest romantizm artabilir."
    ]
  },
  "Mars": {
    "Koç": [
      "Mars Koç burcundayken enerji seviyesi ve hızlı hareket etme isteği artabilir.",
      "Cesur girişimler görülebilir.",
      "Sabırsızlık artabilir."
    ],
    "Boğa": [
      "Mars Boğa geçişlerinde sabırlı ama kararlı ilerleme eğilimi görülebilir.",
      "İnatçılık artabilir.",
      "Süreklilik güçlenebilir."
    ],
    "İkizler": [
      "Mars İkizler etkisi aynı anda birçok konuya yönelme isteği yaratabilir.",
      "Zihinsel enerji yükselebilir.",
      "Dağınıklık görülebilir."
    ],
    "Yengeç": [
      "Mars Yengeç burcundayken duygusal tepkiler daha hızlı ortaya çıkabilir.",
      "Koruma içgüdüsüyle hareket artabilir.",
      "Alıngan savunma görülebilir."
    ],
    "Aslan": [
      "Mars Aslan geçişlerinde özgüven ve dikkat çekme isteği güçlenebilir.",
      "Gösterişli eylemler artabilir.",
      "Liderlik isteği yükselebilir."
    ],
    "Başak": [
      "Mars Başak etkisi çalışma temposunu ve üretkenliği artırabilir.",
      "Detaylara odaklı çaba görülebilir.",
      "Eleştirel enerji yükselebilir."
    ],
    "Terazi": [
      "Mars Terazi burcundayken ilişkiler içinde gerilimler daha görünür olabilir.",
      "Uzlaşma için mücadele artabilir.",
      "Kararsız eylem görülebilir."
    ],
    "Akrep": [
      "Mars Akrep geçişlerinde yoğun motivasyon ve güçlü odaklanma görülebilir.",
      "Derinlemesine çaba artabilir.",
      "Kontrol isteği yükselebilir."
    ],
    "Yay": [
      "Mars Yay burcundayken motivasyon ve hareket isteği artabilir.",
      "Yeni deneyimlere yönelme ve risk alma eğilimi güçlenebilir.",
      "Enerji daha özgür ve hızlı kullanılmak istenebilir."
    ],
    "Oğlak": [
      "Mars Oğlak burcundayken hedef odaklı çalışma isteği güçlenebilir.",
      "Disiplinli çaba artabilir.",
      "Sabırlı ilerleme görülebilir."
    ],
    "Kova": [
      "Mars Kova geçişlerinde bağımsız hareket etme isteği artabilir.",
      "Farklı yöntem deneme cesareti yükselebilir.",
      "İsyankar enerji görülebilir."
    ],
    "Balık": [
      "Mars Balık burcundayken enerji daha duygusal ve sezgisel kullanılabilir.",
      "Motivasyon dalgalanabilir.",
      "Fedakar çaba görülebilir."
    ]
  },
  "Ay": {
    "Koç": [
      "Ay Koç burcundayken duygusal tepkiler daha hızlı ortaya çıkabilir.",
      "Sabırsızlık hissedilebilir.",
      "Bağımsızlık ihtiyacı artabilir."
    ],
    "Boğa": [
      "Ay Boğa geçişlerinde huzur ve güven ihtiyacı artabilir.",
      "Konfora yönelim görülebilir.",
      "Sakinlik arayışı yükselebilir."
    ],
    "İkizler": [
      "Ay İkizler burcundayken sosyal iletişim ve hareketlilik artabilir.",
      "Merak duygusu yükselebilir.",
      "Değişken ruh hali görülebilir."
    ],
    "Yengeç": [
      "Ay Yengeç geçişlerinde duygusal hassasiyet daha yoğun hissedilebilir.",
      "Aile özlemi artabilir.",
      "Korunma ihtiyacı yükselebilir."
    ],
    "Aslan": [
      "Ay Aslan burcundayken görünür olma isteği ve duygusal ifade güçlenebilir.",
      "Takdir ihtiyacı artabilir.",
      "Cömert duygular görülebilir."
    ],
    "Başak": [
      "Ay Başak etkisi düzen kurma ihtiyacını artırabilir.",
      "Detaylara takılma görülebilir.",
      "Hizmet etme isteği yükselebilir."
    ],
    "Terazi": [
      "Ay Terazi geçişlerinde ilişkilerde uyum arayışı öne çıkabilir.",
      "Kararsızlık hissedilebilir.",
      "Zarif etkileşim ihtiyacı artabilir."
    ],
    "Akrep": [
      "Ay Akrep burcundayken duygular daha yoğun yaşanabilir.",
      "Sezgiler güçlenebilir.",
      "Mahremiyet ihtiyacı yükselebilir."
    ],
    "Yay": [
      "Ay Yay geçişlerinde özgürlük isteği ve iyimserlik artabilir.",
      "Keşif arzusu yükselebilir.",
      "Neşeli ruh hali görülebilir."
    ],
    "Oğlak": [
      "Ay Oğlak burcundayken duyguları kontrol etme eğilimi güçlenebilir.",
      "Ciddiyet artabilir.",
      "Güvenlik ihtiyacı yükselebilir."
    ],
    "Kova": [
      "Ay Kova geçişlerinde bireysel alan ihtiyacı daha belirgin olabilir.",
      "Sosyal bağlar önem kazanabilir.",
      "Özgür hissetme isteği artabilir."
    ],
    "Balık": [
      "Ay Balık burcundayken sezgiler ve empati gücü artabilir.",
      "Hassasiyet yükselebilir.",
      "Hayal kurma eğilimi görülebilir."
    ]
  }
};

export const RETRO_INTERPRETATIONS: Record<string, string[]> = {
  "Merkür": [
    "Merkür retrosunda iletişim ve planlama süreçlerinde gecikmeler yaşanabilir.",
    "Eski konuşmalar ve yarım kalan meseleler yeniden gündeme gelebilir.",
    "Teknolojik aksaklıklara karşı daha dikkatli olmak gerekebilir.",
    "Karar vermeden önce iki kez düşünme ihtiyacı artabilir.",
    "Geçmişten gelen mesajlar veya kişiler tekrar ortaya çıkabilir."
  ],
  "Venüs": [
    "Venüs retrosu ilişkiler ve maddi konularda geçmişi yeniden değerlendirme süreci yaratabilir.",
    "Eski ilişkiler veya duygusal meseleler tekrar hatırlanabilir.",
    "Harcamalarda daha temkinli olma ihtiyacı hissedilebilir.",
    "Değer verdiğiniz konuları sorgulama eğilimi artabilir.",
    "Estetik ve zevk konularında kararsızlık görülebilir."
  ],
  "Mars": [
    "Mars retrosunda motivasyon dalgalanmaları ve enerji düşüşleri görülebilir.",
    "Yarım kalan işleri tamamlama isteği güçlenebilir.",
    "Öfke kontrolü daha fazla önem kazanabilir.",
    "Eyleme geçmeden önce plan yapma ihtiyacı artabilir.",
    "Eski çatışmalar yeniden gündeme gelebilir."
  ],
  "Jüpiter": [
    "Jüpiter retrosu içsel büyüme ve geçmiş kararları değerlendirme süreci yaratabilir.",
    "İnançlar ve hayat görüşü sorgulanabilir.",
    "Büyük planlar yerine içe dönüş ihtiyacı artabilir.",
    "Geçmiş fırsatlar yeniden değerlendirilebilir.",
    "Öğrenme süreci daha içsel ilerleyebilir."
  ],
  "Satürn": [
    "Satürn retrosunda sorumluluklar ve uzun vadeli planlar yeniden gözden geçirilebilir.",
    "Geçmiş hatalardan ders çıkarma süreci güçlenebilir.",
    "Disiplin konularında içsel sorgulama artabilir.",
    "Ertelenen görevler tekrar önünüze gelebilir.",
    "Sabır testi yaşanabilir."
  ],
  "Uranüs": [
    "Uranüs retrosunda içsel değişim isteği daha belirgin hale gelebilir.",
    "Özgürlük ihtiyacını yeniden tanımlama süreci yaşanabilir.",
    "Ani kararlar yerine içsel hazırlık önem kazanabilir.",
    "Geçmişte bastırılan farklılıklar ortaya çıkabilir.",
    "Beklenmedik içsel farkındalıklar görülebilir."
  ],
  "Neptün": [
    "Neptün retrosunda belirsiz kalan konular daha net fark edilebilir.",
    "Hayaller ve gerçekler arasındaki fark daha görünür olabilir.",
    "Sezgiler güçlenirken kafa karışıklığı da artabilir.",
    "Geçmiş yanılgılarla yüzleşme yaşanabilir.",
    "İçe dönüş ve ruhsal arınma ihtiyacı artabilir."
  ],
  "Plüton": [
    "Plüton retrosu derin dönüşüm ve geçmiş meselelerle yüzleşme süreci yaratabilir.",
    "Kontrol etme isteği sorgulanabilir.",
    "Gizli kalan konular yüzeye çıkabilir.",
    "İçsel güçlenme süreci başlayabilir.",
    "Eski korkularla yüzleşme fırsatı doğabilir."
  ]
};
