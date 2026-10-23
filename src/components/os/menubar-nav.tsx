"use client";

// Меню слева от логотипа — как строка меню macOS. «Направления» — выпадающее меню.
// На главной пункты открывают окна рабочего стола, на других страницах — обычные ссылки.
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

const isOS = () => typeof window !== "undefined" && (window as unknown as { __hvalaOS?: boolean }).__hvalaOS && matchMedia("(min-width: 1024px)").matches;
function openOr(e: React.MouseEvent, id: string) {
  if (!isOS()) return;
  e.preventDefault();
  dispatchEvent(new CustomEvent("hvala:open", { detail: { id } }));
}

export function MenubarNav() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (!open) return;
    const off = (e: Event) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); box.current?.querySelector("button")?.focus(); } };
    addEventListener("pointerdown", off); addEventListener("keydown", esc);
    return () => { removeEventListener("pointerdown", off); removeEventListener("keydown", esc); };
  }, [open]);
  const item = "rounded-md px-2.5 py-1 text-[13px] font-medium text-foreground/80 hover:bg-foreground/[.06] hover:text-foreground";
  return (
    <nav aria-label="Основное меню" className="hidden md:block">
      <ul className="flex items-center gap-0.5">
        <li ref={box} className="relative">
          <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)} className={cn(item, "inline-flex items-center gap-1", open && "bg-foreground/[.08] text-foreground")}>
            Направления<ChevronDown className="size-3.5 opacity-60" aria-hidden />
          </button>
          {open && (
            <ul className="window absolute left-0 top-[calc(100%+6px)] z-50 w-64 p-1.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <a href={`/services/${s.slug}/`} onClick={(e) => { setOpen(false); openOr(e, `page:${s.slug}`); }} className="block rounded-md px-2.5 py-1.5 hover:bg-primary hover:text-primary-foreground">{s.title}</a>
                </li>
              ))}
              <li aria-hidden className="my-1 h-px bg-border" />
              <li><a href="/services/" className="block rounded-md px-2.5 py-1.5 hover:bg-primary hover:text-primary-foreground">Все направления</a></li>
            </ul>
          )}
        </li>
        <li><a href="/about/" onClick={(e) => openOr(e, "page:about")} className={item}>О компании</a></li>
        <li><a href="/contacts/" onClick={(e) => openOr(e, "page:contacts")} className={item}>Контакты</a></li>
      </ul>
    </nav>
  );
}
