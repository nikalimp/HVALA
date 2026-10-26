import Link from "next/link";
import { Check, MapPin, RefreshCw, Smartphone, Store, Users, Wallet, type LucideIcon } from "lucide-react";
import { cases, formats } from "@/content/os";
import { FormatTabs } from "@/components/format-tabs";
import { CaseCard } from "@/components/case-card";
import { LogoMarquee } from "@/components/logo-marquee";
import { ReviewWidget } from "@/components/review-widget";
import { TwoGisReviews } from "@/components/twogis-reviews";

const targetingIcons: Record<string, LucideIcon> = { geo: MapPin, venue: Store, people: Users, income: Wallet, os: Smartphone, freq: RefreshCw };
import { home } from "@/content/home";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Container, Eyebrow, Section } from "@/components/container";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/faq";
import { Cta } from "@/components/cta";
import { Bitmap } from "@/components/bitmap";
import { cn } from "@/lib/utils";
import { DesktopShell } from "@/components/os/desktop-shell";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph } from "@/lib/schema";

// Блоки главной — по specs/02-spec.md, §5: рабочий стол, затем стандартные секции.
export default function Home() {
  return (
    <>
      <JsonLd data={graph(home.faq.length > 0 && faqSchema(home.faq))} />

      <DesktopShell />

      <Section id="after-desktop" className="scroll-mt-14 border-t bg-card">
        <Container>
          <Eyebrow>Для заведений</Eyebrow>
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">Каждое подключение — новый контакт</h2>
          {/* 4 этапа на одной линии: точки-номера соединены линией (на телефоне — вертикально) */}
          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-border lg:bottom-auto lg:left-4 lg:right-4 lg:top-4 lg:h-px lg:w-auto" />
            {home.venueSteps.map((s, i) => (
              <li key={s.title} className="relative pl-12 lg:pl-0 lg:pt-14">
                <span className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground ring-4 ring-card">{i + 1}</span>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <h3 className="mb-5 mt-14 text-xl font-semibold tracking-tight">10 инструментов на странице входа</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {home.tools.map((t) => (
              <li key={t.title} className="rounded-xl border bg-background p-4">
                <p className="font-medium">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ul>
          <h3 className="mb-6 mt-14 text-xl font-semibold tracking-tight">Нам доверяют</h3>
          <LogoMarquee items={home.clients} />
          <p className="mt-8 text-sm text-muted-foreground">
            О нас писали:{" "}
            {home.press.map((p, i) => (
              <span key={p.name}>{i > 0 && ", "}<a href={p.href} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-foreground">{p.name}</a></span>
            ))}
          </p>
        </Container>
      </Section>

      <Section id="tariffs" className="border-t">
        <Container>
          <Eyebrow>Тарифы Wi-Fi</Eyebrow>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">Платёж в ваших руках</h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">Подключение — от 2 рабочих дней. Выберите модель оплаты: разовый платёж или подписку без сторонней рекламы.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {home.tariffs.map((t) => (
              <div key={t.name} className={cn("flex flex-col rounded-2xl border p-6 sm:p-8", "featured" in t && t.featured && "border-2 border-primary bg-brand-bg shadow-lg shadow-primary/10")}>
                <h3 className="flex items-center justify-between gap-3 font-semibold">{t.name}{"badge" in t && t.badge && <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">{t.badge}</span>}</h3>
                <p className="mt-4 text-4xl font-semibold tracking-tight tabular-nums">{t.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.note}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{p}</li>
                  ))}
                </ul>
                <Button asChild size="lg" variant={"featured" in t && t.featured ? "default" : "outline"} className="mt-8"><a href={site.cta.href} data-os-app="mail" data-os-payload={services[0].title}>Получить консультацию</a></Button>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="relative isolate overflow-hidden border-t bg-card">
        <Bitmap alpha={0.14} density={0.5} className="[mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <Container>
          <Eyebrow>Для рекламодателей</Eyebrow>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">Реклама в момент подключения к Wi-Fi</h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">HVALA mobile показывает баннер бренда на весь экран, когда человек подключается к Wi-Fi в заведении. На экране только один баннер, и его видят.</p>
          <dl className="grid grid-cols-2 gap-6 border-y py-6 sm:grid-cols-4">
            {home.network.stats.map((s) => (
              <div key={s.label}>
                <dd className="text-3xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
                <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
          <h3 className="mb-4 mt-10 text-xl font-semibold tracking-tight">Таргетинги: кому показать рекламу</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {home.network.targeting.map((t) => {
              const Icon = targetingIcons[t.icon];
              return (
                <li key={t.title} className="flex gap-4 rounded-xl border bg-background p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-bg text-brand"><Icon className="size-5" aria-hidden /></span>
                  <span>
                    <span className="block font-medium">{t.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{t.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline"><a href="#formats">Форматы с примерами</a></Button>
            <Button asChild variant="ghost"><Link href="/services/advertising/">Подробнее о сети</Link></Button>
          </div>
        </Container>
      </Section>

      <Section id="formats" className="scroll-mt-14 border-t">
        <Container>
          <Eyebrow>Форматы</Eyebrow>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">4 формата рекламы в Wi-Fi</h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">Все форматы показываются на весь экран в момент подключения к Wi-Fi. Оплата — за тысячу показов (CPM), медиаплан рассчитываем по запросу.</p>
          <FormatTabs items={formats} />
          <Button asChild size="lg" className="mt-8"><a href={site.cta.href} data-os-app="mail" data-os-payload="Реклама в Wi-Fi">Рассчитать медиаплан</a></Button>
        </Container>
      </Section>

      <Section id="cases" className="border-t">
        <Container>
          <Eyebrow>Кейсы</Eyebrow>
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">Результаты клиентов в цифрах</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {home.caseIds.map((id) => cases.find((c) => c.id === id)!).map((c) => <li key={c.id} className="flex"><CaseCard c={c.id === "akadem" ? { ...c, video: undefined } : c} showGroup className="w-full" /></li>)}
          </ul>
          <Button asChild variant="outline" className="mt-8"><Link href="/cases/">Все кейсы</Link></Button>
        </Container>
      </Section>

      <Section id="reviews" className="border-t bg-card">
        <Container className="max-w-3xl">
          <Eyebrow className="text-center">Отзывы</Eyebrow>
          <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">Что говорят клиенты</h2>
          {home.rating.widget.orgId ? (
            <>
              <TwoGisReviews orgId={home.rating.widget.orgId} branchId={home.rating.widget.branchId} title="Отзывы о HVALA в 2ГИС" className="block h-[824px] w-full rounded-2xl border bg-background" />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Рейтинг {home.rating.value} · {home.rating.count} ·{" "}
                <a href={`${home.rating.href}/tab/reviews/addreview`} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-foreground">Оставить отзыв в 2ГИС</a>
              </p>
            </>
          ) : (
            <ReviewWidget rating={home.rating.value} count={home.rating.count} name={home.rating.name} address={home.rating.address} href={home.rating.href} />
          )}
        </Container>
      </Section>

      <Section id="faq" className="border-t">
        <Container className="max-w-3xl">
          <Eyebrow>Вопросы</Eyebrow>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">Частые вопросы</h2>
          <FaqList items={home.faq} />
        </Container>
      </Section>

      <Cta title="Обсудим ваш проект" text="Расскажите о заведении, мероприятии или рекламной задаче. Менеджер ответит в Telegram и подберёт решение." />
    </>
  );
}
