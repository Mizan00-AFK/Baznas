import { useMemo, useState, type ReactNode } from "react";
import { BookOpen, Download, ExternalLink, Facebook, FileText, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Search, ShieldCheck, Twitter, Youtube } from "lucide-react";
import logo from "@/imports/logo-baznas-crop.png";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { LEMBAGA, PPID_KATEGORI, PPID_LANGKAH, PRIVASI, PUSTAKA } from "../data/pages";
import { tx, useI18n } from "../lib/i18n";

function ExternalButton({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium ${
        primary ? "bg-[#1a7a3a] text-white hover:bg-[#156830]" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </a>
  );
}

/* ---------- Panduan Brand (baznas.go.id/brand) ---------- */

export function PanduanBrand() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Panduan Brand")} description={tx("Logo Badan Amil Zakat Nasional (BAZNAS) digunakan sebagai identitas pada kegiatan resmi BAZNAS.")} />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold text-gray-900">{t("Logo Utama")}</h2>
            <p className="mt-1 text-sm text-gray-600">{t("Wajah utama BAZNAS dan pilihan pertama untuk semua materi komunikasi.")}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
                <img src={logo} alt={t("Logo BAZNAS pada latar terang")} className="max-h-full w-auto" />
              </div>
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-[#1a7a3a] p-6">
                <span className="rounded-lg bg-white p-3">
                  <img src={logo} alt={t("Logo BAZNAS pada latar hijau")} className="h-20 w-auto" />
                </span>
              </div>
            </div>
          </Card>
          <div className="space-y-4">
            <Card className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
                <Download size={22} aria-hidden />
              </span>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{t("File Logo")}</h2>
                <p className="mt-1 text-sm text-gray-600">{t("Kumpulan file logo resmi BAZNAS dalam berbagai format.")}</p>
                <div className="mt-3">
                  <ExternalButton href="https://baznas.go.id/brand" primary>
                    {t("Unduh Logo")} <ExternalLink size={14} className="rtl:-scale-x-100" />
                  </ExternalButton>
                </div>
              </div>
            </Card>
            <Card className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
                <BookOpen size={22} aria-hidden />
              </span>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{t("Panduan Branding")}</h2>
                <p className="mt-1 text-sm text-gray-600">{t("Dokumen panduan lengkap penggunaan identitas visual BAZNAS: warna, tipografi, dan aturan penggunaan logo.")}</p>
                <div className="mt-3">
                  <ExternalButton href="https://baznas.go.id/brand">
                    {t("Unduh Panduan (PDF)")} <ExternalLink size={14} className="rtl:-scale-x-100" />
                  </ExternalButton>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  );
}

/* ---------- Pustaka (baznas.go.id/pustaka) ---------- */

export function Pustaka() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("semua");
  const years = [...new Set(PUSTAKA.map((p) => p.year))];
  const items = useMemo(
    () =>
      PUSTAKA.filter(
        (p) => (year === "semua" || String(p.year) === year) && `${t(p.title)} ${p.title} ${p.author}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, year, t],
  );

  return (
    <>
      <PageHeader title={tx("Pustaka")} description={tx("Publikasi, kajian, dan buku terbitan BAZNAS dan Pusat Kajian Strategis (PUSKAS) BAZNAS.")} />
      <PageBody>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">{t("Cari publikasi")}</span>
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Cari judul atau penulis…")} className="w-full rounded-md border border-gray-300 py-2.5 pe-3 ps-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a3a]" />
          </label>
          <select aria-label={t("Filter tahun")} value={year} onChange={(e) => setYear(e.target.value)} className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a3a]">
            <option value="semua">{t("Semua tahun")}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.title}>
              <Card className="flex h-full flex-col">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded bg-[#1a7a3a] text-white">
                    <FileText size={18} aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-semibold leading-snug text-gray-900">{t(p.title)}</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {p.author} · {p.year} · {t("{n} halaman", { n: p.pages })}
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{t(p.desc)}</p>
                {p.isbn && <p className="mt-2 text-xs text-gray-500">ISBN {p.isbn}</p>}
                <a href="https://baznas.go.id/pustaka" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#1a7a3a] underline underline-offset-4">
                  {t("Baca di baznas.go.id")} <ExternalLink size={13} className="rtl:-scale-x-100" aria-hidden />
                </a>
              </Card>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p className="mt-6 text-center text-sm text-gray-500">{t("Publikasi tidak ditemukan.")}</p>}
      </PageBody>
    </>
  );
}

/* ---------- Jaringan Lembaga (baznas.go.id/lembaga-amil-zakat, lembaga-islam, lembaga-pendidikan) ---------- */

export function JaringanLembaga() {
  const { t } = useI18n();
  const [tab, setTab] = useState(LEMBAGA[0].id);
  const group = LEMBAGA.find((l) => l.id === tab) ?? LEMBAGA[0];
  return (
    <>
      <PageHeader title={tx("Jaringan Lembaga")} description={tx("Lembaga amil zakat, organisasi Islam, dan perguruan tinggi yang menjadi jaringan BAZNAS.")} />
      <PageBody>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist" aria-label={t("Jenis lembaga")}>
            {LEMBAGA.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={l.id === tab}
                onClick={() => setTab(l.id)}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${l.id === tab ? "bg-[#1a7a3a] text-white shadow-sm" : "text-gray-700 hover:bg-gray-200"}`}
              >
                {t(l.name)} <span className="opacity-70">({l.items.length})</span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">{t(group.desc)}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item) => (
            <li key={item.name}>
              <Card className="h-full">
                <div className="font-semibold leading-snug text-gray-900">{item.name}</div>
                {"sk" in item && item.sk && (
                  <div className="mt-1 break-all text-xs text-gray-500">
                    {t("SK Rekomendasi")}: <span dir="ltr">{item.sk}</span>
                  </div>
                )}
                {item.web && (
                  <a
                    href={`https://${item.web}`}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#1a7a3a] underline decoration-green-200 underline-offset-4 hover:decoration-[#1a7a3a]"
                  >
                    {item.web} <ExternalLink size={12} aria-hidden />
                  </a>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </PageBody>
    </>
  );
}

/* ---------- PPID (ppid.baznas.go.id) ---------- */

export function Ppid() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("PPID")} description={tx("Pejabat Pengelola Informasi dan Dokumentasi (PPID) BAZNAS melayani permohonan informasi publik sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.")} />
      <PageBody>
        <h2 className="text-lg font-semibold text-gray-900">{t("Kategori Informasi Publik")}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PPID_KATEGORI.map((k) => (
            <li key={k.h}>
              <Card className="h-full">
                <ShieldCheck size={22} className="text-[#1a7a3a]" aria-hidden />
                <h3 className="mt-3 font-semibold text-gray-900">{t(k.h)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{t(k.p)}</p>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">{t("Alur Permohonan Informasi")}</h2>
            <ol className="mt-4 space-y-3">
              {PPID_LANGKAH.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a7a3a] text-xs font-bold text-white">{i + 1}</span>
                  {t(s)}
                </li>
              ))}
            </ol>
          </Card>
          <Card className="h-fit border-[#1a7a3a]/30 bg-green-50/50">
            <h2 className="font-semibold text-gray-900">{t("Layanan PPID BAZNAS")}</h2>
            <p className="mt-2 text-sm text-gray-600">{t("Daftar informasi publik, formulir permohonan, dan pengajuan keberatan tersedia di situs PPID BAZNAS.")}</p>
            <div className="mt-4 grid gap-2">
              <ExternalButton href="https://ppid.baznas.go.id" primary>
                {t("Kunjungi ppid.baznas.go.id")} <ExternalLink size={14} className="rtl:-scale-x-100" />
              </ExternalButton>
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

/* ---------- Kontak (baznas.go.id/kontak-baznas) ---------- */

const SOSMED = [
  { label: "Facebook", handle: "badanamilzakat", href: "https://www.facebook.com/badanamilzakat/", icon: Facebook },
  { label: "Instagram", handle: "@baznasindonesia", href: "https://www.instagram.com/baznasindonesia/", icon: Instagram },
  { label: "X (Twitter)", handle: "@baznasindonesia", href: "https://twitter.com/baznasindonesia", icon: Twitter },
  { label: "LinkedIn", handle: "baznas-indonesia", href: "https://www.linkedin.com/company/baznas-indonesia", icon: Linkedin },
  { label: "YouTube", handle: "BAZNAS TV", href: "https://www.youtube.com/channel/UCmY29I5na-P9Q108PY5By4w", icon: Youtube },
];

export function Kontak() {
  const { t, lang } = useI18n();
  const channels = [
    { icon: Phone, label: tx("Telepon"), lines: ["14047", "021-39526001"], href: "tel:14047" },
    { icon: MessageCircle, label: tx("WhatsApp"), lines: ["0811 8882 1818"], href: "https://wa.me/6281188821818" },
    { icon: Mail, label: tx("Info Umum"), lines: ["baznas@baznas.go.id"], href: "mailto:baznas@baznas.go.id" },
    { icon: Mail, label: tx("Layanan Muzaki"), lines: ["layananmuzaki@baznas.go.id"], href: "mailto:layananmuzaki@baznas.go.id" },
  ];
  return (
    <>
      <PageHeader title={tx("Kontak")} description={tx("Hubungi BAZNAS untuk pertanyaan seputar zakat, pembayaran, dan layanan lainnya.")} />
      <PageBody>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <li key={c.label}>
              <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block h-full">
                <Card className="h-full transition hover:border-[#1a7a3a]">
                  <c.icon size={22} className="text-[#1a7a3a]" aria-hidden />
                  <div className="mt-3 text-sm text-gray-600">{t(c.label)}</div>
                  {c.lines.map((l) => (
                    <div key={l} dir="ltr" className="break-all text-start font-semibold text-gray-900">
                      {l}
                    </div>
                  ))}
                </Card>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <Card className="overflow-hidden p-0 sm:p-0">
            <iframe
              title={t("Peta lokasi Kantor Pusat BAZNAS")}
              src={`https://maps.google.com/maps?q=BAZNAS%20Jl.%20Matraman%20Raya%20No.134%20Jakarta&z=16&output=embed&hl=${lang}`}
              className="h-72 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="flex items-start gap-2 p-4 text-sm text-gray-700">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#1a7a3a]" aria-hidden />
              {t("Jl. Matraman Raya No.134, RT.5/RW.4, Kb. Manggis, Kec. Matraman, Kota Jakarta Timur, DKI Jakarta 13150")}
            </p>
          </Card>
          <Card className="h-fit">
            <h2 className="font-semibold text-gray-900">{t("Media Sosial")}</h2>
            <ul className="mt-3 space-y-1">
              {SOSMED.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-green-50">
                    <s.icon size={18} className="text-[#1a7a3a]" aria-hidden />
                    <span className="text-sm text-gray-900">{s.label}</span>
                    <span dir="ltr" className="ms-auto text-sm text-gray-500">
                      {s.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

/* ---------- Kebijakan Privasi (baznas.go.id/kebijakan-privasi) ---------- */

export function KebijakanPrivasi() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Kebijakan Privasi")} description={tx("BAZNAS berkomitmen menghormati privasi pengguna situs dan melindungi informasi pribadi Anda sebaik mungkin.")} />
      <PageBody narrow>
        <Card>
          <ol className="space-y-6">
            {PRIVASI.map((s, i) => (
              <li key={s.h} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-[#1a7a3a]">{i + 1}</span>
                <div>
                  <h2 className="font-semibold text-gray-900">{t(s.h)}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{t(s.p)}</p>
                </div>
              </li>
            ))}
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-[#1a7a3a]">{PRIVASI.length + 1}</span>
              <div>
                <h2 className="font-semibold text-gray-900">{t("Kontak")}</h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {t("Pertanyaan terkait kebijakan privasi dapat dikirim ke {email} atau ke kantor BAZNAS di Jakarta Timur.", { email: "support@baznas.go.id" })}
                </p>
              </div>
            </li>
          </ol>
        </Card>
      </PageBody>
    </>
  );
}
