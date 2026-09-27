import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { FormulirBayarZIS } from "./pages/FormulirBayarZIS";
import { KalkulatorZakat } from "./pages/KalkulatorZakat";
import { LaporanKeuangan } from "./pages/LaporanKeuangan";
import { ProfilVisiMisi } from "./pages/ProfilVisiMisi";
import { KantorMinimarket, KonfirmasiZakat, RekeningZakat } from "./pages/LayananPages";
import { EdukasiZIS, FaqPage, InfoPage, SectionIndex, WebsiteDaerah } from "./pages/InfoPages";
import { MitraBaznas, Penghargaan, ProfilProgram, StrukturBaznas } from "./pages/ProfilPages";
import { Artikel, BaznasTV, BeritaProgram, Newsletter, SiaranPers } from "./pages/BeritaPages";
import { RegisterLabelTaatZakat, RegisterPenerimaZakat, RegisterRelawan } from "./pages/RegisterPages";
import { JaringanLembaga, KebijakanPrivasi, Kontak, PanduanBrand, Ppid, Pustaka } from "./pages/InformasiPages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },

      // Profil
      { path: "profil", Component: SectionIndex },
      { path: "profil/visi-misi", Component: ProfilVisiMisi },
      { path: "profil/struktur", Component: StrukturBaznas },
      { path: "profil/program", Component: ProfilProgram },
      { path: "profil/penghargaan", Component: Penghargaan },
      { path: "profil/mitra", Component: MitraBaznas },

      // Layanan
      { path: "layanan", Component: SectionIndex },
      { path: "layanan/bayar-zis", Component: FormulirBayarZIS },
      { path: "layanan/rekening", Component: RekeningZakat },
      { path: "layanan/kantor-minimarket", Component: KantorMinimarket },
      { path: "layanan/register-penerima-zakat", Component: RegisterPenerimaZakat },
      { path: "layanan/register-relawan", Component: RegisterRelawan },
      { path: "layanan/register-label-taat-zakat", Component: RegisterLabelTaatZakat },

      // Edukasi ZIS
      { path: "edukasi", Component: SectionIndex },
      { path: "edukasi/kalkulator-zakat", Component: KalkulatorZakat },
      { path: "edukasi/:slug", Component: EdukasiZIS },

      // Berita & Informasi Lainnya
      { path: "berita", Component: SectionIndex },
      { path: "berita/program", Component: BeritaProgram },
      { path: "berita/siaran-pers", Component: SiaranPers },
      { path: "berita/artikel", Component: Artikel },
      { path: "berita/baznas-tv", Component: BaznasTV },
      { path: "berita/newsletter", Component: Newsletter },
      { path: "ppid", Component: Ppid },
      { path: "informasi", Component: SectionIndex },
      { path: "informasi/laporan", Component: LaporanKeuangan },
      { path: "informasi/website-daerah", Component: WebsiteDaerah },
      { path: "informasi/panduan-brand", Component: PanduanBrand },
      { path: "informasi/pustaka", Component: Pustaka },
      { path: "informasi/jaringan-lembaga", Component: JaringanLembaga },

      // Tautan dari footer & halaman lain
      { path: "konfirmasi-zakat", Component: KonfirmasiZakat },
      { path: "faq", Component: FaqPage },
      { path: "kontak", Component: Kontak },
      { path: "kebijakan-privasi", Component: KebijakanPrivasi },

      // Alamat dari versi redesain sebelumnya tetap berfungsi
      { path: "bayar-zakat", element: <Navigate to="/layanan/bayar-zis" replace /> },
      { path: "layanan/bayar-zis/formulir", element: <Navigate to="/layanan/bayar-zis" replace /> },
      { path: "layanan/bayar-zis/rekening", element: <Navigate to="/layanan/rekening" replace /> },
      { path: "layanan/bayar-zis/kantor", element: <Navigate to="/layanan/kantor-minimarket" replace /> },
      { path: "zakat/kalkulator", element: <Navigate to="/edukasi/kalkulator-zakat" replace /> },
      { path: "profil/pejabat", element: <Navigate to="/profil/struktur" replace /> },

      { path: "*", Component: InfoPage },
    ],
  },
]);
