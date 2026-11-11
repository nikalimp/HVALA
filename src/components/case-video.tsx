"use client";

// Видео креатива кампании (с hvalamobile.com, перекодировано в MP4 H.264 и лежит в public/media). Грузится и играет, только когда карточка на экране:
// на странице кейсов их много, а внешние файлы тяжёлые. prefers-reduced-motion — без автозапуска, с кнопками.
import { useEffect, useRef, useState } from "react";

export function CaseVideo({ src, label, className, fallback }: { src: string; label: string; className?: string; fallback?: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  const [failed, setFailed] = useState(false); // браузер не смог проиграть файл (например, .MOV в HEVC) — показываем запасной вариант
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
  if (failed && fallback) return <>{fallback}</>;
  return (
    <video
      onError={() => setFailed(true)}
      ref={ref}
      src={still ? src : undefined}
      poster={src.replace(/\.mp4$/, ".jpg")}
      muted loop playsInline preload="none" controls={still}
      aria-label={label}
      className={className ?? "aspect-[4/5] w-full rounded-xl bg-muted object-cover"}
    />
  );
}
