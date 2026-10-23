import { Check } from "lucide-react";
import type { CaseItem } from "@/content/os";
import { cn } from "@/lib/utils";
import { CaseVideo } from "./case-video";

// Карточка кейса: главная цифра — крупно над заголовком, остальные результаты — списком ниже
export function CaseCard({ c, showGroup = false, className }: { c: CaseItem; showGroup?: boolean; className?: string }) {
  const norm = (x: string) => x.replace(/[\s\u00a0\u202f\u2060]+/g, " ");
  const rest = c.metrics.filter((m) => !norm(m).includes(norm(c.kpi.value).replace(/^\+/, "")));
  return (
    <article id={c.id} className={cn("flex scroll-mt-20 flex-col rounded-2xl border bg-background p-6", className)}>
      <p className="flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-brand">{c.brand ?? (showGroup ? c.group : "")}</span>
        {showGroup && c.brand && <span className="rounded-full bg-brand-bg px-2.5 py-0.5 text-xs font-medium text-brand">{c.group}</span>}
      </p>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold leading-none tracking-tight tabular-nums">{c.kpi.value}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{c.kpi.label}</p>
        </div>
        {c.video && <div className="w-20 shrink-0"><CaseVideo src={c.video} label={`Креатив кампании ${c.brand ?? c.title}`} /></div>}
      </div>
      <h3 className="mt-5 font-semibold leading-snug">{c.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
      {rest.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t pt-4 text-sm">
          {rest.map((m) => <li key={m} className="flex gap-2 tabular-nums"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{m}</li>)}
        </ul>
      )}
    </article>
  );
}
