import { Link } from "react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FINANCE_PROGRAMS_2025, FINANCE_YEARLY } from "../data/content";
import { useI18n } from "../lib/i18n";

/**
 * Ringkasan transparansi di beranda (H5, Pertemuan 9): angka kunci
 * dan distribusi per bidang tampil langsung, bukan hanya berkas PDF.
 */
export function TransparansiSection() {
  const { t, lang } = useI18n();
  const latest = FINANCE_YEARLY[FINANCE_YEARLY.length - 1];
  const ratio = (latest.penyaluran / latest.penghimpunan) * 100;
  const maxProgram = Math.max(...FINANCE_PROGRAMS_2025.map((p) => p.value));

  return (
    <section className="bg-islamic-pattern-green bg-brand-50/60 px-4 py-14 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.14em] text-brand-600">
            <ShieldCheck size={16} aria-hidden /> {t("Transparansi")}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t("Transparansi Dana Umat")}</h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600">
            {t("Setiap rupiah tercatat dan diaudit. Lihat berapa yang dihimpun, berapa yang sudah disalurkan, dan ke mana dana Anda bekerja.")}
          </p>

          <div className="mt-8">
            <div className="text-sm text-slate-600">{t("Dana terhimpun tahun {year}", { year: latest.year })}</div>
            <div className="mt-1 text-5xl font-extrabold tracking-tight text-ink tabular-nums">{t("Rp {n} M", { n: latest.penghimpunan })}</div>
          </div>

          <div className="mt-6 max-w-md">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold text-ink">{t("Sudah tersalurkan")}</span>
              <span className="font-bold tabular-nums text-ink">
                {t("Rp {n} M", { n: latest.penyaluran })} · {ratio.toLocaleString(lang === "id" ? "id-ID" : "en-US", { maximumFractionDigits: 1 })}%
              </span>
            </div>
            <div
              className="mt-2 h-3 overflow-hidden rounded-full bg-brand-100"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(ratio)}
              aria-label={t("Rasio penyaluran terhadap penghimpunan")}
            >
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${ratio}%` }} />
            </div>
          </div>

          <Link
            to="/informasi/laporan"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-5 font-bold text-white transition hover:bg-brand-700"
          >
            {t("Lihat Laporan Lengkap")} <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
          </Link>
        </div>

        <figure className="rounded-3xl border border-brand-100 bg-white p-6 shadow-[0_24px_50px_-30px_rgba(10,50,24,0.45)] sm:p-8">
          <figcaption>
            <div className="text-lg font-bold text-ink">{t("Penyaluran per bidang, {year}", { year: latest.year })}</div>
            <div className="text-sm text-slate-500">{t("Dalam miliar rupiah")}</div>
          </figcaption>
          <ul className="mt-6 space-y-4">
            {FINANCE_PROGRAMS_2025.map((p) => (
              <li key={p.name} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]">
                <span className="text-sm font-medium text-slate-700">{t(p.name)}</span>
                <span className="flex items-center gap-2">
                  <span
                    className="h-5 rounded-e-[4px] bg-brand-600"
                    style={{ width: `${(p.value / maxProgram) * 82}%` }}
                    title={`${t(p.name)}: ${t("Rp {n} M", { n: p.value })}`}
                  />
                  <span className="text-sm font-semibold tabular-nums text-ink">{p.value}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-slate-400">{t("*Data ilustrasi untuk prototipe.")}</p>
        </figure>
      </div>
    </section>
  );
}
