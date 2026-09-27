import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { CheckCircle2, Copy, MapPin, Navigation, Phone, Store, Truck, Upload } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { CurrencyInput } from "../components/CurrencyInput";
import { tx, useI18n } from "../lib/i18n";
import { BANKS, REKENING, type Account } from "../data/rekening";

/* ---------- Rekening (baznas.go.id/rekening) ---------- */

function BankLogo({ bank }: { bank: Account["bank"] }) {
  const [failed, setFailed] = useState(false);
  const info = BANKS[bank];
  if (failed) return null;
  return <img src={info.logo} alt="" className="h-8 w-20 shrink-0 object-contain" loading="lazy" onError={() => setFailed(true)} />;
}

function AccountRow({ account, onCopy }: { account: Account; onCopy: (a: Account) => void }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2">
      <span dir="ltr" className="text-base font-bold tabular-nums tracking-wide text-gray-900 sm:text-lg">
        {account.number}
      </span>
      <button type="button" onClick={() => onCopy(account)} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#1a7a3a] px-3 text-sm font-medium text-white hover:bg-[#156830]">
        <Copy size={14} /> {t("Salin")}
      </button>
    </div>
  );
}

export function RekeningZakat() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const initial = params.get("kategori");
  const [cat, setCatState] = useState(REKENING.some((r) => r.id === initial) ? initial! : REKENING[0].id);
  const setCat = (id: string) => {
    setCatState(id);
    setParams((p) => ({ ...Object.fromEntries(p), kategori: id }), { replace: true });
  };
  const current = REKENING.find((r) => r.id === cat) ?? REKENING[0];
  const copy = (a: Account) => {
    navigator.clipboard?.writeText(a.number.replace(/\D/g, ""));
    toast.success(t("Nomor rekening {bank} disalin.", { bank: BANKS[a.bank].name }));
  };

  // Program Tematik: rekening dikelompokkan per program
  const programs = current.accounts.reduce<Record<string, Account[]>>((acc, a) => {
    if (a.program) (acc[a.program] ??= []).push(a);
    return acc;
  }, {});

  return (
    <>
      <PageHeader title={tx("Rekening Zakat BAZNAS")} description={tx("Mari tunaikan zakat, sebagian dari rezeki kita hak orang lain.")} />
      <PageBody>
        <div className="space-y-6">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist" aria-label={t("Kategori rekening")}>
              {REKENING.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={cat === r.id}
                  onClick={() => setCat(r.id)}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${cat === r.id ? "bg-[#1a7a3a] text-white shadow-sm" : "text-gray-700 hover:bg-gray-200"}`}
                >
                  {t(r.label)} <span className="opacity-70">({r.accounts.length})</span>
                </button>
              ))}
            </div>
          </div>

          {current.note && <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-gray-700">{t(current.note)}</p>}

          {current.id === "tematik" ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(programs).map(([program, accounts]) => (
                <li key={program}>
                  <Card className="h-full">
                    <h2 className="font-semibold text-gray-900">{t(program)}</h2>
                    <div className="mt-3 space-y-3">
                      {accounts.map((a) => (
                        <div key={a.number}>
                          <div className="mb-1.5 flex items-center gap-2">
                            <BankLogo bank={a.bank} />
                            <span className="text-sm text-gray-600">{BANKS[a.bank].name}</span>
                          </div>
                          <AccountRow account={a} onCopy={copy} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {current.accounts.map((a) => (
                <li key={a.number}>
                  <Card className="h-full">
                    <div className="flex items-center gap-3">
                      <BankLogo bank={a.bank} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900">{BANKS[a.bank].name}</div>
                        <div className="text-xs text-gray-500">{t("a.n. BAZNAS · {category}", { category: t(current.label) })}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <AccountRow account={a} onCopy={copy} />
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}

          <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">{t("Sudah melakukan transfer?")}</h2>
              <p className="text-sm text-gray-600">{t("Konfirmasikan pembayaran Anda agar Bukti Setor Zakat dapat diterbitkan.")}</p>
            </div>
            <Link to="/konfirmasi-zakat" className="inline-flex items-center justify-center rounded-md bg-[#1a7a3a] px-5 py-2.5 font-medium text-white hover:bg-[#156830]">
              {t("Konfirmasi Zakat")}
            </Link>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

/* ---------- Kantor Pusat BAZNAS (mengikuti baznas.go.id/layananpembayaran) ---------- */

// Nama gerai adalah nama merek dan tidak diterjemahkan
const RETAIL = ["Alfamart", "Alfamidi", "Dan+Dan", "Pegadaian", "Lotte Grosir", "Indomaret"];

export function KantorMinimarket() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHeader title={tx("Kantor Pusat BAZNAS")} description={tx("Solusi kemudahan pembayaran zakat secara langsung: di kantor BAZNAS, layanan jemput zakat, atau kasir retail terdekat.")} />
      <PageBody>
        <div className="space-y-6">
          <Card className="p-0 sm:p-0 overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_22rem]">
              {/* Peta tertanam, bukan pranala eksternal (Pertemuan 6 b.iv) */}
              <iframe
                title={t("Peta lokasi Kantor Pusat BAZNAS")}
                src={`https://maps.google.com/maps?q=BAZNAS%20Jl.%20Matraman%20Raya%20No.134%20Jakarta&z=16&output=embed&hl=${lang}`}
                className="h-72 w-full border-0 sm:h-96 lg:h-full lg:min-h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-4 sm:p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MapPin size={20} className="text-[#1a7a3a]" aria-hidden /> {t("Kantor Pusat BAZNAS")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {t("Jl. Matraman Raya No.134, RT.5/RW.4, Kb. Manggis, Kec. Matraman, Kota Jakarta Timur, DKI Jakarta 13150")}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={16} className="text-[#1a7a3a]" aria-hidden />
                  <a href="tel:14047" dir="ltr" className="underline underline-offset-2 hover:text-[#1a7a3a]">14047</a>
                </p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=BAZNAS+Matraman+Raya+134+Jakarta"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1a7a3a] px-4 py-2.5 font-medium text-white hover:bg-[#156830]"
                >
                  <Navigation size={16} /> {t("Petunjuk arah")}
                </a>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Truck size={20} className="text-[#1a7a3a] rtl:-scale-x-100" aria-hidden /> {t("Jemput Zakat")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {t("Layanan penjemputan zakat untuk wilayah DKI Jakarta dan sekitarnya dengan minimal zakat Rp 1.000.000. Hubungi melalui SMS atau WhatsApp ke {phone}.", { phone: "0878 7737 3555" })}
              </p>
            </Card>
            <Card>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Store size={20} className="text-[#1a7a3a]" aria-hidden /> {t("Kasir Retail")}
              </h2>
              <p className="mt-2 text-sm text-gray-700">{t("Tunaikan zakat di kasir gerai mitra di seluruh Indonesia:")}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {RETAIL.map((r) => (
                  <li key={r} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  );
}

/* ---------- Konfirmasi Zakat ---------- */

export function KonfirmasiZakat() {
  const { t } = useI18n();
  const [nominal, setNominal] = useState("");
  const [bank, setBank] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!nominal) er.nominal = t("Isi nominal yang Anda transfer.");
    if (!bank) er.bank = t("Pilih rekening tujuan.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) er.email = t("Format email belum benar, contoh: nama@email.com.");
    if (!file) er.file = t("Lampirkan bukti transfer (JPG, PNG, atau PDF).");
    setErrors(er);
    if (Object.keys(er).length === 0) setSent(true);
  };

  const field = "w-full h-11 rounded-md border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a3a]";

  return (
    <>
      <PageHeader title={tx("Konfirmasi Zakat")} description={tx("Untuk pembayaran melalui transfer rekening. Konfirmasi diperlukan agar Bukti Setor Zakat (BSZ) dapat diterbitkan.")} />
      <PageBody narrow>
        <Card>
          {sent ? (
            <div className="py-6 text-center" role="status">
              <CheckCircle2 size={48} className="mx-auto text-[#1a7a3a]" />
              <h2 className="mt-3 text-xl font-bold text-gray-900">{t("Konfirmasi terkirim")}</h2>
              <p className="mt-2 text-gray-600">{t("Tim kami akan memverifikasi dalam 1×24 jam kerja. BSZ akan dikirim ke {email}.", { email })}</p>
              <Link to="/" className="mt-6 inline-flex rounded-md bg-[#1a7a3a] px-5 py-2.5 font-medium text-white">
                {t("Kembali ke Beranda")}
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <CurrencyInput label={t("Nominal yang ditransfer")} value={nominal} onChange={setNominal} error={errors.nominal} />
              <div>
                <label htmlFor="bank" className="mb-2 block text-sm font-medium text-gray-900">
                  {t("Rekening tujuan")}
                </label>
                <select id="bank" value={bank} onChange={(e) => setBank(e.target.value)} className={`${field} bg-white ${errors.bank ? "border-red-400" : "border-gray-300"}`}>
                  <option value="">{t("Pilih rekening…")}</option>
                  {REKENING.map((r) => (
                    <optgroup key={r.id} label={t(r.label)}>
                      {r.accounts.map((a) => (
                        <option key={`${r.id}-${a.number}`} value={`${r.id}-${a.number}`}>
                          {BANKS[a.bank].name}
                          {a.program ? ` — ${t(a.program)}` : ""} ({a.number})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.bank && <p className="mt-1.5 text-sm text-red-600">{errors.bank}</p>}
              </div>
              <div>
                <label htmlFor="kemail" className="mb-2 block text-sm font-medium text-gray-900">
                  {t("Email untuk BSZ")}
                </label>
                <input id="kemail" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("nama@email.com")} className={`${field} ${errors.email ? "border-red-400" : "border-gray-300"}`} />
                {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-gray-900">{t("Bukti transfer")}</span>
                <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center hover:bg-green-50 ${errors.file ? "border-red-300" : "border-gray-300"}`}>
                  <Upload className="text-[#1a7a3a]" aria-hidden />
                  <span className="text-sm font-medium text-gray-900">{file ? file.name : t("Klik untuk memilih berkas")}</span>
                  <span className="text-xs text-gray-500">{t("JPG, PNG, atau PDF · maks. 5 MB")}</span>
                  <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
                {errors.file && <p className="mt-1.5 text-sm text-red-600">{errors.file}</p>}
              </div>
              <button type="submit" className="w-full rounded-md bg-[#1a7a3a] py-3 font-medium text-white hover:bg-[#156830]">
                {t("Kirim Konfirmasi")}
              </button>
            </form>
          )}
        </Card>
      </PageBody>
    </>
  );
}
