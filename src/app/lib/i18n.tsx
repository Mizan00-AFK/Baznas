import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EN } from "./locales/en";
import { AR } from "./locales/ar";
import { setThousandSeparator } from "./format";

export type Lang = "id" | "en" | "ar";

export const LANGUAGES: { code: Lang; short: string; label: string }[] = [
  { code: "id", short: "ID", label: "Bahasa Indonesia" },
  { code: "en", short: "EN", label: "English" },
  { code: "ar", short: "AR", label: "العربية" },
];

/**
 * Kamus dikunci oleh teks Bahasa Indonesia aslinya, jadi komponen cukup menulis
 * t("Bayar Zakat"). Nilai dinamis memakai {nama}: t("Minimal {jumlah}.", { jumlah }).
 */
const DICTIONARY: Record<Exclude<Lang, "id">, Record<string, string>> = { en: EN, ar: AR };

const LOCALE: Record<Lang, string> = { id: "id-ID", en: "en-GB", ar: "ar-u-nu-latn" };

/**
 * Penanda teks yang akan diterjemahkan saat ditampilkan (dipakai di data/array).
 * Tidak mengubah apa pun; membantu skrip pengecekan menemukan semua teks.
 */
export const tx = (text: string) => text;

type Vars = Record<string, string | number>;

function interpolate(text: string, vars?: Vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`));
}

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  t: (text: string, vars?: Vars) => string;
  /** Format tanggal ISO (YYYY-MM-DD) sesuai bahasa. */
  formatDate: (iso: string) => string;
  /** Nama bulan (0–11) sesuai bahasa. */
  monthName: (month: number) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

function readInitialLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "ar" || fromUrl === "id") return fromUrl;
    const stored = localStorage.getItem("baznas-lang");
    if (stored === "en" || stored === "ar" || stored === "id") return stored;
  } catch {
    /* localStorage bisa tidak tersedia */
  }
  return "id";
}

// Hanya saat pengembangan: catat teks yang belum punya terjemahan.
const missing = new Set<string>();

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readInitialLang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  // Diset saat render agar semua angka pada render ini memakai pemisah yang benar.
  setThousandSeparator(lang === "id" ? "." : ",");

  const t = useCallback(
    (text: string, vars?: Vars) => {
      if (lang === "id") return interpolate(text, vars);
      const translated = DICTIONARY[lang][text];
      if (translated === undefined && import.meta.env.DEV) {
        missing.add(text);
        document.documentElement.dataset.i18nMissing = JSON.stringify([...missing]);
      }
      return interpolate(translated ?? text, vars);
    },
    [lang],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = t("BAZNAS — Badan Amil Zakat Nasional");
    try {
      localStorage.setItem("baznas-lang", lang);
    } catch {
      /* abaikan */
    }
  }, [lang, dir, t]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir,
      setLang,
      t,
      formatDate: (iso) =>
        new Date(iso + "T00:00:00").toLocaleDateString(LOCALE[lang], { day: "numeric", month: "long", year: "numeric" }),
      monthName: (month) => new Date(2025, month, 1).toLocaleDateString(LOCALE[lang], { month: "long" }),
    }),
    [lang, dir, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n harus dipakai di dalam I18nProvider");
  return ctx;
}
