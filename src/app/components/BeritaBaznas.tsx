import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { NEWS, NEWS_CATEGORY_HREF } from "../data/content";
import { tx, useI18n } from "../lib/i18n";

const CATEGORIES = [tx("Semua"), tx("Berita Program"), tx("Siaran Pers"), tx("Artikel"), tx("Newsletter")];

/**
 * Berita BAZNAS (wireframe: 1 berita utama + daftar). Ditambah chip filter
 * kategori — hasil langsung tersaring tanpa memuat ulang halaman.
 */
export function BeritaBaznas() {
  const { t, formatDate } = useI18n();
  const [category, setCategory] = useState("Semua");
  const items = useMemo(() => (category === "Semua" ? NEWS : NEWS.filter((n) => n.category === category)), [category]);
  const [featured, ...rest] = items;

  return (
    <section className="px-4 py-14 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">{t("Terkini")}</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t("Berita BAZNAS")}</h2>
          </div>
          <Link to="/berita" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
            {t("Lihat Semua")} <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
          </Link>
        </div>

        <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-1" role="toolbar" aria-label={t("Filter kategori berita")}>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c)}
                  className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                    active ? "bg-brand-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700"
                  }`}
                >
                  {t(c)}
                </button>
              );
            })}
          </div>
        </div>

        {featured && (
          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            <Link
              to={NEWS_CATEGORY_HREF[featured.category] ?? "/berita"}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-[0_24px_50px_-28px_rgba(10,50,24,0.5)] lg:col-span-3"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <ImageWithFallback
                  src={featured.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-700">
                  {t(featured.category)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Calendar size={14} aria-hidden /> {formatDate(featured.date)}
                </span>
                <h3 className="mt-2 text-xl font-bold leading-snug text-ink group-hover:text-brand-700 sm:text-2xl">{t(featured.title)}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600">{t(featured.desc)}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-700">
                  {t("Baca Selengkapnya")}
                  <ArrowRight size={16} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>

            <ul className="flex flex-col gap-2 lg:col-span-2">
              {rest.map((news) => (
                <li key={news.id}>
                  <Link
                    to={NEWS_CATEGORY_HREF[news.category] ?? "/berita"}
                    className="group flex gap-4 rounded-2xl p-3 transition hover:bg-brand-50"
                  >
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                      <ImageWithFallback
                        src={news.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 text-xs">
                        <span className="font-bold text-brand-700">{t(news.category)}</span>
                        <span className="text-slate-500">{formatDate(news.date)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 font-semibold leading-snug text-ink group-hover:text-brand-700">{t(news.title)}</p>
                    </div>
                  </Link>
                </li>
              ))}
              {rest.length === 0 && (
                <li className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  {t("Belum ada berita lain pada kategori ini.")}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
