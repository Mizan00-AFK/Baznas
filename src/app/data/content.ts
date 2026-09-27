// Konten contoh untuk prototipe. Angka keuangan & jaringan bersifat ILUSTRASI.
// Teks bertanda tx() diterjemahkan saat ditampilkan (lihat lib/locales).
import { tx } from "../lib/i18n";

export const NEWS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1542562460-67f4b9aa9a25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: tx("Berita Program"),
    date: "2026-05-19",
    title: tx("BAZNAS Distribusikan Bantuan Pangan kepada 50.000 Keluarga Prasejahtera di 34 Provinsi"),
    desc: tx("Dalam rangka penguatan ketahanan pangan nasional, BAZNAS serentak mendistribusikan paket bantuan pangan kepada puluhan ribu keluarga kurang mampu di seluruh Indonesia."),
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1611087802810-046bb671e644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: tx("Siaran Pers"),
    date: "2026-05-18",
    title: tx("BAZNAS dan Kemensos Perkuat Sinergi Program Pemberdayaan Masyarakat"),
    desc: tx("Kolaborasi lintas lembaga untuk memperluas jangkauan program pemberdayaan ekonomi mustahik."),
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1715704170926-0ca943fce5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: tx("Artikel"),
    date: "2026-05-17",
    title: tx("Mengenal Lebih Dekat 8 Golongan Penerima Zakat (Mustahik) dalam Islam"),
    desc: tx("Siapa saja yang berhak menerima zakat? Simak penjelasan delapan asnaf berdasarkan QS. At-Taubah ayat 60."),
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1629273229664-11fabc0becc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: tx("Berita Program"),
    date: "2026-05-15",
    title: tx("Ribuan Anak Yatim Terima Santunan dari Program BAZNAS Peduli Anak"),
    desc: tx("Santunan pendidikan dan kebutuhan pokok diberikan kepada anak yatim di berbagai daerah."),
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: tx("Newsletter"),
    date: "2026-05-14",
    title: tx("Newsletter BAZNAS Edisi Mei 2026: Capaian dan Rencana Program Terbaru"),
    desc: tx("Rangkuman capaian penghimpunan dan penyaluran bulan ini."),
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: tx("Siaran Pers"),
    date: "2026-05-12",
    title: tx("BAZNAS Bantu Pemulihan Pascabencana di Wilayah Terdampak Banjir"),
    desc: tx("Tim tanggap bencana BAZNAS menyalurkan logistik dan layanan kesehatan."),
  },
];

export const NEWS_CATEGORY_HREF: Record<string, string> = {
  "Berita Program": "/berita/program",
  "Siaran Pers": "/berita/siaran-pers",
  Artikel: "/berita/artikel",
  Newsletter: "/berita/newsletter",
};

/** Pertanyaan mengikuti halaman FAQ situs asli (baznas.go.id/faq-baznas). */
export const FAQ: { q: string; a: string; link?: { label: string; href: string } }[] = [
  { q: tx("Apa kepanjangan dari ZIS?"), a: tx("ZIS adalah singkatan dari Zakat, Infak, dan Sedekah.") },
  {
    q: tx("Apa itu Zakat, Infak dan Sedekah?"),
    a: tx("Zakat adalah harta yang wajib dikeluarkan oleh seorang muslim yang telah memenuhi syarat untuk diberikan kepada yang berhak menerimanya. Infak dan sedekah adalah harta yang dikeluarkan secara sukarela di luar zakat untuk kemaslahatan umum."),
  },
  { q: tx("Apa pengertian dari kata Muzaki?"), a: tx("Muzaki adalah sebutan bagi orang yang menunaikan zakat.") },
  { q: tx("Apa pengertian dari kata Mustahik?"), a: tx("Mustahik adalah sebutan bagi orang yang menerima zakat.") },
  { q: tx("Apa syarat wajib zakat?"), a: tx("Syarat wajib zakat adalah muslim, berakal, merdeka, dan hartanya mencapai nisab serta haul.") },
  {
    q: tx("Apa itu Kalkulator Zakat?"),
    a: tx("Kalkulator Zakat adalah layanan BAZNAS untuk membantu muzaki menghitung besaran zakat yang wajib ditunaikan."),
    link: { label: tx("Buka Kalkulator Zakat"), href: "/edukasi/kalkulator-zakat" },
  },
  {
    q: tx("Bagaimana cara melakukan konfirmasi zakat?"),
    a: tx("Muzaki dapat melakukan konfirmasi pembayaran zakat dengan mengisi formulir Konfirmasi Zakat dan melampirkan bukti transfer."),
    link: { label: tx("Buka formulir Konfirmasi Zakat"), href: "/konfirmasi-zakat" },
  },
  {
    q: tx("Apa itu Bukti Setor Zakat (BSZ)?"),
    a: tx("Bukti Setor Zakat (BSZ) adalah bukti pembayaran yang berhak diterima muzaki setelah melakukan pembayaran."),
  },
  { q: tx("Apa saja kegunaan BSZ?"), a: tx("BSZ dapat digunakan sebagai pengurang penghasilan kena pajak sesuai ketentuan yang berlaku.") },
  {
    q: tx("Kemana zakat didistribusikan oleh BAZNAS?"),
    a: tx("Zakat disalurkan kepada delapan golongan penerima (asnaf) melalui program kemanusiaan, kesehatan, pendidikan dan dakwah, serta ekonomi."),
    link: { label: tx("Lihat Laporan"), href: "/informasi/laporan" },
  },
  {
    q: tx("Bagaimana caranya untuk melakukan konsultasi zakat?"),
    a: tx("Muzaki dapat menghubungi Layanan Muzaki BAZNAS melalui WhatsApp atau telepon 14047."),
  },
];

/** Dalam miliar rupiah. Data ilustrasi untuk prototipe. */
export const FINANCE_YEARLY = [
  { year: "2021", penghimpunan: 512, penyaluran: 468 },
  { year: "2022", penghimpunan: 589, penyaluran: 541 },
  { year: "2023", penghimpunan: 676, penyaluran: 627 },
  { year: "2024", penghimpunan: 742, penyaluran: 701 },
  { year: "2025", penghimpunan: 815, penyaluran: 773 },
];

export const FINANCE_SOURCES_2025 = [
  { name: tx("Zakat"), value: 503 },
  { name: tx("Infak/Sedekah"), value: 221 },
  { name: tx("Dana Sosial Keagamaan Lainnya"), value: 58 },
  { name: tx("Fidyah"), value: 33 },
];

export const FINANCE_PROGRAMS_2025 = [
  { name: tx("Kemanusiaan"), value: 214 },
  { name: tx("Pendidikan"), value: 178 },
  { name: tx("Ekonomi"), value: 152 },
  { name: tx("Kesehatan"), value: 131 },
  { name: tx("Dakwah & Advokasi"), value: 98 },
];

/** Mengikuti halaman Keuangan situs asli: laporan tahunan audited & laporan bulanan. */
export const AUDITED_YEARS = Array.from({ length: 13 }, (_, i) => 2024 - i); // 2024–2012
export const MONTHLY_YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i); // 2025–2010

/** Ibu kota provinsi & jumlah kab/kota (untuk peta jaringan). */
export const PROVINCES: { name: string; slug: string; city: string; lat: number; lng: number; units: number }[] = [
  { name: tx("Aceh"), slug: "baitulmalaceh", city: "Banda Aceh", lat: 5.55, lng: 95.32, units: 23 },
  { name: tx("Sumatera Utara"), slug: "sumut", city: "Medan", lat: 3.59, lng: 98.67, units: 33 },
  { name: tx("Sumatera Barat"), slug: "sumbar", city: "Padang", lat: -0.95, lng: 100.35, units: 19 },
  { name: tx("Riau"), slug: "riau", city: "Pekanbaru", lat: 0.51, lng: 101.45, units: 12 },
  { name: tx("Kepulauan Riau"), slug: "kepri", city: "Tanjung Pinang", lat: 0.92, lng: 104.45, units: 7 },
  { name: tx("Jambi"), slug: "jambi", city: "Jambi", lat: -1.61, lng: 103.61, units: 11 },
  { name: tx("Sumatera Selatan"), slug: "sumsel", city: "Palembang", lat: -2.99, lng: 104.76, units: 17 },
  { name: tx("Kepulauan Bangka Belitung"), slug: "babel", city: "Pangkal Pinang", lat: -2.13, lng: 106.11, units: 7 },
  { name: tx("Bengkulu"), slug: "bengkulu", city: "Bengkulu", lat: -3.79, lng: 102.26, units: 10 },
  { name: tx("Lampung"), slug: "lampung", city: "Bandar Lampung", lat: -5.43, lng: 105.26, units: 15 },
  { name: tx("DKI Jakarta"), slug: "dki", city: "Jakarta", lat: -6.2, lng: 106.85, units: 6 },
  { name: tx("Banten"), slug: "banten", city: "Serang", lat: -6.12, lng: 106.15, units: 8 },
  { name: tx("Jawa Barat"), slug: "jabar", city: "Bandung", lat: -6.91, lng: 107.61, units: 27 },
  { name: tx("Jawa Tengah"), slug: "jateng", city: "Semarang", lat: -6.97, lng: 110.42, units: 35 },
  { name: tx("DI Yogyakarta"), slug: "diy", city: "Yogyakarta", lat: -7.8, lng: 110.36, units: 5 },
  { name: tx("Jawa Timur"), slug: "jatim", city: "Surabaya", lat: -7.25, lng: 112.75, units: 38 },
  { name: tx("Bali"), slug: "bali", city: "Denpasar", lat: -8.65, lng: 115.22, units: 9 },
  { name: tx("Nusa Tenggara Barat"), slug: "ntb", city: "Mataram", lat: -8.58, lng: 116.12, units: 10 },
  { name: tx("Nusa Tenggara Timur"), slug: "ntt", city: "Kupang", lat: -10.18, lng: 123.6, units: 22 },
  { name: tx("Kalimantan Barat"), slug: "kalbar", city: "Pontianak", lat: -0.03, lng: 109.33, units: 14 },
  { name: tx("Kalimantan Tengah"), slug: "kalteng", city: "Palangka Raya", lat: -2.21, lng: 113.92, units: 14 },
  { name: tx("Kalimantan Selatan"), slug: "kalsel", city: "Banjarmasin", lat: -3.32, lng: 114.59, units: 13 },
  { name: tx("Kalimantan Timur"), slug: "kaltim", city: "Samarinda", lat: -0.5, lng: 117.15, units: 10 },
  { name: tx("Kalimantan Utara"), slug: "kaltara", city: "Tanjung Selor", lat: 2.84, lng: 117.37, units: 5 },
  { name: tx("Sulawesi Utara"), slug: "sulut", city: "Manado", lat: 1.47, lng: 124.84, units: 15 },
  { name: tx("Gorontalo"), slug: "gorontalo", city: "Gorontalo", lat: 0.54, lng: 123.06, units: 6 },
  { name: tx("Sulawesi Tengah"), slug: "sulteng", city: "Palu", lat: -0.9, lng: 119.87, units: 13 },
  { name: tx("Sulawesi Barat"), slug: "sulbar", city: "Mamuju", lat: -2.68, lng: 118.89, units: 6 },
  { name: tx("Sulawesi Selatan"), slug: "sulsel", city: "Makassar", lat: -5.15, lng: 119.43, units: 24 },
  { name: tx("Sulawesi Tenggara"), slug: "sultra", city: "Kendari", lat: -3.97, lng: 122.51, units: 17 },
  { name: tx("Maluku"), slug: "maluku", city: "Ambon", lat: -3.7, lng: 128.18, units: 11 },
  { name: tx("Maluku Utara"), slug: "malut", city: "Sofifi", lat: 0.74, lng: 127.56, units: 10 },
  { name: tx("Papua"), slug: "papua", city: "Jayapura", lat: -2.53, lng: 140.72, units: 9 },
  { name: tx("Papua Barat"), slug: "pabar", city: "Manokwari", lat: -0.86, lng: 134.08, units: 7 },
  { name: tx("Papua Barat Daya"), slug: "pbd", city: "Sorong", lat: -0.88, lng: 131.26, units: 6 },
  { name: tx("Papua Tengah"), slug: "papteng", city: "Nabire", lat: -3.37, lng: 135.5, units: 8 },
  { name: tx("Papua Pegunungan"), slug: "papeg", city: "Wamena", lat: -4.09, lng: 138.95, units: 8 },
  { name: tx("Papua Selatan"), slug: "papsel", city: "Merauke", lat: -8.49, lng: 140.4, units: 4 },
];

export const ZIS_TYPES = [
  { value: "zakat", label: tx("Zakat"), desc: tx("Wajib bila mencapai nisab") },
  { value: "infak", label: tx("Infak"), desc: tx("Untuk kemaslahatan umat") },
  { value: "sedekah", label: tx("Sedekah"), desc: tx("Kebaikan tanpa batas") },
  { value: "fidyah", label: tx("Fidyah"), desc: tx("Pengganti puasa Ramadan") },
] as const;

export type ZisType = (typeof ZIS_TYPES)[number]["value"];

export const ZAKAT_SUBTYPES = [
  { value: "penghasilan", label: tx("Zakat Penghasilan") },
  { value: "mal", label: tx("Zakat Mal") },
  { value: "fitrah", label: tx("Zakat Fitrah") },
] as const;

/** Asumsi perhitungan (dapat diubah pengguna di kalkulator). */
export const DEFAULT_GOLD_PRICE = 1_600_000; // Rp per gram, contoh
export const NISAB_GRAMS = 85;
export const FIDYAH_PER_DAY = 60_000; // contoh tarif per hari
export const ZAKAT_FITRAH_PER_JIWA = 50_000; // contoh tarif per jiwa

/** Contoh sebagian BAZNAS kabupaten/kota (pola alamat mengikuti situs asli). */
export const KABUPATEN = [
  "Aceh Besar", "Bandung", "Banyumas", "Bekasi", "Bogor", "Cirebon", "Demak", "Garut", "Gresik", "Indragiri Hilir",
  "Jember", "Kampar", "Karawang", "Kendal", "Klaten", "Kudus", "Lamongan", "Lombok Timur", "Magelang", "Malang",
  "Pasuruan", "Sidoarjo", "Sleman", "Sukabumi", "Tangerang", "Wonosobo",
];
export const KOTA = [
  "Balikpapan", "Bandung", "Banjarmasin", "Bekasi", "Bogor", "Bukittinggi", "Depok", "Makassar", "Malang", "Medan",
  "Padang", "Palembang", "Pekanbaru", "Semarang", "Surabaya", "Tangerang Selatan", "Yogyakarta",
];
export const daerahUrl = (prefix: "kab" | "kota", name: string) =>
  `https://${prefix}${name.toLowerCase().replace(/[^a-z]/g, "")}.baznas.go.id`;
