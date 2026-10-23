"use client";

// Попапы на любой странице сайта: форма заявки и демо Wi‑Fi — по центру поверх размытого фона, как поиск.
// Открываются кнопками с data-os-app="mail" | "wifi" (data-os-payload — тема заявки) или событием hvala:overlay.
// Без JavaScript кнопки остаются обычными ссылками (Telegram менеджера, страница направления).
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { MailApp, WifiApp } from "./apps";

type Overlay = { id: "mail" | "wifi"; payload?: string } | null;

export function OverlayHost() {
  const [ov, setOv] = useState<Overlay>(null);
  const opener = useRef<Element | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = (id: string, payload?: string) => {
      if (id !== "mail" && id !== "wifi") return false;
      opener.current = document.activeElement;
      setOv({ id, payload });
      return true;
    };
    const onEvt = (e: Event) => { const d = (e as CustomEvent<{ id: string; payload?: string }>).detail; show(d.id, d.payload); };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-os-app]");
      if (a && show(a.dataset.osApp!, a.dataset.osPayload)) e.preventDefault();
    };
    addEventListener("hvala:overlay", onEvt);
    addEventListener("click", onClick);
    const m = location.hash.match(/^#app-(mail|wifi)$/);
    if (m) { history.replaceState(null, "", location.pathname); show(m[1]); }
    return () => { removeEventListener("hvala:overlay", onEvt); removeEventListener("click", onClick); };
  }, []);

  useEffect(() => {
    if (!ov) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    addEventListener("keydown", onKey);
    requestAnimationFrame(() => box.current?.querySelector<HTMLElement>("input, button")?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [ov]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    setOv(null);
    if (opener.current instanceof HTMLElement) opener.current.focus({ preventScroll: true });
  };
  if (!ov) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label={ov.id === "mail" ? "Заявка" : "Демо: Wi‑Fi гостя"}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-foreground/10 p-4 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div ref={box} className={ov.id === "mail" ? "window flex max-h-[min(44rem,calc(100dvh-2rem))] w-full max-w-xl flex-col" : "contents"}>
        {ov.id === "mail" ? (
          <>
            <div className="flex shrink-0 items-center gap-3 border-b bg-muted/60 px-4 py-2.5">
              <button type="button" aria-label="Закрыть" onClick={close} className="flex size-3 items-center justify-center rounded-full bg-brand text-primary-foreground [&_svg]:size-2"><X aria-hidden /></button>
              <span className="flex-1 text-center text-xs font-medium text-muted-foreground">Новая заявка</span>
              <span aria-hidden className="w-3" />
            </div>
            <div className="min-h-0 flex-1 overflow-auto"><MailApp payload={ov.payload} /></div>
          </>
        ) : (
          <WifiApp bare />
        )}
      </div>
    </div>
  );
}
