import { Check } from "lucide-react";
import type { CaseItem } from "@/content/os";
import { cn } from "@/lib/utils";
import { CaseVideo } from "./case-video";
import { CountUp } from "./count-up";

// Карточка кейса. Сверху — медиа во всю ширину карточки: видео креатива или, если видео нет,
// плашка с главной цифрой (tall=false — ниже, когда в ряду нет ни одного видео). Ниже — бренд, главная цифра (если сверху видео), заголовок, текст и остальные результаты.
export function CaseCard({ c, showGroup = false, tall = true, className }: { c: CaseItem; showGroup?: boolean; tall?: boolean; className?: string }) {
  const norm = (x: string) => x.replace(/[\s  ⁠]+/g, " ");
  const rest = c.metrics.filter((m) => !norm(m).includes(norm(c.kpi.value).replace(/^\+/, "")));
  const kpi = (big: boolean) => (
    <div>
      <p className={cn("font-semibold leading-none tracking-tight tabular-nums", big ? "text-5xl" : "text-4xl")}><CountUp value={c.kpi.value} /></p>
      <p className="mt-2 text-sm text-muted-foreground">{c.kpi.label}</p>
    </div>
  );
  return (
    <article id={c.id} className={cn("flex scroll-mt-20 flex-col rounded-2xl border bg-background p-3", className)}>
      {c.video ? (
        <CaseVideo src={c.video} label={`Креатив кампании ${c.brand ?? c.title}`} />
      ) : (
        <div className={cn("relative flex flex-col", tall ? "aspect-[4/5]" : "aspect-[4/3]", "justify-end overflow-hidden rounded-xl bg-brand-bg p-6")}>
          <span aria-hidden className="absolute inset-0 opacity-25 [background-image:radial-gradient(var(--brand-vivid)_2px,transparent_2.5px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
          <div className="relative">{kpi(true)}</div>
        </div>
      )}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <p className="flex items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-brand">{c.brand ?? (showGroup ? c.group : "")}</span>
          {showGroup && c.brand && <span className="rounded-full bg-brand-bg px-2.5 py-0.5 text-xs font-medium text-brand">{c.group}</span>}
        </p>
        {c.video && <div className="mt-4">{kpi(false)}</div>}
        <h3 className="mt-5 font-semibold leading-snug">{c.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
        {rest.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t pt-4 text-sm">
            {rest.map((m) => <li key={m} className="flex gap-2 tabular-nums"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{m}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}
