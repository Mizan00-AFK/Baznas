import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import beritaswipe1 from "@/imports/beritaswipe1.jpg";
import beritaswipe2 from "@/imports/beritaswipe2.jpeg";
import beritaswipe3 from "@/imports/beritaswipe3.png";
import beritaswipe4 from "@/imports/beritaswipe4.png";
import beritaswipe5 from "@/imports/beritaswipe5.jpeg";
import { tx, useI18n } from "../lib/i18n";

const SLIDES = [
  { image: beritaswipe2, title: tx("Zakat Online BAZNAS — bayar zakat dengan mudah via website") },
  { image: beritaswipe1, title: tx("BAZNAS salurkan bantuan kepada mustahik di seluruh Indonesia") },
  { image: beritaswipe3, title: tx("BAZNAS raih penghargaan lembaga zakat terbaik") },
  { image: beritaswipe4, title: tx("Program literasi zakat untuk masyarakat") },
  { image: beritaswipe5, title: tx("Kolaborasi BAZNAS dengan mitra strategis") },
];

const INTERVAL = 6000;

/**
 * Carousel berita (Pertemuan 6–8): dapat digeser manual, ada indikator posisi
 * dan progres, bisa dijeda (kontrol pengguna), berhenti saat di-hover/fokus,
 * dan tidak berputar otomatis bila pengguna memilih "reduce motion".
 */
export function HeroCarousel() {
  const { t } = useI18n();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [hovered, setHovered] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragStart = useRef<number | null>(null);

  const go = useCallback((i: number) => setCurrent((i + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  const running = playing && !hovered && dragStart.current === null;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(next, INTERVAL);
    return () => clearTimeout(timer);
  }, [running, next, current]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStart.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current !== null) setDragX(e.clientX - dragStart.current);
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    if (dragX > 60) prev();
    else if (dragX < -60) next();
    dragStart.current = null;
    setDragX(0);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("Sorotan BAZNAS")}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="bg-gradient-to-b from-brand-50 to-white px-0 pb-2 pt-0 sm:px-6 sm:pt-6"
    >
      <div className="relative mx-auto max-w-7xl" dir="ltr">
        <div
          className="relative aspect-[1600/648] w-full cursor-grab touch-pan-y select-none overflow-hidden bg-white shadow-[0_20px_50px_-24px_rgba(10,50,24,0.45)] active:cursor-grabbing sm:rounded-3xl"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.22,.8,.3,1)]"
            style={{
              transform: `translateX(calc(${-current * 100}% + ${dragX}px))`,
              transitionDuration: dragX ? "0ms" : undefined,
            }}
          >
            {SLIDES.map((s, i) => (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={t("{n} dari {total}: {title}", { n: i + 1, total: SLIDES.length, title: t(s.title) })}
                aria-hidden={i !== current}
                className="relative h-full w-full shrink-0 overflow-hidden"
              >
                {/* Latar blur agar banner dengan rasio berbeda tetap memenuhi bingkai */}
                <img src={s.image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />
                <img src={s.image} alt={t(s.title)} draggable={false} className="relative h-full w-full object-contain" />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label={t("Slide sebelumnya")}
            className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-800 shadow-md backdrop-blur transition hover:bg-white sm:flex"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t("Slide berikutnya")}
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-800 shadow-md backdrop-blur transition hover:bg-white sm:flex"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Kontrol: indikator posisi + progres + jeda */}
        <div className="mt-3 flex items-center justify-center gap-3 px-4">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={t("Pilih slide")}>
            {SLIDES.map((s, i) => {
              const active = i === current;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={t("Slide {n}: {title}", { n: i + 1, title: t(s.title) })}
                  onClick={() => go(i)}
                  className="group flex h-8 items-center"
                >
                  <span
                    className={`relative block h-2 overflow-hidden rounded-full transition-all duration-300 ${
                      active ? "w-10 bg-brand-100" : "w-2 bg-slate-300 group-hover:bg-brand-300"
                    }`}
                  >
                    {active && (
                      <span
                        key={`${current}-${running}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-brand-600"
                        style={{
                          width: running ? undefined : "100%",
                          animation: running ? `hero-progress ${INTERVAL}ms linear forwards` : undefined,
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="text-xs font-semibold tabular-nums text-slate-500" aria-live="polite">
            {current + 1} / {SLIDES.length}
          </span>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t("Jeda putar otomatis") : t("Putar otomatis")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>
      <style>{`@keyframes hero-progress { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}
