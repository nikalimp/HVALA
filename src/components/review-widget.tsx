import { MapPin, Star } from "lucide-react";

// Виджет отзывов 2ГИС: рейтинг, звёзды, число отзывов, ссылки на отзывы и на форму отзыва.
// Данные статичные (2ГИС, снято 23.10.2026); живой виджет 2ГИС — по коду из кабинета 2ГИС (задача в 05-tasks.md).
export function ReviewWidget({ rating, count, name, address, href }: { rating: string; count: string; name: string; address: string; href: string }) {
  const value = Number(rating.replace(",", "."));
  return (
    <div className="grid gap-6 rounded-2xl border bg-background p-6 sm:grid-cols-2 sm:gap-10 sm:p-8">
      <div>
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-success px-2 py-0.5 text-sm font-bold text-background">2ГИС</span>
        <span className="text-xs text-muted-foreground">отзывы клиентов</span>
      </div>
      <p className="mt-5 text-5xl font-semibold leading-none tracking-tight tabular-nums">{rating}</p>
      <p className="mt-2 flex gap-0.5" aria-label={`Рейтинг ${rating} из 5`}>
        {[1, 2, 3, 4, 5].map((i) => <Star key={i} aria-hidden className={i <= Math.round(value) ? "size-5 fill-[var(--star)] text-[var(--star)]" : "size-5 text-border"} />)}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{count}</p>
      </div>
      <div className="flex flex-col justify-between border-t pt-5 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0">
      <p className="flex items-start gap-2 text-sm"><MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden /><span><span className="font-medium">{name}</span><br /><span className="text-muted-foreground">{address}</span></span></p>
      <div className="mt-5 flex flex-wrap gap-2">
        <a href={`${href}/tab/reviews`} target="_blank" rel="noopener" className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">Читать отзывы</a>
        <a href={`${href}/tab/reviews/addreview`} target="_blank" rel="noopener" className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent">Оставить отзыв</a>
      </div>
      </div>
    </div>
  );
}
