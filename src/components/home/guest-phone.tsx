"use client";

// «Телефон гостя»: на компьютере телефон закреплён слева, справа при прокрутке идут сцены — экран меняется под активную.
// На телефоне — карусель со свайпом: в каждой карточке свой экран. Экраны — декоративный HTML (aria-hidden), смысл — в тексте сцен.
import { useEffect, useRef, useState } from "react";
import { Check, Star, Wifi } from "lucide-react";
import { home } from "@/content/home";
import { cn } from "@/lib/utils";

type SceneId = (typeof home.phoneScenes)[number]["id"];

function Bar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold">
      <span>12:30</span>
      <span className="h-5 w-20 rounded-full bg-foreground" />
      <Wifi className="size-3.5" />
    </div>
  );
}

function Venue() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">К</span>
      <span className="leading-tight"><span className="block text-sm font-semibold">Ваше заведение</span><span className="text-[11px] text-muted-foreground">Гостевой Wi-Fi</span></span>
    </div>
  );
}

function Screen({ id }: { id: SceneId }) {
  switch (id) {
    case "login":
      return (
        <div className="flex h-full flex-col gap-4 p-5">
          <Venue />
          <p className="mt-6 text-xl font-semibold leading-tight">Добро пожаловать! Войдите в Wi-Fi</p>
          <div className="rounded-xl border bg-background px-3 py-2.5 text-sm tabular-nums">+7 (900) 123-45-67</div>
          <div className="pulse rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">Подключиться</div>
          <p className="mt-auto flex items-center gap-1.5 text-[11px] text-muted-foreground"><Check className="size-3.5 text-brand" />Вход по номеру — по требованиям закона</p>
        </div>
      );
    case "promo":
      return (
        <div className="flex h-full flex-col gap-3 p-5">
          <Venue />
          <div className="pop mt-3 rounded-2xl bg-primary p-4 text-primary-foreground">
            <p className="text-[11px] uppercase tracking-wider opacity-80">Только сегодня</p>
            <p className="mt-1 text-3xl font-bold leading-none">−15%</p>
            <p className="mt-1.5 text-sm">на кофе за вход в Wi-Fi</p>
            <p className="mt-3 rounded-lg bg-primary-foreground py-1.5 text-center text-xs font-semibold text-primary">Показать бариста</p>
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">Афиша</p>
          {["Пт · Джазовый вечер", "Сб · Мастер-класс латте-арт"].map((e) => (
            <div key={e} className="rounded-xl border bg-background px-3 py-2 text-sm">{e}</div>
          ))}
        </div>
      );
    case "survey":
      return (
        <div className="flex h-full flex-col gap-3 p-5">
          <Venue />
          <p className="mt-3 text-sm font-semibold">Расскажите о себе</p>
          <div className="flex gap-2 text-xs">{["Ж", "М"].map((g, i) => <span key={g} className={cn("rounded-full border px-3 py-1", i === 0 && "border-primary bg-brand-bg text-brand")}>{g}</span>)}</div>
          <div className="flex flex-wrap gap-2 text-xs">{["18–24", "25–34", "35–44", "45+"].map((a, i) => <span key={a} className={cn("rounded-full border px-3 py-1", i === 1 && "border-primary bg-brand-bg text-brand")}>{a}</span>)}</div>
          <p className="mt-2 text-sm font-semibold">Как вам новое меню?</p>
          {[["Отлично", 72], ["Нормально", 21], ["Не очень", 7]].map(([l, v]) => (
            <div key={l} className="relative overflow-hidden rounded-lg border bg-background px-3 py-1.5 text-xs">
              <span className="fill-bar absolute inset-y-0 left-0 bg-brand-bg" style={{ width: `${v}%` }} />
              <span className="relative flex justify-between"><span>{l}</span><span className="tabular-nums">{v}%</span></span>
            </div>
          ))}
        </div>
      );
    case "review":
      return (
        <div className="flex h-full flex-col gap-3 p-5">
          <Venue />
          <p className="mt-3 text-sm font-semibold">Оцените визит</p>
          <div className="flex gap-1.5">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="star size-7 fill-primary text-primary" style={{ "--s": s } as React.CSSProperties} />)}</div>
          <div className="rounded-xl border bg-background p-3 text-sm">Очень вкусный раф, бариста — супер! Хочу такой же сироп в меню.</div>
          <div className="pop mt-auto rounded-xl bg-foreground p-3 text-xs text-background">
            <p className="font-semibold">Новый отзыв · 5 ★</p>
            <p className="mt-0.5 opacity-80">Управляющий видит его сразу</p>
          </div>
        </div>
      );
    case "loyalty":
      return (
        <div className="flex h-full flex-col gap-3 p-5">
          <Venue />
          <div className="pop mt-3 aspect-[1.6] rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg">
            <p className="text-xs opacity-80">Карта гостя</p>
            <p className="mt-6 text-2xl font-bold">5% бонусами</p>
            <p className="mt-1 text-[11px] opacity-80">Добавить в Wallet</p>
          </div>
          {["Подписаться на Telegram", "Мы во ВКонтакте", "Скачать приложение", "Вакансия: бариста"].map((b) => (
            <div key={b} className="rounded-xl border bg-background px-3 py-2 text-sm">{b}</div>
          ))}
        </div>
      );
  }
}

function Phone({ active, className }: { active: SceneId; className?: string }) {
  return (
    <div aria-hidden className={cn("phone-frame relative h-[540px] w-[264px] shrink-0 overflow-hidden bg-card", className)}>
      <Bar />
      <div className="absolute inset-x-0 bottom-0 top-9">
        {home.phoneScenes.map((s) => (
          <div key={s.id} className="phone-screen" data-on={active === s.id ? "" : undefined}>
            <Screen id={s.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GuestPhone() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.scene)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-16">
      <div className="hidden lg:block">
        <div className="sticky top-24 flex h-[calc(100vh-8rem)] min-h-[600px] items-center justify-center gap-8">
          <Phone active={home.phoneScenes[active].id} />
          <ol className="flex flex-col gap-2" aria-hidden>
            {home.phoneScenes.map((s, i) => <li key={s.id} className={cn("scene-dot w-1.5 rounded-full", i === active ? "h-8 bg-primary" : "h-1.5 bg-border")} />)}
          </ol>
        </div>
      </div>
      <ol className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 case-track lg:mx-0 lg:block lg:overflow-visible lg:p-0">
        {home.phoneScenes.map((s, i) => (
          <li
            key={s.id}
            ref={(el) => { refs.current[i] = el; }}
            data-scene={i}
            className={cn("flex w-[85%] shrink-0 snap-center flex-col gap-6 rounded-2xl border bg-background p-5 sm:w-[60%] lg:min-h-[72vh] lg:w-auto lg:justify-center lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:transition-opacity lg:duration-500", i !== active && "lg:opacity-30")}
          >
            <Phone active={s.id} className="mx-auto -my-6 scale-90 lg:hidden" />
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-brand">{String(i + 1).padStart(2, "0")} · {s.tag}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">{s.title}</h3>
              <p className="mt-4 max-w-md text-muted-foreground lg:text-lg">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
