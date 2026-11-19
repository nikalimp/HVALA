// Кейсы заведений бенто-сеткой: один большой кейс и три поменьше. Цифры растут (CountUp), столбики — CSS.
import { Check, MessageSquareText, RefreshCw, Target, Ticket, type LucideIcon } from "lucide-react";
import type { CaseItem } from "@/content/os";
import { CountUp } from "@/components/count-up";
import { cn } from "@/lib/utils";

const tagIcon: Record<string, LucideIcon> = { Акции: Ticket, SMS: MessageSquareText, "Яндекс Аудитории": Target, Ретаргетинг: RefreshCw };
const bars = [22, 30, 26, 38, 44, 41, 56, 63, 70, 84];

export function CasesBento({ items, big }: { items: CaseItem[]; big: string }) {
  const main = items.find((c) => c.id === big) ?? items[0];
  const rest = items.filter((c) => c !== main);
  const Tile = ({ c, i, large }: { c: CaseItem; i: number; large?: boolean }) => {
    const Icon = tagIcon[c.tags[0]] ?? Check;
    return (
      <article id={c.id} data-reveal style={{ "--i": i } as React.CSSProperties}
        className={cn("relative flex scroll-mt-20 flex-col overflow-hidden rounded-2xl border p-6", large ? "bg-primary text-primary-foreground lg:row-span-3 lg:p-10" : "bg-background")}>
        <span className={cn("flex size-10 items-center justify-center rounded-xl", large ? "bg-primary-foreground/15" : "bg-brand-bg text-brand")}><Icon className="size-5" aria-hidden /></span>
        <p className={cn("mt-6 font-semibold leading-none tracking-tight tabular-nums", large ? "text-6xl sm:text-7xl" : "text-4xl")}><CountUp value={c.kpi.value} /></p>
        <p className={cn("mt-2 text-sm", large ? "text-primary-foreground/80" : "text-muted-foreground")}>{c.kpi.label}</p>
        <h3 className={cn("mt-6 font-semibold leading-snug", large && "text-xl")}>{c.title}</h3>
        <p className={cn("mt-1.5 text-sm", large ? "text-primary-foreground/80" : "text-muted-foreground")}>{c.text}</p>
        <ul className="mt-4 space-y-1 text-sm">
          {c.metrics.map((m) => <li key={m} className="flex gap-2 tabular-nums"><Check className={cn("mt-0.5 size-4 shrink-0", large ? "" : "text-brand")} aria-hidden />{m}</li>)}
        </ul>
        {large && (
          <div aria-hidden className="mt-auto flex min-h-32 flex-1 items-end gap-2 pt-10">
            {bars.map((h, b) => <span key={b} className="grow-bar flex-1 rounded-t-md bg-primary-foreground/25 last:bg-primary-foreground" style={{ height: `${h}%`, "--b": b } as React.CSSProperties} />)}
          </div>
        )}
      </article>
    );
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr] lg:grid-rows-3">
      <Tile c={main} i={0} large />
      {rest.map((c, i) => <Tile key={c.id} c={c} i={i + 1} />)}
    </div>
  );
}
