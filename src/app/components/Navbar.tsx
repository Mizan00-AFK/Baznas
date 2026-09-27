import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useSearch } from "./SearchDialog";
import logo from "@/imports/logo-baznas-crop.png";
import { NAV_ITEMS, type NavChild, type NavItem } from "../data/navigation";
import { LANGUAGES, useI18n } from "../lib/i18n";

/**
 * Pemilih bahasa: dropdown tersembunyi diganti chip "ID | EN | AR"
 * yang langsung bisa diklik (Pertemuan 6 b.i — visibility of objects).
 */
export function LanguageChips() {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="radiogroup" aria-label={t("Bahasa")} className="inline-flex items-center rounded-md border border-gray-300 bg-white p-0.5 shadow-sm">
      {LANGUAGES.map((option, i) => {
        const active = option.code === lang;
        return (
          <span key={option.code} className="flex items-center">
            {i > 0 && <span className="mx-0.5 h-4 w-px bg-gray-200" aria-hidden />}
            <button
              type="button"
              role="radio"
              aria-checked={active}
              title={option.label}
              onClick={() => setLang(option.code)}
              className={`rounded px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors ${
                active ? "bg-[#1a7a3a] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#1a7a3a]"
              }`}
            >
              {option.short}
            </button>
          </span>
        );
      })}
    </div>
  );
}

function isActive(item: { href: string }, pathname: string) {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function DropdownMenu({
  items,
  hoveredSub,
  setHoveredSub,
}: {
  items: NavChild[];
  hoveredSub: string | null;
  setHoveredSub: (v: string | null) => void;
}) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleItemEnter = (label: string, hasSub: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredSub(hasSub ? label : null);
  };

  const handleItemLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredSub(null);
    }, 100);
  };

  const handleSubEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="absolute top-full start-0 mt-0 bg-white shadow-xl border border-gray-100 min-w-[200px] z-50 rounded-b-lg">
      {items.map((child) => {
        const childActive = isActive(child, pathname);
        return (
          <div
            key={child.label}
            className="relative"
            onMouseEnter={() => handleItemEnter(child.label, !!child.sub)}
            onMouseLeave={handleItemLeave}
            onFocus={() => handleItemEnter(child.label, !!child.sub)}
          >
            <Link
              to={child.href}
              className={`flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#1a7a3a] hover:text-white focus:bg-[#1a7a3a] focus:text-white transition-colors duration-150 whitespace-nowrap ${
                childActive ? "text-[#1a7a3a] font-semibold" : "text-gray-700"
              }`}
            >
              {t(child.label)}
              {child.sub && <ChevronDown size={14} className="-rotate-90 rtl:rotate-90 ms-2" />}
            </Link>
            {child.sub && hoveredSub === child.label && (
              <div
                className="absolute start-full top-0 bg-white shadow-xl border border-gray-100 min-w-[220px] z-[60] rounded-e-lg"
                onMouseEnter={handleSubEnter}
                onMouseLeave={handleItemLeave}
              >
                {child.sub.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.href}
                    className={`block px-4 py-2.5 text-sm hover:bg-[#1a7a3a] hover:text-white focus:bg-[#1a7a3a] focus:text-white transition-colors duration-150 whitespace-nowrap ${
                      pathname === sub.href ? "text-[#1a7a3a] font-semibold" : "text-gray-700"
                    }`}
                  >
                    {t(sub.label)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Menu untuk layar kecil (< 1280px): struktur sama, ditampilkan sebagai daftar bertingkat. */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const { openSearch } = useSearch();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    `flex min-h-11 items-center rounded-md px-3 text-sm ${active ? "bg-[#eef7f0] font-semibold text-[#1a7a3a]" : "text-gray-700 hover:bg-gray-50"}`;

  return (
    <div className={`fixed inset-0 z-[70] overflow-hidden xl:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("Menu")}
        className={`absolute end-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <LanguageChips />
          <button type="button" onClick={onClose} aria-label={t("Tutup menu")} className="flex h-11 w-11 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100">
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label={t("Navigasi utama")}>
          <button
            type="button"
            onClick={() => {
              onClose();
              openSearch();
            }}
            className="mb-3 flex h-11 w-full items-center gap-2 rounded-md border border-gray-300 px-3 text-sm text-gray-500 hover:border-[#1a7a3a]"
          >
            <Search size={16} /> {t("Cari layanan, berita, dokumen, program…")}
          </button>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <li key={item.label}>
                    <Link to={item.href} onClick={onClose} className={`${linkClass(isActive(item, pathname))} font-medium`}>
                      {t(item.label)}
                    </Link>
                  </li>
                );
              }
              const isOpen = expanded === item.label;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-md px-3 text-sm font-medium ${isActive(item, pathname) ? "text-[#1a7a3a]" : "text-gray-700"} hover:bg-gray-50`}
                  >
                    {t(item.label)}
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <ul className="ms-3 border-s-2 border-gray-100 ps-2">
                      {item.children.map((child) => {
                        if (!child.sub) {
                          return (
                            <li key={child.label}>
                              <Link to={child.href} onClick={onClose} className={linkClass(pathname === child.href)}>
                                {t(child.label)}
                              </Link>
                            </li>
                          );
                        }
                        const subOpen = expandedSub === child.label;
                        return (
                          <li key={child.label}>
                            <button
                              type="button"
                              aria-expanded={subOpen}
                              onClick={() => setExpandedSub(subOpen ? null : child.label)}
                              className="flex min-h-11 w-full items-center justify-between rounded-md px-3 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {t(child.label)}
                              <ChevronDown size={14} className={`transition-transform ${subOpen ? "rotate-180" : ""}`} />
                            </button>
                            {subOpen && (
                              <ul className="ms-3 border-s-2 border-gray-100 ps-2">
                                {child.sub.map((sub) => (
                                  <li key={sub.label}>
                                    <Link to={sub.href} onClick={onClose} className={linkClass(pathname === sub.href)}>
                                      {t(sub.label)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const { openSearch } = useSearch();
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(label);
    setHoveredSub(null);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
      setHoveredSub(null);
    }, 120);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    setOpenMenu(null);
    setHoveredSub(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#konten"
        className="sr-only z-[80] rounded-md bg-white font-semibold text-[#1a7a3a] focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:px-4 focus:py-2"
      >
        {t("Lewati ke konten utama")}
      </a>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label={t("BAZNAS — Beranda")}>
            <img src={logo} alt="BAZNAS" className="h-12 w-auto" />
          </Link>

          {/* Nav Links (desktop) */}
          <div className="hidden xl:flex items-center gap-4">
            {NAV_ITEMS.map((item: NavItem) => {
              const active = isActive(item, pathname);
              const highlighted = openMenu === item.label || active;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => (item.children ? handleMouseEnter(item.label) : undefined)}
                  onMouseLeave={() => (item.children ? handleMouseLeave() : undefined)}
                  onFocus={() => (item.children ? handleMouseEnter(item.label) : undefined)}
                  onBlur={(e) => {
                    if (item.children && !e.currentTarget.contains(e.relatedTarget as Node)) handleMouseLeave();
                  }}
                >
                  <Link
                    to={item.href}
                    aria-haspopup={item.children ? "true" : undefined}
                    aria-expanded={item.children ? openMenu === item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap border-b-2 ${highlighted ? "text-[#1a7a3a] border-[#1a7a3a]" : "text-gray-700 hover:text-[#1a7a3a] border-transparent hover:border-[#1a7a3a]"} px-[12px] py-[20px]`}
                  >
                    {t(item.label)}
                    {item.children && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-150 ${openMenu === item.label ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>
                  {item.children && openMenu === item.label && (
                    <div
                      onMouseEnter={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <DropdownMenu items={item.children} hoveredSub={hoveredSub} setHoveredSub={setHoveredSub} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openSearch()}
              aria-label={t("Cari")}
              title={t("Cari (Ctrl+K)")}
              className="flex h-11 w-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#1a7a3a]"
            >
              <Search size={20} />
            </button>
            <div className="hidden sm:block">
              <LanguageChips />
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t("Buka menu")}
              className="flex h-11 w-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 xl:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
