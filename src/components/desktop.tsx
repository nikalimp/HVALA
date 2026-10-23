import Link from "next/link";
import { BriefcaseBusiness, Building2, Handshake, Megaphone, PartyPopper, Phone, Radar, Send, Wifi } from "lucide-react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { Button } from "./ui/button";

// Первый экран — рабочий стол ОС (03-design.md §0). Иконки-«приложения» — обычные ссылки на страницы сайта,
// окна — обычный HTML: весь текст доступен без JavaScript и виден поисковикам и нейросетям.
const apps = [
  { href: "/services/guest-wifi/", label: "Wi-Fi для заведений", Icon: Wifi },
  { href: "/services/advertising/", label: "Реклама в Wi-Fi", Icon: Megaphone },
  { href: "/services/event-wifi/", label: "Мероприятия", Icon: PartyPopper },
  { href: "/services/trap/", label: "TRAP", Icon: Radar },
  { href: "/services/franchise/", label: "Франшиза", Icon: Handshake },
  { href: "/#cases", label: "Кейсы", Icon: BriefcaseBusiness },
  { href: "/about/", label: "О компании", Icon: Building2 },
  { href: "/contacts/", label: "Контакты", Icon: Phone },
];

function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 border-b bg-muted/60 px-4 py-2.5">
      <span aria-hidden className="flex gap-1.5">
        <span className="size-3 rounded-full bg-brand" />
        <span className="size-3 rounded-full bg-brand/45" />
        <span className="size-3 rounded-full bg-brand/20" />
      </span>
      <span className="flex-1 truncate text-center text-xs font-medium text-muted-foreground">{title}</span>
      <span aria-hidden className="w-[3.25rem]" />
    </div>
  );
}

function AppIcon({ href, label, Icon, size = "lg" }: (typeof apps)[number] & { size?: "lg" | "sm" }) {
  return (
    <Link href={href} className="desktop-app group flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-center outline-offset-2">
      <span className={size === "lg" ? "app-tile size-14 sm:size-16" : "app-tile size-11"}>
        <Icon className={size === "lg" ? "size-7" : "size-5"} strokeWidth={1.75} aria-hidden />
      </span>
      <span className={size === "lg" ? "max-w-24 text-xs font-medium leading-tight text-desktop-ink" : "sr-only"}>{label}</span>
    </Link>
  );
}

export function Desktop() {
  return (
    <section aria-labelledby="hero-title" className="desktop relative isolate overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] w-full max-w-6xl gap-8 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-[auto_1fr] lg:gap-10 lg:pt-10">
        {/* Иконки на рабочем столе */}
        <nav aria-label="Разделы сайта" className="order-2 lg:order-1">
          <ul className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-8 lg:grid-cols-2 lg:gap-x-4">
            {apps.map((a) => (
              <li key={a.href}><AppIcon {...a} /></li>
            ))}
          </ul>
        </nav>

        {/* Окна */}
        <div className="relative order-1 grid items-start gap-6 lg:order-2 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_19rem]">
          <article className="window">
            <TitleBar title="О HVALA" />
            <div className="p-6 sm:p-9">
              <p className="font-mono text-xs uppercase tracking-wider text-brand">{home.slogan}</p>
              <h1 id="hero-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl xl:text-5xl">{home.h1}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{home.answer}</p>
              <dl className="mt-7 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4">
                {site.stats.map((s) => (
                  <div key={s.label}>
                    <dd className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
                    <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg"><a href={site.cta.href}><Send aria-hidden />{site.cta.label}</a></Button>
                <Button asChild size="lg" variant="outline"><Link href="/services/">Все направления</Link></Button>
              </div>
            </div>
          </article>

          {/* Окно-иллюстрация: страница входа в Wi-Fi, собрана кодом. Декоративная — текст дублирует окно слева */}
          <div aria-hidden className="window hidden lg:block lg:translate-y-16">
            <TitleBar title="Wi-Fi гостя" />
            <div className="p-5">
              <div className="mx-auto w-full max-w-[13.5rem] rounded-[1.75rem] border-[6px] border-desktop-ink bg-background p-4 shadow-sm">
                <p className="text-center text-[11px] font-semibold tracking-wide text-muted-foreground">Coffee Point · Wi-Fi</p>
                <div className="mt-3 rounded-xl bg-brand-bg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Акция дня</p>
                  <p className="mt-1 text-sm font-semibold leading-snug">Второй капучино в подарок</p>
                </div>
                <p className="mt-4 text-[11px] text-muted-foreground">Номер телефона</p>
                <div className="mt-1 rounded-lg border px-2.5 py-2 text-sm tabular-nums">+7 900 000-00-00</div>
                <div className="mt-3 rounded-lg bg-primary px-2.5 py-2 text-center text-sm font-medium text-primary-foreground">Подключиться</div>
                <div className="mt-4 flex justify-center gap-1.5">
                  <span className="h-1 w-6 rounded-full bg-brand" />
                  <span className="h-1 w-2 rounded-full bg-border" />
                  <span className="h-1 w-2 rounded-full bg-border" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Док */}
      <nav aria-label="Док" className="dock absolute inset-x-0 bottom-5 hidden justify-center sm:flex">
        <ul className="flex items-end gap-1.5 rounded-2xl border bg-background/70 p-2 shadow-lg backdrop-blur-md">
          {apps.map((a) => (
            <li key={a.href} title={a.label}><AppIcon {...a} size="sm" /></li>
          ))}
          <li aria-hidden className="mx-1 h-9 w-px self-center bg-border" />
          <li title={site.cta.label}>
            <a href={site.cta.href} className="desktop-app flex rounded-xl p-1.5">
              <span className="app-tile app-tile-cta size-11"><Send className="size-5" strokeWidth={1.75} aria-hidden /></span>
              <span className="sr-only">{site.cta.label}</span>
            </a>
          </li>
        </ul>
      </nav>
    </section>
  );
}
