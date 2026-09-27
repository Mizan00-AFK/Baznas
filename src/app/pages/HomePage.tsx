import { Link } from "react-router";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { HeroCarousel } from "../components/HeroCarousel";
import { ShortcutSection } from "../components/ShortcutSection";
import { ZakatInfoBanner } from "../components/ZakatInfoBanner";
import { TransparansiSection } from "../components/TransparansiSection";
import { BeritaBaznas } from "../components/BeritaBaznas";
import { FaqAccordion } from "../components/FaqAccordion";
import { FAQ } from "../data/content";
import { useI18n } from "../lib/i18n";

export function HomePage() {
  const { t } = useI18n();
  return (
    <>
      <HeroCarousel />
      <ShortcutSection />
      <ZakatInfoBanner />
      <BeritaBaznas />
      <TransparansiSection />

      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.14em] text-brand-600">
              <MessageCircleQuestion size={16} aria-hidden /> {t("FAQ")}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t("Pertanyaan yang Sering Diajukan")}</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {t("Jawaban singkat untuk hal yang paling sering ditanyakan muzaki. Masih bingung? Hubungi Layanan Muzaki di 14047.")}
            </p>
            <Link to="/faq" className="mt-6 inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
              {t("Lihat semua pertanyaan")} <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
            </Link>
          </div>
          <FaqAccordion items={FAQ.slice(0, 5)} />
        </div>
      </section>
    </>
  );
}
