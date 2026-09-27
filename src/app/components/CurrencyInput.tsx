import { useId, type ReactNode } from "react";
import { formatThousands } from "../lib/format";
import { useI18n } from "../lib/i18n";

type CurrencyInputProps = {
  label: string;
  value: string;
  onChange: (digits: string) => void;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  placeholder?: string;
  suffix?: string;
  size?: "md" | "lg";
  id?: string;
  prefix?: string;
};

/**
 * Input nominal dengan pemisah ribuan otomatis saat mengetik (Pertemuan 6):
 * pengguna mengetik 20000000 dan langsung melihat 20.000.000.
 * Nilai yang disimpan tetap berupa digit murni.
 */
export function CurrencyInput({
  label,
  value,
  onChange,
  hint,
  error,
  optional,
  placeholder = "0",
  suffix,
  size = "md",
  id,
  prefix = "Rp",
}: CurrencyInputProps) {
  const { t } = useI18n();
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const height = size === "lg" ? "h-16 text-2xl font-bold" : "h-11 text-base font-semibold";

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-ink">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-slate-500">{t("Opsional")}</span>}
      </label>
      <div
        dir="ltr"
        className={`flex items-center rounded-lg border bg-white transition focus-within:ring-4 ${
          error
            ? "border-red-400 focus-within:ring-red-100"
            : "border-slate-300 focus-within:border-brand-600 focus-within:ring-brand-100"
        }`}
      >
        {prefix && <span className="pl-4 pr-2 text-sm font-semibold text-slate-500">{prefix}</span>}
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={formatThousands(value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={hint || error ? hintId : undefined}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, ""))}
          className={`w-full min-w-0 rounded-xl bg-transparent pr-4 ${prefix ? "" : "pl-4"} tabular-nums text-ink outline-none placeholder:text-slate-300 ${height}`}
        />
        {suffix && <span className="whitespace-nowrap pr-4 text-sm text-slate-500">{suffix}</span>}
      </div>
      {(error || hint) && (
        <p id={hintId} className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-slate-500"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
