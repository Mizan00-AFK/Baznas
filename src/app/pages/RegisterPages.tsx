import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { BadgeCheck, CheckCircle2, ClipboardList, FileText, HeartHandshake, MapPin, MessageCircle, Users } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { tx, useI18n } from "../lib/i18n";

const field = (error?: string) =>
  `w-full h-11 rounded-md border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a3a] ${error ? "border-red-400" : "border-gray-300"}`;

type FieldDef = { key: string; label: string; type?: string; options?: string[]; required?: boolean; ltr?: boolean };

/** Formulir pendaftaran sederhana dengan validasi inline. */
function RegisterForm({ fields, submitLabel, successTitle, successText }: { fields: FieldDef[]; submitLabel: string; successTitle: string; successText: string }) {
  const { t } = useI18n();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    for (const f of fields) {
      const v = (values[f.key] ?? "").trim();
      if (f.required !== false && !v) er[f.key] = t("Kolom ini wajib diisi.");
      else if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) er[f.key] = t("Format email belum benar, contoh: nama@email.com.");
      else if (f.type === "tel" && v && !/^(\+62|62|0)8\d{7,11}$/.test(v.replace(/[\s-]/g, ""))) er[f.key] = t("Nomor HP belum valid, contoh: 0812 3456 7890.");
    }
    setErrors(er);
    if (Object.keys(er).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="py-6 text-center" role="status">
        <CheckCircle2 size={48} className="mx-auto text-[#1a7a3a]" />
        <h2 className="mt-3 text-xl font-bold text-gray-900">{t(successTitle)}</h2>
        <p className="mt-2 text-gray-600">{t(successText)}</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-[#1a7a3a] px-5 py-2.5 font-medium text-white">
          {t("Kembali ke Beranda")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
          <label htmlFor={f.key} className="mb-2 flex justify-between text-sm font-medium text-gray-900">
            {t(f.label)}
            {f.required === false && <span className="text-xs font-normal text-gray-500">{t("Opsional")}</span>}
          </label>
          {f.options ? (
            <select id={f.key} value={values[f.key] ?? ""} onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))} className={field(errors[f.key])}>
              <option value="">{t("Pilih…")}</option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {t(o)}
                </option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea
              id={f.key}
              rows={4}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
              className={`${field(errors[f.key])} h-auto py-2.5`}
            />
          ) : (
            <input
              id={f.key}
              type={f.type ?? "text"}
              dir={f.ltr ? "ltr" : undefined}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
              className={field(errors[f.key])}
            />
          )}
          {errors[f.key] && <p className="mt-1.5 text-sm text-red-600">{errors[f.key]}</p>}
        </div>
      ))}
      <div className="sm:col-span-2">
        <p className="mb-4 text-xs text-gray-500">{t("Prototipe: data tidak dikirim ke server.")}</p>
        <button type="submit" className="w-full rounded-md bg-[#1a7a3a] py-3 font-medium text-white hover:bg-[#156830]">
          {t(submitLabel)}
        </button>
      </div>
    </form>
  );
}

/* ---------- Register Penerima Zakat (situs asli: WhatsApp Layanan Mustahik) ---------- */

const WA_MUSTAHIK = "https://api.whatsapp.com/send?phone=6281380990456&text=Assalamu%27alaikum%20Wr.Wb%2C%20Saya%20ingin%20mengajukan%20permohonan%20bantuan";

const LANGKAH_MUSTAHIK = [
  { icon: MessageCircle, h: tx("Hubungi Layanan Mustahik"), p: tx("Kirim pesan melalui WhatsApp resmi Layanan Mustahik BAZNAS.") },
  { icon: FileText, h: tx("Sampaikan kebutuhan"), p: tx("Jelaskan kondisi dan jenis bantuan yang dibutuhkan, lalu siapkan dokumen identitas (KTP dan KK).") },
  { icon: ClipboardList, h: tx("Verifikasi"), p: tx("Petugas BAZNAS melakukan asesmen dan verifikasi kelayakan sesuai ketentuan 8 asnaf.") },
  { icon: HeartHandshake, h: tx("Penyaluran"), p: tx("Bantuan disalurkan melalui program yang sesuai dengan kebutuhan penerima.") },
];

export function RegisterPenerimaZakat() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Register Penerima Zakat")} description={tx("Layanan bagi masyarakat yang membutuhkan bantuan untuk mengajukan permohonan sebagai penerima zakat (mustahik).")} />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <ol className="grid gap-4 sm:grid-cols-2">
            {LANGKAH_MUSTAHIK.map((s, i) => (
              <li key={s.h}>
                <Card className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
                      <s.icon size={20} aria-hidden />
                    </span>
                    <span className="text-xs font-semibold text-gray-500">{t("Langkah {n}", { n: i + 1 })}</span>
                  </div>
                  <h2 className="mt-3 font-semibold text-gray-900">{t(s.h)}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{t(s.p)}</p>
                </Card>
              </li>
            ))}
          </ol>
          <Card className="h-fit border-[#1a7a3a]/30 bg-green-50/50">
            <h2 className="font-semibold text-gray-900">{t("Ajukan permohonan bantuan")}</h2>
            <p className="mt-2 text-sm text-gray-600">{t("Permohonan dilayani melalui WhatsApp Layanan Mustahik BAZNAS.")}</p>
            <a href={WA_MUSTAHIK} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#1a7a3a] px-4 py-3 font-medium text-white hover:bg-[#156830]">
              <MessageCircle size={18} /> {t("Chat Layanan Mustahik")}
            </a>
            <p dir="ltr" className="mt-2 text-center text-sm text-gray-600">+62 813-8099-0456</p>
            <Link to="/layanan/kantor-minimarket" className="mt-4 flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <MapPin size={16} /> {t("Atau datang ke kantor BAZNAS")}
            </Link>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

/* ---------- Register Relawan (program Kerelawanan, bidang Kebencanaan) ---------- */

export function RegisterRelawan() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Register Relawan")} description={tx("Bergabunglah menjadi relawan BAZNAS. Relawan direkrut dan dilatih untuk mendukung tanggap bencana, edukasi, dan aksi sosial.")} />
      <PageBody narrow>
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
              <Users size={22} aria-hidden />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">{t("Formulir Pendaftaran Relawan")}</h2>
          </div>
          <RegisterForm
            fields={[
              { key: "nama", label: tx("Nama Lengkap") },
              { key: "email", label: tx("Email"), type: "email", ltr: true },
              { key: "hp", label: tx("No. Handphone"), type: "tel", ltr: true },
              { key: "domisili", label: tx("Kota Domisili") },
              { key: "minat", label: tx("Bidang Minat"), options: [tx("Tanggap Bencana"), tx("Edukasi"), tx("Kesehatan"), tx("Aksi Sosial")] },
              { key: "keahlian", label: tx("Keahlian"), required: false },
              { key: "motivasi", label: tx("Motivasi menjadi relawan"), type: "textarea", required: false },
            ]}
            submitLabel={tx("Daftar Sebagai Relawan")}
            successTitle={tx("Pendaftaran terkirim")}
            successText={tx("Terima kasih! Tim BAZNAS akan menghubungi Anda untuk informasi pelatihan relawan.")}
          />
        </Card>
      </PageBody>
    </>
  );
}

/* ---------- Register Label Taat Zakat ---------- */

const MANFAAT_LABEL = [
  tx("Bentuk apresiasi BAZNAS bagi badan usaha yang menunaikan zakat melalui BAZNAS."),
  tx("Label dapat dicantumkan pada produk dan media promosi perusahaan."),
  tx("Menumbuhkan kepercayaan konsumen muslim terhadap perusahaan."),
];

export function RegisterLabelTaatZakat() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Register Label Taat Zakat")} description={tx("Pendaftaran Label Taat Zakat bagi perusahaan dan pelaku usaha yang menunaikan zakat melalui BAZNAS.")} />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <Card className="h-fit">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
              <BadgeCheck size={22} aria-hidden />
            </span>
            <h2 className="mt-3 font-semibold text-gray-900">{t("Tentang Label Taat Zakat")}</h2>
            <ul className="mt-3 space-y-2">
              {MANFAAT_LABEL.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#1a7a3a]" aria-hidden /> {t(m)}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="mb-6 text-lg font-semibold text-gray-900">{t("Formulir Pendaftaran")}</h2>
            <RegisterForm
              fields={[
                { key: "perusahaan", label: tx("Nama Perusahaan") },
                { key: "bidang", label: tx("Bidang Usaha") },
                { key: "alamat", label: tx("Alamat Perusahaan"), type: "textarea" },
                { key: "pic", label: tx("Nama Penanggung Jawab") },
                { key: "email", label: tx("Email"), type: "email", ltr: true },
                { key: "hp", label: tx("No. Handphone"), type: "tel", ltr: true },
              ]}
              submitLabel={tx("Kirim Pendaftaran")}
              successTitle={tx("Pendaftaran terkirim")}
              successText={tx("Tim BAZNAS akan menghubungi penanggung jawab perusahaan untuk proses verifikasi.")}
            />
          </Card>
        </div>
      </PageBody>
    </>
  );
}
