import { Check } from "lucide-react";
import { useI18n } from "../lib/i18n";

type StepperProps = {
  steps: string[];
  current: number;
  /** Langkah yang sudah dilewati boleh diklik untuk kembali (kontrol pengguna). */
  onStepClick?: (index: number) => void;
  locked?: boolean;
};

/** Indikator tahapan transaksi (H4, Pertemuan 9: visibilitas status sistem). */
export function Stepper({ steps, current, onStepClick, locked }: StepperProps) {
  const { t } = useI18n();
  const percent = (current / (steps.length - 1)) * 100;

  return (
    <nav aria-label={t("Tahapan pembayaran")}>
      {/* Ponsel: ringkas */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-bold text-ink">{steps[current]}</span>
          <span className="text-slate-500">
            {t("Langkah {n} dari {total}", { n: current + 1, total: steps.length })}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${Math.max(percent, 6)}%` }} />
        </div>
      </div>

      {/* Tablet & desktop: penuh */}
      <ol className="relative hidden sm:grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        <div className="absolute top-5 h-1 rounded-full bg-slate-200" style={{ left: `${50 / steps.length}%`, right: `${50 / steps.length}%` }} aria-hidden>
          <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = done && !locked && !!onStepClick;
          const circle = done
            ? "bg-brand-600 text-white border-brand-600"
            : active
              ? "bg-white text-brand-700 border-brand-600 ring-4 ring-brand-100"
              : "bg-white text-slate-400 border-slate-300";
          const content = (
            <>
              <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition ${circle}`}>
                {done ? <Check size={18} strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span className={`mt-2 text-center text-sm ${active ? "font-bold text-ink" : done ? "font-semibold text-brand-700" : "text-slate-500"}`}>
                {label}
              </span>
            </>
          );
          return (
            <li key={label} className="flex flex-col items-center" aria-current={active ? "step" : undefined}>
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  className="flex flex-col items-center rounded-xl px-2 hover:opacity-80"
                  aria-label={t("Kembali ke langkah {n}: {label}", { n: i + 1, label })}
                >
                  {content}
                </button>
              ) : (
                <div className="flex flex-col items-center px-2">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
