import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Download, ExternalLink, Mail, Play, UserRound } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { ARTIKEL, BERITA_PROGRAM, NEWSLETTERS, SIARAN_PERS, VIDEOS, type NewsItem } from "../data/pages";
import { tx, useI18n } from "../lib/i18n";

function NewsList({ title, description, items, source }: { title: string; description: string; items: NewsItem[]; source: string }) {
  const { t, formatDate } = useI18n();
  const [featured, ...rest] = items;
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="flex flex-col border-[#1a7a3a]/30">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={14} aria-hidden /> {formatDate(featured.date)}
            </span>
            <h2 className="mt-2 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">{t(featured.title)}</h2>
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
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {rest.map((n) => (
              <li key={n.title} className="p-4">
                <span className="text-xs text-gray-500">{formatDate(n.date)}</span>
                <h3 className="mt-1 font-semibold leading-snug text-gray-900">{t(n.title)}</h3>
                {n.summary && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{t(n.summary)}</p>}
              </li>
            ))}
          </ul>
        </div>
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
  return (
    <>
      <PageHeader title={tx("Baznas TV")} description={tx("Liputan kegiatan dan program BAZNAS dalam bentuk video.")} />
      <PageBody>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
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
                  <h2 className="mt-1 font-semibold leading-snug text-gray-900">{t(v.title)}</h2>
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
  return (
    <>
      <PageHeader title={tx("Newsletter")} description={tx("Dapatkan update berita dan informasi penyaluran zakat, infak, dan sedekah.")} />
      <PageBody>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEWSLETTERS.map((n) => {
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
