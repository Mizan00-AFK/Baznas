import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Info, RotateCcw } from "lucide-react";
import { CurrencyInput } from "./CurrencyInput";
import { DEFAULT_GOLD_PRICE, NISAB_GRAMS } from "../data/content";
import { formatRupiah, parseRupiah } from "../lib/format";
import { tx, useI18n } from "../lib/i18n";

type Field = { key: string; label: string; optional?: boolean; unit?: "rp" | "gram"; defaultValue?: string };
type Values = Record<string, string>;
type Result = { base: number; nisab: number; wajib: boolean; monthly?: boolean };

export type CalcMode = {
  id: string;
  label: string;
  /** Sub-jenis zakat yang dikirim ke formulir pembayaran. */
  sub: "penghasilan" | "mal";
  fields: Field[];
  baseLabel: string;
  resultLabel: string;
  belowNisab: string;
  compute: (n: (key: string) => number, nisabYear: number) => Result;
};

const sum = (n: (k: string) => number, keys: string[]) => keys.reduce((s, k) => s + n(k), 0);

/** Definisi kalkulator mengikuti situs asli (bayarzakat & kalkulatorzakat BAZNAS). */
export const CALC_MODES: Record<string, CalcMode> = {
  penghasilan: {
    id: "penghasilan",
    label: tx("Penghasilan"),
    sub: "penghasilan",
    fields: [
      { key: "gaji", label: tx("Gaji saya per bulan") },
      { key: "lain", label: tx("Penghasilan lain-lain per bulan (bonus, THR, dan lainnya)"), optional: true },
    ],
    baseLabel: tx("Jumlah penghasilan per bulan"),
    resultLabel: tx("Jumlah Wajib Zakat yang harus dibayarkan (2,5% dari Jumlah Penghasilan)"),
    belowNisab: tx("Penghasilan Anda belum mencapai nisab, KLIK untuk sedekah"),
    compute: (n, nisabYear) => {
      const base = sum(n, ["gaji", "lain"]);
      return { base, nisab: nisabYear / 12, wajib: base >= nisabYear / 12, monthly: true };
    },
  },
  maal: {
    id: "maal",
    label: tx("Maal (Harta)"),
    sub: "mal",
    fields: [
      { key: "emas", label: tx("Nilai emas, perak, dan/atau permata"), optional: true },
      { key: "tunai", label: tx("Uang tunai, tabungan, deposito") },
      { key: "aset", label: tx("Kendaraan, rumah, aset lain"), optional: true },
      { key: "hutang", label: tx("Jumlah hutang/cicilan"), optional: true },
    ],
    baseLabel: tx("Jumlah harta bersih"),
    resultLabel: tx("Jumlah Wajib Zakat yang harus dibayarkan (2,5% dari Jumlah Harta)"),
    belowNisab: tx("Harta Anda belum mencapai nisab, KLIK untuk sedekah"),
    compute: (n, nisabYear) => {
      const base = sum(n, ["emas", "tunai", "aset"]) - n("hutang");
      return { base, nisab: nisabYear, wajib: base >= nisabYear };
    },
  },
  jasa: {
    id: "jasa",
    label: tx("Jasa"),
    sub: "mal",
    fields: [{ key: "pendapatan", label: tx("Pendapatan sebelum pajak (per tahun)") }],
    baseLabel: tx("Jumlah pendapatan per tahun"),
    resultLabel: tx("Jumlah Wajib Zakat yang harus dibayarkan (2,5% dari Pendapatan)"),
    belowNisab: tx("Pendapatan Anda belum mencapai nisab, KLIK untuk sedekah"),
    compute: (n, nisabYear) => ({ base: n("pendapatan"), nisab: nisabYear, wajib: n("pendapatan") >= nisabYear }),
  },
  perusahaan: {
    id: "perusahaan",
    label: tx("Perusahaan"),
    sub: "mal",
    fields: [
      { key: "aktiva", label: tx("Aktiva Lancar") },
      { key: "pasiva", label: tx("Pasiva Lancar") },
    ],
    baseLabel: tx("Aktiva lancar − pasiva lancar"),
    resultLabel: tx("Jumlah Wajib Zakat yang harus dibayarkan (2,5% dari Aktiva Bersih)"),
    belowNisab: tx("Aset perusahaan belum mencapai nisab, KLIK untuk sedekah"),
    compute: (n, nisabYear) => {
      const base = n("aktiva") - n("pasiva");
      return { base, nisab: nisabYear, wajib: base >= nisabYear };
    },
  },
  perdagangan: {
    id: "perdagangan",
    label: tx("Perdagangan"),
    sub: "mal",
    fields: [
      { key: "aset", label: tx("Aset Lancar") },
      { key: "laba", label: tx("Laba"), optional: true },
    ],
    baseLabel: tx("Jumlah aset lancar + laba"),
    resultLabel: tx("Jumlah Wajib Zakat yang harus dibayarkan (2,5% dari Aset dan Laba)"),
    belowNisab: tx("Harta perdagangan belum mencapai nisab, KLIK untuk sedekah"),
    compute: (n, nisabYear) => {
      const base = sum(n, ["aset", "laba"]);
      return { base, nisab: nisabYear, wajib: base >= nisabYear };
    },
  },
  emas: {
    id: "emas",
    label: tx("Emas"),
    sub: "mal",
    fields: [
      { key: "gram", label: tx("Jumlah Emas yang Dimiliki"), unit: "gram" },
      { key: "harga", label: tx("Harga Emas per Gram"), defaultValue: String(DEFAULT_GOLD_PRICE) },
    ],
    baseLabel: tx("Nilai emas (gram × harga)"),
    resultLabel: tx("Jumlah Wajib Zakat yang harus dibayarkan (2,5% dari Nilai Emas)"),
    belowNisab: tx("Emas Anda belum mencapai nisab 85 gram, KLIK untuk sedekah"),
    compute: (n) => {
      const harga = n("harga") || DEFAULT_GOLD_PRICE;
      return { base: n("gram") * harga, nisab: NISAB_GRAMS * harga, wajib: n("gram") >= NISAB_GRAMS };
    },
  },
};

type Props = {
  modes: CalcMode[];
  /** Dipanggil saat pengguna menekan Bayar Zakat. Jika tidak diisi, diarahkan ke formulir. */
  onPay?: (amount: number, mode: CalcMode) => void;
};

export function ZakatCalculator({ modes, onPay }: Props) {
  const { t } = useI18n();
  const [modeId, setModeId] = useState(modes[0].id);
  const [values, setValues] = useState<Values>({});
  const [goldPrice, setGoldPrice] = useState(String(DEFAULT_GOLD_PRICE));
  const mode = modes.find((m) => m.id === modeId) ?? modes[0];

  const get = (key: string) => values[`${mode.id}.${key}`] ?? mode.fields.find((f) => f.key === key)?.defaultValue ?? "";
  const n = (key: string) => parseRupiah(get(key));
  const nisabYear = NISAB_GRAMS * (parseRupiah(goldPrice) || DEFAULT_GOLD_PRICE);
  const { base, nisab, wajib, monthly } = mode.compute(n, nisabYear);
  const zakat = wajib ? base * 0.025 : 0;
  const hasInput = mode.fields.some((f) => !f.defaultValue && n(f.key) > 0);

  const reset = () => {
    const snapshot = values;
    setValues((v) => Object.fromEntries(Object.entries(v).filter(([k]) => !k.startsWith(`${mode.id}.`))));
    toast(t("Isian kalkulator dikosongkan."), { action: { label: t("Urungkan"), onClick: () => setValues(snapshot) } });
  };

  const payLink = `/layanan/bayar-zis?jenis=zakat&sub=${mode.sub}&nominal=${Math.round(zakat)}`;

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist" aria-label={t("Jenis zakat")}>
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={m.id === mode.id}
              onClick={() => setModeId(m.id)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                m.id === mode.id ? "bg-[#1a7a3a] text-white shadow-sm" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(m.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          {mode.fields.map((f) => (
            <CurrencyInput
              key={`${mode.id}-${f.key}`}
              label={t(f.label)}
              optional={f.optional}
              prefix={f.unit === "gram" ? "" : "Rp"}
              suffix={f.unit === "gram" ? t("gram") : undefined}
              value={get(f.key)}
              onChange={(v) => setValues((s) => ({ ...s, [`${mode.id}.${f.key}`]: v }))}
            />
          ))}
          {mode.id !== "emas" && (
            <CurrencyInput
              label={t("Harga emas per gram (acuan nisab)")}
              value={goldPrice}
              onChange={setGoldPrice}
              suffix={t("/gram")}
              hint={t("Nisab = {grams} gram emas. Sesuaikan dengan harga emas terkini; nilai bawaan hanya contoh.", { grams: NISAB_GRAMS })}
            />
          )}
          <p className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-gray-700">
            <Info size={18} className="mt-0.5 shrink-0 text-blue-500" aria-hidden />
            {t("Informasi yang Anda masukkan ke dalam kalkulator zakat akan dibagikan ke BAZNAS untuk tujuan perhitungan zakat dan diproses oleh BAZNAS sesuai dengan kebijakan privasi BAZNAS.")}
          </p>
        </div>

        {/* Hasil diperbarui langsung saat mengetik (Pertemuan 8a) */}
        <aside aria-live="polite" className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-24">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-600">{t(mode.baseLabel)}</dt>
              <dd className="text-end font-semibold tabular-nums text-gray-900">{formatRupiah(Math.max(base, 0))}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-600">{t("Nisab per tahun")}</dt>
              <dd className="text-end font-semibold tabular-nums text-gray-900">{formatRupiah(monthly ? nisab * 12 : nisab)}</dd>
            </div>
            {monthly && (
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">{t("Nisab per bulan")}</dt>
                <dd className="text-end font-semibold tabular-nums text-gray-900">{formatRupiah(nisab)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-gray-600">{t(mode.resultLabel)}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[#1a7a3a]">{formatRupiah(zakat)}</p>
          </div>

          {hasInput && wajib && (
            <p className="mt-3 flex items-start gap-2 text-sm text-[#1a7a3a]">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden /> {t("Anda sudah wajib menunaikan zakat.")}
            </p>
          )}
          {hasInput && !wajib && (
            <Link to="/layanan/bayar-zis?jenis=sedekah" className="mt-3 block rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800 underline-offset-2 hover:underline">
              {t(mode.belowNisab)}
            </Link>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={reset}
              disabled={!hasInput}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-gray-300 font-medium text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={15} /> {t("Reset")}
            </button>
            {onPay ? (
              <button
                type="button"
                disabled={!wajib}
                onClick={() => onPay(Math.round(zakat), mode)}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-[#1a7a3a] font-medium text-white hover:bg-[#156830] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("Lanjut")} <ArrowRight size={15} className="rtl:rotate-180" />
              </button>
            ) : wajib ? (
              <Link to={payLink} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-[#1a7a3a] font-medium text-white hover:bg-[#156830]">
                {t("Bayar Zakat")} <ArrowRight size={15} className="rtl:rotate-180" />
              </Link>
            ) : (
              <span className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md bg-[#1a7a3a] font-medium text-white opacity-40" aria-disabled="true">
                {t("Bayar Zakat")}
              </span>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
