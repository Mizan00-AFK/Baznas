import type { ReactNode } from "react";
import { useLocation } from "react-router";
import { Breadcrumb } from "./Breadcrumb";
import { getTrail, type Crumb } from "../data/navigation";
import { useI18n } from "../lib/i18n";
import { cn } from "./ui/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  trail?: Crumb[];
  children?: ReactNode;
};

/** Kepala halaman yang sama untuk semua halaman selain beranda: breadcrumb + judul rata kiri. */
export function PageHeader({ title, description, trail, children }: PageHeaderProps) {
  const { pathname } = useLocation();
  const { t } = useI18n();

  return (
    <>
      <Breadcrumb items={trail ?? getTrail(pathname)} />
      <header className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">{t(title)}</h1>
        {description && <p className="mt-2 max-w-3xl text-base leading-relaxed text-gray-600">{t(description)}</p>}
        {children}
      </header>
    </>
  );
}

/** Pembungkus isi halaman dengan lebar & jarak yang konsisten. */
export function PageBody({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return <div className={`mx-auto px-4 pb-16 pt-6 sm:px-6 sm:pt-8 ${narrow ? "max-w-4xl" : "max-w-7xl"}`}>{children}</div>;
}

/** Kartu standar yang dipakai di semua halaman. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6", className)}>{children}</div>;
}
