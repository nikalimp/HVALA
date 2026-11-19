import Link from "next/link";
import { Check, MapPin, Minus, RefreshCw, Scale, Smartphone, Store, Users, Wallet, X, type LucideIcon } from "lucide-react";
import { caseGroups, cases, formats } from "@/content/os";
import { FormatTabs } from "@/components/format-tabs";
import { CaseCard } from "@/components/case-card";
import { CaseSlider } from "@/components/case-slider";
import { CountUp } from "@/components/count-up";
import { LogoMarquee } from "@/components/logo-marquee";
import { ReviewWidget } from "@/components/review-widget";
import { TwoGisReviews } from "@/components/twogis-reviews";
import { Reveal } from "@/components/home/reveal";
import { GuestPhone } from "@/components/home/guest-phone";
import { Cabinet } from "@/components/home/cabinet";
import { Tariffs } from "@/components/home/tariffs";
import { CasesBento } from "@/components/home/cases-bento";
import { ItBlock } from "@/components/home/it-block";

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

      <Reveal />

      {/* Закон — «вынужденная мера», которую HVALA превращает в маркетинг (Евгений, 12.11.2026) */}
      <Section id="after-desktop" className="scroll-mt-14 border-t">
        <Container>
          <div data-reveal>
            <Eyebrow className="flex items-center justify-center gap-2"><Scale className="size-3.5" aria-hidden />Закон о Wi-Fi</Eyebrow>
            <h2 className="mx-auto mb-3 max-w-4xl text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance">{home.law.title}</h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">{home.law.text}</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {home.law.compare.map((c, i) => {
              const good = c.tone === "good";
              const Mark = good ? Check : c.tone === "bad" ? X : Minus;
              return (
                <li key={c.title} data-reveal style={{ "--i": i * 2 } as React.CSSProperties} className={cn("relative flex flex-col rounded-2xl border p-6", good ? "border-2 border-primary bg-brand-bg shadow-lg shadow-primary/10 md:-my-3 md:py-9" : "bg-card")}>
                  <h3 className={cn("font-semibold", good && "text-brand")}>{c.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {c.points.map((p, j) => (
                      <li key={p} className={cn("flex gap-2.5 text-sm", !good && "text-muted-foreground")}><Mark className={cn("mt-0.5 size-4 shrink-0", good ? "text-brand" : "opacity-60")} aria-hidden /><span className={cn(c.tone === "bad" && "strike")} style={{ "--j": j } as React.CSSProperties}>{p}</span></li>
                    ))}
                  </ul>
                  {good && <span aria-hidden className="stamp absolute -right-2 -top-4 rounded-lg border-2 border-primary bg-background px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand shadow-sm">По закону ✓</span>}
                </li>
              );
            })}
          </ul>
          {/* Две аудитории (Евгений): управляющий и IT-специалист — каждому свой путь по странице */}
          <nav aria-label="Кому интересно" className="mt-12 flex flex-wrap justify-center gap-3" data-reveal>
            <Button asChild size="lg" className="h-12 px-6 text-base"><a href="#how">Я управляющий — что получу</a></Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base"><a href="#it">Я IT-специалист — как подключить</a></Button>
          </nav>
        </Container>
      </Section>

      <Section id="how" className="scroll-mt-14 border-t bg-card">
        <Container>
          <div data-reveal>
            <Eyebrow className="text-center">Глазами гостя</Eyebrow>
            <h2 className="mb-3 text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance">Каждое подключение — новый контакт</h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground lg:mb-0">Вот что видит гость, когда подключается к Wi‑Fi вашего заведения. Листайте — экран меняется.</p>
          </div>
          <GuestPhone />
          <h3 className="mb-5 mt-14 text-center text-xl font-semibold tracking-tight">Все 10 инструментов страницы входа</h3>
          <ul className="flex flex-wrap justify-center gap-2">
            {home.tools.map((t, i) => (
              <li key={t.title} data-reveal style={{ "--i": i } as React.CSSProperties} title={t.text} className="rounded-full border bg-background px-4 py-2 text-sm"><span className="font-medium">{t.title}</span><span className="sr-only">: {t.text}</span></li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="cabinet" className="border-t">
        <Container><Cabinet /></Container>
      </Section>

      <Section className="border-t bg-card py-12 sm:py-14">
        <Container>
          <h2 data-reveal className="mb-6 text-center text-2xl font-semibold tracking-tight">2000+ заведений уже собирают базу гостей</h2>
          <LogoMarquee items={home.clients} />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            О нас писали:{" "}
            {home.press.map((p, i) => (
              <span key={p.name}>{i > 0 && ", "}<a href={p.href} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-foreground">{p.name}</a></span>
            ))}
          </p>
        </Container>
      </Section>

      <Section id="tariffs" className="scroll-mt-14 border-t">
        <Container>
          <div data-reveal>
            <Eyebrow className="text-center">Тарифы Wi-Fi</Eyebrow>
            <h2 className="mb-3 text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance">29 900 ₽ один раз — и никакой абонентской платы</h2>
            <p className="mx-auto mb-6 max-w-2xl text-center text-muted-foreground">Подключение — от 2 рабочих дней. Платите один раз за подключение, дальше обслуживание бесплатно. Нужна страница входа только с вашим брендом — выберите годовую подписку.</p>
          </div>
          <Tariffs />
        </Container>
      </Section>

      {site.features.advertising && (<>
      <Section className="relative isolate overflow-hidden border-t bg-card">
        <Bitmap alpha={0.14} density={0.5} className="[mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <Container>
          <Eyebrow className="text-center">Для рекламодателей</Eyebrow>
          <h2 className="mb-3 text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance">Реклама в момент подключения к Wi-Fi</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">HVALA mobile показывает ваш баннер на весь экран, когда человек подключается к Wi-Fi в заведении. На экране только один баннер — ваш, и его видят.</p>
          <dl className="grid grid-cols-2 gap-6 border-y py-6 text-center sm:grid-cols-4">
            {home.network.stats.map((s) => (
              <div key={s.label}>
                <dd className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl"><CountUp value={s.value} /></dd>
                <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
          <h3 className="mb-4 mt-10 text-center text-2xl font-semibold tracking-tight">Таргетинги: кому показать рекламу</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {home.network.targeting.map((t) => {
              const Icon = targetingIcons[t.icon];
              return (
                <li key={t.title} className="flex flex-col gap-4 rounded-xl border bg-background p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-bg text-brand"><Icon className="size-5" aria-hidden /></span>
                  <span>
                    <span className="block font-medium">{t.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{t.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 text-base"><a href="#formats">Форматы с примерами</a></Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base"><Link href="/services/advertising/">Подробнее о сети</Link></Button>
          </div>
        </Container>
      </Section>

      <Section id="formats" className="scroll-mt-14 border-t">
        <Container>
          <Eyebrow className="text-center">Форматы</Eyebrow>
          <h2 className="mb-3 text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance">4 формата рекламы в Wi-Fi</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">Все форматы показываются на весь экран в момент подключения к Wi-Fi. Оплата — за тысячу показов (CPM), медиаплан рассчитываем по запросу.</p>
          <FormatTabs items={formats} />
          <div className="mt-8 flex justify-center"><Button asChild size="lg" className="h-12 px-8 text-base"><a href={site.cta.href} data-os-app="mail" data-os-payload="Реклама в Wi-Fi">Получить медиаплан</a></Button></div>
        </Container>
      </Section>
      </>)}

      <Section id="cases" className="border-t">
        <Container>
          <div data-reveal>
            <Eyebrow className="text-center">Кейсы</Eyebrow>
            <h2 className="mb-8 text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance">Что получили заведения</h2>
          </div>
          {site.features.advertising ? (
            <CaseSlider label="Кейсы HVALA">
              {home.caseIds.map((id) => cases.find((c) => c.id === id)!).map((c) => <CaseCard key={c.id} c={c.id === "akadem" ? { ...c, video: undefined } : c} showGroup={caseGroups.length > 1} className="w-full" />)}
            </CaseSlider>
          ) : (
            <CasesBento items={home.caseIds.map((id) => cases.find((c) => c.id === id)!)} big="return" />
          )}
          <div className="mt-8 flex justify-center"><Button asChild size="lg" className="h-12 px-8 text-base"><Link href="/cases/">Все кейсы</Link></Button></div>
        </Container>
      </Section>

      <ItBlock />

      <Section id="reviews" className="border-t bg-card">
        <Container className="max-w-3xl">
          <Eyebrow className="text-center">Отзывы</Eyebrow>
          <h2 className="mb-8 text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance" data-reveal>{home.rating.value} в 2ГИС: что пишут клиенты</h2>
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
          <Eyebrow className="text-center">Вопросы</Eyebrow>
          <h2 data-reveal className="mb-6 text-center text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight font-semibold tracking-tight text-balance">Что спрашивают перед подключением</h2>
          <FaqList items={home.faq} />
        </Container>
      </Section>

      <Cta title="Подключим гостевой Wi-Fi с авторизацией" text="Расскажите о заведении: город, площадь и оборудование. Менеджер ответит в Telegram и рассчитает подключение." />
    </>
  );
}
