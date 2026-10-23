"use client";

// Правая часть строки меню: поиск (⌘K), демо Wi-Fi, дата и часы.
// На главной открывает приложения рабочего стола (событие hvala:open), на других страницах ведёт на /#app-<id>.
import { useEffect, useState } from "react";
import { Search, Wifi } from "lucide-react";

function openApp(id: string) {
  if ((window as unknown as { __hvalaOS?: boolean }).__hvalaOS) dispatchEvent(new CustomEvent("hvala:open", { detail: { id } }));
  else location.href = `/#app-${id}`;
}

export function MenubarExtras() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 20_000);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !(window as unknown as { __hvalaOS?: boolean }).__hvalaOS) { e.preventDefault(); openApp("spotlight"); }
    };
    addEventListener("keydown", onKey);
    return () => { clearInterval(t); removeEventListener("keydown", onKey); };
  }, []);
  return (
    <>
      <a href="/#app-wifi" onClick={(e) => { e.preventDefault(); openApp("wifi"); }} aria-label="Демо: Wi-Fi гостя" title="Демо Wi-Fi гостя" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
        <Wifi className="size-4" aria-hidden />
      </a>
      <a href="/#app-spotlight" onClick={(e) => { e.preventDefault(); openApp("spotlight"); }} aria-label="Поиск по сайту (⌘K)" title="Поиск ⌘K" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
        <Search className="size-4" aria-hidden />
      </a>
      <span className="hidden min-w-[3rem] px-1.5 text-right text-[13px] font-medium tabular-nums text-foreground/80 lg:inline" suppressHydrationWarning>
        {now ? now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : ""}
      </span>
    </>
  );
}
