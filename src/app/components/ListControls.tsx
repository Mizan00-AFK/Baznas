import { Fragment, useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router";
import { ArrowDownUp, CalendarDays, Check, ChevronDown, Search, X } from "lucide-react";
import { normalize } from "../lib/search";
import { tx, useI18n } from "../lib/i18n";

/**
 * State yang disimpan di URL (?q=…&urut=…) agar hasil filter bisa dibagikan,
 * dibuka langsung dari hasil pencarian, dan bertahan saat tombol Kembali.
 */
export function useQueryParam(key: string, fallback = ""): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? fallback;
  const setValue = useCallback(
    (next: string) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (!next || next === fallback) p.delete(key);
          else p.set(key, next);
          return p;
        },
        { replace: true },
      );
    },
    [key, fallback, setParams],
  );
  return [value, setValue];
}

/** Apakah teks memuat semua kata kueri (tanpa peduli huruf besar/kecil & harakat). */
export function matchesQuery(query: string, ...texts: (string | undefined)[]) {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return true;
  const hay = normalize(texts.filter(Boolean).join(" "));
  return tokens.every((tok) => hay.includes(tok));
}

/** Menyorot bagian teks yang cocok dengan kueri. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!tokens.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${tokens.join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-amber-100 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function SearchBox({ value, onChange, placeholder, label, className = "" }: { value: string; onChange: (v: string) => void; placeholder: string; label: string; className?: string }) {
  const { t } = useI18n();
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-gray-300 bg-white pe-9 ps-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a3a] [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label={t("Hapus pencarian")} className="absolute end-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <X size={15} />
        </button>
      )}
    </label>
  );
}

export const SORT_LABELS = {
  relevansi: tx("Paling relevan"),
  terbaru: tx("Terbaru"),
  terlama: tx("Terlama"),
  az: tx("Judul A–Z"),
  za: tx("Judul Z–A"),
} as const;

type Option<V extends string> = { value: V; label: string };

/**
 * Menu pilihan bergaya website (pengganti dropdown bawaan browser).
 * Aksesibel: tombol + listbox, navigasi ↑ ↓ Home End, Enter/Spasi memilih, Esc menutup.
 * Arah panel menyesuaikan ruang yang tersedia (juga untuk RTL dan layar ponsel).
 */
export function DropdownSelect<V extends string>({
  value,
  onChange,
  options,
  label,
  icon: Icon,
}: {
  value: V;
  onChange: (v: V) => void;
  options: Option<V>[];
  label: string;
  icon: typeof ArrowDownUp;
}) {
  const [open, setOpen] = useState(false);
  const [alignEnd, setAlignEnd] = useState(true);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const [active, setActive] = useState(index);
  const wrap = useRef<HTMLDivElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);
  const list = useRef<HTMLUListElement | null>(null);
  const id = useId();
  const current = options[index];

  useEffect(() => {
    if (!open) return;
    setActive(index);
    list.current?.focus();
    const close = (e: MouseEvent) => wrap.current && !wrap.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = () => {
    const r = button.current?.getBoundingClientRect();
    if (r) {
      const rtl = document.documentElement.dir === "rtl";
      const MENU = 232;
      // Rata-ujung (end) bila cukup ruang ke arah awal baris; jika tidak, rata-awal (start).
      setAlignEnd(rtl ? r.left + MENU <= window.innerWidth - 8 : r.right - MENU >= 8);
    }
    setOpen((o) => !o);
  };

  const choose = (v: V) => {
    onChange(v);
    setOpen(false);
    button.current?.focus();
  };

  const onListKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((i) => Math.min(i + 1, options.length - 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") choose(options[active].value);
    else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") button.current?.focus();
      return;
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={wrap} className="relative shrink-0">
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) toggle();
          }
        }}
        className={`inline-flex h-11 items-center gap-2 rounded-full border bg-white pe-3 ps-4 text-sm shadow-sm transition-colors ${
          open ? "border-[#1a7a3a] ring-2 ring-green-100" : "border-gray-300 hover:border-[#1a7a3a]"
        }`}
      >
        <Icon size={15} className="text-[#1a7a3a]" aria-hidden />
        <span className="hidden text-gray-500 sm:inline">{label}:</span>
        <span className="font-semibold text-gray-900">{current?.label}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className={`absolute top-full z-40 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl outline-none animate-in fade-in-0 zoom-in-95 ${alignEnd ? "end-0" : "start-0"}`}
        >
          <li className="px-3 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wider text-gray-400" aria-hidden>
            {label}
          </li>
          {options.map((o, i) => {
            const selected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o.value)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${i === active ? "bg-green-50" : ""} ${
                  selected ? "font-semibold text-[#1a7a3a]" : "text-gray-700"
                }`}
              >
                {o.label}
                {selected && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a7a3a] text-white">
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Menu "Urutkan" yang dipakai di semua daftar. */
export function SortSelect<T extends keyof typeof SORT_LABELS>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: T[] }) {
  const { t } = useI18n();
  return <DropdownSelect value={value} onChange={onChange} label={t("Urutkan")} icon={ArrowDownUp} options={options.map((o) => ({ value: o, label: t(SORT_LABELS[o]) }))} />;
}

/** Filter tahun dengan gaya yang sama dengan menu Urutkan. */
export function YearSelect({ value, onChange, years }: { value: string; onChange: (v: string) => void; years: number[] }) {
  const { t } = useI18n();
  return (
    <DropdownSelect
      value={value}
      onChange={onChange}
      label={t("Tahun")}
      icon={CalendarDays}
      options={[{ value: "semua", label: t("Semua tahun") }, ...years.map((y) => ({ value: String(y), label: String(y) }))]}
    />
  );
}

/** Keterangan jumlah hasil + tombol hapus filter. */
export function ResultCount({ shown, total, onReset }: { shown: number; total: number; onReset?: () => void }) {
  const { t } = useI18n();
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-gray-600" aria-live="polite">
      {shown === total ? t("{n} item", { n: total }) : t("Menampilkan {shown} dari {total} item", { shown, total })}
      {onReset && shown !== total && (
        <button type="button" onClick={onReset} className="font-medium text-[#1a7a3a] underline underline-offset-2">
          {t("Hapus filter")}
        </button>
      )}
    </p>
  );
}
