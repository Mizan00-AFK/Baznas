import { useMemo, useState } from "react";
import { Award, Building2, Handshake, Landmark, Smartphone, Store, Trophy } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { AWARDS, MITRA_GROUPS, MITRA_STORIES, PROGRAMS, STRUKTUR } from "../data/pages";
import { tx, useI18n } from "../lib/i18n";
import { Highlight, ResultCount, SearchBox, SortSelect, matchesQuery, useQueryParam } from "../components/ListControls";
import { sortResults, type SortMode } from "../lib/search";

/** Inisial untuk avatar, mengabaikan gelar (Dr., Ir., H., Hj., Prof., Drs.). */
function initials(name: string) {
  const words = name
    .split(",")[0]
    .split(/\s+/)
    .filter((w) => w && !/^(Dr|Ir|H|Hj|Prof|Drs|Lc|MA|M)\.?$/i.test(w.replace(/\.$/, "")));
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

/* ---------- Struktur BAZNAS (baznas.go.id/struktur-baznas) ---------- */

export function StrukturBaznas() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Struktur BAZNAS")} description={tx("Susunan pimpinan dan pejabat Badan Amil Zakat Nasional Republik Indonesia.")} />
      <PageBody>
        <div className="space-y-10">
          {STRUKTUR.map((section) => (
            <section key={section.group}>
              <h2 className="text-lg font-semibold text-gray-900">{t(section.group)}</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.people.map((p, i) => {
                  const lead = section.group === "Jajaran Pimpinan" && i < 2;
                  return (
                    <li key={p.name}>
                      <Card className={`flex h-full items-center gap-4 ${lead ? "border-[#1a7a3a] bg-green-50/60" : ""}`}>
                        <span
                          aria-hidden
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                            lead ? "bg-[#1a7a3a] text-white" : "bg-green-50 text-[#1a7a3a]"
                          }`}
                        >
                          {initials(p.name)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold leading-snug text-gray-900">{p.name}</div>
                          <div className="mt-1 text-sm text-gray-600">{t(p.role)}</div>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </PageBody>
    </>
  );
}

/* ---------- Profil Program (baznas.go.id/program/*) ---------- */

export function ProfilProgram() {
  const { t } = useI18n();
  const [active, setActive] = useQueryParam("bidang", PROGRAMS[0].id);
  const [query, setQuery] = useQueryParam("q");
  const program = PROGRAMS.find((p) => p.id === active) ?? PROGRAMS[0];
  // Saat mencari, hasil diambil dari semua bidang
  const matches = query.trim()
    ? PROGRAMS.flatMap((p) => p.items.filter((it) => matchesQuery(query, t(it.name), it.name, t(it.desc))).map((it) => ({ ...it, bidang: p })))
    : [];

  return (
    <>
      <PageHeader title={tx("Profil Program")} description={tx("Program pendistribusian dan pendayagunaan zakat, infak, dan sedekah BAZNAS di tujuh bidang.")} />
      <PageBody>
        <SearchBox value={query} onChange={setQuery} label={t("Cari program")} placeholder={t("Cari nama program di semua bidang…")} className="mb-4 w-full sm:w-96" />
        {query.trim() ? (
          <>
            <ResultCount shown={matches.length} total={PROGRAMS.reduce((n, p) => n + p.items.length, 0)} onReset={() => setQuery("")} />
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((item) => (
                <li key={item.bidang.id + item.name}>
                  <Card className="h-full">
                    <button type="button" onClick={() => { setQuery(""); setActive(item.bidang.id); }} className="text-xs font-semibold text-[#1a7a3a] hover:underline">
                      {t(item.bidang.name)}
                    </button>
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <Highlight text={t(item.name)} query={query} />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{t(item.desc)}</p>
                  </Card>
                </li>
              ))}
            </ul>
            {matches.length === 0 && <p className="mt-6 text-center text-sm text-gray-500">{t("Tidak ada item yang cocok dengan pencarian Anda.")}</p>}
          </>
        ) : (
        <>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist" aria-label={t("Bidang program")}>
            {PROGRAMS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === active}
                onClick={() => setActive(p.id)}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${p.id === active ? "bg-[#1a7a3a] text-white shadow-sm" : "text-gray-700 hover:bg-gray-200"}`}
              >
                {t(p.name)}
              </button>
            ))}
          </div>
        </div>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t(program.name)}</h2>
        <p className="mt-1 text-sm text-gray-600">{t("{n} program", { n: program.items.length })}</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {program.items.map((item, i) => (
            <li key={item.name}>
              <Card className="h-full">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-[#1a7a3a]">{i + 1}</span>
                <h3 className="mt-3 font-semibold text-gray-900">{t(item.name)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t(item.desc)}</p>
              </Card>
            </li>
          ))}
        </ul>
        </>
        )}
      </PageBody>
    </>
  );
}

/* ---------- Penghargaan (baznas.go.id/penghargaan) ---------- */

export function Penghargaan() {
  const { t, lang } = useI18n();
  const years = [...new Set(AWARDS.map((a) => a.year))];
  const [yearParam, setYearParam] = useQueryParam("tahun", "all");
  const [query, setQuery] = useQueryParam("q");
  const [urut, setUrut] = useQueryParam("urut", "terbaru");
  const year: number | "all" = yearParam === "all" ? "all" : Number(yearParam);
  const setYear = (y: number | "all") => setYearParam(String(y));
  const label = (a: (typeof AWARDS)[number]) => (a.local ? t(a.title) : a.title);
  const items = useMemo(
    () =>
      sortResults(
        AWARDS.filter((a) => (year === "all" || a.year === year) && matchesQuery(query, label(a), a.title, a.by && t(a.by), a.org)).map((a) => ({
          ...a,
          titleText: label(a),
          date: String(a.year),
        })),
        urut as SortMode,
        lang,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, query, urut, t, lang],
  );

  const chip = (active: boolean) =>
    `h-10 shrink-0 rounded-md px-4 text-sm font-medium ${active ? "bg-[#1a7a3a] text-white" : "border border-gray-300 bg-white text-gray-700 hover:border-[#1a7a3a]"}`;

  return (
    <>
      <PageHeader title={tx("Penghargaan")} description={tx("Apresiasi nasional dan internasional atas tata kelola, inovasi, dan dampak program BAZNAS.")} />
      <PageBody>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-[#1a7a3a] p-4 text-white">
            <dt className="text-sm text-white/80">{t("Total penghargaan")}</dt>
            <dd className="mt-1 text-3xl font-bold">{AWARDS.length}</dd>
          </div>
          {years.map((y) => (
            <div key={y} className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm text-gray-600">{t("Tahun {year}", { year: y })}</dt>
              <dd className="mt-1 text-3xl font-bold text-gray-900">{AWARDS.filter((a) => a.year === y).length}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox value={query} onChange={setQuery} label={t("Cari penghargaan")} placeholder={t("Cari nama penghargaan atau penyelenggara…")} className="w-full sm:w-96" />
          <div className="flex items-center gap-3">
            <ResultCount shown={items.length} total={AWARDS.length} onReset={() => { setQuery(""); setYear("all"); }} />
            <SortSelect value={urut as SortMode} onChange={setUrut} options={["terbaru", "terlama", "az", "za"]} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="toolbar" aria-label={t("Filter tahun")}>
          <button type="button" aria-pressed={year === "all"} onClick={() => setYear("all")} className={chip(year === "all")}>
            {t("Semua tahun")}
          </button>
          {years.map((y) => (
            <button key={y} type="button" aria-pressed={year === y} onClick={() => setYear(y)} className={chip(year === y)}>
              {y}
            </button>
          ))}
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => (
            <li key={`${a.year}-${i}`}>
              <Card className="flex h-full gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  {a.local ? <Award size={20} aria-hidden /> : <Trophy size={20} aria-hidden />}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#1a7a3a]">{a.year}</div>
                  <div className="mt-0.5 font-semibold leading-snug text-gray-900">
                    <Highlight text={a.titleText} query={query} />
                  </div>
                  {(a.by || a.org) && <div className="mt-1 text-sm text-gray-600">{a.by ? t(a.by) : a.org}</div>}
                </div>
              </Card>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p className="mt-6 text-center text-sm text-gray-500">{t("Tidak ada item yang cocok dengan pencarian Anda.")}</p>}
      </PageBody>
    </>
  );
}

/* ---------- Mitra BAZNAS (baznas.go.id/mitra-baznas) ---------- */

const GROUP_ICON = [Store, Landmark, Smartphone];

export function MitraBaznas() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Mitra Baznas")} description={tx("Kolaborasi BAZNAS dengan dunia usaha, perbankan, dan kanal digital untuk memperluas manfaat zakat.")} />
      <PageBody>
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Handshake size={20} className="text-[#1a7a3a]" aria-hidden /> {t("Kolaborasi Terbaru")}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {MITRA_STORIES.map((s) => (
              <li key={s.partner}>
                <Card className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
                      <Building2 size={20} aria-hidden />
                    </span>
                    <span className="font-semibold text-gray-900">{s.partner}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{t(s.text)}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {MITRA_GROUPS.map((g, i) => {
            const Icon = GROUP_ICON[i] ?? Building2;
            return (
              <Card key={g.name}>
                <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                  <Icon size={18} className="text-[#1a7a3a]" aria-hidden /> {t(g.name)}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((name) => (
                    <li key={name} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                      {name}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
