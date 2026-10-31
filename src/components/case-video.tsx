"use client";

// Видео креатива кампании (с hvalamobile.com). Грузится и играет, только когда карточка на экране:
// на странице кейсов их много, а внешние файлы тяжёлые. prefers-reduced-motion — без автозапуска, с кнопками.
import { useEffect, useRef, useState } from "react";

export function CaseVideo({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.src) v.src = src; v.play().catch(() => {}); } else v.pause();
    }, { rootMargin: "120px" });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      src={still ? src : undefined}
      muted loop playsInline preload="none" controls={still}
      aria-label={label}
      className={className ?? "aspect-[4/5] w-full rounded-xl bg-muted object-cover"}
    />
  );
}
