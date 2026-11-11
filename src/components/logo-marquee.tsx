// Бегущая строка клиентов. Логотип берётся из public/clients/<file>.svg, если файл есть (поле logo);
// пока файла нет — название клиента набором. Лента дублируется для бесшовного цикла;
// пауза при наведении; prefers-reduced-motion — без движения, строки переносятся.
import { cn } from "@/lib/utils";

export type Client = { name: string; logo?: string; invert?: boolean };

export function LogoMarquee({ items, className }: { items: Client[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="marquee-row flex shrink-0 items-center gap-12 pr-12">
      {items.map((c) => (
        <li key={c.name} className="shrink-0">
          {c.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.logo} alt={hidden ? "" : c.name} className={cn("h-9 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0", c.invert ? "invert dark:invert-0" : "dark:invert")} />
          ) : (
            <span className="whitespace-nowrap text-xl font-semibold tracking-tight text-foreground/55">{c.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("marquee group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]", className)}>
      {row(false)}
      {row(true)}
    </div>
  );
}
