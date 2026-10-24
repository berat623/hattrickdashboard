"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import rawCities from "@/data/cities.json";
import { CityInfo, HouseSystem, AyanamsaSystem } from "@/types/natal";
import { CalculateChartParams } from "@/lib/natal-engine";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  HeartHandshake,
  ChevronDown,
  Globe,
  Sliders,
  Sparkles,
} from "lucide-react";

interface PersonFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  useCustomLocation: boolean;
  city: CityInfo;
  customCityName: string;
  customLat: string;
  customLon: string;
  customTz: string;
}

interface SynastryFormProps {
  onCalculate: (params1: CalculateChartParams, params2: CalculateChartParams) => void;
  loading?: boolean;
}

const CITIES: CityInfo[] = (rawCities as CityInfo[]).sort((a, b) =>
  a.city.localeCompare(b.city, "tr")
);

const DEFAULT_CITY1: CityInfo = CITIES.find((c) => c.city === "İstanbul") || {
  city: "İstanbul",
  lat: 41.0138,
  lng: 28.9603,
  tz: "Europe/Istanbul",
};

const DEFAULT_CITY2: CityInfo = CITIES.find((c) => c.city === "Ankara") || {
  city: "Ankara",
  lat: 39.9334,
  lng: 32.8597,
  tz: "Europe/Istanbul",
};

export function SynastryForm({ onCalculate, loading }: SynastryFormProps) {
  const [p1, setP1] = useState<PersonFormData>({
    name: "1. Kişi",
    birthDate: "1995-05-15",
    birthTime: "14:30",
    useCustomLocation: false,
    city: DEFAULT_CITY1,
    customCityName: "",
    customLat: "41.01",
    customLon: "28.96",
    customTz: "Europe/Istanbul",
  });

  const [p2, setP2] = useState<PersonFormData>({
    name: "2. Kişi",
    birthDate: "1997-08-20",
    birthTime: "09:15",
    useCustomLocation: false,
    city: DEFAULT_CITY2,
    customCityName: "",
    customLat: "39.93",
    customLon: "32.85",
    customTz: "Europe/Istanbul",
  });

  const [search1, setSearch1] = useState<string>(DEFAULT_CITY1.city);
  const [search2, setSearch2] = useState<string>(DEFAULT_CITY2.city);
  const [drop1, setDrop1] = useState<boolean>(false);
  const [drop2, setDrop2] = useState<boolean>(false);

  // Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [houseSystem, setHouseSystem] = useState<HouseSystem>("placidus");
  const [ayanamsaSystem, setAyanamsaSystem] = useState<AyanamsaSystem>("tropical");

  const dropRef1 = useRef<HTMLDivElement>(null);
  const dropRef2 = useRef<HTMLDivElement>(null);

  const filtered1 = useMemo(() => {
    const q = search1.trim().toLocaleLowerCase("tr");
    if (!q) return CITIES.slice(0, 30);
    return CITIES.filter((c) => c.city.toLocaleLowerCase("tr").includes(q)).slice(0, 30);
  }, [search1]);

  const filtered2 = useMemo(() => {
    const q = search2.trim().toLocaleLowerCase("tr");
    if (!q) return CITIES.slice(0, 30);
    return CITIES.filter((c) => c.city.toLocaleLowerCase("tr").includes(q)).slice(0, 30);
  }, [search2]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef1.current && !dropRef1.current.contains(e.target as Node)) {
        setDrop1(false);
      }
      if (dropRef2.current && !dropRef2.current.contains(e.target as Node)) {
        setDrop2(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const getParams = (person: PersonFormData): CalculateChartParams => {
      let city = person.city.city;
      let lat = person.city.lat;
      let lon = person.city.lng;
      let timezone = person.city.tz;

      if (person.useCustomLocation) {
        city = person.customCityName.trim() || "Özel Konum";
        lat = parseFloat(person.customLat) || 0;
        lon = parseFloat(person.customLon) || 0;
        timezone = person.customTz.trim() || "Europe/Istanbul";
      }

      return {
        name: person.name.trim() || "Kişi",
        birthDate: person.birthDate,
        birthTime: person.birthTime,
        city,
        lat,
        lon,
        timezone,
        houseSystem,
        ayanamsaSystem,
      };
    };

    onCalculate(getParams(p1), getParams(p2));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-5 transition-all"
    >
      <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-rose-500" />
          <span>Detaylı Sinastri (İlişki & Evlilik Uyumu)</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          İki kişinin doğum haritaları arasındaki gezegen açılarını, romantizm, iletişim, tutku ve karmik bağları analiz edin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person 1 Box */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-3">
          <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-700">
            <span>1. Kişi (Siz)</span>
            <span className="text-[11px] font-normal text-rose-600 dark:text-rose-400">Güneş & Ay</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">İsim</label>
            <input
              type="text"
              value={p1.name}
              onChange={(e) => setP1({ ...p1, name: e.target.value })}
              placeholder="Örn: Burak"
              className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Doğum Tarihi</label>
              <input
                type="date"
                value={p1.birthDate}
                onChange={(e) => setP1({ ...p1, birthDate: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Doğum Saati</label>
              <input
                type="time"
                value={p1.birthTime}
                onChange={(e) => setP1({ ...p1, birthTime: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1 relative" ref={dropRef1}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">Doğum Yeri</span>
              <button
                type="button"
                onClick={() => setP1({ ...p1, useCustomLocation: !p1.useCustomLocation })}
                className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                {p1.useCustomLocation ? "Şehir Seç" : "Özel Konum"}
              </button>
            </div>

            {!p1.useCustomLocation ? (
              <>
                <input
                  type="text"
                  value={search1}
                  onChange={(e) => {
                    setSearch1(e.target.value);
                    setDrop1(true);
                  }}
                  onFocus={() => setDrop1(true)}
                  placeholder="Şehir arayın..."
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
                {drop1 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg">
                    {filtered1.map((c) => (
                      <button
                        key={`${c.city}-${c.lat}-${c.lng}`}
                        type="button"
                        onClick={() => {
                          setP1({ ...p1, city: c });
                          setSearch1(c.city);
                          setDrop1(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b border-zinc-50 dark:border-zinc-800/40 last:border-0"
                      >
                        {c.city}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <input
                  type="number"
                  step="0.01"
                  value={p1.customLat}
                  onChange={(e) => setP1({ ...p1, customLat: e.target.value })}
                  placeholder="Enlem"
                  className="px-2 py-1 rounded text-[11px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                />
                <input
                  type="number"
                  step="0.01"
                  value={p1.customLon}
                  onChange={(e) => setP1({ ...p1, customLon: e.target.value })}
                  placeholder="Boylam"
                  className="px-2 py-1 rounded text-[11px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Person 2 Box */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-3">
          <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-700">
            <span>2. Kişi (Partneriniz)</span>
            <span className="text-[11px] font-normal text-rose-600 dark:text-rose-400">Venüs & Mars</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">İsim</label>
            <input
              type="text"
              value={p2.name}
              onChange={(e) => setP2({ ...p2, name: e.target.value })}
              placeholder="Örn: Ayşe"
              className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Doğum Tarihi</label>
              <input
                type="date"
                value={p2.birthDate}
                onChange={(e) => setP2({ ...p2, birthDate: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Doğum Saati</label>
              <input
                type="time"
                value={p2.birthTime}
                onChange={(e) => setP2({ ...p2, birthTime: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1 relative" ref={dropRef2}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">Doğum Yeri</span>
              <button
                type="button"
                onClick={() => setP2({ ...p2, useCustomLocation: !p2.useCustomLocation })}
                className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                {p2.useCustomLocation ? "Şehir Seç" : "Özel Konum"}
              </button>
            </div>

            {!p2.useCustomLocation ? (
              <>
                <input
                  type="text"
                  value={search2}
                  onChange={(e) => {
                    setSearch2(e.target.value);
                    setDrop2(true);
                  }}
                  onFocus={() => setDrop2(true)}
                  placeholder="Şehir arayın..."
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
                {drop2 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg">
                    {filtered2.map((c) => (
                      <button
                        key={`${c.city}-${c.lat}-${c.lng}`}
                        type="button"
                        onClick={() => {
                          setP2({ ...p2, city: c });
                          setSearch2(c.city);
                          setDrop2(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b border-zinc-50 dark:border-zinc-800/40 last:border-0"
                      >
                        {c.city}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <input
                  type="number"
                  step="0.01"
                  value={p2.customLat}
                  onChange={(e) => setP2({ ...p2, customLat: e.target.value })}
                  placeholder="Enlem"
                  className="px-2 py-1 rounded text-[11px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                />
                <input
                  type="number"
                  step="0.01"
                  value={p2.customLon}
                  onChange={(e) => setP2({ ...p2, customLon: e.target.value })}
                  placeholder="Boylam"
                  className="px-2 py-1 rounded text-[11px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-semibold text-zinc-800 dark:text-zinc-200"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-rose-500" />
            <span>Sinastri Hesaplama Seçenekleri (Ev & Zodyak)</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Ev Sistemi</label>
                <select
                  value={houseSystem}
                  onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                >
                  <option value="placidus">Placidus</option>
                  <option value="whole_sign">Whole Sign (Tüm Burç)</option>
                  <option value="equal">Equal House (Eşit Ev)</option>
                  <option value="porphyry">Porphyry</option>
                  <option value="koch">Koch</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Zodyak / Ayanamsa</label>
                <select
                  value={ayanamsaSystem}
                  onChange={(e) => setAyanamsaSystem(e.target.value as AyanamsaSystem)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                >
                  <option value="tropical">Tropikal (Batı)</option>
                  <option value="lahiri">Lahiri (Vedik Sidereal)</option>
                  <option value="kp">KP Sistemi</option>
                  <option value="raman">Raman</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{loading ? "Sinastri Hesaplanıyor..." : "Sinastri (İlişki Uyumu) Analizi Yap"}</span>
        </button>
      </div>
    </form>
  );
}
