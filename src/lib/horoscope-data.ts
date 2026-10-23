import {
  DailyHoroscopeItem,
  HoroscopeApiResponse,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";

export function getTodayFormattedDate(): string {
  return new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const INITIAL_HOROSCOPES: Record<
  ZodiacSignId,
  Record<HoroscopeSourceId, DailyHoroscopeItem | null>
> = {
  taurus: {
    askganesha: {
      signId: "taurus",
      sourceId: "askganesha",
      sourceName: "AskGanesha",
      date: getTodayFormattedDate(),
      predictionEn:
        "The day would be tiring, you might face difficulties in terms of achieving target based deadlines at work. You will feel low all day, no matter what you do you will be able to earn money. Students are going to work harder to achieve their goals today. Love life might take you on a roller coaster ride full of emotions, be ready to ride carefully.",
      predictionTr:
        "Gün oldukça yorucu geçebilir, iş yerinde hedef odaklı teslim tarihlerine yetişme konusunda bazı zorluklarla karşılaşabilirsiniz. Gün boyu enerjiniz dalgalı olsa da maddi konularda kazanç elde etmeyi başaracaksınız. Öğrenciler hedeflerine ulaşmak için bugün daha disiplinli çalışacak. Aşk hayatınız sizi duygularla dolu bir iniş çıkışa sürükleyebilir; sakin ve temkinli kalmanız tavsiye edilir.",
      luckyColor: "Black",
      luckyColorTr: "Siyah",
      luckyNumber: "12",
      fetchedAt: new Date().toISOString(),
    },
    ganeshaspeaks: {
      signId: "taurus",
      sourceId: "ganeshaspeaks",
      sourceName: "GaneshaSpeaks",
      date: getTodayFormattedDate(),
      predictionEn:
        "You may feel let down as your folks may not extend the support you expected from them, says Ganesha. You should try to remain practical and not get swayed by emotions. It is highly likely that family feuds may erupt today. Ganesha advises you to avoid confrontations and keep smiling to emerge a winner.",
      predictionTr:
        "Ganesha, aileniz veya yakın çevrenizden beklediğiniz desteği görememenin sizde geçici bir hayal kırıklığı yaratabileceğini belirtiyor. Duygularınızın kontrolü ele geçirmesine izin vermemeli ve pratik kalmaya özen göstermelisiniz. Aile içi fikir ayrılıkları gündeme gelebilir; Ganesha tartışmalardan kaçınmanızı ve gülümseyerek kazanan taraf olmanızı öğütlüyor.",
      luckyColor: "Cream",
      luckyColorTr: "Krem",
      luckyNumber: "6",
      fetchedAt: new Date().toISOString(),
    },
    astrosage: null, // AstroSage is strictly only for Leo and Virgo
  },
  cancer: {
    askganesha: {
      signId: "cancer",
      sourceId: "askganesha",
      sourceName: "AskGanesha",
      date: getTodayFormattedDate(),
      predictionEn:
        "Deep emotional harmony and inner clarity will guide your choices today. You may find peace in creative activities or spending quality time near tranquil waters. Career matters require patience, while personal relationships blossom with sincerity.",
      predictionTr:
        "Bugün derin duygusal uyum ve içsel berraklık kararlarınıza rehberlik edecek. Yaratıcı aktivitelerle ilgilenmek veya huzurlu ortamlarda vakit geçirmek size büyük bir rahatlama sağlayacaktır. Kariyer konularında sabırlı olmanız gerekirken, ikili ilişkileriniz samimiyet ve sevgiyle güçlenecek.",
      luckyColor: "White",
      luckyColorTr: "Beyaz",
      luckyNumber: "7",
      fetchedAt: new Date().toISOString(),
    },
    ganeshaspeaks: {
      signId: "cancer",
      sourceId: "ganeshaspeaks",
      sourceName: "GaneshaSpeaks",
      date: getTodayFormattedDate(),
      predictionEn:
        "Ganesha says today is an ideal day for domestic happiness and heartfelt connections. Your intuition is at its peak; listen to what your heart whispers before making crucial family decisions. Financially, keep a watchful eye on unexpected expenses.",
      predictionTr:
        "Ganesha, bugünün evdeki huzur ve içten bağlar kurmak için harika bir gün olduğunu söylüyor. Sezgileriniz zirve noktasında; ailevi kararlar almadan önce kalbinizin sesini dinleyin. Maddi konularda ise beklenmedik harcamalara karşı bütçenizi korumanızda fayda var.",
      luckyColor: "Silver",
      luckyColorTr: "Gümüş",
      luckyNumber: "2",
      fetchedAt: new Date().toISOString(),
    },
    astrosage: null, // AstroSage is strictly only for Leo and Virgo
  },
  leo: {
    askganesha: {
      signId: "leo",
      sourceId: "askganesha",
      sourceName: "AskGanesha",
      date: getTodayFormattedDate(),
      predictionEn:
        "Your fiery confidence and natural authority will open doors that were previously closed. Recognition at the workplace is highly probable. Share your warmth with companions and do not let ego interfere with romance.",
      predictionTr:
        "Ateşli özgüveniniz ve doğal liderlik vasfınız, daha önce kapalı görünen kapıları aralayacak. İş ortamında takdir toplama ihtimaliniz oldukça yüksek. Sıcaklığınızı sevdiklerinizle cömertçe paylaşın ve egonun romantik bağlarınıza gölge düşürmesine izin vermeyin.",
      luckyColor: "Gold",
      luckyColorTr: "Altın Sarısı",
      luckyNumber: "1",
      fetchedAt: new Date().toISOString(),
    },
    ganeshaspeaks: {
      signId: "leo",
      sourceId: "ganeshaspeaks",
      sourceName: "GaneshaSpeaks",
      date: getTodayFormattedDate(),
      predictionEn:
        "Ganesha predicts that you will take center stage in all important meetings and social gatherings. Your enthusiasm is infectious and will inspire your peers. Keep your expenditure in balance despite temptations.",
      predictionTr:
        "Ganesha, tüm önemli toplantılarda ve sosyal ortamlarda ilgi odağı olacağınızı öngörüyor. Coşkunuz ve enerjiniz çevrenizdekileri motive edecek. Cazip fırsatlara rağmen harcamalarınızda ölçülü kalmanız uzun vadede kazandıracak.",
      luckyColor: "Orange",
      luckyColorTr: "Turuncu",
      luckyNumber: "9",
      fetchedAt: new Date().toISOString(),
    },
    astrosage: {
      signId: "leo",
      sourceId: "astrosage",
      sourceName: "AstroSage",
      date: getTodayFormattedDate(),
      predictionEn:
        "Avoid conflict as it may worsen your illness. Although no one prefers to lend or give away their money to anyone, but you'll feel relieved by lending your money to a person in need. Your partners will lose patience if you neglect his/her opinions. You are going to be absorbed in romantic thoughts and past dreams. The day is really great for your married life.",
      predictionTr:
        "Sağlığınızı korumak için gereksiz tartışmalardan kaçınmalısınız. Hiç kimse parasını başkasına borç vermekten hoşlanmasa da, gerçekten ihtiyaç sahibi birine yardım etmek size içsel bir huzur ve hafiflik kazandıracaktır. Partnerinizin fikirlerini önemsemek ilişki dengenizi koruyacaktır. Romantik düşüncelere dalabileceğiniz, evlilik ve birliktelik açısından oldukça tatmin edici bir gün.",
      luckyColor: "Black and Blue",
      luckyColorTr: "Siyah ve Mavi",
      luckyNumber: "8",
      remedy:
        "Offer water to the rising Sun or feed birds in the morning for auspicious health and spiritual tranquility.",
      remedyTr:
        "Ruhsal dinginlik ve sağlık için sabah vakitlerinde doğan güneşe saygı gösterin veya kuşlara yem verin.",
      fetchedAt: new Date().toISOString(),
    },
  },
  virgo: {
    askganesha: {
      signId: "virgo",
      sourceId: "askganesha",
      sourceName: "AskGanesha",
      date: getTodayFormattedDate(),
      predictionEn:
        "Your meticulous eye for detail will save the day in a crucial professional matter. Others may be overwhelmed by complexities, but you will find straightforward solutions. Take time in the evening to unwind and enjoy a healthy meal.",
      predictionTr:
        "Detaylara gösterdiğiniz titiz yaklaşım, iş hayatında kritik bir konunun başarıyla çözülmesini sağlayacak. Başkaları karmaşadan bunalırken, siz en net ve pratik çözümü üreteceksiniz. Akşam saatlerinde dinlenmeye ve sağlıklı beslenmeye özen göstermeyi ihmal etmeyin.",
      luckyColor: "Green",
      luckyColorTr: "Yeşil",
      luckyNumber: "5",
      fetchedAt: new Date().toISOString(),
    },
    ganeshaspeaks: {
      signId: "virgo",
      sourceId: "ganeshaspeaks",
      sourceName: "GaneshaSpeaks",
      date: getTodayFormattedDate(),
      predictionEn:
        "Ganesha observes that your analytical mindset will help you complete pending administrative or financial paperwork. Clear communication with colleagues will avoid misunderstandings. Good news from abroad or a distant acquaintance is likely.",
      predictionTr:
        "Ganesha, analitik zihninizin bekleyen evrak ve finansal planlamaları tamamlamada en büyük yardımcınız olacağını söylüyor. Çalışma arkadaşlarınızla kuracağınız açık iletişim yanlış anlaşılmaları önleyecek. Uzaklardan veya eski bir tanıdıktan sevindirici bir haber gelebilir.",
      luckyColor: "Emerald Green",
      luckyColorTr: "Zümrüt Yeşili",
      luckyNumber: "4",
      fetchedAt: new Date().toISOString(),
    },
    astrosage: {
      signId: "virgo",
      sourceId: "astrosage",
      sourceName: "AstroSage",
      date: getTodayFormattedDate(),
      predictionEn:
        "Maintain composure in demanding situations. Planetary transits encourage disciplined execution of your long-term goals. Spend constructive time with younger family members to strengthen bond. An unexpected financial gain or savings tip will brighten your day.",
      predictionTr:
        "Yoğun ve talepkar durumlarda soğukkanlılığınızı koruyun. Gezegen transitleri, uzun vadeli hedeflerinizin disiplinle uygulanmasını destekliyor. Aile içindeki gençlerle vakit geçirmek aranızdaki bağı pekiştirecektir. Beklenmedik bir finansal tasarruf fırsatı gününüze moral katacak.",
      luckyColor: "Navy Blue",
      luckyColorTr: "Lacivert",
      luckyNumber: "3",
      remedy:
        "Feed green grass or vegetables to cows or animals for enhanced career growth and intellectual sharpness.",
      remedyTr:
        "Zihinsel berraklık ve kariyer gelişimi için doğadaki canlılara yeşil sebzeler veya yem ikram edin.",
      fetchedAt: new Date().toISOString(),
    },
  },
};

export function getHoroscopesForSign(signId: ZodiacSignId): HoroscopeApiResponse {
  const signInfo = ZODIAC_SIGNS[signId];
  const itemsMap = INITIAL_HOROSCOPES[signId];
  const items: DailyHoroscopeItem[] = [];

  if (itemsMap.askganesha) items.push(itemsMap.askganesha);
  if (itemsMap.ganeshaspeaks) items.push(itemsMap.ganeshaspeaks);
  if (itemsMap.astrosage && (signId === "leo" || signId === "virgo")) {
    items.push(itemsMap.astrosage);
  }

  const availableSources: HoroscopeSourceId[] =
    signId === "leo" || signId === "virgo"
      ? ["askganesha", "ganeshaspeaks", "astrosage"]
      : ["askganesha", "ganeshaspeaks"];

  return {
    success: true,
    date: getTodayFormattedDate(),
    sign: signInfo,
    items,
    availableSources,
  };
}
