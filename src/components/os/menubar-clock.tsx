"use client";

// Часы в строке меню — правее переключателя темы, как в macOS
import { useEffect, useState } from "react";

export function MenubarClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 20_000); return () => clearInterval(t); }, []);
  return (
    <span className="hidden min-w-[3rem] px-1.5 text-right text-[13px] font-medium tabular-nums text-foreground/80 lg:inline" suppressHydrationWarning>
      {now ? now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : ""}
    </span>
  );
}
