"use client";

// Форматы рекламы на одной плашке: табы сверху, под ними пример (видео) и описание.
// Все 4 панели — в HTML (неактивные скрыты атрибутом hidden), видео играет только у открытой панели.
// Клавиатура: стрелки влево/вправо, Home, End — как у табов WAI-ARIA.
import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Format = { id: string; title: string; text: string; points: string[]; video: string };

export function FormatTabs({ items }: { items: Format[] }) {
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (i: number) => { const n = (i + items.length) % items.length; setCur(n); tabs.current[n]?.focus(); };
  return (
    <div className="rounded-2xl border bg-background p-2 sm:p-3">
      <div role="tablist" aria-label="Форматы рекламы" className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
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
            className={cn("flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors", i === cur ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >{f.title}</button>
        ))}
      </div>
      {items.map((f, i) => (
        <div key={f.id} role="tabpanel" id={`panel-${f.id}`} aria-labelledby={`tab-${f.id}`} hidden={i !== cur} className="grid items-center gap-8 p-4 sm:p-6 md:grid-cols-[14rem_1fr]">
          {i === cur
            ? <video src={f.video} autoPlay muted loop playsInline preload="none" className="mx-auto aspect-[9/16] w-full max-w-56 rounded-[2rem] border-[6px] border-desktop-ink bg-muted object-cover" aria-label={`Пример формата ${f.title}`} />
            : <span aria-hidden className="mx-auto block aspect-[9/16] w-full max-w-56 rounded-[2rem] border-[6px] border-desktop-ink bg-muted" />}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Формат {i + 1} из {items.length}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-3 max-w-xl text-muted-foreground">{f.text}</p>
            <ul className="mt-6 grid max-w-xl gap-2.5 sm:grid-cols-2">
              {f.points.map((p) => <li key={p} className="flex gap-2.5 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{p}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
