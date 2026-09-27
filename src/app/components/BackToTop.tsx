import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useI18n } from "../lib/i18n";

/** Tombol kembali ke atas (dipertahankan dari situs asli, Pertemuan 6 & 7). */
export function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("Kembali ke atas")}
      title={t("Kembali ke atas")}
      className={`fixed bottom-6 end-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 text-white shadow-lg transition-all duration-300 hover:bg-brand-900 sm:end-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
