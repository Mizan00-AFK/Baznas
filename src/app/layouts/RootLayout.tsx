import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BackToTop } from "../components/BackToTop";
import { useI18n } from "../lib/i18n";

export function RootLayout() {
  const { t, dir } = useI18n();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="konten" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <Toaster
        position="top-center"
        richColors
        closeButton
        dir={dir}
        containerAriaLabel={t("Notifikasi")}
        toastOptions={{ closeButtonAriaLabel: t("Tutup notifikasi") }}
      />
      <ScrollRestoration />
    </div>
  );
}
