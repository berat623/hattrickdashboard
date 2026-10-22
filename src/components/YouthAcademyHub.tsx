"use client";

import { useState, useMemo } from "react";
import { Player } from "@/types/hattrick";
import { getHattrickSkillName } from "@/lib/algorithms/lineup";
import {
  Sparkles,
  GraduationCap,
  Search,
  Clock,
  TrendingUp,
  Star,
  Award,
  CheckCircle2,
  MapPin,
  Dumbbell,
  Coins,
} from "lucide-react";

interface YouthAcademyHubProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
}

interface ScoutCandidate {
  id: number;
  name: string;
  region: string;
  age: number;
  ageDays: number;
  role: string;
  specialty: string;
  currentPrimary: number;
  potentialPrimary: number;
  currentSecondary: number;
  potentialSecondary: number;
  primarySkillName: string;
  secondarySkillName: string;
}

const REGIONS = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Trabzon",
  "Antalya",
  "Adana",
];

const INITIAL_YOUTH_SQUAD: ScoutCandidate[] = [
  {
    id: 101,
    name: "Efe Can Yıldırım",
    region: "İstanbul",
    age: 15,
    ageDays: 42,
    role: "IM",
    specialty: "Kafa",
    currentPrimary: 5,
    potentialPrimary: 8,
    currentSecondary: 4,
    potentialSecondary: 6,
    primarySkillName: "Oyun Kuruculuk",
    secondarySkillName: "Kısa Pas",
  },
  {
    id: 102,
    name: "Kerem Arda Soylu",
    region: "İzmir",
    age: 16,
    ageDays: 18,
    role: "FW",
    specialty: "Hızlı",
    currentPrimary: 6,
    potentialPrimary: 8,
    currentSecondary: 5,
    potentialSecondary: 7,
    primarySkillName: "Golcülük",
    secondarySkillName: "Kanat",
  },
  {
    id: 103,
    name: "Mert Kaan Demirci",
    region: "Trabzon",
    age: 16,
    ageDays: 64,
    role: "CD",
    specialty: "Güçlü",
    currentPrimary: 6,
    potentialPrimary: 7,
    currentSecondary: 4,
    potentialSecondary: 6,
    primarySkillName: "Savunma",
    secondarySkillName: "Oyun Kuruculuk",
  },
  {
    id: 104,
    name: "Barış Tuna Aksoy",
    region: "Bursa",
    age: 15,
    ageDays: 88,
    role: "RW",
    specialty: "Teknik",
    currentPrimary: 5,
    potentialPrimary: 8,
    currentSecondary: 4,
    potentialSecondary: 6,
    primarySkillName: "Kanat",
    secondarySkillName: "Kısa Pas",
  },
];

export function YouthAcademyHub({
  players,
  onSelectPlayer,
}: YouthAcademyHubProps) {
  const [youthSquad, setYouthSquad] =
    useState<ScoutCandidate[]>(INITIAL_YOUTH_SQUAD);
  const [selectedRegion, setSelectedRegion] = useState<string>("İstanbul");
  const [searchRole, setSearchRole] = useState<string>("ANY");
  const [pulledCandidate, setPulledCandidate] = useState<ScoutCandidate | null>(
    null
  );

  // 17y 00d Promotion Calculator State
  const [calcAge, setCalcAge] = useState<number>(15);
  const [calcDays, setCalcDays] = useState<number>(65);
  const [calcCurrentSkill, setCalcCurrentSkill] = useState<number>(5);
  const [calcTargetSkill, setCalcTargetSkill] = useState<number>(8);
  const [hasSpecialty, setHasSpecialty] = useState<boolean>(true);

  const promotionCalc = useMemo(() => {
    const totalDaysNow = calcAge * 112 + calcDays;
    const targetDays17 = 17 * 112; // 17 years 0 days in Hattrick (112 days/year)
    const daysRemaining = Math.max(0, targetDays17 - totalDaysNow);
    const weeksRemaining = Math.floor(daysRemaining / 7);

    const levelsNeeded = Math.max(0, calcTargetSkill - calcCurrentSkill);
    const weeksNeededToMax = Math.round(levelsNeeded * 4.5);
    const canFinishBefore17 = weeksRemaining >= weeksNeededToMax;

    // Value at 17y 00d vs 17y 60d
    const base17Value =
      calcTargetSkill >= 8
        ? 14500000
        : calcTargetSkill === 7
        ? 5200000
        : 1400000;
    const specMult = hasSpecialty ? 1.65 : 1.0;
    const valAt17y00d = Math.round(base17Value * specMult);
    const valAt17y60d = Math.round(valAt17y00d * 0.42);

    return {
      daysRemaining,
      weeksRemaining,
      weeksNeededToMax,
      canFinishBefore17,
      valAt17y00d,
      valAt17y60d,
    };
  }, [calcAge, calcDays, calcCurrentSkill, calcTargetSkill, hasSpecialty]);

  const handleCallScout = () => {
    const firstNames = ["Arda", "Semih", "Kenan", "Can", "Yiğit", "Emirhan", "Poyraz", "Kuzey"];
    const lastNames = ["Yılmaz", "Kılıç", "Güler", "Yıldız", "Uzun", "Çelik", "Öztürk", "Şahin"];
    const specs = ["Hızlı", "Kafa", "Teknik", "Güçlü", "Öngörülemez", "Yok"];
    const roles =
      searchRole === "ANY" ? ["IM", "FW", "CD", "RW", "GK"] : [searchRole];
    const role = roles[Math.floor(Math.random() * roles.length)];

    const skillMap: Record<string, { pri: string; sec: string }> = {
      IM: { pri: "Oyun Kuruculuk", sec: "Kısa Pas" },
      FW: { pri: "Golcülük", sec: "Kısa Pas" },
      CD: { pri: "Savunma", sec: "Oyun Kuruculuk" },
      RW: { pri: "Kanat", sec: "Oyun Kuruculuk" },
      GK: { pri: "Kalecilik", sec: "Savunma" },
    };

    const newProspect: ScoutCandidate = {
      id: Date.now(),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
        lastNames[Math.floor(Math.random() * lastNames.length)]
      }`,
      region: selectedRegion,
      age: Math.random() > 0.35 ? 15 : 16,
      ageDays: Math.floor(Math.random() * 95) + 5,
      role,
      specialty: specs[Math.floor(Math.random() * specs.length)],
      currentPrimary: 5 + Math.floor(Math.random() * 2),
      potentialPrimary: 7 + Math.floor(Math.random() * 2),
      currentSecondary: 4 + Math.floor(Math.random() * 2),
      potentialSecondary: 6 + Math.floor(Math.random() * 2),
      primarySkillName: skillMap[role].pri,
      secondarySkillName: skillMap[role].sec,
    };

    setPulledCandidate(newProspect);
  };

  const acceptCandidate = () => {
    if (!pulledCandidate) return;
    setYouthSquad([pulledCandidate, ...youthSquad]);
    setPulledCandidate(null);
  };

  // Real A-Team U20 players
  const u20Players = players.filter((p) => p.age <= 20);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-400 text-slate-950">
              <GraduationCap className="w-4 h-4" />
              <span>ALTYAPI AKADEMİSİ & GÖZLEMCİ AĞI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              17 Yaş 0 Gün Elit Yıldız Üretim & Terfi Merkezi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Hattrick&apos;te en yüksek bonservis geliri, oyuncuyu tam{" "}
              <strong>17 yaş 00 gün</strong> olduğunda A takıma çıkarıp satmakla elde edilir. Gözlemci ağınızı ve terfi takviminizi buradan yönetin.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-left sm:text-right shrink-0">
            <div className="text-[11px] text-slate-300 font-semibold">
              A Takımdaki U-20 Oyuncularınız
            </div>
            <div className="text-xl font-black text-emerald-400">
              {u20Players.length} Genç Yetenek
            </div>
            <div className="text-[11px] text-amber-300 font-bold">
              1 Hattrick Yılı = 112 Gün (16 Hafta)
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Scout Network Puller (6 cols) & 17y00d Promotion Calculator (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Scout Network Simulator */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Haftalık Gözlemci (Scout) Çağrısı & Keşif
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                3 Aktif Gözlemci
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Arama Bölgesi (Türkiye):
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      📍 {r} Bölgesi
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Aranan Mevki Odağı:
                </label>
                <select
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                >
                  <option value="ANY">Herhangi Bir Oyuncu (En Yüksek Tavan)</option>
                  <option value="IM">Oyun Kurucu / Orta Saha</option>
                  <option value="FW">Golcü / Forvet</option>
                  <option value="CD">Stoper / Savunma</option>
                  <option value="RW">Kanat Oyuncusu</option>
                  <option value="GK">Kaleci</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCallScout}
              className="w-full py-3 px-4 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>📞 {selectedRegion} Gözlemcisini Ara ve Rapor Al</span>
            </button>

            {pulledCandidate && (
              <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
                      Gözlemci Raporu • {pulledCandidate.region}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {pulledCandidate.name} ({pulledCandidate.age}y{" "}
                      {pulledCandidate.ageDays}g)
                    </h4>
                  </div>
                  {pulledCandidate.specialty !== "Yok" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950">
                      ⚡ {pulledCandidate.specialty}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">
                      {pulledCandidate.primarySkillName}
                    </div>
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {getHattrickSkillName(pulledCandidate.currentPrimary)} →{" "}
                      {getHattrickSkillName(pulledCandidate.potentialPrimary)} (
                      {pulledCandidate.potentialPrimary})
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">
                      {pulledCandidate.secondarySkillName}
                    </div>
                    <div className="font-extrabold text-blue-600 dark:text-blue-400">
                      {getHattrickSkillName(pulledCandidate.currentSecondary)} →{" "}
                      {getHattrickSkillName(pulledCandidate.potentialSecondary)} (
                      {pulledCandidate.potentialSecondary})
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={acceptCandidate}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-pointer"
                  >
                    ✅ Akademiye Kabul Et
                  </button>
                  <button
                    type="button"
                    onClick={() => setPulledCandidate(null)}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Reddet ve Sıradaki Gözlemciye Geç
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Youth Double Training Tip */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
              <span>En Verimli Altyapı Çift Antrenman Kombinasyonları:</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              • <strong>Orta Saha:</strong> Oyun Kuruculuk (Birincil) + Kısa Pas (İkincil)
              <br />• <strong>Forvet:</strong> Golcülük (Birincil) + Golcülük&amp;Duran Top veya Kanat Hücumu (İkincil)
              <br />• <strong>Savunma:</strong> Savunma (Birincil) + Defansif Pozisyonlar (İkincil)
            </p>
          </div>
        </div>

        {/* Right 6 Cols: 17y 00d Promotion & Value Calculator */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  17 Yaş 00 Gün Terfi & Satış Geliri Hesaplayıcı
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                112 Gün Takvimi
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Mevcut Yaş:</span>
                    <span className="text-emerald-500">{calcAge} Yaş</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={16}
                    value={calcAge}
                    onChange={(e) => setCalcAge(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Mevcut Gün (0-111):</span>
                    <span className="text-emerald-500">{calcDays} Gün</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={111}
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Mevcut Ana Yetenek:</span>
                    <span>
                      {getHattrickSkillName(calcCurrentSkill)} ({calcCurrentSkill})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={7}
                    value={calcCurrentSkill}
                    onChange={(e) => setCalcCurrentSkill(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Tavan (Potansiyel):</span>
                    <span className="text-amber-500">
                      {getHattrickSkillName(calcTargetSkill)} ({calcTargetSkill})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={8}
                    value={calcTargetSkill}
                    onChange={(e) => setCalcTargetSkill(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={hasSpecialty}
                  onChange={(e) => setHasSpecialty(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Oyuncunun Özel Yeteneği Var (Hızlı / Kafa / Teknik / Güçlü)
                </span>
              </label>
            </div>

            {/* Calculation Result Boxes */}
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  17 Yaş 00 Güne Kalan Süre:
                </span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {promotionCalc.weeksRemaining} Hafta ({promotionCalc.daysRemaining} Gün)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Tavana Ulaşma Durumu:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                    promotionCalc.canFinishBefore17
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {promotionCalc.canFinishBefore17
                    ? `✅ Yetişir (~${promotionCalc.weeksNeededToMax} Hafta)`
                    : `⚠️ Gecikiyor (~${promotionCalc.weeksNeededToMax} Hafta Gerekiyor)`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-emerald-500/20">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">
                    17y 00g Satış Değeri
                  </div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {promotionCalc.valAt17y00d.toLocaleString("tr-TR")} TL
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">
                    17y 60g Satış Değeri
                  </div>
                  <div className="text-sm font-black text-rose-500">
                    {promotionCalc.valAt17y60d.toLocaleString("tr-TR")} TL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academy Prospects List */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
            Akademi İzleme Listesi ({youthSquad.length} Genç Aday)
          </h3>
          <span className="text-xs text-slate-400">
            Tavan yeteneğe göre sıralı
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {youthSquad.map((y) => (
            <div
              key={y.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {y.role} • {y.region}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {y.age}y {y.ageDays}g
                </span>
              </div>

              <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span>{y.name}</span>
                {y.specialty !== "Yok" && (
                  <span className="text-[10px] text-amber-500">
                    ⚡ {y.specialty}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">{y.primarySkillName}:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {y.currentPrimary} → {y.potentialPrimary} (
                    {getHattrickSkillName(y.potentialPrimary)})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{y.secondarySkillName}:</span>
                  <strong className="text-blue-500">
                    {y.currentSecondary} → {y.potentialSecondary}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
