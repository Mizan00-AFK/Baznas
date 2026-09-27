/**
 * Struktur menu mengikuti rancangan awal kelompok (Rancangan_Plan.txt).
 * Perubahan yang didasarkan pada materi pertemuan:
 * - P7 b.i: kedalaman menu maksimal 2 level (submenu Bayar ZIS dinaikkan ke menu Layanan).
 * - P7 b.ii: "Kalkulator Zakat" ditambahkan ke menu Edukasi ZIS (semantik tugas: zakat).
 * Selain itu label dan susunan menu tidak diubah.
 */
import { tx } from "../lib/i18n";

export type NavSub = { label: string; href: string; external?: boolean };
export type NavChild = { label: string; href: string; external?: boolean; sub?: NavSub[] };
export type NavItem = { label: string; href: string; external?: boolean; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { label: tx("Beranda"), href: "/" },
  {
    label: tx("Profil"),
    href: "/profil",
    children: [
      { label: tx("Visi dan Misi"), href: "/profil/visi-misi" },
      { label: tx("Struktur BAZNAS"), href: "/profil/struktur" },
      { label: tx("Profil Program"), href: "/profil/program" },
      { label: tx("Penghargaan"), href: "/profil/penghargaan" },
      { label: tx("Mitra Baznas"), href: "/profil/mitra" },
    ],
  },
  {
    label: tx("Layanan"),
    href: "/layanan",
    children: [
      // P7 b.i: submenu "Bayar ZIS" dinaikkan satu level agar menu maksimal 2 level
      { label: tx("Formulir Bayar ZIS"), href: "/layanan/bayar-zis" },
      { label: tx("Rekening Zakat"), href: "/layanan/rekening" },
      { label: tx("Kantor Pusat BAZNAS"), href: "/layanan/kantor-minimarket" },
      { label: tx("Register Penerima Zakat"), href: "/layanan/register-penerima-zakat" },
      { label: tx("Register Relawan"), href: "/layanan/register-relawan" },
      { label: tx("Register Label Taat Zakat"), href: "/layanan/register-label-taat-zakat" },
    ],
  },
  {
    label: tx("Edukasi ZIS"),
    href: "/edukasi",
    children: [
      { label: tx("Kalkulator Zakat"), href: "/edukasi/kalkulator-zakat" },
      { label: tx("Zakat Fitrah"), href: "/edukasi/zakat-fitrah" },
      { label: tx("Zakat Mal"), href: "/edukasi/zakat-mal" },
      { label: tx("Infak"), href: "/edukasi/infak" },
      { label: tx("Sedekah"), href: "/edukasi/sedekah" },
      { label: tx("Fidyah"), href: "/edukasi/fidyah" },
    ],
  },
  {
    label: tx("Berita"),
    href: "/berita",
    children: [
      { label: tx("Berita Program"), href: "/berita/program" },
      { label: tx("Siaran Pers"), href: "/berita/siaran-pers" },
      { label: tx("Artikel"), href: "/berita/artikel" },
      { label: tx("Baznas TV"), href: "/berita/baznas-tv" },
      { label: tx("Newsletter"), href: "/berita/newsletter" },
    ],
  },
  { label: tx("PPID"), href: "/ppid" },
  {
    label: tx("Informasi Lainnya"),
    href: "/informasi",
    children: [
      { label: tx("Laporan"), href: "/informasi/laporan" },
      { label: tx("Panduan Brand"), href: "/informasi/panduan-brand" },
      { label: tx("Pustaka"), href: "/informasi/pustaka" },
      { label: tx("Website Baznas Daerah"), href: "/informasi/website-daerah" },
      { label: tx("Jaringan Lembaga"), href: "/informasi/jaringan-lembaga" },
    ],
  },
];

/** Halaman di luar menu utama (footer / akses cepat). */
const EXTRA: Record<string, string> = {
  "/faq": tx("FAQ"),
  "/cari": tx("Pencarian"),
  "/konfirmasi-zakat": tx("Konfirmasi Zakat"),
  "/kontak": tx("Kontak"),
  "/kebijakan-privasi": tx("Kebijakan Privasi"),
};

export type Crumb = { label: string; href?: string };

/** Jejak breadcrumb, mis. Beranda / Layanan / Bayar ZIS / Formulir. */
export function getTrail(pathname: string): Crumb[] {
  const path = pathname.replace(/\/$/, "") || "/";
  const home: Crumb = { label: tx("Beranda"), href: "/" };
  if (path === "/") return [{ label: tx("Beranda") }];

  for (const item of NAV_ITEMS) {
    if (item.href === path) return [home, { label: item.label }];
    for (const child of item.children ?? []) {
      if (child.href === path) return [home, { label: item.label, href: item.href }, { label: child.label }];
      for (const sub of child.sub ?? []) {
        if (sub.href === path)
          return [
            home,
            { label: item.label, href: item.href },
            { label: child.label, href: child.href },
            { label: sub.label },
          ];
      }
    }
  }
  if (EXTRA[path]) return [home, { label: EXTRA[path] }];
  return [home, { label: tx("Halaman tidak ditemukan") }];
}

/** Anak-anak dari sebuah menu/submenu (untuk halaman indeks seperti /layanan). */
export function getChildren(pathname: string): { label: string; links: { label: string; href: string }[] } | null {
  for (const item of NAV_ITEMS) {
    if (item.href === pathname && item.children) return { label: item.label, links: item.children };
    for (const child of item.children ?? []) {
      if (child.href === pathname && child.sub) return { label: child.label, links: child.sub };
    }
  }
  return null;
}
