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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const STATIC_HOROSCOPES: Record<
  HoroscopeDay,
  Record<ZodiacSignId, Record<HoroscopeSourceId, DailyHoroscopeItem | null>>
> = {
  today: {
    taurus: {
      askganesha: {
        signId: "taurus",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Today would be tiring, you might face difficulties in terms of achieving target-based deadlines at work. You will feel steady nonetheless, and financial stability will be maintained. Love life might take you on a journey of deep reflection, so remain calm and composed.",
        predictionTr:
          "Bugün çalışma ortamında hedeflere ve teslim tarihlerine yetişirken sabrınız sınanabilir. Kararlı ve sakin tutumunuz sayesinde finansal dengenizi başarıyla koruyacaksınız. İkili ilişkilerinizde ani tepkilerden kaçınarak anlayışlı davranmanız günün huzurunu sağlayacaktır.",
        luckyColor: "Emerald Green",
        luckyColorTr: "Zümrüt Yeşili",
        luckyNumber: "6",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "taurus",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Ganesha advises you to remain practical and avoid unnecessary emotional conflicts. Focus on building long-term security. A pleasant encounter with an old acquaintance will bring clarity to a pending decision.",
        predictionTr:
          "Ganesha, gereksiz duygusal sürtüşmelerden uzak durup pratik yaklaşımlara odaklanmanızı tavsiye ediyor. Uzun vadeli güvenlik ve maddi planlarınıza sadık kalın. Eski bir dostla yapacağınız sohbet, aklınızı kurcalayan bir kararda yol gösterici olacak.",
        luckyColor: "Cream",
        luckyColorTr: "Krem",
        luckyNumber: "5",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null, // Strictly only Leo & Virgo
    },
    cancer: {
      askganesha: {
        signId: "cancer",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Deep emotional clarity and intuitive wisdom guide your actions today. Creative endeavors bring satisfaction. Focus on harmony in domestic life and listen carefully to family members.",
        predictionTr:
          "Derin duygusal berraklık ve güçlü sezgileriniz bugün kararlarınıza yön verecek. Yaratıcı uğraşlar ve sevdiklerinizle geçireceğiniz huzurlu anlar enerjinizi yükseltecek. Aile içi iletişime özen göstermek size içsel güç kazandıracak.",
        luckyColor: "Silver",
        luckyColorTr: "Gümüş",
        luckyNumber: "2",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "cancer",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Ganesha says domestic matters will take center stage. Your sensitivity is your greatest strength if channeled constructively. Spend quiet moments recharging your energy.",
        predictionTr:
          "Ganesha, ailevi ve evle ilgili konuların ön planda olacağını belirtiyor. Hassasiyetinizi yapıcı bir şekilde kullandığınızda engelleri kolayca aşacaksınız. Akşam saatlerinde kendinize vakit ayırarak zihninizi dinlendirin.",
        luckyColor: "Pearl White",
        luckyColorTr: "İnci Beyazı",
        luckyNumber: "7",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null, // Strictly only Leo & Virgo
    },
    leo: {
      askganesha: {
        signId: "leo",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Your natural leadership and warmth inspire confidence in your team today. Professional recognition is likely. Be generous with encouragement and keep personal pride in check.",
        predictionTr:
          "Doğal liderlik vasfınız ve yaydığınız sıcak enerji çevrenizdekilere güven aşılayacak. İş hayatında takdir ve saygı toplama olasılığınız yüksek. Çevrenizi cesaretlendirirken alçakgönüllülüğü korumak başarınızı perçinleyecek.",
        luckyColor: "Gold",
        luckyColorTr: "Altın Sarısı",
        luckyNumber: "1",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "leo",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Ganesha foresees that you will excel in social and collaborative environments. Financial discipline will ensure that your ambitious projects move forward smoothly.",
        predictionTr:
          "Ganesha, sosyal ortamlarda ve ortaklaşa yürütülen projelerde parlayacağınızı öngörüyor. Harcamalarınızda göstereceğiniz disiplin, iddialı hedeflerinize güvenle ulaşmanızı sağlayacak.",
        luckyColor: "Orange",
        luckyColorTr: "Turuncu",
        luckyNumber: "9",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: {
        signId: "leo",
        sourceId: "astrosage",
        sourceName: "AstroSage",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Planetary influences favor strategic career moves and harmonious relations with elders. Generosity in helping someone in need brings spiritual peace. Romantic bonding is strengthened.",
        predictionTr:
          "Gezegen hareketleri stratejik kariyer adımlarını ve büyüklerle kurulacak olumlu diyalogları destekliyor. İhtiyaç sahibine uzatacağınız bir yardım eli içsel huzur sağlayacak. İkili ilişkilerinizde karşılıklı güven derinleşiyor.",
        luckyColor: "Ruby Red",
        luckyColorTr: "Yakut Kırmızısı",
        luckyNumber: "8",
        remedy: "Offer water to the rising Sun or feed birds for vital energy and peace.",
        remedyTr: "Güne saygı ve içsel dinginlik için sabah saatlerinde kuşlara yem ikram edin.",
        fetchedAt: new Date().toISOString(),
      },
    },
    virgo: {
      askganesha: {
        signId: "virgo",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Your analytical acumen solves complex issues that baffled others today. Health matters show improvement. Take time in the evening for mental relaxation.",
        predictionTr:
          "Analitik zihniniz ve detaylara hakimiyetiniz, başkalarının çözmekte zorlandığı karmaşık meseleleri hızla çözecek. Sağlık ve zindelik konularında olumlu gelişmeler var. Akşam saatlerinde dinlenmeye vakit ayırın.",
        luckyColor: "Green",
        luckyColorTr: "Yeşil",
        luckyNumber: "5",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "virgo",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Ganesha says clear communication will prevent any workplace confusion today. Paperwork and administrative tasks will be completed efficiently.",
        predictionTr:
          "Ganesha, kuracağınız net ve açık iletişimin olası iş yeri pürüzlerini peşinen engelleyeceğini vurguluyor. Bekleyen evrak ve resmi işlerinizi büyük bir düzenle neticelendireceksiniz.",
        luckyColor: "Navy Blue",
        luckyColorTr: "Lacivert",
        luckyNumber: "4",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: {
        signId: "virgo",
        sourceId: "astrosage",
        sourceName: "AstroSage",
        day: "today",
        date: getFormattedDayDate("today"),
        predictionEn:
          "Disciplined efforts yield tangible results. Financial savings tips will be beneficial. Spend quality time with family to rejuvenate your spirit.",
        predictionTr:
          "Disiplinli çalışmalarınız somut meyvelerini vermeye başlıyor. Finansal planlama ve bütçe yönetimi konusunda alacağınız tavsiyeler faydalı olacak. Ailenizle geçireceğiniz kaliteli zaman ruhunuzu dinlendirecek.",
        luckyColor: "Emerald Green",
        luckyColorTr: "Zümrüt Yeşili",
        luckyNumber: "3",
        remedy: "Feed green grass or vegetables to animals for career prosperity.",
        remedyTr: "Kariyer bereketi ve zihinsel berraklık için canlılara yeşil sebzeler ikram edin.",
        fetchedAt: new Date().toISOString(),
      },
    },
  },
  yesterday: {
    taurus: {
      askganesha: {
        signId: "taurus",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "A day focused on grounding your thoughts and managing routine tasks. Taking things slow helped avoid misunderstandings.",
        predictionTr:
          "Düşüncelerinizi toparlamaya ve rutin işleri düzenlemeye odaklandığınız bir gündü. Acele etmemek olası yanlış anlaşılmaların önüne geçti.",
        luckyColor: "Brown",
        luckyColorTr: "Toprak Kahvesi",
        luckyNumber: "4",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "taurus",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "Practical choices dominated your day. Family support proved valuable in resolving a lingering concern.",
        predictionTr:
          "Pratik ve mantıklı kararlar gününüze yön verdi. Ailenizin desteği uzun süredir bekleyen bir konunun çözülmesinde etkili oldu.",
        luckyColor: "Cream",
        luckyColorTr: "Krem",
        luckyNumber: "6",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null,
    },
    cancer: {
      askganesha: {
        signId: "cancer",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "Emotional depth and heartfelt conversations brought comfort. Listening to your intuition saved time and energy.",
        predictionTr:
          "Duygusal derinlik ve içten konuşmalar huzur sağladı. Sezgilerinizi dinlemek gereksiz zaman ve enerji kaybını önledi.",
        luckyColor: "Silver",
        luckyColorTr: "Gümüş",
        luckyNumber: "2",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "cancer",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "Domestic tranquility was prioritized. Small creative efforts offered a pleasant mental break.",
        predictionTr:
          "Evdeki huzur ve dinginlik ön plandaydı. Yaratıcı küçük uğraşlar zihninizi dinlendirmenize yardımcı oldu.",
        luckyColor: "White",
        luckyColorTr: "Beyaz",
        luckyNumber: "7",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null,
    },
    leo: {
      askganesha: {
        signId: "leo",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "Confidence in your capabilities inspired those around you. Opportunities for collaborative growth were prominent.",
        predictionTr:
          "Yeteneklerinize duyduğunuz güven çevrenizdekileri motive etti. Ortak çalışmalarda yeni fırsatlar öne çıktı.",
        luckyColor: "Gold",
        luckyColorTr: "Altın Sarısı",
        luckyNumber: "1",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "leo",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "Vibrant energy propelled pending projects forward. Maintaining tact in communication prevented friction.",
        predictionTr:
          "Yüksek enerjiniz bekleyen işlerin hızla ilerlemesini sağladı. İletişimde diplomatik kalmak sürtüşmeleri engelledi.",
        luckyColor: "Orange",
        luckyColorTr: "Turuncu",
        luckyNumber: "9",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null, // AstroSage does not provide yesterday
    },
    virgo: {
      askganesha: {
        signId: "virgo",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "Attention to fine details prevented costly oversights. Organization brought a sense of accomplishment.",
        predictionTr:
          "İnce ayrıntılara gösterdiğiniz dikkat olası hataları önledi. Düzenli çalışma prensibiniz verimli bir gün sağladı.",
        luckyColor: "Green",
        luckyColorTr: "Yeşil",
        luckyNumber: "5",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "virgo",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "yesterday",
        date: getFormattedDayDate("yesterday"),
        predictionEn:
          "Systematic approach handled heavy workloads with ease. Evening allowed for restful relaxation.",
        predictionTr:
          "Sistematik yaklaşımınız yoğun iş yükünün üstesinden kolayca gelmenizi sağladı. Akşam saatleri huzurlu bir dinlenme sundu.",
        luckyColor: "Navy Blue",
        luckyColorTr: "Lacivert",
        luckyNumber: "3",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null, // AstroSage does not provide yesterday
    },
  },
  tomorrow: {
    taurus: {
      askganesha: {
        signId: "taurus",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Tomorrow brings fresh financial optimism and creative inspirations. New perspectives on career growth will emerge.",
        predictionTr:
          "Yarın finansal konularda yeni bir iyimserlik ve yaratıcı ilhamlar getirecek. Kariyer planlarınızda yeni ve kazançlı bakış açıları belirecek.",
        luckyColor: "Olive Green",
        luckyColorTr: "Zeytin Yeşili",
        luckyNumber: "8",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "taurus",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Ganesha anticipates a day of positive social networking and meaningful discussions on future aspirations.",
        predictionTr:
          "Ganesha, geleceğe yönelik planlar ve faydalı sosyal temaslar açısından verimli bir gün olacağını öngörüyor.",
        luckyColor: "Beige",
        luckyColorTr: "Bej",
        luckyNumber: "6",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null,
    },
    cancer: {
      askganesha: {
        signId: "cancer",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Warmth and harmony blossom in relationships tomorrow. Creative impulses will bring joy and inner satisfaction.",
        predictionTr:
          "Yarın ikili ilişkilerde sıcaklık ve anlayış güçleniyor. Sanatsal ve yaratıcı dürtüleriniz size mutluluk ve tatmin getirecek.",
        luckyColor: "Sea Green",
        luckyColorTr: "Deniz Yeşili",
        luckyNumber: "3",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "cancer",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Ganesha advises gentle steps toward self-care and renewing bonds with close companions.",
        predictionTr:
          "Ganesha, kişisel bakımınıza ve yakın dostluk bağlarınızı güçlendirmeye zaman ayırmanızı tavsiye ediyor.",
        luckyColor: "Silver",
        luckyColorTr: "Gümüş",
        luckyNumber: "2",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: null,
    },
    leo: {
      askganesha: {
        signId: "leo",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Dynamic progress in enterprise and innovative ventures is signaled. Your enthusiasm will motivate everyone.",
        predictionTr:
          "Girişimlerinizde ve yenilikçi projelerinizde dinamik bir ilerleme bekleniyor. Coşkunuz ve enerjiniz çevrenize ilham verecek.",
        luckyColor: "Amber",
        luckyColorTr: "Kehribar Sarısı",
        luckyNumber: "7",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "leo",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Ganesha foresees positive recognition and fulfilling interactions in both professional and personal spheres.",
        predictionTr:
          "Ganesha, hem mesleki alanda hem de özel hayatınızda sevindirici takdirler ve tatmin edici buluşmalar öngörüyor.",
        luckyColor: "Yellow",
        luckyColorTr: "Sarı",
        luckyNumber: "1",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: {
        signId: "leo",
        sourceId: "astrosage",
        sourceName: "AstroSage",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Playing with kids or lighthearted recreation will bring great joy. Financial savings ideas will yield quick results.",
        predictionTr:
          "Sevdiklerinizle keyifli vakit geçirmek moralinizi tazeleyecek. Tasarruf ve birikim fikirleriniz hızla sonuç verecektir.",
        luckyColor: "Red and White",
        luckyColorTr: "Kırmızı ve Beyaz",
        luckyNumber: "9",
        remedy: "Practice mindfulness and express gratitude for harmonious vitality.",
        remedyTr: "Beden ve zihin dengesi için sabah saatlerinde şükran ve dinginlik anı yaratın.",
        fetchedAt: new Date().toISOString(),
      },
    },
    virgo: {
      askganesha: {
        signId: "virgo",
        sourceId: "askganesha",
        sourceName: "AskGanesha",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "A balanced, productive mindset will make tackling challenging problems effortless. Health and vigor are well-supported.",
        predictionTr:
          "Dengeli ve üretken zihniniz zorlu görünen sorunları zahmetsizce çözmenizi sağlayacak. Zindeliğiniz ve enerjiniz yüksek seyredecek.",
        luckyColor: "Forest Green",
        luckyColorTr: "Orman Yeşili",
        luckyNumber: "5",
        fetchedAt: new Date().toISOString(),
      },
      ganeshaspeaks: {
        signId: "virgo",
        sourceId: "ganeshaspeaks",
        sourceName: "GaneshaSpeaks",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Ganesha observes that thorough preparation will turn meetings and discussions into major successes.",
        predictionTr:
          "Ganesha, titiz hazırlıklarınızın önemli görüşme ve toplantıları büyük birer başarıya dönüştüreceğini belirtiyor.",
        luckyColor: "Teal",
        luckyColorTr: "Camgöbeği",
        luckyNumber: "4",
        fetchedAt: new Date().toISOString(),
      },
      astrosage: {
        signId: "virgo",
        sourceId: "astrosage",
        sourceName: "AstroSage",
        day: "tomorrow",
        date: getFormattedDayDate("tomorrow"),
        predictionEn:
          "Methodical progress continues. Unexpected positive correspondence from a distant friend will brighten your mood.",
        predictionTr:
          "Planlı ve metodik ilerleyişiniz sürüyor. Uzaktaki bir tanıdıktan gelecek samimi bir haber gününüze neşe katacak.",
        luckyColor: "Emerald Green",
        luckyColorTr: "Zümrüt Yeşili",
        luckyNumber: "6",
        remedy: "Care for domestic plants or green foliage for calm clarity.",
        remedyTr: "Zihinsel berraklık için yeşil yapraklı bitkilerin bakımını yapın.",
        fetchedAt: new Date().toISOString(),
      },
    },
  },
};

export function getHoroscopesForSign(
  signId: ZodiacSignId,
  day: HoroscopeDay = "today"
): HoroscopeApiResponse {
  const signInfo = ZODIAC_SIGNS[signId];
  const dayGroup = STATIC_HOROSCOPES[day] || STATIC_HOROSCOPES.today;
  const itemsMap = dayGroup[signId];
  const items: DailyHoroscopeItem[] = [];

  if (itemsMap.askganesha) items.push(itemsMap.askganesha);
  if (itemsMap.ganeshaspeaks) items.push(itemsMap.ganeshaspeaks);
  if (itemsMap.astrosage && (signId === "leo" || signId === "virgo") && day !== "yesterday") {
    items.push(itemsMap.astrosage);
  }

  const availableSources: HoroscopeSourceId[] =
    (signId === "leo" || signId === "virgo") && day !== "yesterday"
      ? ["askganesha", "ganeshaspeaks", "astrosage"]
      : ["askganesha", "ganeshaspeaks"];

  return {
    success: true,
    day,
    date: getFormattedDayDate(day),
    sign: signInfo,
    items,
    availableSources,
  };
}
