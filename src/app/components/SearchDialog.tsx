import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Award,
  Calculator,
  Clock,
  CornerDownLeft,
  CreditCard,
  FileText,
  HandHeart,
  HelpCircle,
  LayoutGrid,
  MapPinned,
  Newspaper,
  Search,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { Highlight } from "./ListControls";
import { POPULAR_SEARCHES, SEARCH_CATEGORIES, clearRecent, readRecent, saveRecent, search, type SearchCategory, type SearchResult } from "../lib/search";
import { useI18n } from "../lib/i18n";

export const CATEGORY_ICON: Record<SearchCategory, LucideIcon> = {
  halaman: LayoutGrid,
  berita: Newspaper,
  dokumen: FileText,
  program: HandHeart,
  faq: HelpCircle,
  rekening: CreditCard,
  jaringan: MapPinned,
  profil: Award,
};

const QUICK_LINKS = [
  { label: "Bayar Zakat", href: "/layanan/bayar-zis", icon: HandHeart },
  { label: "Kalkulator Zakat", href: "/edukasi/kalkulator-zakat", icon: Calculator },
  { label: "Rekening Zakat", href: "/layanan/rekening", icon: CreditCard },
  { label: "Laporan Keuangan", href: "/informasi/laporan", icon: FileText },
];

const SearchContext = createContext<{ openSearch: (query?: string) => void }>({ openSearch: () => {} });
export const useSearch = () => useContext(SearchContext);

/** Penyedia pencarian global + pintasan keyboard Ctrl/⌘+K dan "/". */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState("");
  const openSearch = useCallback((query = "") => {
    setInitial(query);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <SearchContext.Provider value={{ openSearch }}>
      {children}
      {open && <SearchDialog initialQuery={initial} onClose={() => setOpen(false)} />}
    </SearchContext.Provider>
  );
}

function SearchDialog({ initialQuery, onClose }: { initialQuery: string; onClose: () => void }) {
  const { t, monthName } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory | "semua">("semua");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState(readRecent);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listId = useId();

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const all = useMemo(() => search(query, t, monthName), [query, t, monthName]);
  const counts = useMemo(() => {
    const c: Partial<Record<SearchCategory, number>> = {};
    all.forEach((r) => (c[r.category] = (c[r.category] ?? 0) + 1));
    return c;
  }, [all]);
  const filtered = category === "semua" ? all : all.filter((r) => r.category === category);
  const visible = filtered.slice(0, 8);

  useEffect(() => setActive(0), [query, category]);

  const go = (href: string, q = query) => {
    saveRecent(q);
    onClose();
    navigate(href);
  };
  const goAll = () => go(`/cari?q=${encodeURIComponent(query.trim())}${category !== "semua" ? `&kategori=${category}` : ""}`);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      if (visible[active]) go(visible[active].href);
      else goAll();
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 px-3 pt-[8vh] sm:px-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={t("Pencarian")} className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4">
          <Search size={20} className="shrink-0 text-[#1a7a3a]" aria-hidden />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={visible.length > 0}
            aria-controls={listId}
            aria-activedescendant={visible.length ? optionId(active) : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("Cari layanan, berita, dokumen, program…")}
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button type="button" onClick={onClose} aria-label={t("Tutup pencarian")} className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Filter kategori */}
        {query.trim() && (
          <div className="flex gap-1.5 overflow-x-auto border-b border-gray-100 px-4 py-2.5" role="toolbar" aria-label={t("Filter kategori")}>
            {[{ id: "semua" as const, label: "Semua" }, ...SEARCH_CATEGORIES].map((c) => {
              const n = c.id === "semua" ? all.length : counts[c.id] ?? 0;
              if (c.id !== "semua" && n === 0) return null;
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${on ? "bg-[#1a7a3a] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {t(c.label)} <span className="opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {!query.trim() ? (
            <div className="space-y-5 p-4">
              {recent.length > 0 && (
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t("Pencarian terakhir")}</h2>
                    <button
                      type="button"
                      onClick={() => {
                        clearRecent();
                        setRecent([]);
                      }}
                      className="text-xs font-medium text-[#1a7a3a] hover:underline"
                    >
                      {t("Hapus riwayat")}
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <li key={r}>
                        <button type="button" onClick={() => setQuery(r)} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[#1a7a3a]">
                          <Clock size={13} aria-hidden /> {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{t("Pencarian populer")}</h2>
                <ul className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((p) => (
                    <li key={p}>
                      <button type="button" onClick={() => setQuery(t(p))} className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm text-[#1a7a3a] hover:bg-green-100">
                        <TrendingUp size={13} aria-hidden /> {t(p)}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{t("Akses cepat")}</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
                    <li key={href}>
                      <button type="button" onClick={() => go(href, "")} className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-start text-sm font-medium text-gray-900 hover:border-[#1a7a3a] hover:bg-green-50">
                        <Icon size={18} className="text-[#1a7a3a]" aria-hidden /> {t(label)}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : visible.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-gray-900">{t("Tidak ada hasil untuk “{q}”", { q: query.trim() })}</p>
              <p className="mt-1 text-sm text-gray-500">{t("Coba kata kunci lain, misalnya “zakat”, “rekening”, atau “laporan”.")}</p>
            </div>
          ) : (
            <ul id={listId} role="listbox" aria-label={t("Saran pencarian")} className="p-2">
              {visible.map((r: SearchResult, i) => {
                const Icon = CATEGORY_ICON[r.category];
                const on = i === active;
                return (
                  <li
                    key={r.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={on}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 ${on ? "bg-green-50" : ""}`}
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${on ? "bg-[#1a7a3a] text-white" : "bg-gray-100 text-gray-600"}`}>
                      <Icon size={16} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        <Highlight text={r.titleText} query={query} />
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {t(SEARCH_CATEGORIES.find((c) => c.id === r.category)!.label)}
                        {r.descText ? ` · ${r.descText}` : ""}
                      </span>
                    </span>
                    {on && <CornerDownLeft size={15} className="mt-2 shrink-0 text-gray-400 rtl:-scale-x-100" aria-hidden />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Kaki: lihat semua hasil */}
        {query.trim() && filtered.length > 0 && (
          <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-sm">
            <button type="button" onClick={goAll} className="inline-flex items-center gap-1 font-medium text-[#1a7a3a] hover:underline">
              {t("Lihat semua {n} hasil", { n: filtered.length })} <ArrowRight size={14} className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
