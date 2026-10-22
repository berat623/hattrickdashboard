"use client";

import { useState, useMemo } from "react";
import { Player } from "@/types/hattrick";
import {
  HeartPulse,
  Stethoscope,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Flame,
  Sparkles,
  Brain,
  Coins,
} from "lucide-react";

interface MedicalStaffHubProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
}

export function MedicalStaffHub({
  players,
  onSelectPlayer,
}: MedicalStaffHubProps) {
  const injuredPlayers = players.filter((p) => p.injuryDays > 0);

  // Injury Healing Calculator State
  const [playerAge, setPlayerAge] = useState<number>(
    injuredPlayers[0]?.age || 24
  );
  const [injuryWeeks, setInjuryWeeks] = useState<number>(
    injuredPlayers[0]?.injuryDays || 2
  );
  const [medicLevel, setMedicLevel] = useState<number>(4);

  // Technical Staff Simulator State
  const [assistantLevels, setAssistantLevels] = useState<number>(8); // 0 - 10
  const [formCoachLevel, setFormCoachLevel] = useState<number>(4); // 0 - 5
  const [psychologistLevel, setPsychologistLevel] = useState<number>(3); // 0 - 5
  const [spokespersonLevel, setSpokespersonLevel] = useState<number>(3); // 0 - 5

  // Calculate exact Hattrick healing days
  const healingStats = useMemo(() => {
    const ageFactor = 1 + (playerAge - 20) * 0.055;
    const medicBonus = 1 - medicLevel * 0.085;
    const totalDaysToHeal = Math.max(
      2,
      Math.round(injuryWeeks * 7 * ageFactor * medicBonus)
    );
    const daysToBruised = Math.max(
      1,
      Math.round((injuryWeeks - 0.5) * 7 * ageFactor * medicBonus)
    );
    return {
      totalDaysToHeal,
      weeksToHeal: (totalDaysToHeal / 7).toFixed(1),
      daysToBruised,
      weeksToBruised: (daysToBruised / 7).toFixed(1),
    };
  }, [playerAge, injuryWeeks, medicLevel]);

  // Calculate Staff Impact & Cost
  const staffAnalysis = useMemo(() => {
    const trainingBoostPct = Math.round(assistantLevels * 3.2);
    const injuryRiskPct = Math.max(
      2,
      Math.round(8 + assistantLevels * 1.4 - medicLevel * 2.2)
    );
    const formBoost = (formCoachLevel * 0.2).toFixed(1);
    const confidenceBoost = Math.round(psychologistLevel * 12);
    const sponsorBoostPct = Math.round(spokespersonLevel * 4.5);

    const weeklyCost =
      assistantLevels * 18000 +
      medicLevel * 32000 +
      formCoachLevel * 32000 +
      psychologistLevel * 32000 +
      spokespersonLevel * 32000;

    return {
      trainingBoostPct,
      injuryRiskPct,
      formBoost,
      confidenceBoost,
      sponsorBoostPct,
      weeklyCost,
    };
  }, [
    assistantLevels,
    medicLevel,
    formCoachLevel,
    psychologistLevel,
    spokespersonLevel,
  ]);

  // Stamina Equilibrium Matrix by Age
  const staminaMatrix = [
    { ageGroup: "17 - 20 Yaş", s10: "7.5 (İyi)", s15: "8.2 (Mükemmel)", s20: "8.8 (Harika)" },
    { ageGroup: "21 - 25 Yaş", s10: "7.0 (İyi)", s15: "7.8 (Mükemmel)", s20: "8.5 (Mükemmel)" },
    { ageGroup: "26 - 29 Yaş", s10: "6.1 (Geçer)", s15: "7.1 (İyi)", s20: "7.9 (Mükemmel)" },
    { ageGroup: "30 - 32 Yaş", s10: "4.8 (Zayıf)", s15: "6.0 (Geçer)", s20: "7.1 (İyi)" },
    { ageGroup: "33+ Yaş", s10: "3.5 (Kötü)", s15: "4.9 (Yetersiz)", s20: "6.2 (Geçer)" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-rose-950/70 to-slate-900 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500 text-white">
              <Stethoscope className="w-4 h-4" />
              <span>SAĞLIK MERKEZİ & TEKNİK EKİP LABORATUVARI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Sakatlık İyileşme Motoru & Teknik Kadro Optimizasyonu
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Oyuncularınızın kaç günde &ldquo;Yara Bandı (Oynayabilir)&rdquo; seviyesine ineceğini hesaplayın ve kulüp teknik personelinizin antrenman/sakatlık dengesini optimize edin.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 shrink-0 text-left sm:text-right">
            <div className="text-[11px] text-slate-300 font-semibold">
              Revirdeki Oyuncu Sayısı
            </div>
            <div className="text-xl font-black text-rose-400">
              {injuredPlayers.length} Sakat Oyuncu
            </div>
            <div className="text-[11px] text-emerald-300 font-bold">
              Doktor Seviyesi: {medicLevel} / 5
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Injury Healing Calculator (6 cols) & Technical Staff Optimizer (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Hattrick Doctor & Injury Calculator */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Sakatlık İyileşme Süresi Hesaplayıcı
                </h3>
              </div>
              <span className="text-xs font-bold text-rose-500">
                Hattrick Doktor Formülü
              </span>
            </div>

            {injuredPlayers.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Kadrodaki Sakat Oyuncularınız (Seçmek İçin Tıklayın):
                </span>
                <div className="flex flex-wrap gap-2">
                  {injuredPlayers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPlayerAge(p.age);
                        setInjuryWeeks(p.injuryDays);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold cursor-pointer"
                    >
                      🚑 {p.name} ({p.age}y • +{p.injuryDays} hf)
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Sakatlanan Oyuncunun Yaşı:</span>
                  <span className="text-emerald-500">{playerAge} Yaş</span>
                </div>
                <input
                  type="range"
                  min={17}
                  max={36}
                  value={playerAge}
                  onChange={(e) => setPlayerAge(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Sakatlık Süresi (+Hafta):</span>
                  <span className="text-rose-500">+{injuryWeeks} Hafta</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={injuryWeeks}
                  onChange={(e) => setInjuryWeeks(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Kulüp Doktoru Seviyesi (0-5):</span>
                  <span className="text-blue-500">Seviye {medicLevel}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={medicLevel}
                  onChange={(e) => setMedicLevel(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10">
                <div className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-300">
                  🩹 Yara Bandı (Maçta Oynayabilir)
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {healingStats.totalDaysToHeal > 2
                    ? `${healingStats.daysToBruised} Gün (${healingStats.weeksToBruised} Hf)`
                    : "Hemen Oynayabilir"}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Antrenman alır ve maça çıkabilir
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10">
                <div className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-300">
                  ✅ %100 Tam İyileşme Süresi
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {healingStats.totalDaysToHeal} Gün ({healingStats.weeksToHeal} Hf)
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Sakatlık izi tamamen silinir
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Technical Staff Optimizer */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Teknik Ekip & Personel Simülatörü
                </h3>
              </div>
              <span className="text-xs font-extrabold text-rose-500">
                {staffAnalysis.weeklyCost.toLocaleString("tr-TR")} TL / Hf
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Yardımcı Antrenör Toplam Seviyesi (0-10):</span>
                  <span className="text-emerald-500">
                    +{staffAnalysis.trainingBoostPct}% Antrenman Hızı
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={assistantLevels}
                  onChange={(e) => setAssistantLevels(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Form Antrenörü Seviyesi (0-5):</span>
                  <span className="text-amber-500">
                    +{staffAnalysis.formBoost} Gizli Form Artışı
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={formCoachLevel}
                  onChange={(e) => setFormCoachLevel(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Spor Psikoloğu Seviyesi (0-5):</span>
                  <span className="text-purple-500">
                    +{staffAnalysis.confidenceBoost}% Özgüven & Takım Ruhu
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={psychologistLevel}
                  onChange={(e) => setPsychologistLevel(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Basın Sözcüsü Seviyesi (0-5):</span>
                  <span className="text-cyan-500">
                    +{staffAnalysis.sponsorBoostPct}% Sponsor & Taraftar Geliri
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={spokespersonLevel}
                  onChange={(e) => setSpokespersonLevel(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">
                  NET SAKATLIK RİSKİ
                </span>
                <strong
                  className={
                    staffAnalysis.injuryRiskPct <= 12
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }
                >
                  %{staffAnalysis.injuryRiskPct} (
                  {staffAnalysis.injuryRiskPct <= 12 ? "Güvenli" : "Doktor Şart"})
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">
                  HAFTALIK PERSONEL GİDERİ
                </span>
                <strong className="text-slate-900 dark:text-white">
                  {staffAnalysis.weeklyCost.toLocaleString("tr-TR")} TL
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Age vs Stamina Share Equilibrium Table */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
          Yaş Gruplarına Göre Kondisyon Dengesi (Stamina Equilibrium) Tablosu
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Yaş Grubu</th>
                <th className="py-2.5 px-3">%10 Kondisyon Payı</th>
                <th className="py-2.5 px-3">%15 Kondisyon Payı (Önerilen)</th>
                <th className="py-2.5 px-3">%20 Kondisyon Payı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staminaMatrix.map((row) => (
                <tr key={row.ageGroup}>
                  <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">
                    {row.ageGroup}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {row.s10}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {row.s15}
                  </td>
                  <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-semibold">
                    {row.s20}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
