"use client";

// Прирост цифры: число в строке («6,7%», «+59 607 ₽», «13 862») растёт от 0 до значения, когда карточка входит в экран.
// В HTML сразу итоговое значение (поиск, нейросети, без JavaScript). prefers-reduced-motion — без анимации.
import { useEffect, useRef, useState } from "react";

const NUM = /\d[\d\s  ⁠]*(?:[.,]\d+)?/;

export function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  useEffect(() => {
    const m = value.match(NUM);
    const el = ref.current;
    if (!m || !el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raw = m[0], dec = raw.match(/[.,](\d+)$/)?.[1].length ?? 0, sep = raw.match(/[.,]/)?.[0] ?? ",";
    const target = Number(raw.replace(/[\s  ⁠]/g, "").replace(",", "."));
    const grouped = /[\s  ]/.test(raw.replace(/[.,]\d+$/, ""));
    const fmt = (n: number) => {
      let [int, frac] = n.toFixed(dec).split(".");
      if (grouped) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return value.replace(raw, frac ? `${int}${sep}${frac}` : int);
    };
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return; // уже на экране при загрузке — не дёргаем
    setText(fmt(0));
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration), k = 1 - Math.pow(1 - p, 3);
        setText(p < 1 ? fmt(target * k) : value);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref}>{text}</span>;
}
