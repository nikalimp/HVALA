"use client";

// Анимированный битмап — фирменный эффект HVALA (пиксельный логотип → пиксельный фон).
// Поле синусоид + упорядоченный дизеринг Байера 4×4, 1 бит на клетку, цвет — токен --brand-vivid.
// Дёшево: холст в N раз меньше экрана (клетка cell px), ~12 кадров в секунду, пауза вне экрана и во вкладке в фоне.
// prefers-reduced-motion — один неподвижный кадр. Декор: aria-hidden, текст поверх читается без него.

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export function Bitmap({
  className,
  cell = 6,
  alpha = 0.22,
  density = 0.55,
  speed = 1,
  variant = "waves",
}: {
  className?: string;
  cell?: number;
  alpha?: number;
  density?: number; // 0…1 — сколько клеток «горит»
  speed?: number;
  variant?: "waves" | "rain" | "ripple";
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, img: ImageData | null = null, raf = 0, last = 0, visible = true;
    let rgb = [255, 28, 53];
    const t0 = performance.now() - Math.random() * 10_000;

    const readColor = () => {
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return;
      probe.fillStyle = getComputedStyle(cv).getPropertyValue("--brand-vivid").trim() || "#ff1c35";
      probe.fillRect(0, 0, 1, 1);
      const d = probe.getImageData(0, 0, 1, 1).data;
      rgb = [d[0], d[1], d[2]];
    };
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(1, Math.ceil(r.width / cell));
      h = Math.max(1, Math.ceil(r.height / cell));
      cv.width = w; cv.height = h;
      img = ctx.createImageData(w, h);
      draw(performance.now());
    };
    const A = Math.round(alpha * 255);
    const draw = (now: number) => {
      if (!img) return;
      const t = ((now - t0) / 1000) * speed;
      const px = img.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let v: number;
          if (variant === "rain") {
            v = 0.5 + 0.5 * Math.sin(y * 0.22 - t * 2.2 + Math.sin(x * 1.7) * 6) * Math.sin(x * 0.9 + t * 0.3);
          } else if (variant === "ripple") {
            const dx = x - w * 0.8, dy = y - h * 0.2;
            v = 0.5 + 0.5 * Math.sin(Math.sqrt(dx * dx + dy * dy) * 0.35 - t * 1.6);
          } else {
            v = 0.5 + 0.25 * Math.sin(x * 0.07 + t * 0.55) + 0.25 * Math.cos(y * 0.09 - t * 0.4) * Math.sin((x + y) * 0.035 + t * 0.25);
          }
          const on = v * density * 1.6 > BAYER[(y & 3) * 4 + (x & 3)];
          const i = (y * w + x) * 4;
          px[i] = rgb[0]; px[i + 1] = rgb[1]; px[i + 2] = rgb[2]; px[i + 3] = on ? A : 0;
        }
      }
      ctx.putImageData(img, 0, 0);
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 80) return;
      last = now;
      draw(now);
    };

    readColor();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);
    const mo = new MutationObserver(() => { readColor(); draw(performance.now()); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    if (!still) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect(); };
  }, [cell, alpha, density, speed, variant]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 size-full [image-rendering:pixelated]", className)} />;
}
