"use client";

import { useState } from "react";
import { SynastryChartData } from "@/types/natal";
import {
  RotateCcw,
  HeartHandshake,
  Heart,
  MessageCircle,
  Flame,
  ShieldCheck,
  Sparkles,
  Layers,
  Compass,
  Printer,
} from "lucide-react";

interface SynastryResultProps {
  data: SynastryChartData;
  onReset: () => void;
}

export function SynastryResult({ data, onReset }: SynastryResultProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "ask" | "iletisim" | "tutku" | "istikrar" | "karmik"
  >("all");

  const filteredAspects =
    selectedFilter === "all"
      ? data.aspects
      : data.aspects.filter((a) => a.category === selectedFilter);

  // Score styling
  const score = data.overallScore;
  let scoreBadge = "Uyumlu";
  let scoreColor = "text-emerald-500";
  let scoreBg = "bg-emerald-500/10 border-emerald-500/30";

  if (score >= 80) {
    scoreBadge = "Mükemmel Ruh Eşi Uyumu";
    scoreColor = "text-rose-500";
    scoreBg = "bg-rose-500/10 border-rose-500/30";
  } else if (score >= 65) {
    scoreBadge = "Güçlü & Verimli Çekim";
    scoreColor = "text-amber-500";
    scoreBg = "bg-amber-500/10 border-amber-500/30";
  } else {
    scoreBadge = "Dönüştürücü & Öğretici İlişki";
    scoreColor = "text-indigo-500";
    scoreBg = "bg-indigo-500/10 border-indigo-500/30";
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-500" />
            <span>
              {data.person1.name} & {data.person2.name} — Sinastri Uyumu
            </span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {data.person1.city} ({data.person1.birthDateFormatted}) • {data.person2.city} ({data.person2.birthDateFormatted})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-500" />
            <span>Yazdır / PDF</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yeni Sinastri</span>
          </button>
        </div>
      </div>

      {/* Hero Compatibility Score Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${scoreBg} bg-white dark:bg-zinc-900 shadow-xs flex flex-col sm:flex-row items-center gap-6`}>
        {/* Score Ring */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="7"
              className="text-zinc-100 dark:text-zinc-800"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * score) / 100}
              strokeLinecap="round"
              className={`${scoreColor} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-2xl sm:text-3xl font-extrabold ${scoreColor}`}>
              %{score}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Genel Uyum</span>
          </div>
        </div>

        {/* Text Verdict */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            {scoreBadge}
          </div>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {data.summaryText}
          </p>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
            <span>Toplam {data.aspects.length} Gezegen Açısı İncelendi</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {data.aspects.filter((a) => a.isHarmonious).length} Destekleyici Açı
            </span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400">
              {data.aspects.filter((a) => !a.isHarmonious).length} Geliştirici Açı
            </span>
          </div>
        </div>
      </div>

      {/* 5 Categories Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Love */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Aşk & Romantizm</span>
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              %{data.categories.love.score}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full"
              style={{ width: `${data.categories.love.score}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
            {data.categories.love.desc}
          </p>
        </div>

        {/* Communication */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-sky-500" />
              <span>Zihinsel & İletişim</span>
            </span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              %{data.categories.communication.score}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${data.categories.communication.score}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
            {data.categories.communication.desc}
          </p>
        </div>

        {/* Passion */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Tutku & Çekim</span>
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              %{data.categories.passion.score}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${data.categories.passion.score}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
            {data.categories.passion.desc}
          </p>
        </div>

        {/* Stability */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Güven & İstikrar</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              %{data.categories.stability.score}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${data.categories.stability.score}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
            {data.categories.stability.desc}
          </p>
        </div>

        {/* Spiritual */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Ruhsal & Karmik</span>
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              %{data.categories.spiritual.score}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${data.categories.spiritual.score}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
            {data.categories.spiritual.desc}
          </p>
        </div>
      </div>

      {/* Burç Uyum Kartları (Güneş & Ay) */}
      {data.zodiacMatches && data.zodiacMatches.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Burçlar Arası Temel Mizaç Uyumu</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.zodiacMatches.map((zm, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 dark:text-white">{zm.title}</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {zm.pair}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {zm.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ev Çapraz Yerleşimleri (House Overlays) */}
      {data.houseOverlays && data.houseOverlays.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Ev Çapraz Yerleşimleri (Partnerinizin Hayatındaki Etkiniz)</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sizin gezegenlerinizin partnerinizin haritasındaki evlere düşüşü, bu ilişkinin hangi hayat alanlarında en yoğun şekilde hissedileceğini gösterir.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {data.houseOverlays.map((ho, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                  <span>
                    {ho.planet} Partnerin {ho.targetHouse}. Evinde
                  </span>
                  <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400">
                    Etki Alanı
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {ho.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cross-Aspects Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
            Çapraz Gezegen Açıları & Detaylı Yorumları ({filteredAspects.length})
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("ask")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === "ask"
                  ? "bg-rose-500 text-white font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Aşk
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("iletisim")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === "iletisim"
                  ? "bg-sky-500 text-white font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              İletişim
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("tutku")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === "tutku"
                  ? "bg-amber-500 text-white font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Tutku
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("istikrar")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === "istikrar"
                  ? "bg-emerald-500 text-white font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              İstikrar
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("karmik")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === "karmik"
                  ? "bg-indigo-500 text-white font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Karmik
            </button>
          </div>
        </div>

        {/* Aspect Cards List */}
        <div className="space-y-2.5">
          {filteredAspects.map((asp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>{asp.planet1} (1. Kişi)</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-amber-600 dark:text-amber-400">{asp.type}</span>
                  <span className="text-zinc-400">•</span>
                  <span>{asp.planet2} (2. Kişi)</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      asp.isHarmonious
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    Orb: {asp.orb}°
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {asp.interpretation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
