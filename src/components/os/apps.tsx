"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Copy, FileText, FolderOpen, LayoutGrid, List, Search, Send, Wifi } from "lucide-react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { caseGroups, caseTags, cases, formats, pageApps, trashFiles, type CaseItem } from "@/content/os";
import { AppGlyph } from "./icons";
import { ConsentCheckbox } from "@/components/consent-checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type OpenFn = (id: string, payload?: string) => void;

const tg = site.contacts.telegram;
const email = site.contacts.email;

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/* ───────── Кейсы (Finder) ───────── */
export function CasesApp({ payload }: { payload?: string }) {
  const [filter, setFilter] = useState<string>("Все кейсы");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"icons" | "list">("icons");
  const [openId, setOpenId] = useState<string | null>(payload ?? null);
  useEffect(() => { if (payload) setOpenId(payload); }, [payload]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      const inFilter = filter === "Все кейсы" || c.group === filter || c.tags.includes(filter);
      const inQuery = !q || [c.title, c.brand, c.text, ...c.metrics].join(" ").toLowerCase().includes(q);
      return inFilter && inQuery;
    });
  }, [filter, query]);
  const current = cases.find((c) => c.id === openId);
  const name = (c: CaseItem) => (c.brand ? `${c.brand}: ${c.title}` : c.title);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <button type="button" aria-label="Назад" disabled={!current} onClick={() => setOpenId(null)} className="rounded p-1 text-muted-foreground hover:bg-accent disabled:opacity-40"><ChevronLeft className="size-4" /></button>
        <button type="button" aria-label="Вперёд" disabled className="rounded p-1 text-muted-foreground opacity-40"><ChevronRight className="size-4" /></button>
        <label className="ml-1 flex flex-1 items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-sm">
          <Search className="size-3.5 text-muted-foreground" aria-hidden />
          <span className="sr-only">Поиск по кейсам</span>
          <input value={query} onChange={(e) => { setQuery(e.target.value); setOpenId(null); }} placeholder="Поиск" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
        </label>
        <div className="flex rounded-md border p-0.5" role="group" aria-label="Вид">
          <button type="button" aria-label="Иконки" aria-pressed={view === "icons"} onClick={() => setView("icons")} className={cn("rounded p-1", view === "icons" && "bg-accent")}><LayoutGrid className="size-3.5" /></button>
          <button type="button" aria-label="Список" aria-pressed={view === "list"} onClick={() => setView("list")} className={cn("rounded p-1", view === "list" && "bg-accent")}><List className="size-3.5" /></button>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 @2xl:grid-cols-[11rem_1fr]">
        <nav aria-label="Папки кейсов" className="flex gap-1 overflow-x-auto border-b bg-muted/50 p-2 text-sm @2xl:block @2xl:overflow-y-auto @2xl:border-b-0 @2xl:border-r">
          <p className="hidden px-2 pb-1 pt-1 text-[11px] font-medium text-muted-foreground @2xl:block">Избранное</p>
          {["Все кейсы", ...caseGroups].map((g) => (
            <button key={g} type="button" onClick={() => { setFilter(g); setOpenId(null); }} className={cn("flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-2 py-1 text-left @2xl:w-full", filter === g ? "bg-accent font-medium" : "hover:bg-accent/60")}>
              <FolderOpen className="size-3.5 text-brand" aria-hidden />{g}
            </button>
          ))}
          <p className="hidden px-2 pb-1 pt-3 text-[11px] font-medium text-muted-foreground @2xl:block">Теги</p>
          {caseTags.map((t, i) => (
            <button key={t} type="button" onClick={() => { setFilter(t); setOpenId(null); }} className={cn("flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-2 py-1 text-left @2xl:w-full", filter === t ? "bg-accent font-medium" : "hover:bg-accent/60")}>
              <span aria-hidden className="size-2 rounded-full" style={{ background: `color-mix(in oklch, var(--brand) ${100 - (i % 5) * 18}%, transparent)` }} />{t}
            </button>
          ))}
        </nav>
        <div className="min-h-0 overflow-y-auto p-4">
          {current ? (
            <article>
              <p className="w-fit rounded-full bg-brand-bg px-2.5 py-0.5 text-xs font-medium text-brand">{current.group}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{name(current)}</h3>
              <p className="mt-2 text-muted-foreground">{current.text}</p>
              <ul className="mt-4 space-y-1.5">
                {current.metrics.map((m) => <li key={m} className="flex gap-2 tabular-nums"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{m}</li>)}
              </ul>
              {current.video && (
                <video src={current.video} controls muted playsInline preload="none" className="mt-5 max-h-72 rounded-xl border bg-muted" aria-label={`Креатив кампании ${current.brand ?? ""}`} />
              )}
            </article>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ничего не нашлось.</p>
          ) : view === "icons" ? (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
              {list.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => setOpenId(c.id)} className="flex w-full flex-col items-center gap-1.5 rounded-lg p-2 text-center hover:bg-accent">
                    <FolderOpen className="size-10 text-brand" strokeWidth={1.25} aria-hidden />
                    <span className="text-xs font-medium leading-tight">{c.brand ?? c.title}</span>
                    <span className="text-[11px] leading-tight text-muted-foreground">{c.metrics[c.metrics.length - 1]}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted-foreground"><tr><th className="pb-2 font-medium">Кейс</th><th className="pb-2 font-medium">Раздел</th><th className="pb-2 font-medium">Результат</th></tr></thead>
              <tbody className="divide-y">
                {list.map((c) => (
                  <tr key={c.id} className="cursor-pointer hover:bg-accent" onClick={() => setOpenId(c.id)}>
                    <td className="py-2 pr-3"><button type="button" className="text-left font-medium" onClick={() => setOpenId(c.id)}>{name(c)}</button></td>
                    <td className="py-2 pr-3 text-muted-foreground">{c.group}</td>
                    <td className="py-2 tabular-nums text-muted-foreground">{c.metrics[c.metrics.length - 1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <p className="border-t px-3 py-1 text-center text-[11px] text-muted-foreground">{current ? "1 кейс" : `Объектов: ${list.length}`}</p>
    </div>
  );
}

/* ───────── Заявка (Mail) ───────── */
export function MailApp({ payload }: { payload?: string }) {
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const text = () => {
    const f = new FormData(formRef.current!);
    return [`Направление: ${f.get("direction")}`, `Имя: ${f.get("name")}`, `Телефон: ${f.get("phone")}`, "", `${f.get("message")}`].join("\n");
  };
  return (
    <form
      ref={formRef}
      className="flex h-full min-h-0 flex-col text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        location.href = `mailto:${email}?subject=${encodeURIComponent("Заявка с сайта HVALA")}&body=${encodeURIComponent(text())}`;
      }}
    >
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <Button type="submit" size="sm"><Send />Отправить письмо</Button>
        <Button
          type="button" size="sm" variant="outline"
          onClick={async () => { if (!formRef.current?.reportValidity()) return; await copy(text()); window.open(tg, "_blank", "noopener"); }}
        >Написать в Telegram</Button>
        <Button type="button" size="sm" variant="ghost" onClick={async () => { setCopied(await copy(email)); }}><Copy />{copied ? "Скопировано" : "Скопировать адрес"}</Button>
      </div>
      <div className="divide-y border-b">
        <p className="flex items-center gap-3 px-3 py-2"><span className="w-24 text-muted-foreground">Кому:</span><span className="rounded-full bg-brand-bg px-2 py-0.5 text-brand">{email}</span></p>
        <label className="flex items-center gap-3 px-3 py-2"><span className="w-24 text-muted-foreground">Имя:</span><input name="name" required autoComplete="name" className="flex-1 bg-transparent outline-none" placeholder="Как к вам обращаться" /></label>
        <label className="flex items-center gap-3 px-3 py-2"><span className="w-24 text-muted-foreground">Телефон:</span><input name="phone" type="tel" required autoComplete="tel" className="flex-1 bg-transparent outline-none" placeholder="+7" /></label>
        <label className="flex items-center gap-3 px-3 py-2">
          <span className="w-24 text-muted-foreground">Тема:</span>
          <select name="direction" defaultValue={payload ?? services[0].title} className="flex-1 bg-transparent outline-none">
            {services.map((s) => <option key={s.slug}>{s.title}</option>)}
            <option>Другое</option>
          </select>
        </label>
      </div>
      <label className="flex min-h-0 flex-1 flex-col px-3 py-2">
        <span className="sr-only">Сообщение</span>
        <textarea name="message" className="min-h-28 flex-1 resize-none bg-transparent outline-none" placeholder="Расскажите о задаче: заведение и город, мероприятие или рекламная кампания." />
      </label>
      <div className="border-t px-3 py-2"><ConsentCheckbox id="mail-consent" /></div>
      <p className="px-3 pb-2 text-xs text-muted-foreground">«Написать в Telegram» копирует текст заявки — вставьте его в чат менеджера.</p>
    </form>
  );
}

/* ───────── Созвон (Calendar) ───────── */
const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const monthGen = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
export function CalendarApp() {
  const [today] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; });
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [picked, setPicked] = useState<Date | null>(null);
  const first = (cursor.getDay() + 6) % 7;
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))];
  const label = picked ? `${picked.getDate()} ${monthGen[picked.getMonth()]}` : "";
  const msg = `Хочу созвон-демо HVALA ${label}`;
  return (
    <div className="p-4 text-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">{monthNames[cursor.getMonth()]} {cursor.getFullYear()}</p>
        <div className="flex gap-1">
          <button type="button" aria-label="Предыдущий месяц" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="rounded p-1 hover:bg-accent"><ChevronLeft className="size-4" /></button>
          <button type="button" aria-label="Следующий месяц" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="rounded p-1 hover:bg-accent"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs" role="grid" aria-label="Выбор даты созвона">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => <span key={d} className="pb-1 text-muted-foreground">{d}</span>)}
        {cells.map((d, i) =>
          d ? (
            <button
              key={i} type="button" disabled={d < today} aria-pressed={picked?.getTime() === d.getTime()} onClick={() => setPicked(d)}
              className={cn("mx-auto flex size-8 items-center justify-center rounded-full tabular-nums hover:bg-accent disabled:opacity-35",
                d.getTime() === today.getTime() && "font-semibold text-brand",
                picked?.getTime() === d.getTime() && "bg-primary text-primary-foreground hover:bg-primary")}
            >{d.getDate()}</button>
          ) : <span key={i} />
        )}
      </div>
      <p className="mt-4 flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-success" aria-hidden />Покажем, как работает HVALA для вашей задачи</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" disabled={!picked} onClick={async () => { await copy(msg); window.open(tg, "_blank", "noopener"); }}>{picked ? `Созвон ${label} — Telegram` : "Выберите дату"}</Button>
        <Button size="sm" variant="outline" disabled={!picked} asChild={!!picked}>
          {picked ? <a href={`mailto:${email}?subject=${encodeURIComponent("Созвон-демо HVALA")}&body=${encodeURIComponent(msg)}`}>Письмом</a> : <span>Письмом</span>}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Менеджер подтвердит время. Telegram: текст скопируется — вставьте его в чат.</p>
    </div>
  );
}

/* ───────── Спросить HVALA (Messages) ───────── */
const questions = [...home.faq, ...services.flatMap((s) => s.faq)].filter((f, i, a) => a.findIndex((x) => x.q === f.q) === i);
export function MessagesApp({ payload }: { payload?: string }) {
  const [log, setLog] = useState<{ me: boolean; text: string }[]>([{ me: false, text: "Здравствуйте! Это HVALA. Выберите вопрос ниже или напишите менеджеру." }]);
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const ask = (q: string) => {
    const f = questions.find((x) => x.q === q);
    setLog((l) => [...l, { me: true, text: q }, { me: false, text: f ? f.a : "Передам менеджеру." }]);
  };
  useEffect(() => { if (payload) ask(payload); }, [payload]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [log]);
  const asked = new Set(log.filter((m) => m.me).map((m) => m.text));
  return (
    <div className="flex h-full min-h-0 flex-col text-sm">
      <p className="border-b px-3 py-2 text-center text-xs text-muted-foreground">Кому: <span className="font-medium text-foreground">HVALA</span></p>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
        {log.map((m, i) => (
          <p key={i} className={cn("max-w-[85%] rounded-2xl px-3 py-2 leading-snug", m.me ? "ml-auto rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted")}>{m.text}</p>
        ))}
        <div ref={end} />
      </div>
      <div className="flex gap-1.5 overflow-x-auto border-t px-3 py-2">
        {questions.filter((q) => !asked.has(q.q)).slice(0, 8).map((q) => (
          <button key={q.q} type="button" onClick={() => ask(q.q)} className="shrink-0 rounded-full border px-2.5 py-1 text-xs hover:bg-accent">{q.q}</button>
        ))}
      </div>
      <form
        className="flex items-center gap-2 border-t px-3 py-2"
        onSubmit={async (e) => { e.preventDefault(); if (!draft.trim()) return; setLog((l) => [...l, { me: true, text: draft }, { me: false, text: "Текст скопирован — вставьте его в чат с менеджером в Telegram, он ответит." }]); await copy(draft); window.open(tg, "_blank", "noopener"); setDraft(""); }}
      >
        <label className="flex-1"><span className="sr-only">Сообщение менеджеру</span>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Сообщение менеджеру" className="w-full rounded-full border bg-background px-3 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
        </label>
        <button type="submit" aria-label="Отправить" className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Send className="size-4" /></button>
      </form>
    </div>
  );
}

/* ───────── Инструменты (Skills) ───────── */
export function ToolsApp() {
  return (
    <div className="p-4">
      <p className="mb-4 text-sm text-muted-foreground">Десять инструментов страницы входа в Wi-Fi. Все — в личном кабинете заведения.</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {home.tools.map((t) => (
          <li key={t.title} className="rounded-xl border p-3">
            <p className="font-medium">{t.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── HVALA сегодня (Now) ───────── */
export function NowApp() {
  const [d, setD] = useState<string>("");
  useEffect(() => { setD(new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })); }, []);
  return (
    <div className="min-h-full bg-note p-5 text-note-ink">
      <p className="text-xs opacity-70">{d || "Сегодня"}</p>
      <p className="mt-1 text-lg font-semibold">HVALA сегодня</p>
      <ul className="mt-3 space-y-2 text-sm">
        {[...site.stats.map((s) => `${s.value} ${s.label}`), "500+ брендов в рекламной сети", "рейтинг 5,0 в 2ГИС"].map((s) => (
          <li key={s} className="flex items-center gap-2"><span className="flex size-4 items-center justify-center rounded border border-current/40"><Check className="size-3" aria-hidden /></span>{s}</li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Форматы рекламы (Gallery) ───────── */
export function GalleryApp() {
  const [id, setId] = useState(formats[0].id);
  const f = formats.find((x) => x.id === id)!;
  return (
    <div className="grid h-full min-h-0 @2xl:grid-cols-[10rem_1fr]">
      <ul className="flex gap-1 overflow-x-auto border-b bg-muted/50 p-2 text-sm @2xl:block @2xl:border-b-0 @2xl:border-r" aria-label="Форматы">
        {formats.map((x) => (
          <li key={x.id} className="shrink-0"><button type="button" aria-pressed={x.id === id} onClick={() => setId(x.id)} className={cn("w-full whitespace-nowrap rounded-md px-2 py-1.5 text-left", x.id === id ? "bg-accent font-medium" : "hover:bg-accent/60")}>{x.title}</button></li>
        ))}
      </ul>
      <div className="grid min-h-0 gap-4 overflow-y-auto p-4 @xl:grid-cols-[12rem_1fr]">
        <video key={f.video} src={f.video} autoPlay muted loop playsInline preload="none" className="aspect-[9/16] w-full rounded-2xl border bg-muted object-cover" aria-label={`Пример формата ${f.title}`} />
        <div>
          <h3 className="text-lg font-semibold">{f.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
          <ul className="mt-3 space-y-1.5 text-sm">{f.points.map((p) => <li key={p} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{p}</li>)}</ul>
          <p className="mt-4 text-sm text-muted-foreground">Оплата — за тысячу показов. Медиаплан рассчитаем по запросу.</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── Корзина (Trash) ───────── */
export function TrashApp() {
  const [files, setFiles] = useState(trashFiles);
  return (
    <div className="p-4 text-sm">
      {files.length ? (
        <>
          <ul className="space-y-1.5">{files.map((f) => <li key={f} className="flex items-center gap-2 font-mono text-xs"><FileText className="size-4 text-muted-foreground" aria-hidden />{f}</li>)}</ul>
          <Button size="sm" className="mt-4" onClick={() => setFiles([])}>Очистить корзину</Button>
        </>
      ) : (
        <p className="py-6 text-center text-muted-foreground">Корзина пуста. С HVALA это больше не понадобится.</p>
      )}
    </div>
  );
}

/* ───────── Направления (папка) ───────── */
export function DirectionsApp({ open }: { open: OpenFn }) {
  return (
    <div className="p-4">
      <ul className="grid grid-cols-2 gap-2 @lg:grid-cols-3">
        {pageApps.filter((p) => p.href.startsWith("/services/")).map((p) => {
          const s = services.find((x) => `/services/${x.slug}/` === p.href)!;
          return (
            <li key={p.id}>
              <a href={p.href} onClick={(e) => { e.preventDefault(); open(p.id); }} className="flex h-full flex-col gap-2 rounded-xl border p-3 hover:border-brand hover:bg-accent">
                <span className="app-tile size-10"><AppGlyph icon={p.icon} className="size-5" /></span>
                <span className="font-medium leading-tight">{s.title}</span>
                <span className="text-xs text-muted-foreground">{s.short}</span>
                <span className="mt-auto text-xs font-medium">{s.prices[0]?.value}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────── Демо Wi-Fi гостя: только мокап iPhone ───────── */
export function WifiApp() {
  const [step, setStep] = useState<"login" | "online">("login");
  const [phone, setPhone] = useState("");
  const [vote, setVote] = useState<string | null>(null);
  const [card, setCard] = useState(false);
  const [sub, setSub] = useState(false);
  const [clock, setClock] = useState("");
  useEffect(() => { const f = () => setClock(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })); f(); const t = setInterval(f, 20_000); return () => clearInterval(t); }, []);
  const digits = phone.replace(/\D/g, "").replace(/^[78]/, "").slice(0, 10);
  const fmt = (d: string) => `+7 ${d.slice(0, 3)}${d.length > 3 ? ` ${d.slice(3, 6)}` : ""}${d.length > 6 ? `-${d.slice(6, 8)}` : ""}${d.length > 8 ? `-${d.slice(8, 10)}` : ""}`;
  const reset = () => { setStep("login"); setPhone(""); setVote(null); setCard(false); setSub(false); };
  return (
    <div className="flex justify-center bg-muted/50 px-6 py-6">
      {/* Корпус iPhone: рамка, Dynamic Island, строка состояния, полоска «домой» */}
      <div className="relative w-[17.5rem] rounded-[3.1rem] bg-desktop-ink p-[10px] shadow-2xl">
        <span aria-hidden className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-desktop-ink" />
        <span aria-hidden className="absolute -left-[3px] top-40 h-12 w-[3px] rounded-l bg-desktop-ink" />
        <span aria-hidden className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-desktop-ink" />
        <div className="relative flex h-[34rem] flex-col overflow-hidden rounded-[2.5rem] bg-background">
          <div aria-hidden className="flex items-center justify-between px-7 pb-1 pt-3.5 text-[12px] font-semibold tabular-nums">
            <span>{clock}</span>
            <span className="absolute left-1/2 top-2.5 h-[26px] w-[88px] -translate-x-1/2 rounded-full bg-desktop-ink" />
            <span className="flex items-center gap-1"><Wifi className="size-3.5" /><span className="h-2.5 w-5 rounded-[3px] border border-current p-[1px]"><span className="block h-full w-3/4 rounded-[1px] bg-current" /></span></span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-6">
            <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground"><Wifi className="size-3" aria-hidden />Coffee Point · Wi‑Fi</p>
            {step === "login" ? (
              <form className="mt-4 flex flex-1 flex-col" onSubmit={(e) => { e.preventDefault(); if (digits.length === 10) setStep("online"); }}>
                <div className="rounded-2xl bg-brand-bg p-4 text-center">
                  <p className="text-xs text-muted-foreground">Акция дня</p>
                  <p className="mt-1 font-semibold leading-snug">Второй капучино в подарок</p>
                </div>
                <label className="mt-5 block text-[11px] text-muted-foreground" htmlFor="demo-phone">Номер телефона</label>
                <input id="demo-phone" inputMode="tel" autoComplete="off" value={digits ? fmt(digits) : phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
                <button type="submit" disabled={digits.length !== 10} className="mt-3 w-full rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">Подключиться</button>
                <p className="mt-auto text-center text-[10px] leading-tight text-muted-foreground">Демо: номер никуда не отправляется</p>
              </form>
            ) : (
              <div className="mt-4 flex flex-1 flex-col gap-3 text-sm">
                <p className="flex items-center justify-center gap-1.5 font-semibold text-success"><Check className="size-4" aria-hidden />Вы в сети</p>
                <div className="rounded-2xl bg-brand-bg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Ваш подарок</p>
                  <p className="font-semibold">Второй капучино — 0 ₽</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Как вам у нас?</p>
                  <div className="mt-1 flex gap-1">
                    {["Отлично", "Хорошо", "Есть идеи"].map((v) => (
                      <button key={v} type="button" aria-pressed={vote === v} onClick={() => setVote(v)} className={cn("flex-1 rounded-lg border px-1 py-1.5 text-[11px]", vote === v && "border-brand bg-brand-bg")}>{v}</button>
                    ))}
                  </div>
                  {vote && <p className="mt-1 text-center text-[11px] text-muted-foreground">Спасибо за ответ!</p>}
                </div>
                <button type="button" onClick={() => setSub(true)} className="w-full rounded-xl border px-2 py-2 text-xs">{sub ? "Вы подписаны ✓" : "Подписаться на канал кофейни"}</button>
                <button type="button" onClick={() => setCard(true)} className="w-full rounded-xl bg-primary px-2 py-2 text-xs font-medium text-primary-foreground">{card ? "Карта в телефоне ✓" : "Скачать карту лояльности"}</button>
                <button type="button" onClick={reset} className="mt-auto text-center text-[11px] text-muted-foreground underline underline-offset-4">Начать заново</button>
              </div>
            )}
          </div>
          <span aria-hidden className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-desktop-ink/80" />
        </div>
      </div>
    </div>
  );
}

/* ───────── Все разделы (Launchpad) и Поиск (Spotlight) — оверлеи ───────── */
export type Entry = { id: string; label: string; hint: string; icon: string; payload?: string };

export function Launchpad({ entries, onOpen, onClose, renderIcon }: { entries: Entry[]; onOpen: (e: Entry) => void; onClose: () => void; renderIcon: (icon: string) => React.ReactNode }) {
  const [q, setQ] = useState("");
  const list = entries.filter((e) => e.label.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div role="dialog" aria-modal="true" aria-label="Все разделы" className="fixed inset-0 z-[60] overflow-y-auto bg-background/70 px-4 pb-10 pt-20 backdrop-blur-xl" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <label className="mx-auto flex max-w-xs items-center gap-2 rounded-lg border bg-background/80 px-3 py-1.5 text-sm">
        <Search className="size-4 text-muted-foreground" aria-hidden /><span className="sr-only">Поиск раздела</span>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск" className="w-full bg-transparent outline-none" />
      </label>
      <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-6 sm:grid-cols-5 lg:grid-cols-6">
        {list.map((e) => (
          <li key={e.id}>
            <button type="button" onClick={() => onOpen(e)} className="flex w-full flex-col items-center gap-2 rounded-xl p-2 text-center hover:bg-accent/60">
              <span className="app-tile size-16">{renderIcon(e.icon)}</span>
              <span className="text-xs font-medium leading-tight">{e.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Spotlight({ entries, onOpen, onClose, renderIcon }: { entries: Entry[]; onOpen: (e: Entry) => void; onClose: () => void; renderIcon: (icon: string) => React.ReactNode }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const all: Entry[] = useMemo(() => [
    ...entries,
    ...questions.map((f) => ({ id: "messages", label: f.q, hint: "Вопрос", icon: "message", payload: f.q })),
    ...cases.map((c) => ({ id: "cases", label: c.brand ? `${c.brand}: ${c.title}` : c.title, hint: `Кейс · ${c.group}`, icon: "folder", payload: c.id })),
  ], [entries]);
  const s = q.trim().toLowerCase();
  const list = (s ? all.filter((e) => e.label.toLowerCase().includes(s)) : entries).slice(0, 9);
  useEffect(() => setSel(0), [q]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Поиск по сайту" className="fixed inset-0 z-[60] bg-foreground/10 px-4 pt-[14vh] backdrop-blur-[2px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="window mx-auto max-w-xl">
        <label className="flex items-center gap-3 px-4 py-3">
          <Search className="size-5 text-muted-foreground" aria-hidden /><span className="sr-only">Поиск</span>
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск: направления, вопросы, кейсы"
            className="w-full bg-transparent text-lg outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((x) => Math.min(x + 1, list.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((x) => Math.max(x - 1, 0)); }
              if (e.key === "Enter" && list[sel]) onOpen(list[sel]);
            }}
          />
        </label>
        {list.length > 0 && (
          <ul className="max-h-[50vh] overflow-y-auto border-t p-1.5" role="listbox" aria-label="Результаты">
            {list.map((e, i) => (
              <li key={e.id + e.label} role="option" aria-selected={i === sel}>
                <button type="button" onMouseEnter={() => setSel(i)} onClick={() => onOpen(e)} className={cn("flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm", i === sel && "bg-primary text-primary-foreground")}>
                  <span className="flex size-6 items-center justify-center [&_svg]:size-4">{renderIcon(e.icon)}</span>
                  <span className="flex-1 truncate">{e.label}</span>
                  <span className={cn("text-xs", i === sel ? "text-primary-foreground/80" : "text-muted-foreground")}>{e.hint}</span>
                  {i === sel && <ArrowRight className="size-3.5" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
