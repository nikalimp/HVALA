"use client";

// Правая часть строки меню: демо Wi‑Fi и поиск (⌘K). Часы — отдельно, правее переключателя темы (menubar-clock).
// Демо — попап на любой странице (overlay-host). Поиск на главной — оверлей рабочего стола, на других страницах ведёт на /#app-spotlight.
import { useEffect } from "react";
import { Search, Wifi } from "lucide-react";

const isOS = () => !!(window as unknown as { __hvalaOS?: boolean }).__hvalaOS;
function openSearch() {
  if (isOS()) dispatchEvent(new CustomEvent("hvala:open", { detail: { id: "spotlight" } }));
  else location.href = "/#app-spotlight";
}

export function MenubarExtras() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !isOS()) { e.preventDefault(); openSearch(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <a href="/services/guest-wifi/" data-os-app="wifi" aria-label="Демо: Wi-Fi гостя" title="Демо Wi-Fi гостя" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
        <Wifi className="size-4" aria-hidden />
      </a>
      <a href="/#app-spotlight" onClick={(e) => { e.preventDefault(); openSearch(); }} aria-label="Поиск по сайту (⌘K)" title="Поиск ⌘K" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
        <Search className="size-4" aria-hidden />
      </a>
    </>
  );
}
