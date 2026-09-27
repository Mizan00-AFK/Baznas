import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { tx, useI18n } from "../lib/i18n";

const STATS = [
  { label: tx("Muzaki terdaftar"), value: 4.2, suffix: tx("Juta+"), decimals: 1 },
  { label: tx("Mustahik terbantu"), value: 2.8, suffix: tx("Juta+"), decimals: 1 },
  { label: tx("Dana terhimpun 2025"), value: 815, prefix: "Rp ", suffix: tx("M"), decimals: 0 },
  { label: tx("Provinsi terjangkau"), value: 38, suffix: "", decimals: 0 },
];

function CountUp({ value, decimals, prefix = "", suffix = "", locale }: { value: number; decimals: number; prefix?: string; suffix?: string; locale: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setDisplay(0);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setDisplay(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix && ` ${suffix}`}
    </span>
  );
}

/** Banner dampak zakat — desain emosional level reflektif (Pertemuan 8). */
export function ZakatInfoBanner() {
  const { t, lang } = useI18n();
  const locale = lang === "id" ? "id-ID" : "en-US";
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1630568419655-6dfb1ca30cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
          alt={t("Relawan BAZNAS menyalurkan bantuan kepada penerima zakat")}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-brand-900/95 via-brand-800/85 to-brand-700/40" />
        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:p-12">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-100">
              {t("Dampak Zakat Anda")}
            </span>
            <h2 className="mt-4 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
              {t("Bersama Kita Wujudkan Indonesia Tanpa Kemiskinan")}
            </h2>
            <figure className="mt-6 max-w-lg border-s-4 border-gold-400 ps-4">
              <blockquote>
                <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose text-gold-100">
                  خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِمْ بِهَا
                </p>
                {lang !== "ar" && (
                  <p className="mt-2 text-[15px] italic leading-relaxed text-white/85">
                    “{t("Ambillah zakat dari harta mereka, guna membersihkan dan menyucikan mereka.")}”
                  </p>
                )}
              </blockquote>
              <figcaption className="mt-1 text-sm text-white/60">{t("QS. At-Taubah: 103")}</figcaption>
            </figure>
            <Link
              to="/layanan/bayar-zis"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 font-bold text-brand-800 transition hover:bg-gold-100"
            >
              {t("Bayar Zakat")} <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
            </Link>
          </div>

          <div>
            <dl className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md sm:p-5">
                  <dt className="text-sm text-white/75">{t(s.label)}</dt>
                  <dd className="mt-1 text-2xl font-extrabold sm:text-3xl">
                    <CountUp value={s.value} decimals={s.decimals} prefix={lang === "ar" ? "" : s.prefix} suffix={s.suffix && t(s.suffix)} locale={locale} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-white/55">{t("*Angka ilustrasi untuk prototipe.")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
