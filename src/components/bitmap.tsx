"use client";

// Анимированный битмап — фирменный эффект HVALA (пиксельный логотип → пиксельный фон).
// Поле синусоид + упорядоченный дизеринг Байера 4×4, 1 бит на клетку, цвет — токен --brand-vivid.
// Дёшево: холст в N раз меньше экрана (клетка cell px), ~12 кадров в секунду, пауза вне экрана и во вкладке в фоне.
// prefers-reduced-motion — один неподвижный кадр. Декор: aria-hidden, текст поверх читается без него.
//
// Обои рабочего стола (interactive + logo):
//   logo — по центру крупно «HVALA» пикселями, буквы мерцают;
//   курсор над пустым фоном «проявляет» узор вокруг себя; над окном, иконкой или виджетом — нет (isBackground);
//   клик по пустому фону запускает волну, которая расходится кольцом.

import { useEffect, useRef } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/components/logo";
import { cn } from "@/lib/utils";

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export function Bitmap({
  className,
  cell = 6,
  alpha = 0.22,
  density = 0.55,
  speed = 1,
  variant = "waves",
  interactive = false,
  logo = false,
  isBackground,
}: {
  className?: string;
  cell?: number;
  alpha?: number;
  density?: number; // 0…1 — сколько клеток «горит»
  speed?: number;
  variant?: "waves" | "rain" | "ripple";
  interactive?: boolean;
  logo?: boolean;
  isBackground?: (el: Element) => boolean; // по умолчанию фоном считается всё
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef(isBackground);
  bgRef.current = isBackground;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, img: ImageData | null = null, raf = 0, last = 0, visible = true;
    let rgb = [255, 28, 53];
    let mask: Uint8Array | null = null;
    const t0 = performance.now() - Math.random() * 10_000;
    const now = () => ((performance.now() - t0) / 1000) * speed;
    const onBg = (e: Event) => { const el = e.target as Element | null; return !!el && (bgRef.current ? bgRef.current(el) : true); };

    // След курсора: energy — сила, затухает, когда мышь стоит или ушла на объект
    let mx = -1e4, my = -1e4, energy = 0;
    const toCells = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / cell, (e.clientY - r.top) / cell]; };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !onBg(e)) return;
      [mx, my] = toCells(e);
      energy = 1;
    };
    // Волны от клика: кольцо расходится ~3 с
    const waves: { x: number; y: number; t: number }[] = [];
    const onDown = (e: PointerEvent) => {
      if (!onBg(e)) return;
      const [x, y] = toCells(e);
      if (x < 0 || y < 0 || x > w || y > h) return;
      waves.push({ x, y, t: now() });
      if (waves.length > 6) waves.shift();
    };

    const readColor = () => {
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return;
      probe.fillStyle = getComputedStyle(cv).getPropertyValue("--brand-vivid").trim() || "#ff1c35";
      probe.fillRect(0, 0, 1, 1);
      const d = probe.getImageData(0, 0, 1, 1).data;
      rgb = [d[0], d[1], d[2]];
    };
    // Маска названия: логотип рисуется в холст размером с сетку клеток — половина ширины, по центру свободной зоны
    // между иконками слева и виджетами справа (центр — 45% ширины)
    const buildMask = () => {
      if (!logo) { mask = null; return; }
      const m = document.createElement("canvas");
      m.width = w; m.height = h;
      const c = m.getContext("2d");
      if (!c) return;
      const [vx, vy, vw, vh] = LOGO_VIEWBOX;
      const scale = Math.min((w * 0.5) / vw, (h * 0.34) / vh);
      c.translate(w * 0.45 - (vw * scale) / 2 - vx * scale, (h - vh * scale) / 2 - vy * scale);
      c.scale(scale, scale);
      c.fillStyle = "#000";
      for (const d of LOGO_PATHS) c.fill(new Path2D(d));
      const a = c.getImageData(0, 0, w, h).data;
      mask = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) mask[i] = a[i * 4 + 3] > 110 ? 1 : 0;
    };
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(1, Math.ceil(r.width / cell));
      h = Math.max(1, Math.ceil(r.height / cell));
      cv.width = w; cv.height = h;
      img = ctx.createImageData(w, h);
      buildMask();
      draw();
    };
    const A = Math.round(alpha * 255);
    const AL = Math.min(255, Math.round(alpha * 255 * 2.4)); // буквы плотнее фона
    const draw = () => {
      if (!img) return;
      const t = now();
      while (waves.length && t - waves[0].t > 3.2) waves.shift();
      const px = img.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const k = y * w + x;
          let v: number;
          if (variant === "rain") {
            v = 0.5 + 0.5 * Math.sin(y * 0.22 - t * 2.2 + Math.sin(x * 1.7) * 6) * Math.sin(x * 0.9 + t * 0.3);
          } else if (variant === "ripple") {
            const dx = x - w * 0.8, dy = y - h * 0.2;
            v = 0.5 + 0.5 * Math.sin(Math.sqrt(dx * dx + dy * dy) * 0.35 - t * 1.6);
          } else {
            v = 0.5 + 0.25 * Math.sin(x * 0.07 + t * 0.55) + 0.25 * Math.cos(y * 0.09 - t * 0.4) * Math.sin((x + y) * 0.035 + t * 0.25);
          }
          if (interactive && energy > 0.01) {
            const dx = x - mx, dy = y - my, d = Math.sqrt(dx * dx + dy * dy);
            v += energy * (1.1 * Math.exp(-(d * d) / 90) + 0.35 * Math.exp(-d / 26) * Math.sin(d * 0.55 - t * 6));
          }
          for (const wv of waves) {
            const age = t - wv.t, rad = age * 38, dx = x - wv.x, dy = y - wv.y;
            const d = Math.sqrt(dx * dx + dy * dy) - rad;
            v += 1.3 * Math.exp(-(d * d) / 18) * (1 - age / 3.2);
          }
          const inLogo = mask !== null && mask[k] === 1;
          if (inLogo) v = 0.62 + 0.3 * Math.sin(t * 1.8 + x * 0.21 - y * 0.13) + (v - 0.5) * 0.4;
          const on = v * (inLogo ? 1 : density * 1.6) > BAYER[(y & 3) * 4 + (x & 3)];
          const i = k * 4;
          px[i] = rgb[0]; px[i + 1] = rgb[1]; px[i + 2] = rgb[2]; px[i + 3] = on ? (inLogo ? AL : A) : 0;
        }
      }
      ctx.putImageData(img, 0, 0);
      energy *= 0.97;
    };
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const busy = energy > 0.05 || waves.length > 0;
      if (!visible || document.hidden || ts - last < (busy ? 33 : 80)) return;
      last = ts;
      draw();
    };

    readColor();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);
    const mo = new MutationObserver(() => { readColor(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    if (interactive && !still) {
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("pointerdown", onDown, { passive: true });
    }
    if (!still) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect();
      removeEventListener("pointermove", onMove); removeEventListener("pointerdown", onDown);
    };
  }, [cell, alpha, density, speed, variant, interactive, logo]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 size-full [image-rendering:pixelated]", className)} />;
}
