"use client";

// Тарифы с переключателем «1 год / 3 года»: подписка умножается на срок, разовый платёж остаётся прежним.
// В HTML — цены за 1 год (как в content/home.ts). Разница — арифметика из фактов, не новая цена.
import { useState } from "react";
import { Check } from "lucide-react";
import { home } from "@/content/home";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const rub = (n: number) => `${n.toLocaleString("ru-RU").replace(/ /g, " ")} ₽`;

export function Tariffs() {
  const [years, setYears] = useState<1 | 3>(1);
  const total = (t: (typeof home.tariffs)[number]) => t.amount * (t.yearly ? years : 1);
  const max = Math.max(...home.tariffs.map(total));
  return (
    <>
      <div role="radiogroup" aria-label="Срок сравнения" className="mx-auto mb-8 flex w-fit gap-1 rounded-xl bg-muted p-1 text-sm">
        {([1, 3] as const).map((y) => (
          <button key={y} type="button" role="radio" aria-checked={years === y} onClick={() => setYears(y)} className={cn("rounded-lg px-4 py-1.5 font-medium transition-colors", years === y ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {y === 1 ? "За 1 год" : "За 3 года"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {home.tariffs.map((t, i) => {
          const featured = "featured" in t && t.featured;
          const sum = total(t);
          return (
            <div key={t.name} data-reveal style={{ "--i": i } as React.CSSProperties} className={cn("flex flex-col rounded-2xl border p-6 sm:p-8", featured && "border-2 border-primary bg-brand-bg shadow-lg shadow-primary/10")}>
              <h3 className="flex items-center justify-between gap-3 font-semibold">{t.name}{"badge" in t && t.badge && <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">{t.badge}</span>}</h3>
              <p className="mt-4 text-4xl font-semibold tracking-tight tabular-nums">
                {years === 1 ? t.price : <span key={sum} className="inline-block animate-[pop-in_.4s_cubic-bezier(.3,1.5,.5,1)]">{rub(sum)}{t.yearly && <span className="text-2xl"> за 3 года</span>}</span>}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{years === 3 && !t.yearly ? "за 3 года — столько же: платёж один раз" : t.note}</p>
              {/* Полоса — сколько вы платите за срок относительно самого дорогого варианта */}
              <div aria-hidden className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full transition-[width] duration-700", featured ? "bg-primary" : "bg-muted-foreground/40")} style={{ width: `${(sum / max) * 100}%` }} />
              </div>
              {featured && years === 3 && <p className="mt-3 text-sm font-semibold text-brand">Экономия {rub(max - sum)} за 3 года</p>}
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.points.map((p) => <li key={p} className="flex gap-2.5 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{p}</li>)}
              </ul>
              <Button asChild size="lg" variant={featured ? "default" : "outline"} className="mt-8"><a href={site.cta.href} data-os-app="mail" data-os-payload={services[0].title}>Подключить Wi-Fi</a></Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
