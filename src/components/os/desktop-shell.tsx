"use client";

// Рабочий стол HVALA — первый экран главной (03-design.md §0, плейбук web:concept-os).
// Всё, что видно до загрузки JS (окно «О HVALA» с H1, иконки-ссылки, док-ссылки), — обычный HTML.
// Окна, перетаскивание, слои и оверлеи — прогрессивное улучшение.
// Окно страницы меняет адрес (history.pushState); «назад», Esc и ✕ закрывают его. Прямой заход — обычная страница.
// На экранах уже 1024 px окон нет: страницы открываются ссылками, приложения — на весь экран.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FolderOpen, Send } from "lucide-react";
import { Bitmap } from "@/components/bitmap";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { apps, pageApps, type AppId } from "@/content/os";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { AppGlyph } from "./icons";
import { StatsWidgets } from "./stats-widgets";
import {
  CalendarApp, CasesApp, DirectionsApp, GalleryApp, Launchpad, MailApp, MessagesApp, Spotlight, ToolsApp, TrashApp, type Entry,
} from "./apps";

type Win = {
  key: string;
  kind: "app" | "page";
  title: string;
  icon: string;
  href?: string;
  html?: string | null;
  payload?: string;
  z: number;
  x?: number;
  y?: number;
  w: number;
  h?: number;
  min: boolean;
  max: boolean;
};

const sizes: Partial<Record<AppId, { w: number; h?: number }>> = {
  cases: { w: 820, h: 520 }, mail: { w: 580, h: 540 }, calendar: { w: 360 }, messages: { w: 440, h: 540 },
  tools: { w: 560 }, gallery: { w: 680, h: 500 }, trash: { w: 400 }, wifi: { w: 380 }, directions: { w: 600 },
};
const DESKTOP_Q = "(min-width: 1024px)";
const ICONS_KEY = "hvala-os-icons";

const pageById = Object.fromEntries(pageApps.map((p) => [p.id, p]));
const appById = Object.fromEntries(apps.map((a) => [a.id, a]));
// На столе: папка «Направления» (внутри — 5 страниц), «Кейсы», «О компании», «Блог»
const desktopIcons = [
  ...apps.filter((a) => a.desktop).map((a) => ({ id: a.id, label: a.label, icon: a.icon, href: a.fallback })),
  ...pageApps.filter((p) => p.id === "page:about" || p.id === "page:blog").map((p) => ({ id: p.id, label: p.label, icon: p.icon, href: p.href })),
];
const entries: Entry[] = [
  ...pageApps.map((p) => ({ id: p.id, label: p.label, hint: "Страница", icon: p.icon })),
  ...apps.filter((a) => a.id !== "launchpad" && a.id !== "spotlight").map((a) => ({ id: a.id, label: a.label, hint: "Приложение", icon: a.icon })),
];

function AboutWindowBody({ open }: { open: (id: string) => void }) {
  return (
    <div className="p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-brand">{home.slogan}</p>
      <h1 id="hero-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl 2xl:text-5xl">{home.h1}</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">{home.answer}</p>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t pt-5 sm:grid-cols-4 lg:hidden">
        {site.stats.map((s) => (
          <div key={s.label}>
            <dd className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild size="lg"><a href={site.cta.href} onClick={(e) => { e.preventDefault(); open("mail"); }}><Send aria-hidden />{site.cta.label}</a></Button>
        <Button asChild size="lg" variant="outline"><a href="/services/" onClick={(e) => { if (matchMedia(DESKTOP_Q).matches) { e.preventDefault(); open("directions"); } }}><FolderOpen aria-hidden />Направления</a></Button>
      </div>
    </div>
  );
}

export function DesktopShell() {
  const area = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const winRefs = useRef(new Map<string, HTMLElement>());
  const openers = useRef(new Map<string, Element | null>());
  const zTop = useRef(10);
  const [isDesktop, setIsDesktop] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const [overlay, setOverlay] = useState<null | "launchpad" | "spotlight">(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [offsets, setOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  const [wins, setWins] = useState<Win[]>([
    { key: "about", kind: "app", title: "О HVALA", icon: "logo", z: 3, w: 660, min: true, max: false }, // на десктопе закрыто, пока не открыть «О HVALA» в доке; на телефоне видно всегда
  ]);
  const winsRef = useRef(wins);
  winsRef.current = wins;

  useLayoutEffect(() => {
    const mq = matchMedia(DESKTOP_Q);
    const on = () => setIsDesktop(mq.matches);    on(); mq.addEventListener("change", on);setToday(new Date());
    try { const s = localStorage.getItem(ICONS_KEY); if (s) setOffsets(JSON.parse(s)); } catch {}
    return () => mq.removeEventListener("change", on);
  }, []);

  // Стартовая раскладка окон на десктопе: «О HVALA» слева от центра, демо Wi-Fi справа, под ним.
  useLayoutEffect(() => {
    if (!isDesktop || !area.current) return;
    const r = area.current.getBoundingClientRect();
    setWins((ws) => ws.map((w) => {
      if (w.x !== undefined) return w;      if (w.key === "about") return { ...w, w: Math.min(660, r.width - 560), x: Math.max(250, (r.width - 660) / 2 - 30), y: 16 };
      return w;
    }));
  }, [isDesktop]);

  const front = useCallback((key: string) => {
    setWins((ws) => ws.map((w) => (w.key === key ? { ...w, z: ++zTop.current, min: false } : w)));
  }, []);

  const focusWin = (key: string) => requestAnimationFrame(() => winRefs.current.get(key)?.focus({ preventScroll: true }));

  const placeNew = (w: number, h = 420) => {
    const r = area.current?.getBoundingClientRect();
    const n = winsRef.current.filter((x) => !x.min).length;
    const W = r?.width ?? 1200, H = r?.height ?? 700;
    return { x: Math.max(8, Math.min(W - w - 8, (W - w) / 2 + 40 + n * 26)), y: Math.max(8, Math.min(H - Math.min(h, H) - 8, 24 + n * 26)) };
  };

  const openPage = useCallback((id: string, push = true) => {
    const p = pageById[id];
    if (!p) return;
    const existing = winsRef.current.find((w) => w.key === id);
    openers.current.set(id, document.activeElement);
    if (existing) { front(id); focusWin(id); }
    else {
      const w = 780;
      setWins((ws) => [...ws, { key: id, kind: "page", title: p.label, icon: p.icon, href: p.href, html: null, z: ++zTop.current, w, ...placeNew(w, 600), min: false, max: false }]);
      fetch(p.href).then((r) => r.text()).then((t) => {
        const doc = new DOMParser().parseFromString(t, "text/html");
        const main = doc.querySelector("main");
        main?.querySelectorAll("script, nav[aria-label='Хлебные крошки']").forEach((n) => n.remove());
        main?.querySelectorAll("h1").forEach((h) => h.setAttribute("id", `${id}-h1`));
        setWins((ws) => ws.map((x) => (x.key === id ? { ...x, html: main?.innerHTML ?? "" } : x)));
      }).catch(() => setWins((ws) => ws.map((x) => (x.key === id ? { ...x, html: "" } : x))));
      focusWin(id);
    }
    if (push && location.pathname !== p.href) history.pushState({ hvalaWin: id }, "", p.href);
  }, [front]);

  const open = useCallback((id: string, payload?: string) => {
    setSelected(null);
    if (id === "mail" || id === "wifi") { dispatchEvent(new CustomEvent("hvala:overlay", { detail: { id, payload } })); return; }
    if (id === "launchpad" || id === "spotlight") { setOverlay(id); return; }
    if (id.startsWith("page:")) {
      if (!matchMedia(DESKTOP_Q).matches) { location.href = pageById[id].href; return; }
      setOverlay(null); openPage(id); return;
    }
    if (id === "about") { setOverlay(null); front("about"); focusWin("about"); return; }
    const a = appById[id];
    if (!a) return;
    setOverlay(null);
    openers.current.set(id, document.activeElement);
    const existing = winsRef.current.find((w) => w.key === id);
    if (existing) setWins((ws) => ws.map((w) => (w.key === id ? { ...w, z: ++zTop.current, min: false, payload: payload ?? w.payload } : w)));
    else {
      const s = sizes[id as AppId] ?? { w: 520 };
      // Демо Wi-Fi открывается под значком Wi-Fi в строке меню, как меню-экстра macOS
      const pos = id === "wifi" && area.current ? { x: area.current.getBoundingClientRect().width - s.w - 16, y: 4 } : placeNew(s.w, s.h);
      setWins((ws) => [...ws, { key: id, kind: "app", title: a.title, icon: a.icon, payload, z: ++zTop.current, w: s.w, h: s.h, ...pos, min: false, max: false }]);
    }
    focusWin(id);
  }, [front, openPage]);

  const close = useCallback((key: string) => {
    const w = winsRef.current.find((x) => x.key === key);
    if (!w) return;
    if (w.kind === "page" && history.state?.hvalaWin === key) { history.back(); }
    else {
      if (w.kind === "page" && location.pathname === w.href) history.replaceState(null, "", "/");
      setWins((ws) => (key === "about" ? ws.map((x) => (x.key === key ? { ...x, min: true } : x)) : ws.filter((x) => x.key !== key)));
    }
    const back = openers.current.get(key);
    if (back instanceof HTMLElement) back.focus({ preventScroll: true });
  }, []);

  // «Назад» и «вперёд» браузера
  useEffect(() => {
    const onPop = () => {
      const path = location.pathname;
      const page = pageApps.find((p) => p.href === path);
      setWins((ws) => ws.filter((w) => w.kind !== "page" || w.href === path));
      if (page) openPage(page.id, false);
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [openPage]);

  // Шина: строка меню на любой странице открывает приложения (событие hvala:open или ссылка /#app-<id>)
  useEffect(() => {
    (window as unknown as { __hvalaOS?: boolean }).__hvalaOS = true;
    const onOpen = (e: Event) => { const d = (e as CustomEvent<{ id: string; payload?: string }>).detail; open(d.id, d.payload); };
    addEventListener("hvala:open", onOpen);
    const m = location.hash.match(/^#app-([a-z]+)$/);
    if (m) { history.replaceState(null, "", "/"); open(m[1]); }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOverlay((o) => (o === "spotlight" ? null : "spotlight")); return; }
      if (e.key !== "Escape") return;
      if (overlayRef.current) { setOverlay(null); return; }
      const top = [...winsRef.current].filter((w) => !w.min).sort((a, b) => b.z - a.z)[0];
      if (top && document.activeElement && winRefs.current.get(top.key)?.contains(document.activeElement)) close(top.key);
    };
    addEventListener("keydown", onKey);
    return () => { removeEventListener("hvala:open", onOpen); removeEventListener("keydown", onKey); (window as unknown as { __hvalaOS?: boolean }).__hvalaOS = false; };
  }, [open, close]);
  const overlayRef = useRef(overlay);
  overlayRef.current = overlay;

  // Перетаскивание окна за заголовок
  const dragWin = (key: string) => (e: React.PointerEvent) => {
    if (!isDesktop || (e.target as HTMLElement).closest("button")) return;
    const w = winsRef.current.find((x) => x.key === key);
    if (!w || w.max) return;
    front(key);
    const sx = e.clientX, sy = e.clientY, ox = w.x ?? 0, oy = w.y ?? 0;
    const r = area.current!.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const x = Math.min(Math.max(ox + ev.clientX - sx, -w.w + 120), r.width - 120);
      const y = Math.min(Math.max(oy + ev.clientY - sy, 0), r.height - 40);
      setWins((ws) => ws.map((x2) => (x2.key === key ? { ...x2, x, y } : x2)));
    };
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
    addEventListener("pointermove", move); addEventListener("pointerup", up);
  };

  // Иконки: клик — выделить, двойной клик или Enter — открыть, перетаскивание — передвинуть
  const dragged = useRef(false);
  const dragIcon = (id: string) => (e: React.PointerEvent) => {
    if (!isDesktop || e.button !== 0) return;
    dragged.current = false;
    const sx = e.clientX, sy = e.clientY, o = offsets[id] ?? { dx: 0, dy: 0 };
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!dragged.current && Math.hypot(dx, dy) < 5) return;
      dragged.current = true;
      setOffsets((s) => ({ ...s, [id]: { dx: o.dx + dx, dy: o.dy + dy } }));
    };
    const up = () => {
      removeEventListener("pointermove", move); removeEventListener("pointerup", up);
      if (dragged.current) setOffsets((s) => { try { localStorage.setItem(ICONS_KEY, JSON.stringify(s)); } catch {} return s; });
    };
    addEventListener("pointermove", move); addEventListener("pointerup", up);
  };
  const clickIcon = (id: string) => (e: React.MouseEvent) => {
    if (id.startsWith("page:") && !isDesktop) return; // телефон: обычная ссылка
    e.preventDefault();
    if (dragged.current) { dragged.current = false; return; }
    if (!isDesktop || e.detail === 0) open(id); // телефон или клавиатура
    else setSelected(id);
  };

  const glyph = useCallback((icon: string) => (icon === "logo" ? <Logo className="h-3 w-auto text-brand-vivid" /> : <AppGlyph icon={icon} today={today} />), [today]);
  const openWins = wins.filter((w) => !w.min);
  const isOpen = (id: string) => wins.some((w) => w.key === id);
  const dockApps = useMemo(() => apps.filter((a) => a.dock && a.id !== "trash"), []); // док: Все разделы, Спросить HVALA

  const body = (w: Win) => {
    switch (w.key) {
      case "about": return <AboutWindowBody open={open} />;
      case "cases": return <CasesApp payload={w.payload} />;
      case "mail": return <MailApp payload={w.payload} />;
      case "calendar": return <CalendarApp />;
      case "messages": return <MessagesApp payload={w.payload} />;
      case "tools": return <ToolsApp />;
      case "directions": return <DirectionsApp open={open} />;
      case "gallery": return <GalleryApp />;
      case "trash": return <TrashApp />;
    }
    if (w.kind === "page") {
      if (w.html === null) return <p className="p-8 text-sm text-muted-foreground">Открываем…</p>;
      if (!w.html) return <p className="p-8 text-sm"><a className="underline" href={w.href}>Открыть страницу «{w.title}»</a></p>;
      return <div className="os-page" dangerouslySetInnerHTML={{ __html: w.html }} />;
    }
    return null;
  };

  return (
    <section ref={sectionRef} aria-labelledby="hero-title" className="desktop relative -mt-14 overflow-hidden pt-14 lg:h-[100svh] lg:min-h-[640px]">
      <Bitmap className="z-0" cell={6} alpha={0.2} density={0.45} interactive logo isBackground={(el) => el === area.current || el === sectionRef.current} />
      <div ref={area} className="relative mx-auto flex w-full max-w-[1680px] flex-col px-4 pb-10 pt-6 sm:px-6 lg:block lg:absolute lg:inset-x-0 lg:bottom-24 lg:top-14 lg:isolate lg:p-0" onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
        {/* Иконки рабочего стола */}
        <nav aria-label="Разделы сайта" className="order-2 mt-8 lg:absolute lg:left-6 lg:top-4 lg:mt-0">
          <ul className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-9 lg:grid-cols-1 lg:gap-y-3">
            {desktopIcons.map((a) => {
              const o = offsets[a.id];
              return (
                <li key={a.id} style={isDesktop && o ? { transform: `translate(${o.dx}px, ${o.dy}px)` } : undefined} className="relative">
                  <a
                    href={a.href}
                    onClick={clickIcon(a.id)}
                    onDoubleClick={() => isDesktop && open(a.id)}
                    onPointerDown={dragIcon(a.id)}
                    draggable={false}
                    aria-current={selected === a.id ? "true" : undefined}
                    className="desktop-app group flex touch-none select-none flex-col items-center gap-1.5 rounded-xl p-1.5 text-center outline-offset-2"
                  >
                    <span className="app-tile size-14 sm:size-16"><AppGlyph icon={a.icon} className="size-7" today={today} /></span>
                    <span className={cn("max-w-24 rounded px-1.5 py-0.5 text-xs font-medium leading-tight text-desktop-ink backdrop-blur-sm", selected === a.id ? "bg-primary text-primary-foreground" : "bg-background/60")}>{a.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Виджеты справа: цифры компании */}
        <aside aria-label="HVALA в цифрах" className="absolute right-6 top-4 hidden w-[17rem] lg:block">
          <StatsWidgets />
        </aside>

        {/* Окна */}
        {wins.map((w) => {
          const hero = w.key === "about";
          const style = isDesktop
            ? w.max
              ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: w.z }
              : { left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z }
            : undefined;
          if (!hero && !isDesktop && w.kind === "page") return null;
          return (
            <article
              key={w.key}
              ref={(el) => { if (el) winRefs.current.set(w.key, el); else winRefs.current.delete(w.key); }}
              role={hero ? undefined : "dialog"}
              aria-labelledby={hero ? undefined : `${w.key}-title`}
              tabIndex={-1}
              hidden={w.min && !hero}
              onPointerDown={() => isDesktop && front(w.key)}
              style={style}
              className={cn(
                "window flex flex-col outline-none",
                hero ? cn("relative order-1 lg:absolute", w.min && "lg:hidden")+" lg:left-[calc(50%-24rem)] lg:top-4 lg:w-[660px]" : "fixed inset-0 z-50 rounded-none lg:absolute lg:inset-auto lg:rounded-[0.875rem]",
                !hero && "lg:max-h-full",
                
              )}
            >
              <div className="flex shrink-0 cursor-default items-center gap-3 border-b bg-muted/60 px-4 py-2.5 lg:cursor-grab lg:active:cursor-grabbing" onPointerDown={dragWin(w.key)}>
                {!hero && <button type="button" onClick={() => close(w.key)} className="text-sm font-medium text-brand lg:hidden">‹ Назад</button>}
                <span className="hidden gap-1.5 lg:flex">
                  <button type="button" aria-label={hero ? "Свернуть окно" : "Закрыть окно"} onClick={() => close(w.key)} className="size-3 rounded-full bg-brand ring-offset-1 focus-visible:ring-2" />
                </span>
                <span id={`${w.key}-title`} className="flex-1 truncate text-center text-xs font-medium text-muted-foreground">{w.title}</span>
                {w.kind === "page" ? <a href={w.href} className="text-xs text-muted-foreground underline-offset-4 hover:underline">Открыть страницу</a> : <span aria-hidden className="w-3" />}
              </div>
              <div className={cn("@container min-h-0 flex-1 overflow-auto", !hero && "lg:max-h-[calc(100svh-15rem)]", w.max && "lg:max-h-none")}>{body(w)}</div>
            </article>
          );
        })}
      </div>

      {/* Док */}
      <nav aria-label="Док" className="dock absolute inset-x-0 bottom-4 z-10 hidden justify-center lg:flex">
        <ul className="flex items-end gap-1 rounded-2xl border bg-background/70 p-1.5 shadow-lg backdrop-blur-md">
          {dockApps.map((a) => (
            <DockItem key={a.id} label={a.label} href={a.fallback} active={isOpen(a.id)} onClick={() => open(a.id)}><AppGlyph icon={a.icon} className="size-5" today={today} /></DockItem>
          ))}
          {wins.some((w) => w.kind === "page") && <li aria-hidden className="mx-1 h-9 w-px self-center bg-border" />}
          {wins.filter((w) => w.kind === "page").map((w) => (
            <DockItem key={w.key} label={w.title} href={w.href!} active onClick={() => openPage(w.key)}><AppGlyph icon={w.icon} className="size-5" /></DockItem>
          ))}
          <li aria-hidden className="mx-1 h-9 w-px self-center bg-border" />
          <DockItem label="Корзина" href="/" active={isOpen("trash")} onClick={() => open("trash")}><AppGlyph icon="trash" className="size-5" /></DockItem>
        </ul>
      </nav>

      {overlay === "launchpad" && <Launchpad entries={entries} renderIcon={glyph} onClose={() => setOverlay(null)} onOpen={(e) => open(e.id, e.payload)} />}
      {overlay === "spotlight" && <Spotlight entries={entries} renderIcon={glyph} onClose={() => setOverlay(null)} onOpen={(e) => open(e.id, e.payload)} />}
      <p className="sr-only" aria-live="polite">{openWins.length > 2 ? `Открыто окон: ${openWins.length}` : ""}</p>
    </section>
  );
}

function DockItem({ label, href, active, onClick, children }: { label: string; href: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <li className="group/dock relative flex flex-col items-center">
      <span role="tooltip" className="pointer-events-none absolute -top-8 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background group-hover/dock:block group-focus-within/dock:block">{label}</span>
      <a href={href} onClick={(e) => { e.preventDefault(); onClick(); }} className="desktop-app flex rounded-xl p-1">
        <span className="app-tile size-11">{children}</span>
        <span className="sr-only">{label}</span>
      </a>
      <span aria-hidden className={cn("mt-0.5 size-1 rounded-full", active ? "bg-desktop-ink" : "bg-transparent")} />
    </li>
  );
}
