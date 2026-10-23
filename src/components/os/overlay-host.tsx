"use client";

// Попапы на любой странице сайта: форма заявки, демо Wi‑Fi, поиск (⌘K) и ответы на вопросы — поверх размытого фона.
// Открываются кнопками с data-os-app="mail" | "wifi" (data-os-payload — тема заявки) или событием hvala:overlay.
// Поиск открывается на текущей странице. Результат на главной открывает окно рабочего стола, на других — ведёт на страницу.
// Без JavaScript кнопки остаются обычными ссылками (Telegram менеджера, страница направления).
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { MailApp, MessagesApp, Spotlight, WifiApp, type Entry } from "./apps";
import { AppGlyph } from "./icons";
import { Logo } from "../logo";
import { apps, pageApps } from "@/content/os";

type Id = "mail" | "wifi" | "spotlight" | "messages";
type Overlay = { id: Id; payload?: string } | null;
const IDS: string[] = ["mail", "wifi", "spotlight", "messages"];
const entries: Entry[] = [
  ...pageApps.map((p) => ({ id: p.id, label: p.label, hint: "Страница", icon: p.icon })),
  ...apps.filter((a) => a.id !== "launchpad" && a.id !== "spotlight").map((a) => ({ id: a.id, label: a.label, hint: "Приложение", icon: a.icon })),
];
const glyph = (icon: string) => (icon === "logo" ? <Logo className="h-3 w-auto text-brand-vivid" /> : <AppGlyph icon={icon} />);
const isOS = () => !!(window as unknown as { __hvalaOS?: boolean }).__hvalaOS && matchMedia("(min-width: 1024px)").matches;

export function OverlayHost() {
  const [ov, setOv] = useState<Overlay>(null);
  const opener = useRef<Element | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const ovRef = useRef(ov);
  ovRef.current = ov;

  useEffect(() => {
    const show = (id: string, payload?: string) => {
      if (!IDS.includes(id)) return false;
      if (!opener.current || !ovRef.current) opener.current = document.activeElement;
      setOv({ id: id as Id, payload });
      return true;
    };
    const onEvt = (e: Event) => { const d = (e as CustomEvent<{ id: string; payload?: string }>).detail; show(d.id, d.payload); };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-os-app]");
      if (a && show(a.dataset.osApp!, a.dataset.osPayload)) e.preventDefault();
    };
    // ⌘K / Ctrl+K — поиск на любой странице
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      if (ovRef.current?.id === "spotlight") setOv(null); else show("spotlight");
    };
    addEventListener("hvala:overlay", onEvt);
    addEventListener("click", onClick);
    addEventListener("keydown", onKey);
    const m = location.hash.match(/^#app-(mail|wifi|spotlight)$/);
    if (m) { history.replaceState(null, "", location.pathname); show(m[1]); }
    return () => { removeEventListener("hvala:overlay", onEvt); removeEventListener("click", onClick); removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    if (!ov) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    addEventListener("keydown", onKey);
    if (ov.id !== "spotlight") requestAnimationFrame(() => box.current?.querySelector<HTMLElement>("input, button")?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [ov]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    setOv(null);
    if (opener.current instanceof HTMLElement) opener.current.focus({ preventScroll: true });
    opener.current = null;
  };
  // Результат поиска: на рабочем столе — окно, на других страницах — переход или попап
  const pick = (e: Entry) => {
    if (e.id === "mail" || e.id === "wifi") { setOv({ id: e.id, payload: e.payload }); return; }
    if (isOS()) { setOv(null); opener.current = null; dispatchEvent(new CustomEvent("hvala:open", { detail: { id: e.id, payload: e.payload } })); return; }
    if (e.id === "messages") { setOv({ id: "messages", payload: e.payload }); return; }
    setOv(null); opener.current = null;
    const page = pageApps.find((p) => p.id === e.id);
    if (page) { location.href = page.href; return; }
    if (e.id === "cases") { location.href = e.payload ? `/cases/#${e.payload}` : "/cases/"; return; }
    const app = apps.find((a) => a.id === e.id);
    if (app) location.href = app.fallback;
  };
  if (!ov) return null;
  if (ov.id === "spotlight") return <Spotlight entries={entries} renderIcon={glyph} onClose={close} onOpen={pick} />;
  const title = { mail: "Новая заявка", messages: "Сообщения", wifi: "", spotlight: "" }[ov.id];

  return (
    <div
      role="dialog" aria-modal="true" aria-label={ov.id === "wifi" ? "Демо: Wi‑Fi гостя" : title}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-foreground/10 p-4 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div ref={box} className={ov.id !== "wifi" ? "window flex max-h-[min(44rem,calc(100dvh-2rem))] w-full max-w-xl flex-col" : "contents"}>
        {ov.id !== "wifi" ? (
          <>
            <div className="flex shrink-0 items-center gap-3 border-b bg-muted/60 px-4 py-2.5">
              <button type="button" aria-label="Закрыть" onClick={close} className="flex size-3 items-center justify-center rounded-full bg-brand text-primary-foreground [&_svg]:size-2"><X aria-hidden /></button>
              <span className="flex-1 text-center text-xs font-medium text-muted-foreground">{title}</span>
              <span aria-hidden className="w-3" />
            </div>
            <div className={ov.id === "messages" ? "h-[32rem] min-h-0" : "min-h-0 flex-1 overflow-auto"}>{ov.id === "mail" ? <MailApp payload={ov.payload} /> : <MessagesApp payload={ov.payload} />}</div>
          </>
        ) : (
          <WifiApp bare />
        )}
      </div>
    </div>
  );
}
