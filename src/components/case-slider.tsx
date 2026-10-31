"use client";

// Кейсы в один ряд: горизонтальная прокрутка со «скользящими» карточками (scroll-snap) и кнопками «назад/вперёд».
// Все карточки — в HTML. Колесо, свайп и клавиатура (Tab по карточкам) работают без кнопок. Счётчик — «3 / 6».
import { Children, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CaseSlider({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ start: true, end: false, idx: 1 });
  const items = Children.toArray(children);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const upd = () => {
      const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
      setState({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8, idx: Math.min(items.length, Math.round(el.scrollLeft / (w + 16)) + 1) });
    };
    upd();
    el.addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    return () => { el.removeEventListener("scroll", upd); removeEventListener("resize", upd); };
  }, [items.length]);
  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
    el.scrollBy({ left: dir * (w + 16), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const btn = "flex size-11 items-center justify-center rounded-full border bg-background transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-35";
  return (
    <div role="region" aria-roledescription="карусель" aria-label={label}>
      <ul ref={track} className="case-track -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6">
        {items.map((child, i) => (
          <li key={i} className="flex w-[82%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">{child}</li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" className={btn} onClick={() => go(-1)} disabled={state.start} aria-label="Предыдущие кейсы"><ChevronLeft className="size-5" aria-hidden /></button>
        <p className="min-w-16 text-center text-sm tabular-nums text-muted-foreground" aria-live="polite">{state.idx} / {items.length}</p>
        <button type="button" className={cn(btn)} onClick={() => go(1)} disabled={state.end} aria-label="Следующие кейсы"><ChevronRight className="size-5" aria-hidden /></button>
      </div>
    </div>
  );
}
