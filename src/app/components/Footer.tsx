import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { CheckCircle2, Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter, Youtube } from "lucide-react";
import logo from "@/imports/logo-baznas-crop.png";
import { tx, useI18n } from "../lib/i18n";

const COLUMNS = [
  {
    title: tx("Edukasi ZIS"),
    links: [
      { label: tx("Kalkulator Zakat"), href: "/edukasi/kalkulator-zakat" },
      { label: tx("Zakat Fitrah"), href: "/edukasi/zakat-fitrah" },
      { label: tx("Zakat Mal"), href: "/edukasi/zakat-mal" },
      { label: tx("Infak"), href: "/edukasi/infak" },
      { label: tx("Sedekah"), href: "/edukasi/sedekah" },
      { label: tx("Fidyah"), href: "/edukasi/fidyah" },
    ],
  },
  {
    title: tx("Layanan"),
    links: [
      { label: tx("Formulir Bayar ZIS"), href: "/layanan/bayar-zis" },
      { label: tx("Rekening Zakat"), href: "/layanan/rekening" },
      { label: tx("Kantor Pusat BAZNAS"), href: "/layanan/kantor-minimarket" },
      { label: tx("Konfirmasi Zakat"), href: "/konfirmasi-zakat" },
      { label: tx("Register Penerima Zakat"), href: "/layanan/register-penerima-zakat" },
      { label: tx("Register Relawan"), href: "/layanan/register-relawan" },
    ],
  },
  {
    title: tx("Informasi Lainnya"),
    links: [
      { label: tx("Laporan"), href: "/informasi/laporan" },
      { label: tx("Website Baznas Daerah"), href: "/informasi/website-daerah" },
      { label: tx("Panduan Brand"), href: "/informasi/panduan-brand" },
      { label: tx("FAQ"), href: "/faq" },
      { label: tx("Kebijakan Privasi"), href: "/kebijakan-privasi" },
      { label: tx("Kontak"), href: "/kontak" },
    ],
  },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/baznasindonesia", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/baznasindonesia", icon: Instagram },
  { label: "X (Twitter)", href: "https://x.com/baznasindonesia", icon: Twitter },
  { label: "YouTube", href: "https://www.youtube.com/@BAZNASTV", icon: Youtube },
];

function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  if (status === "done") {
    return (
      <p className="flex items-start gap-2 rounded-xl bg-white/10 p-3 text-sm text-white" role="status">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold-400" />
        {t("Terima kasih! Kabar terbaru BAZNAS akan dikirim ke {email}.", { email })}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="newsletter" className="text-sm font-semibold text-white">
        {t("Newsletter")}
      </label>
      <p className="mt-1 text-sm text-white/70">{t("Kabar program dan laporan penyaluran, sebulan sekali.")}</p>
      <div className="mt-3 flex gap-2">
        <input
          id="newsletter"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder={t("nama@email.com")}
          aria-invalid={status === "error"}
          aria-describedby="newsletter-error"
          className="h-11 min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 focus:border-gold-400 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={t("Berlangganan")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-brand-900 hover:bg-gold-100"
        >
          <Send size={18} className="rtl:-scale-x-100" />
        </button>
      </div>
      {status === "error" && (
        <p id="newsletter-error" className="mt-2 text-sm text-gold-100">
          {t("Format email belum benar, contoh: nama@email.com")}
        </p>
      )}
    </form>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-islamic-pattern bg-brand-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(3,1fr)_1.3fr]">
          <div className="space-y-5">
            <div className="inline-flex rounded-2xl bg-white p-3">
              <img src={logo} alt="BAZNAS" className="h-14 w-auto" />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/75">
              {t("Badan Amil Zakat Nasional — lembaga resmi pemerintah pengelola zakat, infak, dan sedekah berdasarkan UU No. 23 Tahun 2011.")}
            </p>
            <ul className="flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-gold-400 hover:text-brand-900"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-gold-400">{t(col.title)}</h2>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link to={link.href} className="text-white/80 underline-offset-4 hover:text-white hover:underline">
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-6">
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                <Link to="/layanan/kantor-minimarket" className="hover:text-white hover:underline">
                  {t("Jl. Matraman Raya No. 134, Jakarta Timur 13150")}
                </Link>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                <a href="tel:14047" className="hover:text-white hover:underline">
                  14047
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                <a href="mailto:baznas@baznas.go.id" className="hover:text-white hover:underline">
                  baznas@baznas.go.id
                </a>
              </li>
            </ul>
            <Newsletter />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center border-t border-white/10 pt-6 text-center text-xs text-white/60">
          <p>
            {t("© 2026 Badan Amil Zakat Nasional. Seluruh hak cipta dilindungi.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
