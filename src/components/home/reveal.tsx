"use client";

// Появление блоков при прокрутке: элементы с data-reveal получают класс .in, когда входят в экран.
// Класс .rv на <html> включает скрытие (globals.css) — без JS и при prefers-reduced-motion всё видно сразу.
import { useEffect } from "react";

export function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    // То, что уже на экране, не прячем — без мигания при загрузке
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add("in");
    }
    document.documentElement.classList.add("rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    els.filter((el) => !el.classList.contains("in")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
