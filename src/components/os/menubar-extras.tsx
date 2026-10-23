"use client";

// Правая часть строки меню: демо Wi‑Fi и поиск (⌘K). Часы — отдельно, правее переключателя темы (menubar-clock).
// Демо и поиск — попапы на текущей странице (overlay-host). ⌘K тоже обрабатывает overlay-host.
import { Search, Wifi } from "lucide-react";

export function MenubarExtras() {
  return (
    <>
      <a href="/services/guest-wifi/" data-os-app="wifi" aria-label="Демо: Wi-Fi гостя" title="Демо Wi-Fi гостя" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
        <Wifi className="size-4" aria-hidden />
      </a>
      <a href="/services/" data-os-app="spotlight" aria-label="Поиск по сайту (⌘K)" title="Поиск ⌘K" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
        <Search className="size-4" aria-hidden />
      </a>
    </>
  );
}
