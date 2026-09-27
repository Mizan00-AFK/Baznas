import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Calendar, Download, ExternalLink, Mail, Play, UserRound } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { ARTIKEL, BERITA_PROGRAM, NEWSLETTERS, SIARAN_PERS, VIDEOS, type NewsItem } from "../data/pages";
import { tx, useI18n } from "../lib/i18n";
import { Highlight, ResultCount, SearchBox, SortSelect, matchesQuery, useQueryParam } from "../components/ListControls";
import { sortResults, type SortMode } from "../lib/search";

/** Kontrol pencarian + urutan yang dipakai semua daftar berita. */
function useNewsControls<T extends { date: string; title: string; summary?: string }>(items: T[]) {
  const { t, lang } = useI18n();
  const [q, setQ] = useQueryParam("q");
  const [urut, setUrut] = useQueryParam("urut", "terbaru");
  const shown = useMemo(() => {
    const f = items.filter((n) => matchesQuery(q, t(n.title), n.title, n.summary && t(n.summary)));
    return sortResults(f.map((n) => ({ ...n, titleText: t(n.title) })), urut as SortMode, lang);
  }, [items, q, urut, t, lang]);
  const controls = (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchBox value={q} onChange={setQ} label={t("Cari berita")} placeholder={t("Cari judul berita…")} className="w-full sm:w-80" />
      <div className="flex items-center gap-3">
        <ResultCount shown={shown.length} total={items.length} onReset={() => setQ("")} />
        <SortSelect value={urut as SortMode} onChange={setUrut} options={["terbaru", "terlama", "az", "za"]} />
      </div>
    </div>
  );
  return { q, shown, controls };
}

function NoResults() {
  const { t } = useI18n();
  return <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">{t("Tidak ada item yang cocok dengan pencarian Anda.")}</p>;
}

function NewsList({ title, description, items, source }: { title: string; description: string; items: NewsItem[]; source: string }) {
  const { t, formatDate } = useI18n();
  const { q, shown, controls } = useNewsControls(items);
  const [featured, ...rest] = shown;
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        {controls}
        {!featured ? (
          <NoResults />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <Card className="flex flex-col border-[#1a7a3a]/30">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar size={14} aria-hidden /> {formatDate(featured.date)}
              </span>
              <h2 className="mt-2 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                <Highlight text={t(featured.title)} query={q} />
              </h2>
              {featured.summary && <p className="mt-3 flex-1 leading-relaxed text-gray-600">{t(featured.summary)}</p>}
              {featured.author && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                  <UserRound size={14} aria-hidden /> {featured.author}
                </p>
              )}
              <a href={source} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-[#1a7a3a] underline underline-offset-4">
                {t("Baca selengkapnya di baznas.go.id")} <ExternalLink size={14} className="rtl:-scale-x-100" aria-hidden />
              </a>
            </Card>
            {rest.length > 0 && (
              <ul className="divide-y divide-gray-100 self-start rounded-xl border border-gray-200 bg-white">
                {rest.map((n) => (
                  <li key={n.title} className="p-4">
                    <span className="text-xs text-gray-500">{formatDate(n.date)}</span>
                    <h3 className="mt-1 font-semibold leading-snug text-gray-900">
                      <Highlight text={t(n.title)} query={q} />
                    </h3>
                    {n.summary && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{t(n.summary)}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </PageBody>
    </>
  );
}

/* baznas.go.id/berita/program-* */
export function BeritaProgram() {
  return (
    <NewsList
      title={tx("Berita Program")}
      description={tx("Kabar terbaru dari program penyaluran dan pemberdayaan BAZNAS di berbagai daerah.")}
      items={BERITA_PROGRAM}
      source="https://baznas.go.id/berita/program-kemanusiaan"
    />
  );
}

/* baznas.go.id/news-all */
export function SiaranPers() {
  return (
    <NewsList
      title={tx("Siaran Pers")}
      description={tx("Rilis resmi BAZNAS RI untuk media dan masyarakat.")}
      items={SIARAN_PERS}
      source="https://baznas.go.id/news-all"
    />
  );
}

/* baznas.go.id/artikel-all */
export function Artikel() {
  return (
    <NewsList
      title={tx("Artikel")}
      description={tx("Artikel edukasi seputar zakat, infak, sedekah, dan amalan ibadah.")}
      items={ARTIKEL}
      source="https://baznas.go.id/artikel-all"
    />
  );
}

/* baznas.go.id/video-all — video YouTube diputar langsung di halaman */
export function BaznasTV() {
  const { t, formatDate } = useI18n();
  const [playing, setPlaying] = useState<string | null>(null);
  const { q, shown, controls } = useNewsControls(VIDEOS);
  return (
    <>
      <PageHeader title={tx("Baznas TV")} description={tx("Liputan kegiatan dan program BAZNAS dalam bentuk video.")} />
      <PageBody>
        {controls}
        {shown.length === 0 && <NoResults />}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((v) => (
            <li key={v.id}>
              <Card className="h-full overflow-hidden p-0 sm:p-0">
                <div className="relative aspect-video bg-gray-900">
                  {playing === v.id ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1`}
                      title={t(v.title)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button type="button" onClick={() => setPlaying(v.id)} className="group absolute inset-0" aria-label={t("Putar video: {title}", { title: t(v.title) })}>
                      <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/40">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#1a7a3a] shadow-lg">
                          <Play size={24} className="ms-1" fill="currentColor" aria-hidden />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-gray-500">{formatDate(v.date)}</span>
                  <h2 className="mt-1 font-semibold leading-snug text-gray-900">
                    <Highlight text={t(v.title)} query={q} />
                  </h2>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </PageBody>
    </>
  );
}

/* baznas.go.id/newsletter-all */
export function Newsletter() {
  const { t, monthName } = useI18n();
  const [urut, setUrut] = useQueryParam("urut", "terbaru");
  const items = urut === "terlama" ? [...NEWSLETTERS].reverse() : NEWSLETTERS;
  return (
    <>
      <PageHeader title={tx("Newsletter")} description={tx("Dapatkan update berita dan informasi penyaluran zakat, infak, dan sedekah.")} />
      <PageBody>
        <div className="mb-6 flex items-center justify-between gap-3">
          <ResultCount shown={items.length} total={items.length} />
          <SortSelect value={urut as "terbaru" | "terlama"} onChange={setUrut} options={["terbaru", "terlama"]} />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((n) => {
            const edition = t("Newsletter {month} {year}", { month: monthName(n.month), year: n.year });
            return (
              <li key={`${n.year}-${n.month}`}>
                <Card className="flex h-full flex-col">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
                    <Mail size={22} aria-hidden />
                  </span>
                  <h2 className="mt-3 flex-1 font-semibold text-gray-900">{edition}</h2>
                  <button
                    type="button"
                    onClick={() => toast.success(t("Mengunduh {title} (simulasi)", { title: edition }))}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-[#1a7a3a] hover:bg-green-50"
                  >
                    <Download size={15} /> {t("Unduh PDF")}
                  </button>
                </Card>
              </li>
            );
          })}
        </ul>
      </PageBody>
    </>
  );
}
