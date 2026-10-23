"use client";

// Видео креатива кампании (с hvalamobile.com). Грузится и играет, только когда карточка на экране:
// на странице кейсов их много, а внешние файлы тяжёлые. prefers-reduced-motion — без автозапуска, с кнопками.
import { useEffect, useRef, useState } from "react";

export function CaseVideo({ src, label }: { src: string; label: string }) {
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
      className="aspect-[9/16] w-full rounded-[0.9rem] border-[3px] border-desktop-ink bg-muted object-cover"
    />
  );
}
