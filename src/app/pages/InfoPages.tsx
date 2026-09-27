import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowRight, Calculator, ChevronRight, Construction, ExternalLink, Search } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { FaqAccordion } from "../components/FaqAccordion";
import { FAQ, KABUPATEN, KOTA, PROVINCES, daerahUrl } from "../data/content";
import { getChildren, getTrail } from "../data/navigation";
import { tx, useI18n } from "../lib/i18n";
import { Highlight, ResultCount, SearchBox, SortSelect, matchesQuery, useQueryParam } from "../components/ListControls";
import { sortResults, type SortMode } from "../lib/search";

/* ---------- Edukasi ZIS: /edukasi/:slug ---------- */

const EDUKASI: Record<string, { title: string; lead: string; points: { h: string; p: string }[]; payQuery: string }> = {
  "zakat-fitrah": {
    title: tx("Zakat Fitrah"),
    lead: tx("Zakat yang wajib ditunaikan setiap muslim menjelang Idulfitri sebagai penyuci diri setelah Ramadan."),
    points: [
      { h: tx("Siapa yang wajib?"), p: tx("Setiap muslim yang memiliki kelebihan makanan pada malam dan hari raya Idulfitri, termasuk orang yang menjadi tanggungannya.") },
      { h: tx("Berapa besarnya?"), p: tx("2,5 kg atau 3,5 liter beras per jiwa, atau uang senilai itu sesuai ketetapan BAZNAS setempat.") },
      { h: tx("Kapan dibayar?"), p: tx("Sejak awal Ramadan hingga sebelum salat Idulfitri.") },
    ],
    payQuery: "jenis=zakat&sub=fitrah",
  },
  "zakat-mal": {
    title: tx("Zakat Mal"),
    lead: tx("Zakat atas harta yang dimiliki selama satu tahun (haul) dan telah mencapai nisab."),
    points: [
      { h: tx("Nisab"), p: tx("Setara 85 gram emas. Harta yang dihitung antara lain tabungan, emas, investasi, dan aset yang tidak dipakai sendiri.") },
      { h: tx("Kadar"), p: tx("2,5% dari total harta bersih setelah dikurangi utang jatuh tempo.") },
      { h: tx("Jenis"), p: tx("Zakat penghasilan, perusahaan, perdagangan, emas, saham, dan lainnya.") },
    ],
    payQuery: "jenis=zakat&sub=mal",
  },
  infak: {
    title: tx("Infak"),
    lead: tx("Harta yang dikeluarkan di luar zakat untuk kemaslahatan umum, tanpa ketentuan nisab maupun jumlah."),
    points: [
      { h: tx("Sifat"), p: tx("Sukarela, dapat diberikan kapan saja dan berapa pun jumlahnya.") },
      { h: tx("Penyaluran"), p: tx("Program kemanusiaan, kesehatan, pendidikan dan dakwah, serta ekonomi.") },
      { h: tx("Keutamaan"), p: tx("Menumbuhkan kepedulian dan melipatgandakan pahala (QS. Al-Baqarah: 261).") },
    ],
    payQuery: "jenis=infak",
  },
  sedekah: {
    title: tx("Sedekah"),
    lead: tx("Kebaikan yang diberikan secara sukarela, baik berupa harta maupun non-harta."),
    points: [
      { h: tx("Bentuk"), p: tx("Uang, barang, tenaga, ilmu, hingga senyuman termasuk sedekah.") },
      { h: tx("Waktu"), p: tx("Tidak terikat waktu maupun jumlah.") },
      { h: tx("Hikmah"), p: tx("Membersihkan hati dan mendekatkan diri kepada Allah Swt.") },
    ],
    payQuery: "jenis=sedekah",
  },
  fidyah: {
    title: tx("Fidyah"),
    lead: tx("Pengganti puasa Ramadan bagi yang tidak mampu berpuasa karena uzur yang dibenarkan syariat."),
    points: [
      { h: tx("Siapa?"), p: tx("Lansia, orang sakit menahun, serta ibu hamil atau menyusui dalam kondisi tertentu.") },
      { h: tx("Besarnya"), p: tx("Satu mud makanan pokok per hari yang ditinggalkan, atau uang senilai itu.") },
      { h: tx("Cara bayar"), p: tx("Pilih jumlah hari pada formulir; nominal dihitung otomatis.") },
    ],
    payQuery: "jenis=fidyah",
  },
};

export function EdukasiZIS() {
  const { t } = useI18n();
  const { slug = "" } = useParams();
  const data = EDUKASI[slug];
  if (!data) return <InfoPage />;

  return (
    <>
      <PageHeader title={data.title} description={data.lead} />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="grid gap-4 sm:grid-cols-3">
            {data.points.map((pt) => (
              <Card key={pt.h}>
                <h2 className="text-base font-semibold text-gray-900">{t(pt.h)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t(pt.p)}</p>
              </Card>
            ))}
          </div>
          <div className="space-y-3">
            <Link to={`/layanan/bayar-zis?${data.payQuery}`} className="flex items-center justify-center rounded-md bg-[#1a7a3a] px-4 py-3 font-medium text-white hover:bg-[#156830]">
              {t("Tunaikan {type}", { type: t(data.title) })}
            </Link>
            {slug.startsWith("zakat") && (
              <Link to="/edukasi/kalkulator-zakat" className="flex items-center justify-center gap-2 rounded-md border border-[#1a7a3a] px-4 py-3 font-medium text-[#1a7a3a] hover:bg-green-50">
                <Calculator size={18} /> {t("Kalkulator Zakat")}
              </Link>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}

/* ---------- FAQ (mengikuti baznas.go.id/faq-baznas) ---------- */

export function FaqPage() {
  const { t } = useI18n();
  const [query, setQuery] = useQueryParam("q");
  const items = FAQ.filter((f) => matchesQuery(query, t(f.q), t(f.a), f.q));
  return (
    <>
      <PageHeader title={tx("Frequently Asked Questions")} description={tx("Pertanyaan yang sering diajukan seputar zakat, infak, sedekah, dan layanan BAZNAS.")} />
      <PageBody narrow>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox value={query} onChange={setQuery} label={t("Cari pertanyaan")} placeholder={t("Cari pertanyaan, mis. nisab, BSZ…")} className="w-full sm:w-96" />
          <ResultCount shown={items.length} total={FAQ.length} onReset={() => setQuery("")} />
        </div>
        {items.length ? (
          <FaqAccordion key={query} items={items} defaultOpen={query.trim() ? 0 : null} />
        ) : (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">{t("Tidak ada item yang cocok dengan pencarian Anda.")}</p>
        )}
      </PageBody>
    </>
  );
}

/* ---------- Website BAZNAS Daerah (mengikuti baznas.go.id/baznas-daerah) ---------- */

type Daerah = { name: string; url: string };
const LEVELS = [tx("Provinsi"), tx("Kabupaten"), tx("Kota")];

export function WebsiteDaerah() {
  const { t } = useI18n();
  const lists: Record<string, Daerah[]> = {
    Provinsi: PROVINCES.map((p) => ({ name: t("BAZNAS Provinsi {name}", { name: t(p.name) }), url: `https://${p.slug}.baznas.go.id` })),
    Kabupaten: KABUPATEN.map((k) => ({ name: t("BAZNAS Kabupaten {name}", { name: k }), url: daerahUrl("kab", k) })),
    Kota: KOTA.map((k) => ({ name: t("BAZNAS Kota {name}", { name: k }), url: daerahUrl("kota", k) })),
  };
  const [tab, setTab] = useQueryParam("tingkat", LEVELS[0]);
  const [query, setQuery] = useQueryParam("q");
  const [urut, setUrut] = useQueryParam("urut", "az");
  const list = lists[tab] ?? lists.Provinsi;
  const items = useMemo(
    () => sortResults(list.filter((d) => matchesQuery(query, d.name)).map((d) => ({ ...d, titleText: d.name })), urut as SortMode, "id"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, query, urut, t],
  );

  return (
    <>
      <PageHeader title={tx("Website BAZNAS Daerah")} description={tx("Kunjungi website resmi BAZNAS provinsi, kabupaten, dan kota di seluruh Indonesia.")} />
      <PageBody>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist" aria-label={t("Tingkat")}>
            {LEVELS.map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`rounded-md px-4 py-2 text-sm font-medium ${tab === k ? "bg-[#1a7a3a] text-white shadow-sm" : "text-gray-700 hover:bg-gray-200"}`}
              >
                {t(k)}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBox value={query} onChange={setQuery} label={t("Cari daerah")} placeholder={t("Cari nama daerah…")} className="w-full sm:w-72" />
            <SortSelect value={urut as SortMode} onChange={setUrut} options={["az", "za"]} />
          </div>
        </div>
        <div className="mt-4">
          <ResultCount shown={items.length} total={list.length} onReset={() => setQuery("")} />
        </div>

        <Card className="mt-6">
          {/* Tautan diberi affordance: warna, garis bawah, ikon eksternal (Pertemuan 6 b.vi) */}
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => (
              <li key={d.url}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-[#1a7a3a] underline decoration-green-200 underline-offset-4 hover:text-[#145c2c] hover:decoration-[#1a7a3a]"
                >
                  <Highlight text={d.name} query={query} />
                  <ExternalLink size={13} className="shrink-0 opacity-60 group-hover:opacity-100 rtl:-scale-x-100" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          {items.length === 0 && <p className="py-6 text-center text-sm text-gray-500">{t("Daerah tidak ditemukan.")}</p>}
          {tab !== "Provinsi" && <p className="mt-4 text-xs text-gray-500">{t("Prototipe menampilkan sebagian daftar {level}.", { level: t(tab).toLowerCase() })}</p>}
        </Card>
      </PageBody>
    </>
  );
}

/* ---------- Halaman indeks menu (mis. /layanan, /edukasi) ---------- */

export function SectionIndex() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const section = getChildren(pathname);
  if (!section) return <InfoPage />;

  return (
    <>
      <PageHeader title={section.label} />
      <PageBody>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.links.map((l) => (
            <li key={l.href}>
              <Link to={l.href} className="group flex h-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#1a7a3a] sm:p-5">
                <span className="font-medium text-gray-900 group-hover:text-[#1a7a3a]">{t(l.label)}</span>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#1a7a3a] rtl:rotate-180" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </PageBody>
    </>
  );
}

/* ---------- Halaman tidak ditemukan (404) ---------- */

export function InfoPage() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const trail = getTrail(pathname);

  return (
    <>
      <PageHeader title={tx("Halaman tidak ditemukan")} trail={trail} />
      <PageBody narrow>
        <Card className="text-center">
          <Construction size={40} className="mx-auto text-amber-500" aria-hidden />
          <h2 className="mt-3 text-lg font-semibold text-gray-900">{t("Alamat yang Anda tuju tidak tersedia")}</h2>
          <p className="mt-2 text-sm text-gray-600">{t("Periksa kembali alamat atau kembali ke beranda.")}</p>
          <div className="mt-6 flex justify-center">
            <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a7a3a] px-5 py-2.5 font-medium text-white hover:bg-[#156830]">
              {t("Kembali ke Beranda")} <ArrowRight size={15} className="rtl:rotate-180" />
            </Link>
          </div>
        </Card>
      </PageBody>
    </>
  );
}
