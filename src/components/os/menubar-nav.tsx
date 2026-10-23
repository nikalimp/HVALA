"use client";

// Меню слева от логотипа — как строка меню macOS: О компании, Направления ▾, Кейсы, Блог, Контакты.
// Все пункты — обычные ссылки на страницы сайта (решение Ника 23.10.2026: из шапки — страницы, не окна).
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const menus = [
  {
    label: "Направления",
    items: services.map((s) => ({ href: `/services/${s.slug}/`, label: s.title })),
    all: { href: "/services/", label: "Все направления" },
  },
];
const linksAfter = [
  { href: "/cases/", label: "Кейсы" },
  ...(site.features.blog ? [{ href: "/blog/", label: "Блог" }] : []),
  { href: "/contacts/", label: "Контакты" },
];

export function MenubarNav() {
  const [open, setOpen] = useState<string | null>(null);
  const box = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!open) return;
    const off = (e: Event) => { if (!box.current?.contains(e.target as Node)) setOpen(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    addEventListener("pointerdown", off); addEventListener("keydown", esc);
    return () => { removeEventListener("pointerdown", off); removeEventListener("keydown", esc); };
  }, [open]);
  const item = "rounded-md px-2.5 py-1 text-[13px] font-medium text-foreground/80 hover:bg-foreground/[.06] hover:text-foreground";
  return (
    <nav aria-label="Основное меню" className="hidden md:block">
      <ul ref={box} className="flex items-center gap-0.5">
        <li><a href="/about/" className={item}>О компании</a></li>
        {menus.map((m) => (
          <li key={m.label} className="relative">
            <button type="button" aria-expanded={open === m.label} aria-haspopup="true" onClick={() => setOpen((o) => (o === m.label ? null : m.label))} onMouseEnter={() => open && setOpen(m.label)} className={cn(item, "inline-flex items-center gap-1", open === m.label && "bg-foreground/[.08] text-foreground")}>
              {m.label}<ChevronDown className="size-3.5 opacity-60" aria-hidden />
            </button>
            {open === m.label && (
              <ul className="window absolute left-0 top-[calc(100%+6px)] z-50 w-64 p-1.5 text-sm">
                {m.items.map((i) => (
                  <li key={i.href}><a href={i.href} onClick={() => setOpen(null)} className="block rounded-md px-2.5 py-1.5 hover:bg-primary hover:text-primary-foreground">{i.label}</a></li>
                ))}
                <li aria-hidden className="my-1 h-px bg-border" />
                <li><a href={m.all.href} onClick={() => setOpen(null)} className="block rounded-md px-2.5 py-1.5 hover:bg-primary hover:text-primary-foreground">{m.all.label}</a></li>
              </ul>
            )}
          </li>
        ))}
        {linksAfter.map((l) => <li key={l.href}><a href={l.href} className={item}>{l.label}</a></li>)}
      </ul>
    </nav>
  );
}
