// Блок для IT-специалиста: тёмная секция (класс .dark переключает токены), терминал печатает шаги подключения.
import { home } from "@/content/home";
import { Container, Section } from "@/components/container";

export function ItBlock() {
  const it = home.it;
  return (
    <Section id="it" className="dark scroll-mt-14 bg-background text-foreground">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div data-reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-brand">Для IT-специалиста</p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-tight">{it.title}</h2>
            <p className="mt-4 text-muted-foreground">{it.text}</p>
            <p className="mt-8 text-sm font-medium">Работаем с оборудованием</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {it.vendors.map((v, i) => <li key={v} data-reveal style={{ "--i": i } as React.CSSProperties} className="rounded-lg border bg-card px-3 py-1.5 font-mono text-sm">{v}</li>)}
            </ul>
          </div>
          <div className="space-y-4">
            <div data-reveal="scale" className="overflow-hidden rounded-2xl border bg-card font-mono text-sm">
              <div aria-hidden className="flex items-center gap-1.5 border-b px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
                <span className="ml-2 text-xs text-muted-foreground">hvala — подключение</span>
              </div>
              <ol className="space-y-2 p-5">
                <li className="text-muted-foreground">$ hvala connect</li>
                {it.terminal.map((l, t) => (
                  <li key={l.t} className="term-line flex gap-3" style={{ "--t": t } as React.CSSProperties}>
                    <span className={l.k === "✓" ? "text-success" : "text-brand"} aria-hidden>{l.k}</span>{l.t}
                  </li>
                ))}
                <li aria-hidden className="term-line" style={{ "--t": it.terminal.length } as React.CSSProperties}><span className="term-cursor inline-block h-4 w-2 translate-y-0.5 bg-foreground" /></li>
              </ol>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {it.points.map((p, i) => (
                <li key={p.title} data-reveal style={{ "--i": i + 2 } as React.CSSProperties} className="rounded-xl border bg-card p-4">
                  <p className="font-medium">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
