import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ArrowLeft, CheckCircle2, Clock, Copy, Download, QrCode, RotateCcw } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CurrencyInput } from "../components/CurrencyInput";
import { Stepper } from "../components/Stepper";
import { CALC_MODES, ZakatCalculator } from "../components/ZakatCalculator";
import { getTrail } from "../data/navigation";
import { FIDYAH_PER_DAY, ZAKAT_FITRAH_PER_JIWA } from "../data/content";
import { formatRupiah, parseRupiah } from "../lib/format";
import { tx, useI18n } from "../lib/i18n";

const JENIS_DANA = [
  { value: "zakat", label: tx("Zakat") },
  { value: "infak", label: tx("Infak") },
  { value: "sedekah", label: tx("Sedekah") },
  { value: "fidyah", label: tx("Fidyah") },
  { value: "kurban", label: tx("Kurban") },
  { value: "dam-haji", label: tx("Dam Haji") },
];

const SUB_ZAKAT = [
  { value: "mal", label: tx("Zakat Maal") },
  { value: "penghasilan", label: tx("Zakat Penghasilan") },
  { value: "fitrah", label: tx("Zakat Fitrah") },
];

// Tarif contoh untuk prototipe
const HARGA_KURBAN = 3_500_000;
const HARGA_DAM = 3_000_000;

/** Metode pembayaran mengikuti halaman bayarzakat BAZNAS. */
const METODE = [
  { group: tx("Virtual Account"), min: 10_000, options: ["BSI", "BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga", "Muamalat", "Permata"] },
  { group: tx("Pembayaran Online"), min: 10_000, options: ["QRIS", "GoPay", "ShopeePay", "OVO", "DANA", "LinkAja"] },
  { group: tx("Gerai Retail"), min: 25_000, options: ["Indomaret"] },
  { group: tx("Kartu"), min: 10_001, options: [tx("Kartu Kredit/Debit")] },
];

const STEPS = [tx("Isi Formulir"), tx("Pilih Pembayaran"), tx("Selesaikan Pembayaran"), tx("Selesai")];

const NIAT: Record<string, { ar: string; id: string }> = {
  fitrah: {
    ar: "نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِيْ فَرْضًا لِلّٰهِ تَعَالَى",
    id: tx("Aku niat mengeluarkan zakat fitrah untuk diriku sendiri, fardu karena Allah Ta'ala."),
  },
  default: {
    ar: "نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِيْ فَرْضًا لِلّٰهِ تَعَالَى",
    id: tx("Aku niat mengeluarkan zakat hartaku, fardu karena Allah Ta'ala."),
  },
};

const inputClass = (error?: string) =>
  `w-full h-11 border rounded-md bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a3a] focus:border-transparent ${
    error ? "border-red-400" : "border-gray-300"
  }`;

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function CountSelect({ id, label, value, max, unit, onChange }: { id: string; label: string; value: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <Field id={id} label={label}>
      <select id={id} value={value} onChange={(e) => onChange(Number(e.target.value))} className={inputClass()}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n} {unit}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function FormulirBayarZIS() {
  const { t, lang } = useI18n();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"formulir" | "kalkulator">("formulir");
  const [step, setStep] = useState(0);

  // Form states
  const initialJenis = JENIS_DANA.some((j) => j.value === params.get("jenis")) ? params.get("jenis")! : "zakat";
  const initialSub = SUB_ZAKAT.some((s) => s.value === params.get("sub")) ? params.get("sub")! : "mal";
  const [jenisDana, setJenisDana] = useState(initialJenis);
  const [subJenis, setSubJenis] = useState(initialSub);
  const [jumlah, setJumlah] = useState(1);
  const [nominal, setNominal] = useState(params.get("nominal")?.replace(/\D/g, "") ?? "");
  const [nama, setNama] = useState("");
  const [gender, setGender] = useState("bapak");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [setuju, setSetuju] = useState(false);
  const [metode, setMetode] = useState<{ group: string; option: string; min: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [txId] = useState(() => "ZIS-" + Date.now().toString().slice(-8));

  // Nominal dihitung otomatis untuk dana berbasis jumlah (jiwa/hari/hewan)
  const autoRate =
    jenisDana === "zakat" && subJenis === "fitrah"
      ? { rate: ZAKAT_FITRAH_PER_JIWA, unit: t("jiwa"), label: t("Jumlah Jiwa"), max: 10 }
      : jenisDana === "fidyah"
        ? { rate: FIDYAH_PER_DAY, unit: t("hari"), label: t("Jumlah Hari"), max: 30 }
        : jenisDana === "kurban"
          ? { rate: HARGA_KURBAN, unit: t("ekor"), label: t("Jumlah Hewan Kurban"), max: 7 }
          : jenisDana === "dam-haji"
            ? { rate: HARGA_DAM, unit: t("ekor"), label: t("Jumlah Hewan Dam Haji"), max: 7 }
            : null;

  useEffect(() => {
    if (autoRate) setNominal(String(autoRate.rate * jumlah));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jenisDana, subJenis, jumlah]);

  const amount = parseRupiah(nominal);
  const jenisLabel = t(
    (jenisDana === "zakat" ? SUB_ZAKAT.find((s) => s.value === subJenis)?.label : JENIS_DANA.find((j) => j.value === jenisDana)?.label) ?? "",
  );
  const sapaan = gender === "ibu" ? t("Ibu") : t("Bapak");
  // Nama bank/dompet digital adalah nama merek dan tidak diterjemahkan
  const optionLabel = (o: string) => (o === "Kartu Kredit/Debit" ? t(o) : o);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (amount < 10_000) e.nominal = t("Nominal minimal {amount}.", { amount: formatRupiah(10_000) });
    if (nama.trim().length < 3) e.nama = t("Tuliskan nama lengkap Anda.");
    if (!/^(\+62|62|0)8\d{7,11}$/.test(phone.replace(/[\s-]/g, ""))) e.phone = t("Nomor HP belum valid, contoh: 0812 3456 7890.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t("Format email belum benar, contoh: nama@email.com.");
    if (!setuju) e.setuju = t("Centang pernyataan ini untuk melanjutkan.");
    return e;
  };

  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePilihPembayaran = () => {
    const e = validateForm();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(t("Periksa kembali isian yang ditandai merah."));
      return;
    }
    goTo(1);
  };

  const handleBayar = () => {
    if (!metode) {
      setErrors({ metode: t("Pilih salah satu metode pembayaran.") });
      return;
    }
    if (amount < metode.min) {
      setErrors({ metode: t("Minimal pembayaran melalui {method} adalah {amount}.", { method: optionLabel(metode.option), amount: formatRupiah(metode.min) }) });
      return;
    }
    goTo(2);
  };

  const handleReset = () => {
    const snapshot = { jenisDana, subJenis, jumlah, nominal, nama, gender, phone, email, setuju };
    setJenisDana("zakat");
    setSubJenis("mal");
    setJumlah(1);
    setNominal("");
    setNama("");
    setGender("bapak");
    setPhone("");
    setEmail("");
    setSetuju(false);
    setErrors({});
    toast(t("Formulir dikosongkan."), {
      action: {
        label: t("Urungkan"),
        onClick: () => {
          setJenisDana(snapshot.jenisDana);
          setSubJenis(snapshot.subJenis);
          setJumlah(snapshot.jumlah);
          setNominal(snapshot.nominal);
          setNama(snapshot.nama);
          setGender(snapshot.gender);
          setPhone(snapshot.phone);
          setEmail(snapshot.email);
          setSetuju(snapshot.setuju);
        },
      },
    });
  };

  const handleSudahBayar = () => {
    goTo(3);
    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.35 }, colors: ["#1a7a3a", "#e0b54a", "#ffffff"] });
    }
  };

  const vaNumber = "8808" + String(amount).padStart(8, "0").slice(-8) + txId.slice(-4);
  const copy = (text: string, what: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(t("{what} disalin.", { what }));
  };

  const niat = jenisDana === "zakat" ? (subJenis === "fitrah" ? NIAT.fitrah : NIAT.default) : null;

  return (
    <>
      <Breadcrumb items={getTrail(pathname)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="w-full h-36 sm:h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=400&fit=crop"
              alt={t("Tunaikan zakat bersama BAZNAS")}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-center text-xl sm:text-2xl font-bold mb-2 text-gray-900">
            {t("TUNAIKAN ZAKAT, INFAK, DAN SEDEKAH")}
            <br />
            {t("ANDA DENGAN")} <span className="text-[#1a7a3a]">{t("AMAN DAN MUDAH")}</span>
          </h1>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-6" role="tablist">
          {(
            [
              ["formulir", tx("Isi Formulir")],
              ["kalkulator", tx("Kalkulator")],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={activeTab === value}
              onClick={() => setActiveTab(value)}
              className={`flex-1 py-3 sm:py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === value
                  ? "text-[#1a7a3a] border-[#1a7a3a] bg-white"
                  : "text-gray-500 border-transparent hover:text-gray-700 bg-gray-50"
              }`}
            >
              {t(label)}
            </button>
          ))}
        </div>

        {activeTab === "kalkulator" ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <ZakatCalculator
              modes={[CALC_MODES.maal, CALC_MODES.penghasilan]}
              onPay={(value, mode) => {
                setJenisDana("zakat");
                setSubJenis(mode.sub);
                setNominal(String(value));
                setStep(0);
                setActiveTab("formulir");
                toast.success(t("Nominal {amount} dimasukkan ke formulir.", { amount: formatRupiah(value) }));
              }}
            />
          </div>
        ) : (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            {/* Indikator tahapan transaksi (Pertemuan 9b) */}
            <Stepper steps={STEPS.map((s) => t(s))} current={step} onStepClick={goTo} locked={step >= 2} />

            <div className="mt-6 border-t border-gray-100 pt-6">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="jenis" label={t("Pilih Jenis Dana")}>
                      <select
                        id="jenis"
                        value={jenisDana}
                        onChange={(e) => {
                          setJenisDana(e.target.value);
                          setJumlah(1);
                          if (!["zakat", "fidyah", "kurban", "dam-haji"].includes(e.target.value)) setNominal("");
                        }}
                        className={inputClass()}
                      >
                        {JENIS_DANA.map((j) => (
                          <option key={j.value} value={j.value}>
                            {t(j.label)}
                          </option>
                        ))}
                      </select>
                    </Field>

                    {jenisDana === "zakat" && (
                      <Field id="sub" label={t("Jenis Zakat")}>
                        <select id="sub" value={subJenis} onChange={(e) => setSubJenis(e.target.value)} className={inputClass()}>
                          {SUB_ZAKAT.map((s) => (
                            <option key={s.value} value={s.value}>
                              {t(s.label)}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}

                    {autoRate && (
                      <CountSelect id="jumlah" label={autoRate.label} value={jumlah} max={autoRate.max} unit={autoRate.unit} onChange={setJumlah} />
                    )}
                  </div>

                  <CurrencyInput
                    label={t("Masukkan Nominal")}
                    value={nominal}
                    onChange={(v) => {
                      setNominal(v);
                      setErrors((e) => ({ ...e, nominal: "" }));
                    }}
                    error={errors.nominal || undefined}
                    hint={
                      autoRate
                        ? t("Dihitung otomatis: {count} {unit} × {rate} (tarif contoh).", { count: jumlah, unit: autoRate.unit, rate: formatRupiah(autoRate.rate) })
                        : t("Titik pemisah ribuan muncul otomatis saat Anda mengetik. Minimal Rp 10.000.")
                    }
                  />

                  {jenisDana === "zakat" && subJenis !== "fitrah" && (
                    <p className="text-sm text-gray-600">
                      {t("Belum tahu besaran zakat Anda?")}{" "}
                      <button type="button" onClick={() => setActiveTab("kalkulator")} className="font-medium text-[#1a7a3a] underline underline-offset-2">
                        {t("Hitung di tab Kalkulator")}
                      </button>
                    </p>
                  )}

                  <div className="border-t pt-6 space-y-4">
                    <p className="text-sm font-medium text-gray-900">{t("Silakan lengkapi data di bawah ini:")}</p>

                    <fieldset>
                      <legend className="sr-only">{t("Sapaan")}</legend>
                      <div className="flex gap-6">
                        {(
                          [
                            ["bapak", tx("Bapak")],
                            ["ibu", tx("Ibu")],
                          ] as const
                        ).map(([value, label]) => (
                          <label key={value} className="flex items-center gap-2 cursor-pointer min-h-11">
                            <input
                              type="radio"
                              name="gender"
                              value={value}
                              checked={gender === value}
                              onChange={(e) => setGender(e.target.value)}
                              className="w-4 h-4 accent-[#1a7a3a]"
                            />
                            <span className="text-sm text-gray-700">{t(label)}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Field id="nama" label={t("Nama Lengkap")} error={errors.nama}>
                      <input id="nama" type="text" autoComplete="name" value={nama} onChange={(e) => setNama(e.target.value)} className={inputClass(errors.nama)} placeholder={t("Contoh: Ahmad Fauzi")} aria-invalid={!!errors.nama} />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="phone" label={t("No. Handphone")} error={errors.phone}>
                        <input id="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass(errors.phone)} placeholder="0812 3456 7890" aria-invalid={!!errors.phone} />
                      </Field>
                      <Field id="email" label={t("Email")} error={errors.email}>
                        <input id="email" type="email" autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass(errors.email)} placeholder={t("nama@email.com")} aria-invalid={!!errors.email} />
                      </Field>
                    </div>

                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1a7a3a]" />
                        <span className="text-sm text-gray-700">
                          {t("Dengan mengisi formulir ini, saya menyatakan bahwa dana yang ditunaikan berasal dari sumber yang halal dan bersedia dihubungi oleh BAZNAS terkait pembayaran ini.")}
                        </span>
                      </label>
                      {errors.setuju && <p className="mt-1.5 text-sm text-red-600">{errors.setuju}</p>}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">i</div>
                    </div>
                    <p className="text-sm text-gray-700">
                      {t("Informasi yang Anda masukkan ke dalam formulir akan dibagikan ke BAZNAS untuk tujuan zakat dan diproses oleh BAZNAS sesuai dengan kebijakan privasi BAZNAS.")}
                    </p>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <button type="button" onClick={handleReset} className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 font-medium px-4 py-3 rounded-md hover:bg-gray-50 transition-colors">
                      <RotateCcw size={16} /> {t("Reset")}
                    </button>
                    <button type="button" onClick={handlePilihPembayaran} className="w-full bg-[#1a7a3a] text-white font-medium py-3 rounded-md hover:bg-[#156830] transition-colors">
                      {t("Pilih Pembayaran")}
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="rounded-md bg-gray-50 p-4 text-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="text-gray-600">{t("{type} · a.n. {name}", { type: jenisLabel, name: `${sapaan} ${nama}` })}</span>
                      <span className="font-bold text-[#1a7a3a]">{formatRupiah(amount)}</span>
                    </div>
                  </div>
                  {METODE.map((m) => (
                    <fieldset key={m.group}>
                      <legend className="mb-2 text-sm font-semibold text-gray-900">
                        {t(m.group)} <span className="font-normal text-gray-500">· {t("minimal {amount}", { amount: formatRupiah(m.min) })}</span>
                      </legend>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {m.options.map((o) => {
                          const active = metode?.option === o;
                          return (
                            <button
                              key={o}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              onClick={() => {
                                setMetode({ group: m.group, option: o, min: m.min });
                                setErrors({});
                              }}
                              className={`min-h-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                active ? "border-[#1a7a3a] bg-green-50 text-[#1a7a3a] ring-1 ring-[#1a7a3a]" : "border-gray-300 text-gray-700 hover:border-[#1a7a3a]"
                              }`}
                            >
                              {optionLabel(o)}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                  {errors.metode && <p className="text-sm text-red-600">{errors.metode}</p>}
                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <button type="button" onClick={() => goTo(0)} className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 font-medium px-4 py-3 rounded-md hover:bg-gray-50">
                      <ArrowLeft size={16} className="rtl:rotate-180" /> {t("Kembali")}
                    </button>
                    <button type="button" onClick={handleBayar} className="w-full bg-[#1a7a3a] text-white font-medium py-3 rounded-md hover:bg-[#156830]">
                      {t("Bayar {amount}", { amount: formatRupiah(amount) })}
                    </button>
                  </div>
                </div>
              )}

              {step >= 2 && (
                <div className="space-y-6">
                  {step === 2 ? (
                    <>
                      <div className="flex items-start gap-3 rounded-md bg-amber-50 p-4">
                        <Clock className="mt-0.5 shrink-0 text-amber-600" size={20} aria-hidden />
                        <div>
                          <h2 className="font-semibold text-gray-900">{t("Selesaikan pembayaran dalam 24 jam")}</h2>
                          <p className="text-sm text-gray-600">{t("Status di bawah akan berubah otomatis setelah dana diterima.")}</p>
                        </div>
                      </div>
                      <div className="rounded-md border border-gray-200 p-4 sm:p-5">
                        <div className="text-sm text-gray-500">
                          {metode && `${t(metode.group)} — ${optionLabel(metode.option)}`}
                        </div>
                        {metode?.option === "QRIS" ? (
                          <div className="mt-3 flex h-40 w-40 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                            <QrCode size={88} aria-label={t("Kode QRIS (simulasi)")} />
                          </div>
                        ) : (
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span dir="ltr" className="text-xl sm:text-2xl font-bold tracking-wider tabular-nums text-gray-900">
                              {vaNumber.replace(/(\d{4})/g, "$1 ").trim()}
                            </span>
                            <button type="button" onClick={() => copy(vaNumber, t("Nomor pembayaran"))} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-300 px-3 text-sm font-medium text-[#1a7a3a] hover:bg-gray-50">
                              <Copy size={14} /> {t("Salin")}
                            </button>
                          </div>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 text-sm">
                          <span className="text-gray-500">{t("Total bayar")}</span>
                          <span className="text-lg font-bold tabular-nums text-[#1a7a3a]">{formatRupiah(amount)}</span>
                        </div>
                        <p className="mt-3 text-xs text-gray-400">{t("Prototipe: nomor pembayaran adalah simulasi.")}</p>
                      </div>
                      <button type="button" onClick={handleSudahBayar} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1a7a3a] text-white font-medium px-6 py-3 rounded-md hover:bg-[#156830]">
                        <CheckCircle2 size={18} /> {t("Saya sudah membayar")}
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <CheckCircle2 size={52} className="mx-auto text-[#1a7a3a]" />
                      <h2 className="mt-3 text-xl sm:text-2xl font-bold text-gray-900">{t("Jazakumullahu khairan!")}</h2>
                      <p className="mt-2 text-gray-600">
                        {t("{type} sebesar {amount} telah diterima. Bukti Setor Zakat dikirim ke {email}.", { type: jenisLabel, amount: formatRupiah(amount), email })}
                      </p>
                      <figure className="mx-auto mt-5 max-w-lg rounded-md bg-green-50 p-4">
                        <p lang="ar" dir="rtl" className="font-arabic text-xl leading-loose text-[#145c2c]">
                          آجَرَكَ اللهُ فِيمَا أَعْطَيْتَ، وَبَارَكَ لَكَ فِيمَا أَبْقَيْتَ، وَجَعَلَهُ لَكَ طَهُورًا
                        </p>
                        {lang !== "ar" && (
                          <figcaption className="mt-2 text-sm italic text-gray-600">
                            “{t("Semoga Allah memberi pahala atas apa yang engkau berikan, memberkahi harta yang tersisa, dan menjadikannya penyuci bagimu.")}”
                          </figcaption>
                        )}
                      </figure>
                      <p className="mt-4 text-sm text-gray-600">
                        {t("Anda akan menerima panggilan berisi doa dan ucapan terima kasih dari nomor {phone}.", { phone: "14047" })}
                      </p>
                      <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
                        <button type="button" onClick={() => toast.success(t("Bukti Setor Zakat diunduh (simulasi)."))} className="inline-flex items-center justify-center gap-2 bg-[#1a7a3a] text-white font-medium px-5 py-3 rounded-md hover:bg-[#156830]">
                          <Download size={18} /> {t("Unduh BSZ")}
                        </button>
                        <Link to="/" className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-medium px-5 py-3 rounded-md hover:bg-gray-50">
                          {t("Kembali ke Beranda")}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Status transaksi real-time (Pertemuan 9b) */}
                  <div className="rounded-md border border-gray-200 p-4 sm:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{t("Status transaksi")}</h3>
                      <span className="text-xs tabular-nums text-gray-500">{txId}</span>
                    </div>
                    <ol className="space-y-3">
                      {[
                        { label: tx("Transaksi dibuat"), done: true },
                        { label: tx("Menunggu pembayaran"), done: step === 3, active: step === 2 },
                        { label: tx("Pembayaran terverifikasi"), done: step === 3 },
                        { label: tx("Bukti Setor Zakat (BSZ) dikirim ke email"), done: step === 3 },
                      ].map((s) => (
                        <li key={s.label} className="flex items-center gap-3 text-sm">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                              s.done ? "bg-[#1a7a3a] text-white" : s.active ? "bg-amber-400 text-white" : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {s.done ? <CheckCircle2 size={14} /> : <Clock size={13} />}
                          </span>
                          <span className={s.done ? "font-medium text-gray-900" : s.active ? "font-medium text-amber-700" : "text-gray-500"}>{t(s.label)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {niat && activeTab === "formulir" && step === 0 && (
          <figure className="mt-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
            <figcaption className="text-sm font-semibold text-gray-900">{t("Niat {type}", { type: jenisLabel })}</figcaption>
            <p lang="ar" dir="rtl" className="font-arabic mt-3 text-xl sm:text-2xl leading-loose text-[#145c2c]">
              {niat.ar}
            </p>
            {lang !== "ar" && <p className="mt-2 text-sm italic text-gray-600">“{t(niat.id)}”</p>}
          </figure>
        )}
      </div>
    </>
  );
}
