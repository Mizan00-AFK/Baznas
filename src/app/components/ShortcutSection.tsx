import { Link } from "react-router";
import { ArrowRight, Building2, Calculator, Clock, CreditCard, HandHeart, ShieldCheck } from "lucide-react";
import { ZIS_TYPES } from "../data/content";
import { tx, useI18n } from "../lib/i18n";

const SECONDARY = [
  {
    icon: CreditCard,
    label: tx("Transfer Rekening"),
    desc: tx("Transfer ke rekening resmi BAZNAS di bank syariah & nasional"),
    href: "/layanan/rekening",
  },
  {
    icon: Building2,
    label: tx("Kantor & Gerai"),
    desc: tx("Bayar tunai di kantor BAZNAS atau gerai mitra terdekat"),
    href: "/layanan/kantor-minimarket",
  },
];

/**
 * Pintasan pembayaran (H1, Pertemuan 7 & 9): aksi utama ditonjolkan,
 * teks rata kiri agar mudah dipindai, dan pilihan jenis dana bisa
 * langsung diklik untuk memulai formulir yang sudah terisi.
 */
export function ShortcutSection() {
  const { t } = useI18n();
  return (
    <section className="px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">{t("Layanan Muzaki")}</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t("Bayar Zakat, Infak, dan Sedekah")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {t("Pilih cara yang paling nyaman bagi Anda. Semua kanal resmi dan tercatat.")}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          {/* Aksi utama */}
          <div className="bg-islamic-pattern relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 text-white shadow-[0_24px_50px_-24px_rgba(20,92,44,0.8)] sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/25 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                  <Clock size={13} aria-hidden /> {t("Paling cepat · ± 2 menit")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                  <ShieldCheck size={13} aria-hidden /> {t("Bukti Setor Zakat via email")}
                </span>
              </div>
              <div className="mt-6 flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-lg">
                  <HandHeart size={28} aria-hidden />
                </span>
                <div>
                  <h3 className="text-2xl font-extrabold">{t("Formulir Online")}</h3>
                  <p className="mt-1 max-w-md text-[15px] leading-relaxed text-white/85">
                    {t("Pilih jenis dana untuk langsung memulai. Pembayaran via virtual account, QRIS, atau dompet digital.")}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ZIS_TYPES.map((type) => (
                  <Link
                    key={type.value}
                    to={`/layanan/bayar-zis?jenis=${type.value}`}
                    className="group rounded-2xl border border-white/20 bg-white/10 p-3 text-start transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-brand-800"
                  >
                    <span className="block text-base font-bold">{t(type.label)}</span>
                    <span className="mt-0.5 block text-xs text-white/75 group-hover:text-brand-700">{t(type.desc)}</span>
                  </Link>
                ))}
              </div>

              <Link
                to="/layanan/bayar-zis"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gold-400 px-5 font-bold text-brand-900 shadow-lg transition hover:bg-gold-100"
              >
                {t("Mulai Bayar")} <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {SECONDARY.map(({ icon: Icon, label, desc, href }) => (
              <Link
                key={label}
                to={href}
                className="group flex flex-1 items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_18px_40px_-24px_rgba(10,50,24,0.4)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={24} aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-bold text-ink">{t(label)}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-slate-600">{t(desc)}</span>
                </span>
                <ArrowRight size={20} className="mt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
              </Link>
            ))}

            <Link
              to="/edukasi/kalkulator-zakat"
              className="group flex items-center gap-4 rounded-3xl border border-dashed border-gold-400 bg-gold-50 p-5 transition hover:bg-gold-100"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-gold-700 shadow-sm">
                <Calculator size={24} aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-ink">{t("Belum tahu besaran zakat Anda?")}</span>
                <span className="mt-0.5 block text-sm text-slate-600">{t("Kalkulator menghitung otomatis dan mengecek nisab.")}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-gold-700">
                {t("Hitung dulu")} <ArrowRight size={16} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
