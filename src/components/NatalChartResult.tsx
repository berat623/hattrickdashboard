"use client";

import { useState } from "react";
import { NatalChartData } from "@/types/natal";
import {
  ASPECT_MEANINGS,
  HOUSE_MEANINGS,
  PLANET_SIGN_INTERPRETATIONS,
  RETRO_INTERPRETATIONS,
  HOUSE_SYSTEM_DETAILS,
  AYANAMSA_DETAILS,
  D9_INTERPRETATIONS,
  ASCENDANT_INTERPRETATIONS,
  MIDHEAVEN_INTERPRETATIONS,
  SPOUSE_BY_7TH_SIGN,
  SPOUSE_MEETING_BY_RULER_HOUSE,
  DARAKARAKA_INTERPRETATIONS,
} from "@/lib/natal-interpretations";
import {
  RotateCcw,
  Sparkles,
  Compass,
  Activity,
  BookOpen,
  Star,
  Shield,
  Heart,
  Flame,
  UserCheck,
  Briefcase,
  MapPin,
  Sparkle,
  Printer,
  Search,
  X,
  Globe,
  Users,
  MessageSquare,
  Hourglass,
  TrendingUp,
  Palette,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";

interface NatalChartResultProps {
  data: NatalChartData;
  onReset: () => void;
}

export function NatalChartResult({ data, onReset }: NatalChartResultProps) {
  const [activeTab, setActiveTab] = useState<
    "chart" | "spouse" | "interpretations" | "planets" | "d9" | "elements" | "aspects"
  >("interpretations");

  const [activeWheelView, setActiveWheelView] = useState<"d1" | "d9">("d1");
  const [interpSearch, setInterpSearch] = useState<string>("");

  const houseSysTitle =
    HOUSE_SYSTEM_DETAILS[data.houseSystem]?.name || data.houseSystem;
  const ayanamsaTitle =
    AYANAMSA_DETAILS[data.ayanamsaSystem]?.name || data.ayanamsaSystem;

  const seventhHouseSign = data.seventhHouse?.sign || data.houses[6]?.sign || "Koç";
  const spouseInfo = SPOUSE_BY_7TH_SIGN[seventhHouseSign] || SPOUSE_BY_7TH_SIGN["Koç"];
  const meetingInfo =
    data.seventhHouse && SPOUSE_MEETING_BY_RULER_HOUSE[data.seventhHouse.rulerHouse]
      ? SPOUSE_MEETING_BY_RULER_HOUSE[data.seventhHouse.rulerHouse]
      : "Eşinizle sosyal ortamlar veya ortak iş hedefleri vesilesiyle karşılaşacaksınız.";

  const spouse = data.spouseProfile || {
    sign: seventhHouseSign,
    summary: spouseInfo.summary,
    karakter: spouseInfo.karakter,
    fiziksel: spouseInfo.fiziksel,
    meslek: spouseInfo.meslek,
    tanisma: spouseInfo.tanisma,
    dinamik: spouseInfo.dinamik,
    memleket: spouseInfo.memleket,
    yasFarki: spouseInfo.yasFarki,
    aileYapisi: spouseInfo.aileYapisi,
    iletisimTarzi: spouseInfo.iletisimTarzi,
    hobiler: spouseInfo.hobiler,
    muhtemelBurclar: spouseInfo.muhtemelBurclar || [],
    ilkIntiba: spouseInfo.ilkIntiba,
    evlilikSonrasiDegisim: spouseInfo.evlilikSonrasiDegisim,
    evlilikZamanlamasi: spouseInfo.evlilikZamanlamasi,
    meetingByRulerHouse: meetingInfo,
    genderPerspective: "",
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>{data.name} — Doğum & D9 Haritası</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {data.city} • {data.birthDateFormatted} {data.birthTime}
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
            <span>Yeni Hesaplama</span>
          </button>
        </div>
      </div>

      {/* Summary Info Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-1.5">
        <div className="font-semibold text-zinc-900 dark:text-white flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span>{data.city}</span>
          <span>•</span>
          <span>{data.birthDateFormatted} {data.birthTime} (Yerel)</span>
          <span>•</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal">UTC: {data.utcTime}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-600 dark:text-zinc-300">
          <span>
            Yükselen (ASC):{" "}
            <strong className="text-amber-600 dark:text-amber-400 font-bold">
              {data.ascendant.sign} {data.ascendant.degree}°{String(data.ascendant.minute).padStart(2, "0")}&apos;
            </strong>
          </span>
          <span>•</span>
          <span>
            Tepe Noktası (MC):{" "}
            <strong className="text-amber-700 dark:text-amber-300 font-bold">
              {data.midheaven.sign} {data.midheaven.degree}°{String(data.midheaven.minute).padStart(2, "0")}&apos;
            </strong>
          </span>
          <span>•</span>
          <span>
            7. Ev (Eş Noktası):{" "}
            <strong className="text-rose-600 dark:text-rose-400 font-bold">
              {seventhHouseSign} Burcunda
            </strong>
          </span>
        </div>

        {/* System Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/20 text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
            Ev: {houseSysTitle}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
            Zodyak: {ayanamsaTitle}
          </span>
          {data.ayanamsaValue > 0 && (
            <span className="text-zinc-500 dark:text-zinc-400">
              (Ayanamsa: {data.ayanamsaValue.toFixed(2)}°)
            </span>
          )}
          {data.vargottamaPlanets.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 font-medium flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span>{data.vargottamaPlanets.length} Vargottama Gezegen</span>
            </span>
          )}
        </div>
      </div>

      {/* Core Mottos (Güneş, Ay, Yükselen) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Sun */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 border-l-4 border-l-amber-500 space-y-1 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Güneş Burcu (Öz Benlik)
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">
            {data.summary.sunSign} ({data.summary.sunHouse}. Ev)
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            {data.summary.sunMotto}
          </div>
        </div>

        {/* Moon */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 border-l-4 border-l-indigo-500 space-y-1 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Ay Burcu (Duygu & Ruh)
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">
            {data.summary.moonSign} ({data.summary.moonHouse}. Ev)
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            {data.summary.moonMotto}
          </div>
        </div>

        {/* Ascendant */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 border-l-4 border-l-emerald-500 space-y-1 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Yükselen Burç (İlk İzlenim)
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">
            {data.summary.ascendantSign}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            {data.summary.ascendantMotto}
          </div>
        </div>
      </div>

      {/* Annual Profection (Yıllık Profeksiyon) Highlight Card */}
      {data.profection && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yıllık Profeksiyon: {data.profection.age} Yaş • {data.profection.house}. Ev Yılı</span>
            </span>
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Yılın Zaman Yöneticisi: <strong className="text-amber-600 dark:text-amber-400 font-bold">{data.profection.ruler}</strong>
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
            {data.profection.houseTheme}
          </h3>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {data.profection.desc}
          </p>
        </div>
      )}

      {/* Main Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("interpretations")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "interpretations"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>Detaylı Yorumlar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("spouse")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "spouse"
              ? "bg-rose-500 text-white shadow-xs font-bold"
              : "text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Eşinizin Portresi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("chart")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "chart"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Harita Çarkı
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("planets")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "planets"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Gezegen Tablosu
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("d9")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "d9"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          D9 Navamsha
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("elements")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "elements"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Element & Nitelik
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("aspects")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "aspects"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Açılar
        </button>
      </div>

      {/* TAB: EŞİNİZİN PORTRESİ (EVLİLİK & EŞ ANALİZİ) */}
      {activeTab === "spouse" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Spouse Hero Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-purple-500/10 border border-rose-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white flex items-center gap-1.5 shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Gelecekteki Eşiniz: {spouse.sign} Arketipi</span>
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                7. Ev (Alçalan - DSC) Noktası
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
              {spouse.summary}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Doğum haritanızda 7. Ev (Alçalan Burç), evlilikte hayatınızı birleştireceğiniz kişinin temel mizaç ve ruhsal niteliklerini simgeler. Sizin 7. eviniz <strong>{spouse.sign}</strong> burcundadır.
            </p>
          </div>

          {/* Gender Perspective Archetype (Eril / Dişil Partner Göstergesi) */}
          {spouse.genderPerspective && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 border border-rose-500/25 space-y-2">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Haritanızdaki Eril & Dişil Partner Göstergeleri</span>
              </h3>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {spouse.genderPerspective}
              </p>
            </div>
          )}

          {/* Ultra Detailed Spouse Grid (12 Kartlık Kapsamlı Profil) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Karakter & Mizaç */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-500" />
                <span>Karakter ve Kişilik Yapısı</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.karakter}
              </p>
            </div>

            {/* Fiziksel Görünüş */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-amber-500" />
                <span>Fiziksel Özellikler & Dış Görünüş</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.fiziksel}
              </p>
            </div>

            {/* Memleketi ve Coğrafi Kökeni */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-500" />
                <span>Memleketi ve Coğrafi Kökeni</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.memleket}
              </p>
            </div>

            {/* Yaş Farkı & Olgunluk Düzeyi */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Yaş Farkı & Olgunluk Düzeyi</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.yasFarki}
              </p>
            </div>

            {/* Aile Yapısı ve Sosyo-Ekonomik Durumu */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Aile Yapısı ve Sosyo-Ekonomik Çevresi</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.aileYapisi}
              </p>
            </div>

            {/* İletişim Tarzı & Tartışma Çözme Üslubu */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-500" />
                <span>İletişim ve Tartışma Üslubu</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.iletisimTarzi}
              </p>
            </div>

            {/* Hobileri ve Boş Zaman Uğraşları */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-violet-500" />
                <span>Hobileri ve İlgi Alanları</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.hobiler}
              </p>
            </div>

            {/* Meslek ve Kariyer Alanları */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-500" />
                <span>Muhtemel Meslek & Kariyer Alanları</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.meslek}
              </p>
            </div>

            {/* Tanışma Ortamı ve Şartları */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Nerede ve Nasıl Tanışacaksınız?</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.tanisma}
              </p>
            </div>

            {/* İlk Karşılaşma Anı ve İlk İntiba */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-pink-500" />
                <span>İlk Karşılaşma Anı & İlk İntiba</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.ilkIntiba}
              </p>
            </div>

            {/* Evlilik Sonrası Hayatınızdaki Büyük Değişim */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Evlilik Sonrası Hayatınızdaki Büyük Değişim</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.evlilikSonrasiDegisim}
              </p>
            </div>

            {/* Evlilik Zamanlaması ve Uygun Dönemler */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-purple-500" />
                <span>Evlilik Zamanlaması & Uygun Yaşlar</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spouse.evlilikZamanlamasi}
              </p>
            </div>
          </div>

          {/* En Muhtemel Burçlar (Pill badges) */}
          {spouse.muhtemelBurclar && spouse.muhtemelBurclar.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2.5 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Eşinizin En Muhtemel Güneş / Yükselen Burçları</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Astrolojik 7. ev aksınız ve trigon açılarınızla en yüksek manyetik uyumu yakalayan burçlar:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {spouse.muhtemelBurclar.map((bName, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-500/20"
                  >
                    ★ {bName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 7th House Ruler & Meeting Scenario */}
          {data.seventhHouse && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>
                  7. Ev Yöneticisinin Konumu ({data.seventhHouse.ruler} Gezegeni {data.seventhHouse.rulerHouse}. Evde)
                </span>
              </h3>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {spouse.meetingByRulerHouse}
              </p>
            </div>
          )}

          {/* Darakaraka (DK) Vedik Ruh Eşi Kartı */}
          {data.darakaraka && (
            <div className="p-4 sm:p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>Darakaraka (Vedik Ruh Eşi Göstergesi): {data.darakaraka.planet} ({data.darakaraka.sign})</span>
                </h3>
                <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                  {data.darakaraka.degree}°{String(data.darakaraka.minute).padStart(2, "0")}&apos;
                </span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {data.darakaraka.desc} Vedik astrolojide haritanızda boylam derecesi en düşük olan gezegen ruh eşinizin içsel karakterini temsil eder.
              </p>
            </div>
          )}

          {/* Evlilik Dinamiği */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 shadow-xs">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" />
              <span>Evlilik ve Birliktelik Dinamiğiniz</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {spouse.dinamik}
            </p>
          </div>
        </div>
      )}

      {/* TAB: ASTROLOJİ.ORG FORMATINDA DETAYLI YORUMLAR (HER GEZEGEN VE DERECE TEK TEK) */}
      {activeTab === "interpretations" && (() => {
        const query = interpSearch.trim().toLocaleLowerCase("tr");
        const ascInterp = ASCENDANT_INTERPRETATIONS[data.ascendant.sign];
        const mcInterp = MIDHEAVEN_INTERPRETATIONS[data.midheaven.sign];

        const showAsc =
          !query ||
          "yükselen".includes(query) ||
          "asc".includes(query) ||
          data.ascendant.sign.toLocaleLowerCase("tr").includes(query) ||
          (ascInterp?.detail || "").toLocaleLowerCase("tr").includes(query) ||
          (ascInterp?.traits || []).some((t) => t.toLocaleLowerCase("tr").includes(query));

        const showMc =
          !query ||
          "mc".includes(query) ||
          "tepe noktası".includes(query) ||
          "kariyer".includes(query) ||
          data.midheaven.sign.toLocaleLowerCase("tr").includes(query) ||
          (mcInterp?.desc || "").toLocaleLowerCase("tr").includes(query);

        const filteredPlanets = data.planets.filter((p) => {
          if (!query) return true;
          const pComments = PLANET_SIGN_INTERPRETATIONS[p.name]?.[p.sign] || [];
          const retroC = p.isRetrograde ? RETRO_INTERPRETATIONS[p.name] || [] : [];
          return (
            p.name.toLocaleLowerCase("tr").includes(query) ||
            p.sign.toLocaleLowerCase("tr").includes(query) ||
            `${p.house}. ev`.includes(query) ||
            (p.isRetrograde && "retro".includes(query)) ||
            (p.isVargottama && "vargottama".includes(query)) ||
            pComments.some((c) => c.toLocaleLowerCase("tr").includes(query)) ||
            retroC.some((c) => c.toLocaleLowerCase("tr").includes(query))
          );
        });

        const filteredSensitive = data.sensitivePoints.filter((sp) => {
          if (!query) return true;
          return (
            sp.name.toLocaleLowerCase("tr").includes(query) ||
            sp.sign.toLocaleLowerCase("tr").includes(query) ||
            `${sp.house}. ev`.includes(query) ||
            sp.desc.toLocaleLowerCase("tr").includes(query)
          );
        });

        const hasAnyResult = showAsc || showMc || filteredPlanets.length > 0 || filteredSensitive.length > 0;

        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Search Input Bar */}
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <Search className="w-4 h-4 text-zinc-400 ml-1 shrink-0" />
              <input
                type="text"
                value={interpSearch}
                onChange={(e) => setInterpSearch(e.target.value)}
                placeholder="Yorumlarda ara (Örn: Güneş, Merkür, Koç, Retro, 10. ev, Kariyer, İletişim)..."
                className="bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none w-full"
              />
              {interpSearch && (
                <button
                  type="button"
                  onClick={() => setInterpSearch("")}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  title="Aramayı temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {!hasAnyResult ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm space-y-2">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                  &quot;{interpSearch}&quot; ile eşleşen bir gezegen veya yorum bulunamadı.
                </p>
                <p className="text-xs">Farklı bir gezegen ismi, burç veya ev numarası aramayı deneyebilirsiniz.</p>
                <button
                  type="button"
                  onClick={() => setInterpSearch("")}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-500 text-white font-medium cursor-pointer"
                >
                  Filtreyi Temizle
                </button>
              </div>
            ) : (
              <>
                {/* 1. Yükselen Burç (ASC) Detaylı Yorumu */}
                {showAsc && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3 border-l-4 border-l-emerald-500">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5">
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="text-emerald-500 text-base">ASC</span>
                        <span>
                          Yükselen {data.ascendant.sign} Burcunda (1. Ev)
                        </span>
                      </h3>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {data.ascendant.degree}°{String(data.ascendant.minute).padStart(2, "0")}&apos;
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {ascInterp?.detail || "Yükselen burcunuz hayata yaklaşımınızı, dış dünyaya verdiğiniz ilk izlenimi ve bedensel enerjinizi yansıtır."}
                    </p>

                    {ascInterp?.traits && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ascInterp.traits.map((trait, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium"
                          >
                            ✓ {trait}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Tepe Noktası (MC) Detaylı Yorumu */}
                {showMc && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-2.5 border-l-4 border-l-amber-600">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5">
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="text-amber-600 text-base">MC</span>
                        <span>
                          Tepe Noktası (MC) {data.midheaven.sign} Burcunda (10. Ev)
                        </span>
                      </h3>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {data.midheaven.degree}°{String(data.midheaven.minute).padStart(2, "0")}&apos;
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {mcInterp?.desc || "Tepe Noktası (Medium Coeli), hayatınızda ulaşacağınız en yüksek kariyer hedeflerini, toplumsal saygınlığınızı ve mesleki yöneliminizi simgeler."}
                    </p>
                  </div>
                )}

                {/* 3. Tüm Gezegenler */}
                {filteredPlanets.map((p) => {
                  const planetComments =
                    PLANET_SIGN_INTERPRETATIONS[p.name]?.[p.sign] || [];
                  const retroComment = p.isRetrograde
                    ? RETRO_INTERPRETATIONS[p.name]
                    : null;

                  return (
                    <div
                      key={p.name}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5">
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <span className="text-amber-500 text-base">{p.symbol}</span>
                          <span>
                            {p.name} {p.sign} Burcunda ({p.house}. Ev)
                          </span>
                          {p.isRetrograde && (
                            <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">
                              Retro
                            </span>
                          )}
                          {p.isVargottama && (
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 font-bold px-1.5 py-0.5 rounded">
                              Vargottama
                            </span>
                          )}
                        </h3>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {p.degree}°{String(p.minute).padStart(2, "0")}&apos;
                        </span>
                      </div>

                      {planetComments.length > 0 ? (
                        <ul className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-2 leading-relaxed">
                          {planetComments.map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500 font-bold mt-0.5">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-zinc-600 dark:text-zinc-300">
                          {p.name} enerjisi {p.sign} burcunda ve {p.house}. evde hayatınızda belirgin bir odaklanma ve güç alanı yaratır.
                        </p>
                      )}

                      {/* Retro interpretation if active */}
                      {p.isRetrograde && retroComment && retroComment.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                          <strong className="font-semibold block flex items-center gap-1">
                            <span>⚡ Retro (R) Karma & İçselleşme Etkisi:</span>
                          </strong>
                          <p>{retroComment[0]}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 4. Hassas Noktalar (Rahu, Ketu, Lilith, Şiron, Pars Fortunae) */}
                {filteredSensitive.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                      Hassas Noktalar ve Karmik Eksen Açıklamaları
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredSensitive.map((sp) => (
                        <div
                          key={sp.name}
                          className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                            <span className="flex items-center gap-1.5">
                              <span className="text-amber-500">{sp.symbol}</span>
                              <span>{sp.name}</span>
                            </span>
                            <span className="font-mono text-zinc-500 text-[11px]">
                              {sp.degree}°{String(sp.minute).padStart(2, "0")}&apos;
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                            {sp.sign} Burcunda ({sp.house}. Ev)
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {sp.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })()}

      {/* TAB: HARİTA ÇARKI (D1 / D9 TOGGLE) */}
      {activeTab === "chart" && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveWheelView("d1")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeWheelView === "d1"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              D1 Rashi (Ana Doğum Çarkı)
            </button>
            <button
              type="button"
              onClick={() => setActiveWheelView("d9")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeWheelView === "d9"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>D9 Navamsha Çarkı</span>
            </button>
          </div>

          <div
            className="w-full max-w-[380px] aspect-square rounded-full shadow-inner overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white"
            dangerouslySetInnerHTML={{
              __html: activeWheelView === "d1" ? data.svgWheel : data.svgD9Wheel,
            }}
          />

          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
            {activeWheelView === "d1"
              ? "12 Ev, burç kuşakları ve gezegen boylamlarının hassas natal yerleşimi."
              : "D9 Navamsha haritası: Ruhun kaderi, evlilik dinamikleri ve Vargottama gezegenler (★ ile işaretli)."}
          </div>
        </div>
      )}

      {/* TAB: PLANETS TABLE */}
      {activeTab === "planets" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs overflow-x-auto">
            <div className="text-xs font-bold text-zinc-900 dark:text-white mb-3">
              Temel Gezegen Konumları & Asalet Durumu
            </div>
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                  <th className="py-2.5 px-3">Gezegen</th>
                  <th className="py-2.5 px-3 text-center">D1 Burç</th>
                  <th className="py-2.5 px-3 text-center">Derece</th>
                  <th className="py-2.5 px-3 text-center">Ev</th>
                  <th className="py-2.5 px-3 text-center">Asalet</th>
                  <th className="py-2.5 px-3 text-center">D9 Burç</th>
                  <th className="py-2.5 px-3 text-right">Nakshatra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {data.planets.map((p) => {
                  let dignityColor = "text-zinc-500";
                  if (p.dignity === "Yönetici") dignityColor = "text-emerald-600 dark:text-emerald-400 font-bold";
                  else if (p.dignity === "Yücelim") dignityColor = "text-blue-600 dark:text-blue-400 font-bold";
                  else if (p.dignity === "Zararda") dignityColor = "text-rose-600 dark:text-rose-400 font-medium";
                  else if (p.dignity === "Düşük") dignityColor = "text-amber-600 dark:text-amber-400 font-medium";

                  return (
                    <tr
                      key={p.name}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="text-base text-amber-600 dark:text-amber-400 w-5 text-center">
                          {p.symbol}
                        </span>
                        <span>{p.name}</span>
                        {p.isVargottama && (
                          <span
                            title="Vargottama: D1 ve D9'da aynı burçta!"
                            className="text-[10px] bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 font-bold px-1.5 py-0.5 rounded"
                          >
                            Vargottama
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-zinc-700 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <span>{p.signSymbol}</span>
                          <span>{p.sign}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {p.degree}°{String(p.minute).padStart(2, "0")}&apos;
                        {p.isRetrograde && (
                          <span className="ml-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">
                            R
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-zinc-800 dark:text-zinc-200">
                        {p.house}. Ev
                      </td>
                      <td className={`py-2.5 px-3 text-center text-xs ${dignityColor}`}>
                        {p.dignity || "Nötr"}
                      </td>
                      <td className="py-2.5 px-3 text-center text-zinc-700 dark:text-zinc-300 font-medium">
                        {p.d9Sign}
                      </td>
                      <td className="py-2.5 px-3 text-right text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{p.nakshatra}</span> (P{p.pada})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: D9 NAVAMSHA */}
      {activeTab === "d9" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{D9_INTERPRETATIONS.title}</span>
            </h3>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {D9_INTERPRETATIONS.overview}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-yellow-500" />
              <span>Vargottama Gezegenleriniz ({data.vargottamaPlanets.length})</span>
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {D9_INTERPRETATIONS.vargottamaDesc}
            </p>

            {data.vargottamaPlanets.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {data.vargottamaPlanets.map((pName) => {
                  const pObj = data.planets.find((p) => p.name === pName);
                  return (
                    <div
                      key={pName}
                      className="px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-semibold text-yellow-900 dark:text-yellow-200 flex items-center gap-2"
                    >
                      <span className="text-amber-600 dark:text-amber-400 text-sm">{pObj?.symbol}</span>
                      <span>{pName}</span>
                      <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                        ({pObj?.sign} burcunda)
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                Haritanızda doğrudan Vargottama konumunda gezegen bulunmamaktadır.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB: ELEMENT & MODALITY */}
      {activeTab === "elements" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Element Dağılımı</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Baskın: {data.elementBalance.dominantElement}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-red-600 dark:text-red-400">Ateş</span>
                  <span>%{data.elementBalance.fire}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${data.elementBalance.fire}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400">Toprak</span>
                  <span>%{data.elementBalance.earth}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${data.elementBalance.earth}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-sky-600 dark:text-sky-400">Hava</span>
                  <span>%{data.elementBalance.air}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${data.elementBalance.air}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-blue-600 dark:text-blue-400">Su</span>
                  <span>%{data.elementBalance.water}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${data.elementBalance.water}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ASPECTS */}
      {activeTab === "aspects" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
              Önemli Gezegen Açıları ({data.aspects.length} Açı)
            </h3>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Uyumlu
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Zorlu
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {data.aspects.map((a, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    {a.planet1} {a.type} {a.planet2}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {ASPECT_MEANINGS[a.type] || ""}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      a.isHarmonious
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    Orb: {a.orb}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
