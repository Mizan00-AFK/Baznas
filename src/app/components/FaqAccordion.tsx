import { useId, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Plus } from "lucide-react";
import { FAQ } from "../data/content";
import { useI18n } from "../lib/i18n";

type FaqItem = (typeof FAQ)[number];

/** FAQ berstruktur accordion (dipertahankan & diperhalus, Pertemuan 8). */
export function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`flex w-full items-center gap-4 px-5 py-5 text-start transition-colors sm:px-6 ${isOpen ? "bg-brand-50/60" : "hover:bg-slate-50"}`}
              >
                <span className="flex-1 text-base font-semibold text-ink sm:text-lg">{t(item.q)}</span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${isOpen ? "rotate-45 bg-brand-600 text-white" : "bg-brand-50 text-brand-700"}`}
                >
                  <Plus size={18} aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              hidden={!isOpen}
              className="bg-brand-50/60 px-5 pb-6 text-[15px] leading-relaxed text-slate-700 sm:px-6"
            >
              <p className="max-w-3xl">{t(item.a)}</p>
              {"link" in item && item.link && (
                <Link to={item.link.href} className="mt-3 inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
                  {t(item.link.label)} <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
