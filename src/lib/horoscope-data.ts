import {
  DailyHoroscopeItem,
  HoroscopeApiResponse,
  HoroscopeDay,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";

export function getFormattedDayDate(day: HoroscopeDay = "today"): string {
  const d = new Date();
  if (day === "yesterday") {
    d.setDate(d.getDate() - 1);
  } else if (day === "tomorrow") {
    d.setDate(d.getDate() + 1);
  }
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}

export function getShortFormattedDayDate(day: HoroscopeDay = "today"): string {
  const d = new Date();
  if (day === "yesterday") {
    d.setDate(d.getDate() - 1);
  } else if (day === "tomorrow") {
    d.setDate(d.getDate() + 1);
  }
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });
}

export const DAY_DATES: Record<HoroscopeDay, string> = {
  get yesterday() {
    return getFormattedDayDate("yesterday");
  },
  get today() {
    return getFormattedDayDate("today");
  },
  get tomorrow() {
    return getFormattedDayDate("tomorrow");
  },
};

export const STATIC_HOROSCOPES: Record<
  HoroscopeDay,
  Record<ZodiacSignId, Record<HoroscopeSourceId, DailyHoroscopeItem | null>>
> = {
  "yesterday": {
    "taurus": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "taurus",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "Wednesday Oct 28th, 2026",
        "predictionEn": "You will find yourself occupied in an office event today and try to stand by your responsibilities. A reunion with old friends is what you can expect. The day will be full of excitement and joyful moments. Health and wealth related matters will be in your favor today.",
        "predictionTr": "Bugün kendinizi bir ofis etkinliğiyle meşgul bulacaksınız ve sorumluluklarınızın arkasında durmaya çalışacaksınız. Bekleyebileceğiniz şey eski arkadaşlarınızla yeniden bir araya gelmektir. Gün heyecanlı ve neşeli anlarla dolu olacak. Sağlık ve zenginlikle ilgili konular bugün lehinize olacak.",
        "luckyColor": "Silver",
        "luckyColorTr": "Gümüş",
        "luckyNumber": "37",
        "fetchedAt": "2026-10-29T09:42:38.271Z"
      },
      "ganeshaspeaks": {
        "signId": "taurus",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "28-10-2026",
        "predictionEn": "Almost as if crafted by Cervantes himself, you might wake up today feeling passionate and quixotic. Make up and make overs may be on the cards as you will have the urge to be groomed. Once you are done without yourself, you will shower others with attention, says Ganesha.",
        "predictionTr": "Sanki Cervantes'in kendisi tarafından hazırlanmış gibi, bugün tutkulu ve Don Kişotvari hissederek uyanabilirsiniz. Bakımlı olma dürtüsüne sahip olacağınız için makyaj ve makyajlar kartlarda olabilir. Ganesha, kendiniz olmadan işiniz bittiğinde, başkalarına ilgi göstereceksiniz diyor.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:38.652Z"
      },
      "astrosage": null
    },
    "cancer": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "cancer",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "Wednesday Oct 28th, 2026",
        "predictionEn": "Today you are likely to receive some unexpected news from your friend. This news might force you to wind up your work early. Health issues might arise. Read all the agreements on your own and do not trust anyone blindly. Financially, a relative will lend a helping hand.",
        "predictionTr": "Bugün, arkadaşınızdan beklenmedik bir haber almanız muhtemeldir. Bu haber sizi işinizi erken bitirmeye zorlayabilir. Sağlık sorunları ortaya çıkabilir. Tüm anlaşmaları kendi başınıza okuyun ve kimseye körü körüne güvenmeyin. Mali açıdan bir akraba yardım eli uzatacaktır.",
        "luckyColor": "Grey",
        "luckyColorTr": "Gri",
        "luckyNumber": "33",
        "fetchedAt": "2026-10-29T09:42:41.484Z"
      },
      "ganeshaspeaks": {
        "signId": "cancer",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "28-10-2026",
        "predictionEn": "With Ganesha&#8217;s grace, whatever you think or peruse will be successful. Students will excel and finish pending work. You can display your imagination excellently. In short, a day of happiness and variety.",
        "predictionTr": "Ganesha'nın lütfuyla, düşündüğünüz veya incelediğiniz her şey başarılı olacaktır. Öğrenciler başarılı olacak ve bekleyen işleri bitireceklerdir. Hayal gücünüzü mükemmel bir şekilde sergileyebilirsiniz. Kısacası mutluluk ve çeşitlilik dolu bir gün.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:41.670Z"
      },
      "astrosage": null
    },
    "leo": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "leo",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "Wednesday Oct 28th, 2026",
        "predictionEn": "It's a good day to spend some quality time with your family and friends. Plan a trip or go out for a family dinner. Make them feel special and tell your family that you love them. Pamper the younger ones, greet your parents, and share your heartiest feelings with your partner. Personal life is going to improve while professionally, stability can be anticipated. Health will be in your today.",
        "predictionTr": "Aileniz ve arkadaşlarınızla kaliteli zaman geçirmek için güzel bir gün. Bir gezi planlayın veya bir aile yemeğine çıkın. Onlara kendilerini özel hissettirin ve ailenize onları sevdiğinizi söyleyin. Küçükleri şımartın, ebeveynlerinizi selamlayın ve en içten duygularınızı partnerinizle paylaşın. Kişisel yaşam gelişecek, profesyonel anlamda ise istikrar beklenebilir. Sağlık bugün hayatınızda olacak.",
        "luckyColor": "Maroon",
        "luckyColorTr": "Bordo",
        "luckyNumber": "12",
        "fetchedAt": "2026-10-29T09:42:44.335Z"
      },
      "ganeshaspeaks": {
        "signId": "leo",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "28-10-2026",
        "predictionEn": "When it comes to maintaining a balance in any relationship, you set an example for others to follow. It is like an inner light guides you towards joyful coexistence, though, at times, it may entail making certain acts of sacrifice, says Ganesha. You may choose to lose an argument in order to win hearts. Just remember that losing a battle is sometimes the only way to win the war. Keep your language short and sweet on this wonderful day.",
        "predictionTr": "Herhangi bir ilişkide dengeyi korumak söz konusu olduğunda başkalarının takip edebileceği bir örnek oluşturursunuz. Ganesha, sanki içsel bir ışığın sizi neşeli bir birlikte yaşama doğru yönlendirdiğini, ancak bazen bazı fedakarlık eylemlerinde bulunmayı gerektirebileceğini söylüyor. Kalpleri kazanmak için bir tartışmayı kaybetmeyi seçebilirsiniz. Bir savaşı kaybetmenin bazen savaşı kazanmanın tek yolu olduğunu unutmayın. Bu harika günde dilinizi kısa ve tatlı tutun.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:44.542Z"
      },
      "astrosage": null
    },
    "virgo": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "virgo",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "Wednesday Oct 28th, 2026",
        "predictionEn": "You can expect a growth in your professional life but in personal life, conditions are expected to be the same. Some good news is likely to arrive from your senior co-workers. This news will cool down the environment at work and will bring a smile on everyone's face. It's a new beginning for you. Financially, growth can be anticipated and health conditions will also improve.",
        "predictionTr": "Mesleki yaşamınızda bir büyüme bekleyebilirsiniz ancak kişisel yaşamınızda koşulların aynı olması bekleniyor. Kıdemli iş arkadaşlarınızdan bazı iyi haberler gelmesi muhtemeldir. Bu haber iş ortamını serinletecek ve herkesin yüzünde bir gülümsemeye neden olacaktır. Bu senin için yeni bir başlangıç. Mali açıdan büyüme öngörülebilir ve sağlık koşulları da iyileşecektir.",
        "luckyColor": "Pink",
        "luckyColorTr": "Pembe",
        "luckyNumber": "4",
        "fetchedAt": "2026-10-29T09:42:47.166Z"
      },
      "ganeshaspeaks": {
        "signId": "virgo",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "yesterday",
        "date": "28 Ekim 2026 Çarşamba",
        "rawDate": "28-10-2026",
        "predictionEn": "Avoid all kinds of prejudice and do not allow intolerance to enter your mind today, advises Ganesha. In all likelihood, you will look around yourself in search of love and affection. You will do well to keep negativity at bay as otherwise it may cow you down. Ganesha suggests that you marshal all your courage to live as per your convictions.",
        "predictionTr": "Ganesha, her türlü önyargıdan kaçının ve hoşgörüsüzlüğün bugün aklınıza girmesine izin vermeyin, tavsiyesinde bulunuyor. Büyük ihtimalle sevgi ve şefkat arayışı içinde etrafınıza bakacaksınız. Olumsuzluğu uzak tutmanız iyi olur, aksi takdirde sizi korkutabilir. Ganesha, inançlarınıza göre yaşamak için tüm cesaretinizi toplamanızı öneriyor.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:47.505Z"
      },
      "astrosage": null
    }
  },
  "today": {
    "taurus": {
      "astrolojiorg": {
        "signId": "taurus",
        "sourceId": "astrolojiorg",
        "sourceName": "Astroloji.org",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29 Ekim 2026 Perşembe",
        "predictionEn": "Aşk: Geçmişe takılmak yerine bugüne odaklanırsanız hafifleyeceksiniz. Geçmişi bırakıp bugüne bakmak size beklemediğiniz bir hafiflik getirecek. Beklenmedik bir özür gelebilir, affetmek size iyi gelir. Kalbinizde güven var, bunu karşınızdaki hissedecek. Akşam sohbeti ilişkinize beklediğinizden iyi gelecek. Yeni bir sayfa açmak için doğru zamandasınız.\n\nİş: Ekip içinde bugün öne çıkıyorsunuz, fark edilir. Bugün sabırla ilerlemek en doğrusu. Sabır sayesinde kapılar açılıyor. Küçük bir hatanın büyüyebileceğini unutmayın, dikkatli olun. Planınızı bir kez daha gözden geçirmeniz iyi olur.\n\nSağlık: Enerjinizi korumak için dinlenin. Bol su içmeyi ihmal etmeyin. Bedeninizde sabır hissi hakim. Uzun süre oturmaktan kaçının, kalkın dolaşın. Gözlerinizi dinlendirmek için uzaklara bakın. Gün ortası kısa dinlenme iyi gelir.",
        "predictionTr": "Aşk: Geçmişe takılmak yerine bugüne odaklanırsanız hafifleyeceksiniz. Geçmişi bırakıp bugüne bakmak size beklemediğiniz bir hafiflik getirecek. Beklenmedik bir özür gelebilir, affetmek size iyi gelir. Kalbinizde güven var, bunu karşınızdaki hissedecek. Akşam sohbeti ilişkinize beklediğinizden iyi gelecek. Yeni bir sayfa açmak için doğru zamandasınız.\n\nİş: Ekip içinde bugün öne çıkıyorsunuz, fark edilir. Bugün sabırla ilerlemek en doğrusu. Sabır sayesinde kapılar açılıyor. Küçük bir hatanın büyüyebileceğini unutmayın, dikkatli olun. Planınızı bir kez daha gözden geçirmeniz iyi olur.\n\nSağlık: Enerjinizi korumak için dinlenin. Bol su içmeyi ihmal etmeyin. Bedeninizde sabır hissi hakim. Uzun süre oturmaktan kaçının, kalkın dolaşın. Gözlerinizi dinlendirmek için uzaklara bakın. Gün ortası kısa dinlenme iyi gelir.",
        "luckyColor": "Yeşil",
        "luckyColorTr": "Yeşil",
        "luckyNumber": "6",
        "fetchedAt": "2026-10-29T09:42:38.785Z"
      },
      "askganesha": {
        "signId": "taurus",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday Oct 29th, 2026",
        "predictionEn": "It's a pretty tough and hectic day for you. You may be asked to spend some extra hours at the workplace which will make you feel exhausted by the end of the day due to your hectic schedule. Financially, you may seek help from a relative. Health wise, you may have to go through some headaches and joint pains so take proper rest.",
        "predictionTr": "Senin için oldukça zorlu ve telaşlı bir gün. Yoğun programınız nedeniyle gün sonunda kendinizi yorgun hissetmenize neden olacak iş yerinde fazladan birkaç saat geçirmeniz istenebilir. Maddi açıdan bir akrabanızdan yardım isteyebilirsiniz. Sağlık açısından, bazı baş ağrıları ve eklem ağrılarından geçmeniz gerekebilir, bu nedenle uygun şekilde dinlenin.",
        "luckyColor": "Yellow",
        "luckyColorTr": "Sarı",
        "luckyNumber": "9",
        "fetchedAt": "2026-10-29T09:42:39.145Z"
      },
      "ganeshaspeaks": {
        "signId": "taurus",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29-10-2026",
        "predictionEn": "In all probability, it is a favourable day to begin financial planning, says Ganesha. You will focus on your relations and leave no stone unturned to make them prosper. You may yearn for a quiet getaway and end up spending a small fortune to get what you want.",
        "predictionTr": "Ganesha, büyük olasılıkla finansal planlamaya başlamak için uygun bir gün olduğunu söylüyor. İlişkilerinize odaklanacak ve onların gelişmesi için çevrilmemiş taş bırakacaksınız. Sessiz bir kaçamak isteyebilir ve sonunda istediğinizi elde etmek için küçük bir servet harcamak zorunda kalabilirsiniz.",
        "luckyColor": "Deep Pastel Pink",
        "luckyColorTr": "Pembe",
        "luckyNumber": "8",
        "fetchedAt": "2026-10-29T09:42:39.331Z"
      },
      "astrosage": {
        "signId": "taurus",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday, October 29, 2026",
        "predictionEn": "Health will be perfect despite a hectic day. Today, with the help of a close relative, you can do well in your business, which will also benefit you financially. Family front seems to go smoothly and you can expect full support to your plans. Personal guidance will improve your relationship. Despite overburdened with work, you can remain energetic at your workplace. Today, you can complete all your tasks before the given scheduled time. Try your best to stay away from people. It's better to look out for and give ample time to yourself than people around you. Do you think that married life is all about compromises? If yes, you will know today that it's the best thing ever happened to you.",
        "predictionTr": "Yoğun bir güne rağmen sağlık mükemmel olacak. Bugün yakın bir akrabanızın yardımıyla işinizde başarılı olabilirsiniz, bu da size maddi açıdan da fayda sağlayacaktır. Aile cephesi sorunsuz gidiyor gibi görünüyor ve planlarınıza tam destek bekleyebilirsiniz. Kişisel rehberlik ilişkinizi geliştirecektir. Aşırı iş yüküne rağmen iş yerinizde enerjik kalabilirsiniz. Bugün, tüm görevlerinizi verilen planlanan süreden önce tamamlayabilirsiniz. İnsanlardan uzak durmaya çalışın. Çevrenizdeki insanlardan ziyade kendinize dikkat etmeniz ve bolca zaman ayırmanız daha iyidir. Evlilik hayatının tamamen uzlaşmalardan ibaret olduğunu mu düşünüyorsunuz? Cevabınız evet ise, bugün bunun başınıza gelen en iyi şey olduğunu bileceksiniz.",
        "luckyColor": "Silver and White",
        "luckyColorTr": "Gümüş ve Beyaz",
        "luckyNumber": "2",
        "remedy": "Give sweetened rice to needy and poor people to strengthen your economic condition.",
        "remedyTr": "Ekonomik durumunuzu güçlendirmek için ihtiyaç sahibi ve fakir insanlara şekerli pirinç verin.",
        "fetchedAt": "2026-10-29T09:42:40.033Z"
      }
    },
    "cancer": {
      "astrolojiorg": {
        "signId": "cancer",
        "sourceId": "astrolojiorg",
        "sourceName": "Astroloji.org",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29 Ekim 2026 Perşembe",
        "predictionEn": "Aşk: Kalbinizi ısıtacak bir haber yolda, hazır olun. Duygusallık sayesinde bugün doğru adımı atıyorsunuz. Bugün tartışmaya girmeyin, sessizlik bazen en iyi cevap olur. Sürpriz bir buluşma gününüzü tamamen değiştirebilir. Romantizm akşam saatlerinde artıyor, keyfini çıkarın. Eski bir anı aklınıza düşüp sizi gülümsetebilir.\n\nİş: Bugün büyük adım atmak için erken, bekleyin. Toplantıda kısa ve net konuşun, dağıtmadan. Sabırlı olursanız sonuç iyi gelecek, merak etmeyin. Koruma sayesinde kapılar açılıyor. Risk almadan önce iki kez düşünün. Bugün konuları fazla kurcalamayın, akışına bırakın.\n\nSağlık: Yavaşlamak bazen en hızlı yol olur, unutmayın. Bugün aile ile iyileşiyorsunuz. Baş ağrısına karşı su için önce. Ekran molası vermek gözleri dinlendirir. Midenizi yormayacak şeyler yiyin bugün. Gün ortası kısa dinlenme iyi gelir.",
        "predictionTr": "Aşk: Kalbinizi ısıtacak bir haber yolda, hazır olun. Duygusallık sayesinde bugün doğru adımı atıyorsunuz. Bugün tartışmaya girmeyin, sessizlik bazen en iyi cevap olur. Sürpriz bir buluşma gününüzü tamamen değiştirebilir. Romantizm akşam saatlerinde artıyor, keyfini çıkarın. Eski bir anı aklınıza düşüp sizi gülümsetebilir.\n\nİş: Bugün büyük adım atmak için erken, bekleyin. Toplantıda kısa ve net konuşun, dağıtmadan. Sabırlı olursanız sonuç iyi gelecek, merak etmeyin. Koruma sayesinde kapılar açılıyor. Risk almadan önce iki kez düşünün. Bugün konuları fazla kurcalamayın, akışına bırakın.\n\nSağlık: Yavaşlamak bazen en hızlı yol olur, unutmayın. Bugün aile ile iyileşiyorsunuz. Baş ağrısına karşı su için önce. Ekran molası vermek gözleri dinlendirir. Midenizi yormayacak şeyler yiyin bugün. Gün ortası kısa dinlenme iyi gelir.",
        "luckyColor": "Beyaz",
        "luckyColorTr": "Beyaz",
        "luckyNumber": "2",
        "fetchedAt": "2026-10-29T09:42:41.708Z"
      },
      "askganesha": {
        "signId": "cancer",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday Oct 29th, 2026",
        "predictionEn": "Your good deeds will pay you off with some rewarding outcomes. A major change can be anticipated which will have far reaching implications. Financially, you will gain stability while health wise, some issues are likely to arise. Take care of your relations with siblings, if gone well, you might get a great growth in near future.",
        "predictionTr": "Yaptığınız iyilikler size bazı ödüllendirici sonuçlarla karşılığını verecektir. Çok geniş kapsamlı sonuçları olacak büyük bir değişiklik beklenebilir. Mali açıdan istikrar kazanırken sağlık açısından bazı sorunların ortaya çıkması muhtemeldir. Kardeşlerinizle ilişkilerinize dikkat edin, eğer iyi giderse yakın gelecekte büyük bir büyüme elde edebilirsiniz.",
        "luckyColor": "Brown",
        "luckyColorTr": "Kahverengi",
        "luckyNumber": "23",
        "fetchedAt": "2026-10-29T09:42:42.068Z"
      },
      "ganeshaspeaks": {
        "signId": "cancer",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29-10-2026",
        "predictionEn": "You are a master of deception, and your sugar-coated comments play a pivotal role in your methods. Today, you will be able to smell trouble from a distance, and will know when to take a U-turn. Your methods may not make you very popular with the so-called moral brigade working with you, but you may think that this is the easiest way to the top. Ganesha, however, is not too sure that these tactics will work on a long-term basis.",
        "predictionTr": "Siz bir aldatma ustasısınız ve şeker kaplı yorumlarınız yöntemlerinizde çok önemli bir rol oynuyor. Bugün, belanın kokusunu uzaktan alabileceksiniz ve ne zaman U dönüşü yapmanız gerektiğini bileceksiniz. Yöntemleriniz, sizinle birlikte çalışan sözde ahlak tugayı arasında sizi pek popüler kılmayabilir, ancak bunun zirveye ulaşmanın en kolay yolu olduğunu düşünebilirsiniz. Ancak Ganesha bu taktiklerin uzun vadede işe yarayacağından pek emin değil.",
        "luckyColor": "Deep Light Blue",
        "luckyColorTr": "Mavi",
        "luckyNumber": "5",
        "fetchedAt": "2026-10-29T09:42:42.377Z"
      },
      "astrosage": {
        "signId": "cancer",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday, October 29, 2026",
        "predictionEn": "Try to relax in-between work and avoid late nights. Today, you need to stay away from such friends who ask you to loan money and then do not return it. Today you move with new excitement and confidence as you receive support from your family members as well as friends. Thoughts of meeting your friend after a long time may increase your heat beats like a rolling stone. Enemies at work might become friends with you today just because of a one single good act. The day is great. Take time out for yourself today and evaluate your shortcomings. This will bring positive changes in your personality. Your spouse will put efforts in making you happy today.",
        "predictionTr": "İş arasında dinlenmeye çalışın ve gece geç saatlerden kaçının. Bugün sizden borç isteyen, sonra da geri vermeyen arkadaşlardan uzak durmalısınız. Bugün aile bireylerinizin yanı sıra arkadaşlarınızdan da destek alırken yeni bir heyecan ve güvenle hareket ediyorsunuz. Arkadaşınızla uzun bir aradan sonra buluşma düşüncesi, ateş atışlarınızı yuvarlanan bir taş gibi artırabilir. İş yerindeki düşmanlarınız, tek bir iyi hareketiniz sayesinde bugün sizinle arkadaş olabilir. Gün harika. Bugün kendinize zaman ayırın ve eksikliklerinizi değerlendirin. Bu kişiliğinizde olumlu değişiklikler getirecektir. Eşiniz bugün sizi mutlu etmek için çaba gösterecek.",
        "luckyColor": "Saffron and Yellow",
        "luckyColorTr": "Safran Sarısı ve Sarı",
        "luckyNumber": "3",
        "remedy": "Donate black grams, bengal grams, black clothing, and mustard oil to maintain continued good health.",
        "remedyTr": "Sağlığınızı sürdürmek için siyah gram, bengal gram, siyah kıyafet ve hardal yağı bağışlayın.",
        "fetchedAt": "2026-10-29T09:42:42.873Z"
      }
    },
    "leo": {
      "astrolojiorg": {
        "signId": "leo",
        "sourceId": "astrolojiorg",
        "sourceName": "Astroloji.org",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29 Ekim 2026 Perşembe",
        "predictionEn": "Aşk: Bekar olanlar için yeni bir tanışma kapıda duruyor. Partnerinizle küçük bir plan yapmak ikinize de iyi gelecek. Duygularınızı açık söylemekten çekinmeyin, bugün tam zamanı. Akşam saatlerinde beklemediğiniz bir mesaj gelebilir. Yeni bir sayfa açmak için doğru zamandasınız. Duygularınızı bastırmayın, paylaşın. İlişkinizde gurur enerjisi sizi destekliyor.\n\nİş: Patron sizden detay bekliyor, hazırlıklı olun. Bugün daha çok gözlem yapın, konuşmaktan değerli. Bugün konuları fazla kurcalamayın, akışına bırakın. Cömertlik sayesinde kapılar açılıyor. Bugün büyük adım atmak için erken, bekleyin. Küçük detaylar büyük fark yaratır, atlamayın.\n\nSağlık: Acele etmeden yavaşlamak iyi gelir. Uzun süre oturmaktan kaçının, kalkın dolaşın. Bedeniniz bugün sinyal veriyor, dinleyin. Bugün cömertlik ile iyileşiyorsunuz. Bel bölgeniz bugün biraz hassas, dikkat edin.",
        "predictionTr": "Aşk: Bekar olanlar için yeni bir tanışma kapıda duruyor. Partnerinizle küçük bir plan yapmak ikinize de iyi gelecek. Duygularınızı açık söylemekten çekinmeyin, bugün tam zamanı. Akşam saatlerinde beklemediğiniz bir mesaj gelebilir. Yeni bir sayfa açmak için doğru zamandasınız. Duygularınızı bastırmayın, paylaşın. İlişkinizde gurur enerjisi sizi destekliyor.\n\nİş: Patron sizden detay bekliyor, hazırlıklı olun. Bugün daha çok gözlem yapın, konuşmaktan değerli. Bugün konuları fazla kurcalamayın, akışına bırakın. Cömertlik sayesinde kapılar açılıyor. Bugün büyük adım atmak için erken, bekleyin. Küçük detaylar büyük fark yaratır, atlamayın.\n\nSağlık: Acele etmeden yavaşlamak iyi gelir. Uzun süre oturmaktan kaçının, kalkın dolaşın. Bedeniniz bugün sinyal veriyor, dinleyin. Bugün cömertlik ile iyileşiyorsunuz. Bel bölgeniz bugün biraz hassas, dikkat edin.",
        "luckyColor": "Altın Sarısı",
        "luckyColorTr": "Altın Sarısı",
        "luckyNumber": "1",
        "fetchedAt": "2026-10-29T09:42:44.590Z"
      },
      "askganesha": {
        "signId": "leo",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday Oct 29th, 2026",
        "predictionEn": "Avoid entering into contracts today as there are huge probabilities of you being defrauded by others. Avoid being emotionally attached with someone at the workplace. Outflow of huge amount of cash can be predicted. Health wise, conditions will improve.",
        "predictionTr": "Başkaları tarafından dolandırılma ihtimaliniz çok yüksek olduğundan, bugün sözleşme yapmaktan kaçının. İşyerinde birine duygusal olarak bağlı olmaktan kaçının. Büyük miktarda nakit çıkışı tahmin edilebilir. Sağlık açısından koşullar iyileşecek.",
        "luckyColor": "Red",
        "luckyColorTr": "Kırmızı",
        "luckyNumber": "40",
        "fetchedAt": "2026-10-29T09:42:44.943Z"
      },
      "ganeshaspeaks": {
        "signId": "leo",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29-10-2026",
        "predictionEn": "There are chances of conflict on the home front today. However you will be able to solve these problems owing to your understanding nature. However, these conflicts would likely not have cropped up if you would have paid more attention to your family. You appreciate the wonderful things in life today, says Ganesha.",
        "predictionTr": "Bugün iç cephede çatışma ihtimali var. Ancak anlayışlı doğanız sayesinde bu sorunları çözebileceksiniz. Ancak ailenize daha fazla ilgi gösterseydiniz bu çatışmalar muhtemelen ortaya çıkmazdı. Ganesha, bugün hayattaki harika şeyleri takdir ettiğinizi söylüyor.",
        "luckyColor": "Gold",
        "luckyColorTr": "Altın Sarısı",
        "luckyNumber": "6",
        "fetchedAt": "2026-10-29T09:42:45.111Z"
      },
      "astrosage": {
        "signId": "leo",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday, October 29, 2026",
        "predictionEn": "Unwanted thoughts may occupy your mind. Try to engage yourself in physical exercise because an empty brain is a devil's workshop. People of this zodiac sign who carry out business from abroad are likely to benefit financially today. Friends will come to your aid if needed. Your partner will be upset if you do not pay enough attention to him or her. Backlog of correspondence will need top priority. Travel plans if any-might get postponed due to last minute changes in your schedule. A tiff is possible today due to relatives, but at the end of the day everything will be resolved beautifully.",
        "predictionTr": "İstenmeyen düşünceler zihninizi işgal edebilir. Kendinizi fiziksel egzersizlerle meşgul etmeye çalışın çünkü boş bir beyin şeytanın atölyesidir. Yurt dışından iş yapan bu burçtaki kişilerin bugün maddi açıdan fayda sağlaması muhtemeldir. Gerekirse arkadaşlarınız yardımınıza gelecektir. Partneriniz, ona yeterince ilgi göstermezseniz üzülecektir. Yazışmaların birikmiş listesi en yüksek önceliğe ihtiyaç duyacaktır. Varsa seyahat planlarınız programınızdaki son dakika değişiklikleri nedeniyle ertelenebilir. Bugün akrabalardan dolayı bir anlaşmazlık yaşanabilir ama günün sonunda her şey güzelce çözülecektir.",
        "luckyColor": "Silver and White",
        "luckyColorTr": "Gümüş ve Beyaz",
        "luckyNumber": "2",
        "remedy": "Feed young girls below age of 9 to attain good health",
        "remedyTr": "Sağlıklı olmaları için 9 yaşın altındaki genç kızları besleyin",
        "fetchedAt": "2026-10-29T09:42:45.709Z"
      }
    },
    "virgo": {
      "astrolojiorg": {
        "signId": "virgo",
        "sourceId": "astrolojiorg",
        "sourceName": "Astroloji.org",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29 Ekim 2026 Perşembe",
        "predictionEn": "Aşk: Beklenmedik bir özür gelebilir, affetmek size iyi gelir. İlişkinizde titizlik enerjisi sizi destekliyor. Akşam saatlerinde beklemediğiniz bir mesaj gelebilir. Kıskançlıktan uzak durun, huzur bulmanın yolu bu. Aşkta acele etmek yerine akışa bırakın. Kalbinizi kapatmayın, açık olun. Kalbinizde ne varsa dile getirin, saklamayın.\n\nİş: İş arkadaşınızdan beklemediğiniz bir destek göreceksiniz. Sunum hazırlamak için bugün ideal bir gün. İş dışı konuşmalara girmemek iyi olur. Planınızı bir kez daha gözden geçirmeniz iyi olur. Detay bugün işteki en büyük gücünüz.\n\nSağlık: Bedeninizi dinlerseniz doğruyu bilir. Midenizi yormayacak şeyler yiyin bugün. Erken kalkmak güne iyi başlatır. Kendinizi zorlamadan ilerleyin. Vücudunuz titizlik istiyor, dinleyin. Gözlerinizi dinlendirmek için uzaklara bakın.",
        "predictionTr": "Aşk: Beklenmedik bir özür gelebilir, affetmek size iyi gelir. İlişkinizde titizlik enerjisi sizi destekliyor. Akşam saatlerinde beklemediğiniz bir mesaj gelebilir. Kıskançlıktan uzak durun, huzur bulmanın yolu bu. Aşkta acele etmek yerine akışa bırakın. Kalbinizi kapatmayın, açık olun. Kalbinizde ne varsa dile getirin, saklamayın.\n\nİş: İş arkadaşınızdan beklemediğiniz bir destek göreceksiniz. Sunum hazırlamak için bugün ideal bir gün. İş dışı konuşmalara girmemek iyi olur. Planınızı bir kez daha gözden geçirmeniz iyi olur. Detay bugün işteki en büyük gücünüz.\n\nSağlık: Bedeninizi dinlerseniz doğruyu bilir. Midenizi yormayacak şeyler yiyin bugün. Erken kalkmak güne iyi başlatır. Kendinizi zorlamadan ilerleyin. Vücudunuz titizlik istiyor, dinleyin. Gözlerinizi dinlendirmek için uzaklara bakın.",
        "luckyColor": "Lacivert",
        "luckyColorTr": "Lacivert",
        "luckyNumber": "5",
        "fetchedAt": "2026-10-29T09:42:47.549Z"
      },
      "askganesha": {
        "signId": "virgo",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday Oct 29th, 2026",
        "predictionEn": "Avoid uttering harsh words and try to act nice for today. Health will improve but you have to stay on medication for another day or so. Financially, you may have to ask for a helping hand from a friend or relative as there are high probabilities that you may run out of funds. Love life will gain strength.",
        "predictionTr": "Sert sözler söylemekten kaçının ve bugün için iyi davranmaya çalışın. Sağlığınız düzelecektir ancak bir veya daha fazla gün daha ilaç tedavisine devam etmeniz gerekir. Mali açıdan, paranızın bitme ihtimalinin yüksek olması nedeniyle bir arkadaşınızdan veya akrabanızdan yardım istemeniz gerekebilir. Aşk hayatı güçlenecek.",
        "luckyColor": "Green",
        "luckyColorTr": "Yeşil",
        "luckyNumber": "27",
        "fetchedAt": "2026-10-29T09:42:47.912Z"
      },
      "ganeshaspeaks": {
        "signId": "virgo",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "29-10-2026",
        "predictionEn": "You will shine exceedingly well in all the activities that you undertake today. Your dream of starting business operations on foreign shores will fructify today, says Ganesha. You may pay more attention to your personal appearance, which will boost your morale considerably.",
        "predictionTr": "Bugün üstlendiğiniz tüm aktivitelerde son derece iyi parlayacaksınız. Ganesha, yabancı kıyılarda iş faaliyetleri başlatma hayalinizin bugün meyve vereceğini söylüyor. Kişisel görünümünüze daha fazla önem verebilirsiniz, bu da moralinizi oldukça yükseltecektir.",
        "luckyColor": "Beige",
        "luckyColorTr": "Bej",
        "luckyNumber": "7",
        "fetchedAt": "2026-10-29T09:42:48.083Z"
      },
      "astrosage": {
        "signId": "virgo",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "today",
        "date": "29 Ekim 2026 Perşembe",
        "rawDate": "Thursday, October 29, 2026",
        "predictionEn": "Today you are under magic spell of hope. Surplus money should be invested in real estate. Let family tension not divert your attention. Bad times give us much more. Don't waste the moment indulging in self-pity but try and know life lessons. You will make your life worth by forgiving your beloved for her past indifference. Slow progress of work brings minor tensions. Travel will be beneficial but expensive. You keep getting jokes on married life over social media, but today you will get really emotional when the startling beautiful facts about your married life will come afore you.",
        "predictionTr": "Bugün umudun sihirli büyüsü altındasınız. Fazla para gayrimenkule yatırılmalıdır. Aile geriliminin dikkatinizi dağıtmasına izin vermeyin. Kötü zamanlar bize çok daha fazlasını verir. Kendinize acıyarak anı boşa harcamayın, ancak hayat derslerini öğrenmeye çalışın. Sevdiğiniz kişinin geçmişteki ilgisizliğini affederek hayatınızı değerli kılacaksınız. İşin yavaş ilerlemesi küçük gerginlikleri de beraberinde getiriyor. Seyahat faydalı ama pahalı olacaktır. Sosyal medyada evlilik hayatınızla ilgili şakalar almaya devam ediyorsunuz, ancak bugün evlilik hayatınızla ilgili şaşırtıcı güzel gerçekler karşınıza çıktığında gerçekten duygulanacaksınız.",
        "luckyColor": "Red and Maroon",
        "luckyColorTr": "Kırmızı ve Bordo",
        "luckyNumber": "9",
        "remedy": "Feed sweet food items to birds for professional success.",
        "remedyTr": "Profesyonel başarı için kuşlara tatlı yiyecekler verin.",
        "fetchedAt": "2026-10-29T09:42:48.603Z"
      }
    }
  },
  "tomorrow": {
    "taurus": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "taurus",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday Oct 30th, 2026",
        "predictionEn": "It's a great opportunity to spend some quality time with your friends and family. You have to be careful with the matters related to money. Personal life will gain strength. Career will be in your favour today but health might not support you today.",
        "predictionTr": "Arkadaşlarınız ve ailenizle kaliteli zaman geçirmek için harika bir fırsat. Parayla ilgili konularda dikkatli olmalısınız. Kişisel yaşam güçlenecek. Bugün kariyer lehinize olacak ancak sağlık bugün sizi desteklemeyebilir.",
        "luckyColor": "Black",
        "luckyColorTr": "Siyah",
        "luckyNumber": "17",
        "fetchedAt": "2026-10-29T09:42:40.403Z"
      },
      "ganeshaspeaks": {
        "signId": "taurus",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "30-10-2026",
        "predictionEn": "This is one of those days when not goes well, warns Ganesha. No matter how hard you try you may not be able to keep problems and difficulties at bay. You may not be pleased or comfortable doing what has been assigned, or required, and could simply sit sullenly, doing nothing. Do not, therefore, take up anything difficult or complex. Stick to simple and easy things. Knowing that this day will pass, you should try to remain positive and optimistic.",
        "predictionTr": "Ganesha, bunun iyi gitmediği günlerden biri olduğu konusunda uyarıyor. Ne kadar çabalarsanız çabalayın, sorunları ve zorlukları uzak tutamayabilirsiniz. Size verilen veya gerekli olanı yapmaktan memnun olmayabilir veya rahat olmayabilirsiniz ve hiçbir şey yapmadan somurtkan bir şekilde oturabilirsiniz. Bu nedenle zor veya karmaşık hiçbir şeyi üstlenmeyin. Basit ve kolay şeylere bağlı kalın. Bu günün geçeceğini bilerek pozitif ve iyimser kalmaya çalışmalısınız.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:40.627Z"
      },
      "astrosage": {
        "signId": "taurus",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday, October 30, 2026",
        "predictionEn": "A day when rest will be important- As you have been facing lot of mental pressure recently- Recreation and entertainment will help you relax. Today, you can take your family members out for a get-together and spend a lot of money on them. Your brother will be more supportive to your needs than you had thought. Don't lose heart-failures are quite natural they are the beauty of life. Today you will have the stamina and the know-how to raise your earning power. Today, you will have ample time to spend with your spouse. Your lover will feel overwhelmed at the attention and love s/he will get. Your spouse might become insensitive toward your health today.",
        "predictionTr": "Dinlenmenin önemli olacağı bir gün - Son zamanlarda çok fazla zihinsel baskıyla karşı karşıya olduğunuz için - Rekreasyon ve eğlence rahatlamanıza yardımcı olacaktır. Bugün aile üyelerinizi bir buluşmaya götürebilir ve onlara bol miktarda para harcayabilirsiniz. Kardeşiniz ihtiyaçlarınızı düşündüğünüzden daha fazla destekleyecektir. Sakın kaybetmeyin kalp yetmezliği oldukça doğaldır, hayatın güzelliğidir. Bugün kazanma gücünüzü artıracak dayanıklılığa ve bilgi birikimine sahip olacaksınız. Bugün eşinizle geçireceğiniz bolca zamanınız olacak. Sevgiliniz göreceği ilgi ve sevgi karşısında bunalacaktır. Eşiniz bugün sağlığınıza karşı duyarsızlaşabilir.",
        "luckyColorTr": "",
        "remedy": "Keep good relations with your boyfriend/girlfriend by distributing chocolates to poor and need young girls.",
        "remedyTr": "Yoksul ve ihtiyaç sahibi genç kızlara çikolata dağıtarak erkek arkadaşınızla/kız arkadaşınızla iyi ilişkiler kurun.",
        "fetchedAt": "2026-10-29T09:42:41.129Z"
      }
    },
    "cancer": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "cancer",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday Oct 30th, 2026",
        "predictionEn": "Children might find themselves occupied in some sort of project work. You may be asked to work overtime which will prevent you from abiding by some personal commitments. Financially, conditions might improve but some health issues continues to exist.",
        "predictionTr": "Çocuklar kendilerini bir tür proje çalışmasıyla meşgul bulabilirler. Bazı kişisel taahhütlere uymanızı engelleyecek fazla mesai yapmanız istenebilir. Mali açıdan koşullar iyileşebilir ancak bazı sağlık sorunları devam ediyor.",
        "luckyColor": "Silver",
        "luckyColorTr": "Gümüş",
        "luckyNumber": "5",
        "fetchedAt": "2026-10-29T09:42:43.225Z"
      },
      "ganeshaspeaks": {
        "signId": "cancer",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "30-10-2026",
        "predictionEn": "You will focus on financial matters and plan accordingly. Compared to expenses, you will save more. A beneficial day for cashiers, money lenders and petty traders. Ganesha counsels hard work to achieve success.",
        "predictionTr": "Finansal konulara odaklanacak ve buna göre plan yapacaksınız. Giderlerle karşılaştırıldığında daha fazla tasarruf edeceksiniz. Kasiyerler, borç verenler ve küçük tüccarlar için faydalı bir gün. Ganesha başarıya ulaşmak için sıkı çalışmayı tavsiye ediyor.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:43.435Z"
      },
      "astrosage": {
        "signId": "cancer",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday, October 30, 2026",
        "predictionEn": "Day of special care for expectant mothers. The court will make decisions in your favour today if you were involved in a case regarding money-related matters. It will benefit you financially. Give priorities to the needs of family members. Involve yourself to share their joy and sorrow to realize them that you care for them. Love can drift you in a new world while standing at one place. It's the day when you will go on a romantic trip. Your cooperative attitude and analytical skills will be noticed. Today, you should try to complete your tasks on time. Keep in mind that someone is waiting for you at home who needs you. Today, roses will look redder and violets will look bluer because intoxication of love is giving you a high.",
        "predictionTr": "Hamile anneler için özel bakım günü. Parayla ilgili bir davaya karışmışsanız mahkeme bugün lehinize karar verecektir. Maddi olarak size fayda sağlayacaktır. Aile üyelerinin ihtiyaçlarına öncelik verin. Onları önemsediğinizi anlamak için sevinçlerini ve üzüntülerini paylaşmaya kendinizi dahil edin. Aşk, bir yerde dururken sizi yeni bir dünyaya sürükleyebilir. Romantik bir geziye çıkacağınız gün. İşbirlikçi tavrınız ve analitik becerileriniz fark edilecek. Bugün görevlerinizi zamanında tamamlamaya çalışmalısınız. Evde size ihtiyacı olan birinin sizi beklediğini unutmayın. Bugün güller daha kırmızı, menekşeler daha mavi görünecek çünkü aşkın sarhoşluğu sizi coşturuyor.",
        "luckyColor": "White, cream, red and ye...",
        "luckyColorTr": "Beyaz, Krem, Kırmızı ve ye",
        "remedy": "Sunbathe daily for 15 - 20 minutes (early morning) to get rid of diseases and deficiencies",
        "remedyTr": "Hastalıklardan ve eksikliklerden kurtulmak için her gün 15 – 20 dakika (sabahın erken saatlerinde) güneşlenin",
        "fetchedAt": "2026-10-29T09:42:43.958Z"
      }
    },
    "leo": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "leo",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday Oct 30th, 2026",
        "predictionEn": "You will be over the moon today as everything seems to turn in your favor today. Professionally, you are likely to receive some good news from your boss. Lovers will share some quality time together. You may have to incur some losses in your business which will promote financial instability. Health will gain stability.",
        "predictionTr": "Bugün her şey sizin lehinize dönüyor gibi göründüğü için bugün çok mutlu olacaksınız. Profesyonel olarak patronunuzdan iyi haberler almanız muhtemeldir. Aşıklar birlikte kaliteli zaman geçirecekler. İşletmenizde finansal istikrarsızlığı artıracak bazı kayıplara uğramanız gerekebilir. Sağlık istikrar kazanacak.",
        "luckyColor": "Black",
        "luckyColorTr": "Siyah",
        "luckyNumber": "1",
        "fetchedAt": "2026-10-29T09:42:46.061Z"
      },
      "ganeshaspeaks": {
        "signId": "leo",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "30-10-2026",
        "predictionEn": "You will be filled with extra-ordinary self-confidence and will be able to take on huge risks. Sportspersons will be able to make a lot of progress in their fields. You will square off against any obstacles in your way using your entire might. While it is a good day for you, keep a curb on your speculations, says Ganesha.",
        "predictionTr": "Olağanüstü bir özgüvenle dolu olacaksınız ve büyük riskler alabileceksiniz. Sporcular kendi alanlarında birçok ilerleme kaydedebilecekler. Tüm gücünüzü kullanarak yolunuzdaki her türlü engele karşı mücadele edeceksiniz. Ganesha, sizin için güzel bir gün olsa da spekülasyonlarınızı bir kenara bırakın, diyor.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:46.281Z"
      },
      "astrosage": {
        "signId": "leo",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday, October 30, 2026",
        "predictionEn": "Involve yourself in paying some sport as it is the secret of perpetual youth. Today you can easily raise capital- collect outstanding debts- or ask for funds to work on new projects. Grandchildren would be a source of immense pleasure. Beloved will be in a romantic mood. Work put in the past brings in results and rewards today. Those who live away from their home would prefer to spend their free time in a park or quiet place it the evening after completing their chores. You will cherish the old beautiful romantic days today again with your spouse.",
        "predictionTr": "Sürekli gençliğin sırrı olduğu için kendinizi biraz spora dahil edin. Bugün kolayca sermaye toplayabilir, ödenmemiş borçları tahsil edebilir veya yeni projeler üzerinde çalışmak için fon isteyebilirsiniz. Torunlar büyük bir mutluluk kaynağı olacaktır. Sevgili romantik bir ruh halinde olacak. Geçmişte yapılan işler bugün sonuç ve ödül getirir. Evinden uzakta yaşayanlar, akşam işlerini tamamladıktan sonra boş zamanlarını parkta veya sessiz bir yerde geçirmeyi tercih ediyor. Bugün eşinizle birlikte eski güzel romantik günlerinizi yeniden yaşayacaksınız.",
        "luckyColorTr": "",
        "remedy": "Save coins in an earthen piggy bank, and help children and pilgrims with this saved money, for enhanced health benefits.",
        "remedyTr": "Paraları topraktan bir kumbarada biriktirin ve sağlık açısından daha fazla fayda sağlamak için biriktirilen bu parayla çocuklara ve hacılara yardımcı olun.",
        "fetchedAt": "2026-10-29T09:42:46.796Z"
      }
    },
    "virgo": {
      "astrolojiorg": null,
      "askganesha": {
        "signId": "virgo",
        "sourceId": "askganesha",
        "sourceName": "AskGanesha",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday Oct 30th, 2026",
        "predictionEn": "You are likely to seek guidance from the experienced persons with respect to love life, be a good listener but do what your heart says you to do. A new project will fetch you huge amount of profit, thereby, strengthening your financial conditions. Health wise, stability can be predicted.",
        "predictionTr": "Aşk hayatı konusunda deneyimli kişilerden rehberlik alma ihtimaliniz yüksek, iyi bir dinleyici olun ama kalbiniz ne diyorsa onu yapın. Yeni bir proje size büyük miktarda kar getirecek ve böylece finansal koşullarınızı güçlendirecektir. Sağlık açısından istikrar öngörülebilir.",
        "luckyColor": "Blue",
        "luckyColorTr": "Mavi",
        "luckyNumber": "42",
        "fetchedAt": "2026-10-29T09:42:48.987Z"
      },
      "ganeshaspeaks": {
        "signId": "virgo",
        "sourceId": "ganeshaspeaks",
        "sourceName": "GaneshaSpeaks",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "30-10-2026",
        "predictionEn": "You will remain engrossed in personal matters at the cost of professionalism. Solve your problems today by taking them head-on. Ganesha warns you not to let your emotions suppress your enterprising spirit, especially in the evening.",
        "predictionTr": "Profesyonellik pahasına kişisel meselelere dalmaya devam edeceksiniz. Sorunlarınızı bugün doğrudan ele alarak çözün. Ganesha, özellikle akşamları duygularınızın girişimci ruhunuzu bastırmasına izin vermemeniz konusunda sizi uyarıyor.",
        "luckyColorTr": "",
        "fetchedAt": "2026-10-29T09:42:49.159Z"
      },
      "astrosage": {
        "signId": "virgo",
        "sourceId": "astrosage",
        "sourceName": "AstroSage",
        "day": "tomorrow",
        "date": "30 Ekim 2026 Cuma",
        "rawDate": "Friday, October 30, 2026",
        "predictionEn": "Health will remain fine despite a busy schedule. You will be presented with many new financial schemes today-Weigh the pros and cons carefully before making any commitment. Go out with friends who are positive and supportive. Your limitless love is very valuable for your beloved. Your hard work will show colors today at work. Someone from your past is likely to contact you and make it a memorable day. Your spouse had never been so awesome. You might get a nice surprise from the love of your life.",
        "predictionTr": "Yoğun programa rağmen sağlık iyi kalacak. Bugün size birçok yeni finansal plan sunulacak. Herhangi bir taahhütte bulunmadan önce artıları ve eksileri dikkatlice tartın. Olumlu ve destekleyici arkadaşlarınızla dışarı çıkın. Sınırsız sevginiz sevdiğiniz için çok değerlidir. Sıkı çalışmanız bugün iş yerinde renklerini gösterecek. Geçmişinizden birisinin sizinle iletişime geçmesi ve unutulmaz bir gün geçirmeniz muhtemeldir. Eşiniz hiç bu kadar muhteşem olmamıştı. Hayatınızın aşkından hoş bir sürpriz alabilirsiniz.",
        "luckyColorTr": "",
        "remedy": "Offering Dhruva at Lord Ganesha temple will be good for financial life.",
        "remedyTr": "Dhruva'yı Lord Ganesha tapınağında sunmak finansal yaşam için iyi olacaktır.",
        "fetchedAt": "2026-10-29T09:42:49.666Z"
      }
    }
  }
};

export function getHoroscopesForSign(
  signId: ZodiacSignId,
  day: HoroscopeDay = "today"
): HoroscopeApiResponse {
  const signInfo = ZODIAC_SIGNS[signId];
  const dayGroup = STATIC_HOROSCOPES[day] || STATIC_HOROSCOPES.today;
  const itemsMap = dayGroup[signId];
  const items: DailyHoroscopeItem[] = [];

  const formattedDate = getFormattedDayDate(day);

  // 1. Astroloji.org: SADECE BUGÜN (today) gösterilir
  if (itemsMap?.astrolojiorg && day === "today") {
    items.push({
      ...itemsMap.astrolojiorg,
      date: formattedDate,
    });
  }

  // 2. AskGanesha: Dün, Bugün, Yarın
  if (itemsMap?.askganesha) {
    items.push({
      ...itemsMap.askganesha,
      date: formattedDate,
    });
  }

  // 3. GaneshaSpeaks: Dün, Bugün, Yarın
  if (itemsMap?.ganeshaspeaks) {
    items.push({
      ...itemsMap.ganeshaspeaks,
      date: formattedDate,
    });
  }

  // 4. AstroSage: Boğa, Yengeç, Aslan ve Başak için Bugün ve Yarın
  if (itemsMap?.astrosage && day !== "yesterday") {
    items.push({
      ...itemsMap.astrosage,
      date: formattedDate,
    });
  }

  const availableSources: HoroscopeSourceId[] =
    day === "today"
      ? ["astrolojiorg", "askganesha", "ganeshaspeaks", "astrosage"]
      : day === "tomorrow"
      ? ["askganesha", "ganeshaspeaks", "astrosage"]
      : ["askganesha", "ganeshaspeaks"];

  return {
    success: true,
    day,
    date: formattedDate,
    sign: signInfo,
    items,
    availableSources,
  };
}
