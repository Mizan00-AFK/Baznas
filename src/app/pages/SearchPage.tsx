import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Calendar, Search, SearchX, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { CATEGORY_ICON } from "../components/SearchDialog";
import { Highlight, SortSelect, useQueryParam } from "../components/ListControls";
import { POPULAR_SEARCHES, SEARCH_CATEGORIES, saveRecent, search, sortResults, type SearchCategory, type SortMode } from "../lib/search";
import { tx, useI18n } from "../lib/i18n";

const PAGE_SIZE = 20;

/** Kotak cari dengan saran otomatis (autocomplete). */
function SearchInput({ initial, onSubmit }: { initial: string; onSubmit: (q: string) => void }) {
  const { t, monthName } = useI18n();
  const navigate = useNavigate();
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const wrap = useRef<HTMLFormElement | null>(null);

  useEffect(() => setValue(initial), [initial]);
  useEffect(() => {
    const close = (e: MouseEvent) => wrap.current && !wrap.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const suggestions = useMemo(() => (value.trim().length >= 2 ? search(value, t, monthName).slice(0, 6) : []), [value, t, monthName]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    setOpen(false);
    onSubmit(value.trim());
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!open || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      saveRecent(value);
      navigate(suggestions[active].href);
    } else if (e.key === "Escape") setOpen(false);
  };

  return (
    <form ref={wrap} role="search" onSubmit={submit} className="relative mt-6 max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            role="combobox"
            aria-expanded={open && suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            aria-label={t("Kata kunci pencarian")}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={t("Cari layanan, berita, dokumen, program…")}
            className="h-12 w-full rounded-md border border-gray-300 bg-white pe-3 ps-10 text-base focus:outline-none focus:ring-2 focus:ring-[#1a7a3a]"
          />
        </div>
        <button type="submit" className="h-12 rounded-md bg-[#1a7a3a] px-5 font-medium text-white hover:bg-[#156830]">
          {t("Cari")}
        </button>
      </div>
      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" aria-label={t("Saran pencarian")} className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {suggestions.map((s, i) => {
            const Icon = CATEGORY_ICON[s.category];
            return (
              <li
                key={s.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  saveRecent(value);
                  navigate(s.href);
                }}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${i === active ? "bg-green-50" : ""}`}
              >
                <Icon size={15} className="shrink-0 text-gray-500" aria-hidden />
                <span className="truncate text-gray-900">
                  <Highlight text={s.titleText} query={value} />
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}

export function SearchPage() {
  const { t, lang, formatDate } = useI18n();
  const [q, setQ] = useQueryParam("q");
  const [kategori, setKategori] = useQueryParam("kategori", "semua");
  const [urut, setUrut] = useQueryParam("urut", "relevansi");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { monthName } = useI18n();

  const all = useMemo(() => search(q, t, monthName), [q, t, monthName]);
  const counts = useMemo(() => {
    const c: Partial<Record<SearchCategory, number>> = {};
    all.forEach((r) => (c[r.category] = (c[r.category] ?? 0) + 1));
    return c;
  }, [all]);
  const results = useMemo(() => {
    const f = kategori === "semua" ? all : all.filter((r) => r.category === kategori);
    return sortResults(f, urut as SortMode, lang);
  }, [all, kategori, urut, lang]);

  useEffect(() => setLimit(PAGE_SIZE), [q, kategori, urut]);
  useEffect(() => {
    if (q) saveRecent(q);
  }, [q]);

  const catLabel = (id: SearchCategory) => t(SEARCH_CATEGORIES.find((c) => c.id === id)!.label);
  const filterButton = (id: SearchCategory | "semua", label: string, n: number) => {
    const on = kategori === id;
    return (
      <button
        key={id}
        type="button"
        aria-pressed={on}
        onClick={() => setKategori(id)}
        disabled={n === 0 && !on}
        className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-start text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
          on ? "bg-[#1a7a3a] font-medium text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span>{label}</span>
        <span className={`rounded-full px-2 text-xs ${on ? "bg-white/20" : "bg-gray-100 text-gray-600"}`}>{n}</span>
      </button>
    );
  };

  return (
    <>
      <PageHeader title={tx("Pencarian")} description={tx("Temukan layanan, berita, dokumen, program, dan informasi lainnya di website BAZNAS.")}>
        <SearchInput initial={q} onSubmit={(v) => setQ(v)} />
      </PageHeader>
      <PageBody>
        {!q.trim() ? (
          <Card className="text-center">
            <Search size={36} className="mx-auto text-[#1a7a3a]" aria-hidden />
            <h2 className="mt-3 font-semibold text-gray-900">{t("Mulai dengan kata kunci")}</h2>
            <p className="mt-1 text-sm text-gray-600">{t("Atau pilih pencarian populer berikut:")}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((p) => (
                <button key={p} type="button" onClick={() => setQ(t(p))} className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm text-[#1a7a3a] hover:bg-green-100">
                  <TrendingUp size={13} aria-hidden /> {t(p)}
                </button>
              ))}
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
            {/* Filter kategori */}
            <aside className="min-w-0">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <SlidersHorizontal size={16} aria-hidden /> {t("Filter kategori")}
              </h2>
              <div className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1 lg:px-0 [&>button]:shrink-0 [&>button]:lg:shrink" role="toolbar" aria-label={t("Filter kategori")}>
                {filterButton("semua", t("Semua"), all.length)}
                {SEARCH_CATEGORIES.map((c) => filterButton(c.id, t(c.label), counts[c.id] ?? 0))}
              </div>
            </aside>

            <section className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-600" aria-live="polite">
                  {t("{n} hasil untuk “{q}”", { n: results.length, q: q.trim() })}
                  {kategori !== "semua" && ` · ${catLabel(kategori as SearchCategory)}`}
                </p>
                <SortSelect value={urut as SortMode} onChange={setUrut} options={["relevansi", "terbaru", "terlama", "az", "za"]} />
              </div>

              {results.length === 0 ? (
                <Card className="mt-4 text-center">
                  <SearchX size={36} className="mx-auto text-gray-400" aria-hidden />
                  <h2 className="mt-3 font-semibold text-gray-900">{t("Tidak ada hasil untuk “{q}”", { q: q.trim() })}</h2>
                  <p className="mt-1 text-sm text-gray-600">{t("Coba kata kunci lain, misalnya “zakat”, “rekening”, atau “laporan”.")}</p>
                  {kategori !== "semua" && (
                    <button type="button" onClick={() => setKategori("semua")} className="mt-4 font-medium text-[#1a7a3a] underline underline-offset-2">
                      {t("Cari di semua kategori")}
                    </button>
                  )}
                </Card>
              ) : (
                <>
                  <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
                    {results.slice(0, limit).map((r) => {
                      const Icon = CATEGORY_ICON[r.category];
                      return (
                        <li key={r.id}>
                          <Link to={r.href} onClick={() => saveRecent(q)} className="group flex items-start gap-4 p-4 hover:bg-green-50/60">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1a7a3a]">
                              <Icon size={18} aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
                                <span className="font-medium text-[#1a7a3a]">{catLabel(r.category)}</span>
                                {r.date && r.category === "berita" && (
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar size={12} aria-hidden /> {formatDate(r.date)}
                                  </span>
                                )}
                              </span>
                              <span className="mt-0.5 block font-semibold leading-snug text-gray-900 group-hover:text-[#1a7a3a]">
                                <Highlight text={r.titleText} query={q} />
                              </span>
                              {r.descText && (
                                <span className="mt-1 line-clamp-2 block text-sm text-gray-600">
                                  <Highlight text={r.descText} query={q} />
                                </span>
                              )}
                            </span>
                            <ArrowRight size={18} className="mt-3 shrink-0 text-gray-300 group-hover:text-[#1a7a3a] rtl:rotate-180" aria-hidden />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {results.length > limit && (
                    <button type="button" onClick={() => setLimit((l) => l + PAGE_SIZE)} className="mt-4 w-full rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      {t("Tampilkan lebih banyak ({n} lagi)", { n: results.length - limit })}
                    </button>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </PageBody>
    </>
  );
}
