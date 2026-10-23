// Виджеты справа на рабочем столе: квадратные плитки 2 × 3 — иконка сверху, крупно цифра, ниже подпись.
// Цифры — как на hvalawifi.ru/4u и hvalamobile.com (decisions.md), рейтинг — 2ГИС.
import { CalendarDays, MapPin, Megaphone, Star, Store, Users, type LucideIcon } from "lucide-react";
import { site } from "@/content/site";

const icons: LucideIcon[] = [CalendarDays, MapPin, Store, Users];
const tiles = [
  ...site.stats.map((s, i) => ({ value: s.value, label: s.label, Icon: icons[i] })),
  { value: "500+", label: "рекламодателей", Icon: Megaphone },
  { value: "5,0", label: "рейтинг в 2ГИС", Icon: Star },
];

export function StatsWidgets() {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {tiles.map(({ value, label, Icon }) => (
        <li key={label} className="flex aspect-square flex-col rounded-[1.4rem] border bg-background/80 p-3.5 backdrop-blur-xl">
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand-bg text-brand"><Icon className="size-4" strokeWidth={2} aria-hidden /></span>
          <span className="mt-auto text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums">{value}</span>
          <span className="mt-1.5 text-xs leading-tight text-muted-foreground">{label}</span>
        </li>
      ))}
    </ul>
  );
}
