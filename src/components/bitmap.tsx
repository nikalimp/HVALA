"use client";

// Анимированный битмап — фирменный эффект HVALA (пиксельный логотип → пиксельный фон).
// Поле синусоид + упорядоченный дизеринг Байера 4×4, 1 бит на клетку, цвет — токен --brand-vivid.
// Дёшево: холст в N раз меньше экрана (клетка cell px), ~12 кадров в секунду, пауза вне экрана и во вкладке в фоне.
// prefers-reduced-motion — один неподвижный кадр. Декор: aria-hidden, текст поверх читается без него.
//
// Обои рабочего стола (interactive + logo):
//   logo — по центру крупно «HVALA» пикселями, буквы мерцают; логотип — «тело»: курсор и волны его отталкивают,
//          он отскакивает от краёв и пружиной возвращается в центр; узор фона вокруг букв расступается;
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
    // Логотип — «тело»: маска размером с логотип (lw×lh клеток), позиция lx,ly (левый верхний угол), скорость lvx,lvy.
    // Стоит в центре; курсор и волны от клика отталкивают его, от краёв холста он отскакивает, пружина возвращает в центр.
    // halo — кольцо в 2 клетки вокруг букв: узор фона там расступается.
    let mask: Uint8Array | null = null, halo: Uint8Array | null = null;
    let lw = 0, lh = 0, lx = 0, ly = 0, lvx = 0, lvy = 0, lastT = 0;
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
      if (mask) { // волна толкает логотип от точки клика
        const dx = lx + lw / 2 - x, dy = ly + lh / 2 - y, n = Math.hypot(dx, dy) || 1;
        const k = 300 / (1 + n / 30);
        lvx += (dx / n) * k; lvy += (dy / n) * k;
      }
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
    // Маска названия: логотип в клетках — половина ширины холста, старт — точно по центру
    const buildMask = () => {
      if (!logo) { mask = null; halo = null; return; }
      const [vx, vy, vw, vh] = LOGO_VIEWBOX;
      const scale = Math.min((w * 0.5) / vw, (h * 0.34) / vh);
      lw = Math.max(1, Math.ceil(vw * scale)); lh = Math.max(1, Math.ceil(vh * scale));
      const m = document.createElement("canvas");
      m.width = lw; m.height = lh;
      const c = m.getContext("2d");
      if (!c) return;
      c.scale(scale, scale);
      c.translate(-vx, -vy);
      c.fillStyle = "#000";
      for (const d of LOGO_PATHS) c.fill(new Path2D(d));
      const a = c.getImageData(0, 0, lw, lh).data;
      mask = new Uint8Array(lw * lh);
      for (let i = 0; i < lw * lh; i++) mask[i] = a[i * 4 + 3] > 110 ? 1 : 0;
      // halo: клетки рядом с буквами (радиус 2), но не сами буквы
      halo = new Uint8Array(lw * lh);
      for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
        if (mask[y * lw + x]) continue;
        let near = 0;
        for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < lw && yy < lh && mask[yy * lw + xx]) { near = 1; break; }
        }
        halo[y * lw + x] = near;
      }
      lx = (w - lw) / 2; ly = (h - lh) / 2; lvx = 0; lvy = 0;
    };
    const step = (t: number) => {
      if (!mask) return;
      const dt = Math.min(0.1, Math.max(0, t - lastT)); lastT = t;
      const cx = lx + lw / 2, cy = ly + lh / 2;
      let ax = ((w - lw) / 2 - lx) * 2.4, ay = ((h - lh) / 2 - ly) * 2.4; // пружина к центру
      if (interactive && energy > 0.05) { // курсор рядом — отталкивает
        const dx = cx - mx, dy = cy - my, d = Math.hypot(dx / (lw / 2 + 12), dy / (lh / 2 + 12));
        if (d < 1.4) { const f = (1.4 - d) * 160 * energy; const n = Math.hypot(dx, dy) || 1; ax += (dx / n) * f; ay += (dy / n) * f; }
      }
      lvx = (lvx + ax * dt) * Math.pow(0.12, dt); lvy = (lvy + ay * dt) * Math.pow(0.12, dt); // затухание
      lx += lvx * dt; ly += lvy * dt;
      if (lx < 0) { lx = 0; lvx = Math.abs(lvx) * 0.8; } if (lx + lw > w) { lx = w - lw; lvx = -Math.abs(lvx) * 0.8; }
      if (ly < 0) { ly = 0; lvy = Math.abs(lvy) * 0.8; } if (ly + lh > h) { ly = h - lh; lvy = -Math.abs(lvy) * 0.8; }
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
      step(t);
      const ox = Math.round(lx), oy = Math.round(ly);
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
          const mx2 = x - ox, my2 = y - oy;
          const inBox = mask !== null && mx2 >= 0 && my2 >= 0 && mx2 < lw && my2 < lh;
          const inLogo = inBox && mask![my2 * lw + mx2] === 1;
          if (inBox && !inLogo && halo![my2 * lw + mx2]) v *= 0.15; // фон расступается вокруг букв
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
      const busy = energy > 0.05 || waves.length > 0 || Math.abs(lvx) + Math.abs(lvy) > 0.5;
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
