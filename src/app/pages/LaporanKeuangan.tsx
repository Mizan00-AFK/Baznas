import { useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { BarChart3, ChevronDown, Download, FileText, Folder, FolderOpen, Table2 } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { AUDITED_YEARS, FINANCE_PROGRAMS_2025, FINANCE_YEARLY, MONTHLY_YEARS } from "../data/content";
import { tx, useI18n } from "../lib/i18n";

// Palet tervalidasi aman buta warna: hijau BAZNAS + emas (emas < 3:1 → disertai label & tabel).
const SERIES = { penghimpunan: "#1a7a3a", penyaluran: "#c98500" };

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  const { t } = useI18n();
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <div className="mb-1 font-semibold text-gray-900">{label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}</span>
          <span className="ms-auto ps-4 font-semibold tabular-nums text-gray-900">{t("Rp {n} M", { n: p.value ?? 0 })}</span>
        </div>
      ))}
    </div>
  );
}

export function LaporanKeuangan() {
  const { t, lang, monthName } = useI18n();
  const [view, setView] = useState<"grafik" | "tabel">("grafik");
  const [year, setYear] = useState<string>("semua");
  const [openYear, setOpenYear] = useState<number | null>(null);

  const numberLocale = lang === "id" ? "id-ID" : "en-US";
  const latest = FINANCE_YEARLY[FINANCE_YEARLY.length - 1];
  const ratio = (latest.penyaluran / latest.penghimpunan) * 100;
  const ratioText = ratio.toLocaleString(numberLocale, { maximumFractionDigits: 1 });
  const maxProgram = Math.max(...FINANCE_PROGRAMS_2025.map((p) => p.value));
  const audited = AUDITED_YEARS.filter((y) => year === "semua" || String(y) === year);
  const monthly = MONTHLY_YEARS.filter((y) => year === "semua" || String(y) === year);
  const allYears = [...new Set([...MONTHLY_YEARS, ...AUDITED_YEARS])].sort((a, b) => b - a);

  const download = (title: string) => toast.success(t("Mengunduh {title} (simulasi)", { title }));

  return (
    <>
      <PageHeader title={tx("Laporan Keuangan")}
        description={tx("Laporan keuangan BAZNAS yang telah diaudit, laporan bulanan, serta ringkasan visual penghimpunan dan penyaluran dana.")}
      />
      <PageBody>
        <div className="space-y-6">
          {/* Ringkasan visual (Pertemuan 9c) */}
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("Ringkasan Penghimpunan & Penyaluran")}</h2>
                <p className="text-sm text-gray-500">{t("Miliar rupiah · data ilustrasi untuk prototipe")}</p>
              </div>
              <div className="inline-flex rounded-lg bg-gray-100 p-1" role="tablist" aria-label={t("Tampilan data")}>
                {(
                  [
                    ["grafik", tx("Grafik"), BarChart3],
                    ["tabel", tx("Tabel"), Table2],
                  ] as const
                ).map(([v, label, Icon]) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={view === v}
                    onClick={() => setView(v)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${view === v ? "bg-white text-[#1a7a3a] shadow-sm" : "text-gray-600"}`}
                  >
                    <Icon size={15} /> {t(label)}
                  </button>
                ))}
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-lg bg-[#1a7a3a] p-4 text-white">
                <dt className="text-sm text-white/80">{t("Terhimpun {year}", { year: latest.year })}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">{t("Rp {n} M", { n: latest.penghimpunan })}</dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm text-gray-600">{t("Tersalurkan {year}", { year: latest.year })}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-gray-900 sm:text-3xl">{t("Rp {n} M", { n: latest.penyaluran })}</dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm text-gray-600">{t("Rasio penyaluran")}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-gray-900 sm:text-3xl">{ratioText}%</dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm text-gray-600">{t("Opini audit {year}", { year: latest.year })}</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{t("WTP")}</dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <figure>
                <figcaption className="text-sm font-semibold text-gray-900">{t("Per tahun")}</figcaption>
                <ul className="mt-2 flex flex-wrap gap-4 text-sm text-gray-700" aria-label={t("Legenda")}>
                  <li className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm" style={{ background: SERIES.penghimpunan }} /> {t("Penghimpunan")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm" style={{ background: SERIES.penyaluran }} /> {t("Penyaluran")}
                  </li>
                </ul>
                {view === "grafik" ? (
                  <div className="mt-3 h-64 sm:h-72" dir="ltr" role="img" aria-label={t("Grafik batang penghimpunan dan penyaluran per tahun")}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={FINANCE_YEARLY} barGap={2} barCategoryGap="28%" margin={{ top: 22, right: 4, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="#eceeec" />
                        <XAxis dataKey="year" tickLine={false} axisLine={{ stroke: "#d8dcd9" }} tick={{ fill: "#4b5563", fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#4b5563", fontSize: 12 }} width={40} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#eef7f0" }} />
                        <Bar dataKey="penghimpunan" name={t("Penghimpunan")} fill={SERIES.penghimpunan} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} label={{ position: "top", fill: "#111827", fontSize: 11, fontWeight: 600 }} />
                        <Bar dataKey="penyaluran" name={t("Penyaluran")} fill={SERIES.penyaluran} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} label={{ position: "top", fill: "#4b5563", fontSize: 11 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[22rem] text-start text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500">
                          <th className="py-2 text-start font-medium">{t("Tahun")}</th>
                          <th className="py-2 text-end font-medium">{t("Penghimpunan (M)")}</th>
                          <th className="py-2 text-end font-medium">{t("Penyaluran (M)")}</th>
                        </tr>
                      </thead>
                      <tbody className="tabular-nums">
                        {FINANCE_YEARLY.map((r) => (
                          <tr key={r.year} className="border-b border-gray-100">
                            <td className="py-2 font-medium text-gray-900">{r.year}</td>
                            <td className="py-2 text-end">{r.penghimpunan}</td>
                            <td className="py-2 text-end">{r.penyaluran}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </figure>
              <figure>
                <figcaption className="text-sm font-semibold text-gray-900">{t("Penyaluran per bidang, {year}", { year: latest.year })}</figcaption>
                <ul className="mt-4 space-y-3">
                  {FINANCE_PROGRAMS_2025.map((p) => (
                    <li key={p.name}>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{t(p.name)}</span>
                        <span className="font-semibold tabular-nums text-gray-900">{p.value}</span>
                      </div>
                      <div className="mt-1 h-2.5 rounded-e-[4px] bg-[#1a7a3a]" style={{ width: `${(p.value / maxProgram) * 100}%` }} />
                    </li>
                  ))}
                </ul>
              </figure>
            </div>
          </Card>

          {/* Filter tahun (Pertemuan 6 b.v) */}
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="tahun" className="text-sm font-medium text-gray-900">
              {t("Filter tahun")}
            </label>
            <select id="tahun" value={year} onChange={(e) => setYear(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a3a]">
              <option value="semua">{t("Semua tahun")}</option>
              {allYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900">{t("Laporan Keuangan")}</h2>
              <ul className="mt-3 divide-y divide-gray-100">
                {audited.map((y) => {
                  const title = t("Laporan Keuangan {year} Audited", { year: y });
                  return (
                    <li key={y} className="flex items-center gap-3 py-3">
                      <FileText size={20} className="shrink-0 text-[#1a7a3a]" aria-hidden />
                      <span className="flex-1 text-sm text-gray-800">{title}</span>
                      <button type="button" onClick={() => download(title)} aria-label={t("Unduh {title}", { title })} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-300 px-3 text-sm font-medium text-[#1a7a3a] hover:bg-green-50">
                        <Download size={15} /> <span className="hidden sm:inline">{t("Unduh PDF")}</span>
                      </button>
                    </li>
                  );
                })}
                {audited.length === 0 && <li className="py-6 text-center text-sm text-gray-500">{t("Belum ada laporan audited untuk tahun ini.")}</li>}
              </ul>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900">{t("Laporan Keuangan Bulanan")}</h2>
              <ul className="mt-3 divide-y divide-gray-100">
                {monthly.map((y) => {
                  const open = openYear === y;
                  return (
                    <li key={y} className="py-1">
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenYear(open ? null : y)}
                        className="flex w-full items-center gap-3 py-2 text-start"
                      >
                        {open ? <FolderOpen size={20} className="shrink-0 text-amber-600" aria-hidden /> : <Folder size={20} className="shrink-0 text-amber-600" aria-hidden />}
                        <span className="flex-1 text-sm text-gray-800">{t("Laporan Keuangan Bulanan {year}", { year: y })}</span>
                        <span className="text-xs text-gray-500">{t("{n} berkas", { n: 12 })}</span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <ul className="mb-2 ms-8 grid grid-cols-1 gap-1 sm:grid-cols-2">
                          {Array.from({ length: 12 }, (_, m) => (
                            <li key={m}>
                              <button
                                type="button"
                                onClick={() => download(t("Laporan {month} {year}", { month: monthName(m), year: y }))}
                                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm text-gray-700 hover:bg-green-50 hover:text-[#1a7a3a]"
                              >
                                <Download size={14} className="shrink-0" aria-hidden /> {monthName(m)} {y}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  );
}
