"use client";

// Форматы рекламы: табы отдельной строкой под заголовком секции, ниже — плашка выбранного формата: описание слева, видео справа в мокапе iPhone.
// Все 4 панели — в HTML (неактивные скрыты атрибутом hidden). Все 4 видео грузятся сразу (preload=auto), чтобы переключение было мгновенным.
// Клавиатура: стрелки влево/вправо, Home, End — как у табов WAI-ARIA.
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Format = { id: string; title: string; text: string; points: string[]; video: string };

export function FormatTabs({ items }: { items: Format[] }) {
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  // Видео открытой панели — с начала и в воспроизведение; остальные — на паузу
  useEffect(() => {
    box.current?.querySelectorAll<HTMLVideoElement>("video").forEach((v, i) => {
      if (i === cur) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
    });
  }, [cur]);
  const go = (i: number) => { const n = (i + items.length) % items.length; setCur(n); tabs.current[n]?.focus(); };
  return (
    <div ref={box}>
      <div role="tablist" aria-label="Форматы рекламы" className="mx-auto mb-4 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-muted p-1">
        {items.map((f, i) => (
          <button
            key={f.id} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`tab-${f.id}`} aria-controls={`panel-${f.id}`}
            aria-selected={i === cur} tabIndex={i === cur ? 0 : -1} onClick={() => setCur(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(cur + 1);
              else if (e.key === "ArrowLeft") go(cur - 1);
              else if (e.key === "Home") go(0);
              else if (e.key === "End") go(items.length - 1);
              else return;
              e.preventDefault();
            }}
            className={cn("whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors", i === cur ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >{f.title}</button>
        ))}
      </div>
      {items.map((f, i) => (
        <div key={f.id} role="tabpanel" id={`panel-${f.id}`} aria-labelledby={`tab-${f.id}`} hidden={i !== cur} className="grid items-center gap-8 rounded-2xl border bg-background p-6 sm:p-8 md:grid-cols-[1fr_16rem]">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Формат {i + 1} из {items.length}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-3 max-w-xl text-muted-foreground">{f.text}</p>
            <ul className="mt-6 grid max-w-xl gap-2.5 sm:grid-cols-2">
              {f.points.map((p) => <li key={p} className="flex gap-2.5 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{p}</li>)}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-60 rounded-[2.6rem] border-[7px] border-desktop-ink bg-desktop-ink shadow-xl md:mx-0">
            <span aria-hidden className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-desktop-ink" />
            <video src={f.video} poster={f.video.replace(/\.mp4$/, ".jpg")} autoPlay muted loop playsInline preload="auto" className="aspect-[9/19.5] w-full rounded-[2.1rem] bg-muted object-cover" aria-label={`Пример формата ${f.title}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
