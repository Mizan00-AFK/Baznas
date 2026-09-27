import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "../data/navigation";
import { useI18n } from "../lib/i18n";

export type BreadcrumbItem = Crumb;

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/** Penanda posisi pengguna, mis. Beranda / Layanan / Bayar ZIS / Formulir. */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useI18n();
  return (
    <nav aria-label={t("Jejak navigasi")} className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight size={14} className="text-gray-400 rtl:rotate-180" aria-hidden />}
              {item.href ? (
                <Link to={item.href} className="text-gray-600 hover:text-[#1a7a3a] hover:underline transition-colors">
                  {t(item.label)}
                </Link>
              ) : (
                <span aria-current="page" className="text-gray-900 font-medium">
                  {t(item.label)}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
