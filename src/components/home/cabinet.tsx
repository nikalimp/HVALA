// Личный кабинет: мокап интерфейса. Цифры — примерные, поэтому в шапке окна подпись «пример интерфейса».
// Анимации (линия графика, столбики, кольцо) — CSS в globals.css, запускаются классом .in от Reveal.
import { Check } from "lucide-react";
import { home } from "@/content/home";
import { CountUp } from "@/components/count-up";

const days = [38, 42, 40, 55, 61, 58, 72, 66, 70, 84, 79, 91, 88, 104];
const W = 400, H = 130;
const pts = days.map((d, i) => [(i / (days.length - 1)) * W, H - (d / 110) * H] as const);
const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
const area = `${line} L${W} ${H} L0 ${H} Z`;
const ages: [string, number][] = [["18–24", 46], ["25–34", 100], ["35–44", 72], ["45+", 38]];

export function Cabinet() {
  const c = home.cabinet;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
      <div data-reveal>
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Личный кабинет</p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-tight">{c.title}</h2>
        <p className="mt-4 text-muted-foreground">{c.text}</p>
        <ul className="mt-6 space-y-2.5">
          {c.points.map((p) => <li key={p} className="flex gap-2.5 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{p}</li>)}
        </ul>
      </div>

      <figure data-reveal="scale" className="window">
        <figcaption className="flex items-center gap-2 border-b bg-card px-4 py-2.5 text-xs text-muted-foreground">
          <span aria-hidden className="flex gap-1.5"><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /></span>
          <span className="ml-2 font-medium text-foreground">Личный кабинет HVALA</span>
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5">пример интерфейса</span>
        </figcaption>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <div className="rounded-xl border p-4 sm:col-span-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">Подключения за 2 недели</p>
              <p className="text-2xl font-semibold tabular-nums"><CountUp value="1 048" /></p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-28 w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
              <path d={area} className="chart-area fill-brand-bg" />
              <path d={line} pathLength={1} className="chart-line fill-none stroke-brand" strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex items-center gap-4 rounded-xl border p-4">
            <svg viewBox="0 0 100 100" className="size-20 -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r="38" className="fill-none stroke-muted" strokeWidth="12" />
              <circle cx="50" cy="50" r="38" pathLength={100} strokeDasharray="100" className="ring fill-none stroke-primary" strokeWidth="12" style={{ "--len": 100, "--off": 42 } as React.CSSProperties} />
            </svg>
            <div className="text-sm">
              <p className="font-medium">Пол гостей</p>
              <p className="mt-1 flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded-full bg-primary" />Женщины 58%</p>
              <p className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded-full bg-muted-foreground/40" />Мужчины 42%</p>
            </div>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">Возраст</p>
            <svg viewBox="0 0 200 70" className="mt-2 h-16 w-full" aria-hidden>
              {ages.map(([, v], i) => <rect key={i} x={i * 52 + 4} y={64 - v * 0.6} width="36" height={v * 0.6} rx="5" className="chart-bar fill-primary" style={{ "--b": i, opacity: 0.45 + v / 200 } as React.CSSProperties} />)}
            </svg>
            <div className="mt-1 grid grid-cols-4 text-center text-[11px] text-muted-foreground">{ages.map(([l]) => <span key={l}>{l}</span>)}</div>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-4">
            {c.segments.map((s) => (
              <li key={s.label} className="rounded-xl bg-brand-bg p-3">
                <p className="text-xl font-semibold tabular-nums text-brand"><CountUp value={s.value.toLocaleString("ru-RU")} /></p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </figure>
    </div>
  );
}
