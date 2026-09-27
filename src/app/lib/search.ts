/**
 * Indeks pencarian seluruh situs: halaman, layanan, berita, dokumen, program,
 * FAQ, rekening, jaringan, dan profil. Teks disimpan sebagai kunci terjemahan
 * sehingga pencarian bekerja di bahasa aktif (ID/EN/AR) maupun teks aslinya.
 */
import { NAV_ITEMS } from "../data/navigation";
import { FAQ, PROVINCES, AUDITED_YEARS } from "../data/content";
import { ARTIKEL, AWARDS, BERITA_PROGRAM, LEMBAGA, NEWSLETTERS, PROGRAMS, PUSTAKA, SIARAN_PERS, STRUKTUR, VIDEOS } from "../data/pages";
import { BANKS, REKENING } from "../data/rekening";
import { tx } from "./i18n";

export type SearchCategory = "halaman" | "berita" | "dokumen" | "program" | "faq" | "rekening" | "jaringan" | "profil";

export const SEARCH_CATEGORIES: { id: SearchCategory; label: string }[] = [
  { id: "halaman", label: tx("Halaman & Layanan") },
  { id: "berita", label: tx("Berita & Video") },
  { id: "dokumen", label: tx("Dokumen & Laporan") },
  { id: "program", label: tx("Program") },
  { id: "faq", label: tx("Tanya Jawab") },
  { id: "rekening", label: tx("Rekening") },
  { id: "jaringan", label: tx("Jaringan & Daerah") },
  { id: "profil", label: tx("Pimpinan & Penghargaan") },
];

export type SearchEntry = {
  id: string;
  category: SearchCategory;
  /** Kunci terjemahan (atau teks apa adanya bila `raw`). */
  title: string;
  desc?: string;
  /** true = judul adalah nama diri, tidak diterjemahkan. */
  raw?: boolean;
  /** true = deskripsi adalah nama diri, tidak diterjemahkan. */
  descRaw?: boolean;
  /** Nilai dinamis untuk judul ({year}, {month} = indeks bulan 0–11). */
  vars?: { year?: number; month?: number; name?: string };
  href: string;
  /** Tanggal ISO untuk pengurutan terbaru/terlama. */
  date?: string;
  /** Kata kunci tambahan (tidak ditampilkan). */
  keywords?: string;
};

const q = (v: string) => encodeURIComponent(v);

function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];

  // Halaman dari menu
  for (const item of NAV_ITEMS) {
    out.push({ id: `nav-${item.href}`, category: "halaman", title: item.label, href: item.href });
    for (const child of item.children ?? []) {
      out.push({ id: `nav-${child.href}`, category: "halaman", title: child.label, desc: item.label, href: child.href });
    }
  }
  const extra: [string, string, string?][] = [
    ["/faq", tx("Frequently Asked Questions"), "faq tanya jawab pertanyaan"],
    ["/kontak", tx("Kontak"), "telepon whatsapp email alamat call center 14047"],
    ["/kebijakan-privasi", tx("Kebijakan Privasi"), "privasi data"],
    ["/konfirmasi-zakat", tx("Konfirmasi Zakat"), "bukti transfer bsz"],
  ];
  for (const [href, title, keywords] of extra) out.push({ id: `page-${href}`, category: "halaman", title, href, keywords });
  out.push({ id: "page-bayar", category: "halaman", title: tx("Bayar Zakat"), desc: tx("Formulir Bayar ZIS"), href: "/layanan/bayar-zis", keywords: "donasi bayar zakat infak sedekah online" });

  // Berita & video
  for (const [list, href] of [
    [BERITA_PROGRAM, "/berita/program"],
    [SIARAN_PERS, "/berita/siaran-pers"],
    [ARTIKEL, "/berita/artikel"],
  ] as const) {
    list.forEach((n, i) => out.push({ id: `${href}-${i}`, category: "berita", title: n.title, desc: n.summary, date: n.date, href: `${href}?q=${q(n.title)}` }));
  }
  VIDEOS.forEach((v) => out.push({ id: `video-${v.id}`, category: "berita", title: v.title, desc: tx("Baznas TV"), date: v.date, href: `/berita/baznas-tv?q=${q(v.title)}`, keywords: "video youtube" }));
  NEWSLETTERS.forEach((n) =>
    out.push({ id: `nl-${n.year}-${n.month}`, category: "berita", title: tx("Newsletter {month} {year}"), vars: { year: n.year, month: n.month }, desc: tx("Newsletter"), date: `${n.year}-${String(n.month + 1).padStart(2, "0")}-01`, href: "/berita/newsletter", keywords: "newsletter buletin" }),
  );

  // Dokumen & laporan
  PUSTAKA.forEach((p, i) => out.push({ id: `pustaka-${i}`, category: "dokumen", title: p.title, desc: p.desc, date: `${p.year}-01-01`, href: `/informasi/pustaka?q=${q(p.title)}`, keywords: `${p.author} ${p.isbn ?? ""} buku kajian publikasi pdf` }));
  AUDITED_YEARS.forEach((y) =>
    out.push({ id: `lap-${y}`, category: "dokumen", title: tx("Laporan Keuangan {year} Audited"), vars: { year: y }, desc: tx("Laporan Keuangan"), date: `${y}-12-31`, href: `/informasi/laporan?tahun=${y}`, keywords: `laporan keuangan audit pdf ${y}` }),
  );

  // Program
  PROGRAMS.forEach((p) => {
    out.push({ id: `prog-${p.id}`, category: "program", title: p.name, desc: tx("Profil Program"), href: `/profil/program?bidang=${p.id}` });
    p.items.forEach((it, i) => out.push({ id: `prog-${p.id}-${i}`, category: "program", title: it.name, desc: it.desc, href: `/profil/program?bidang=${p.id}` }));
  });

  // FAQ
  FAQ.forEach((f, i) => out.push({ id: `faq-${i}`, category: "faq", title: f.q, desc: f.a, href: `/faq?q=${q(f.q)}` }));

  // Rekening
  REKENING.forEach((r) => {
    const banks = [...new Set(r.accounts.map((a) => BANKS[a.bank].name))].join(" ");
    out.push({ id: `rek-${r.id}`, category: "rekening", title: tx("Rekening {name}"), vars: { name: r.label }, desc: tx("Rekening Zakat BAZNAS"), href: `/layanan/rekening?kategori=${r.id}`, keywords: `rekening transfer ${banks}` });
    const programs = [...new Set(r.accounts.map((a) => a.program).filter(Boolean))] as string[];
    programs.forEach((p) => out.push({ id: `rek-${r.id}-${p}`, category: "rekening", title: p, desc: tx("Program Tematik"), href: `/layanan/rekening?kategori=${r.id}`, keywords: "rekening transfer" }));
  });

  // Jaringan
  LEMBAGA.forEach((l) =>
    l.items.forEach((it, i) => out.push({ id: `lem-${l.id}-${i}`, category: "jaringan", title: it.name, raw: true, desc: l.name, href: `/informasi/jaringan-lembaga?jenis=${l.id}&q=${q(it.name)}`, keywords: `${it.web ?? ""} lembaga` })),
  );
  PROVINCES.forEach((p) =>
    out.push({ id: `prov-${p.slug}`, category: "jaringan", title: p.name, desc: tx("Website BAZNAS Daerah"), href: `/informasi/website-daerah?q=${q(p.name)}`, keywords: `${p.city} provinsi` }),
  );

  // Profil: pimpinan & penghargaan
  STRUKTUR.forEach((g) => g.people.forEach((p, i) => out.push({ id: `org-${g.group}-${i}`, category: "profil", title: p.name, raw: true, desc: p.role, href: "/profil/struktur" })));
  AWARDS.forEach((a, i) =>
    out.push({ id: `award-${i}`, category: "profil", title: a.title, raw: !a.local, desc: a.by ?? a.org, descRaw: !a.by, date: `${a.year}-12-31`, href: `/profil/penghargaan?tahun=${a.year}&q=${q(a.title)}`, keywords: `penghargaan award ${a.year}` }),
  );

  return out;
}

export const SEARCH_INDEX = buildIndex();

/** Huruf kecil, tanpa diakritik/harakat, spasi dirapikan. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ًͯ-ٰٟ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type SearchResult = SearchEntry & { score: number; titleText: string; descText?: string };

type Translate = (text: string, vars?: Record<string, string | number>) => string;
type MonthName = (month: number) => string;

/** Terjemahkan judul/deskripsi entri sesuai bahasa aktif. */
export function resolveEntry(e: SearchEntry, t: Translate, monthName: MonthName) {
  const vars: Record<string, string | number> = {};
  if (e.vars?.year !== undefined) vars.year = e.vars.year;
  if (e.vars?.month !== undefined) vars.month = monthName(e.vars.month);
  if (e.vars?.name) vars.name = t(e.vars.name);
  const titleText = e.raw ? e.title : t(e.title, vars);
  const descText = e.desc ? (e.descRaw ? e.desc : t(e.desc)) : undefined;
  return { titleText, descText };
}

/**
 * Cocokkan semua kata kueri. Skor lebih tinggi bila cocok di awal judul,
 * di judul, lalu di deskripsi/kata kunci. Teks asli (ID) ikut dicari.
 */
export function search(query: string, t: Translate, monthName: MonthName, category?: SearchCategory | "semua"): SearchResult[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  const results: SearchResult[] = [];
  for (const e of SEARCH_INDEX) {
    if (category && category !== "semua" && e.category !== category) continue;
    const { titleText, descText } = resolveEntry(e, t, monthName);
    const title = normalize(titleText);
    const titleOriginal = normalize(e.title);
    const rest = normalize(`${descText ?? ""} ${e.desc ?? ""} ${e.keywords ?? ""}`);
    let score = 0;
    let ok = true;
    for (const tok of tokens) {
      if (title.startsWith(tok)) score += 12;
      else if (new RegExp(`(^|\\s)${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) score += 8;
      else if (title.includes(tok) || titleOriginal.includes(tok)) score += 5;
      else if (rest.includes(tok)) score += 2;
      else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    if (title === normalize(query)) score += 20;
    if (e.category === "halaman") score += 1; // halaman utama sedikit didahulukan
    results.push({ ...e, score, titleText, descText });
  }
  // Skor sama: item lebih baru didahulukan, lalu urut judul
  return results.sort((a, b) => b.score - a.score || (b.date ?? "").localeCompare(a.date ?? "") || a.titleText.localeCompare(b.titleText));
}

export type SortMode = "relevansi" | "terbaru" | "terlama" | "az" | "za";

export function sortResults<T extends { date?: string; titleText: string; score?: number }>(items: T[], mode: SortMode, locale: string) {
  const arr = [...items];
  const byTitle = (a: T, b: T) => a.titleText.localeCompare(b.titleText, locale);
  switch (mode) {
    case "terbaru":
      return arr.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || byTitle(a, b));
    case "terlama":
      return arr.sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999") || byTitle(a, b));
    case "az":
      return arr.sort(byTitle);
    case "za":
      return arr.sort((a, b) => byTitle(b, a));
    default:
      return arr.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
}

/** Saran populer saat kotak pencarian masih kosong. */
export const POPULAR_SEARCHES = [tx("Kalkulator Zakat"), tx("Zakat Fitrah"), tx("Rekening Zakat"), tx("Laporan Keuangan")];

const RECENT_KEY = "baznas-recent-searches";

export function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}

export function saveRecent(query: string) {
  const q2 = query.trim();
  if (!q2) return;
  try {
    const next = [q2, ...readRecent().filter((r) => r.toLowerCase() !== q2.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* abaikan */
  }
}

export function clearRecent() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    /* abaikan */
  }
}
