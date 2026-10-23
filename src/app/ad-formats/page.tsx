import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { site } from "@/content/site";
import { home } from "@/content/home";
import { formats } from "@/content/os";
import { Container, Eyebrow, Section } from "@/components/container";
import { Bitmap } from "@/components/bitmap";
import { Button } from "@/components/ui/button";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Форматы рекламы в Wi-Fi: Fullscreen, Action, Survey",
  description: "4 формата рекламы HVALA mobile в гостевом Wi-Fi: Fullscreen, Action banner, Survey banner и 2 Level Banner. Примеры, таргетинги, оплата за показы.",
  alternates: { canonical: "/ad-formats/" },
};

const steps = [
  { title: "Подключение к Wi-Fi", text: "Человек подключается к гостевой сети в заведении." },
  { title: "Баннер", text: "Он видит баннер на весь экран и взаимодействует с механикой." },
  { title: "Целевое действие", text: "Переходит на сайт рекламодателя или оставляет заявку прямо в баннере." },
];

export default function AdFormats() {
  return (
    <>
      <JsonLd data={graph({ "@type": "CollectionPage", name: `Форматы рекламы ${site.name}`, url: `${site.url}/ad-formats/` })} />
      <Section className="relative isolate overflow-hidden pt-12">
        <Bitmap variant="ripple" alpha={0.2} density={0.45} className="[mask-image:linear-gradient(to_left,black,transparent_55%)]" />
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Форматы рекламы в гостевом Wi-Fi</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            В сети HVALA mobile четыре формата: Fullscreen, Action banner, Survey banner и 2 Level Banner. Все показываются на весь экран в момент подключения к Wi-Fi в 2000 заведений — на экране только один баннер. Оплата — за тысячу показов (CPM), медиаплан рассчитываем по запросу. Реклама идёт только в проверенных заведениях: ресторанах, кафе, автосалонах, фитнес-клубах.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href={site.cta.href} data-os-app="mail" data-os-payload="Реклама в Wi-Fi">Рассчитать медиаплан</a></Button>
            <Button asChild size="lg" variant="outline"><Link href="/services/advertising/">О рекламной сети</Link></Button>
          </div>
        </Container>
      </Section>

      {formats.map((f, i) => (
        <Section key={f.id} id={f.id} className={i % 2 ? "border-t" : "border-t bg-card"}>
          <Container className="grid items-center gap-10 md:grid-cols-[16rem_1fr]">
            <video src={f.video} autoPlay muted loop playsInline preload="none" className="mx-auto aspect-[9/16] w-full max-w-64 rounded-[2rem] border-[6px] border-desktop-ink bg-muted object-cover" aria-label={`Пример формата ${f.title}`} />
            <div>
              <Eyebrow>Формат {i + 1} из {formats.length}</Eyebrow>
              <h2 className="text-3xl font-semibold tracking-tight">{f.title}</h2>
              <p className="mt-3 max-w-xl text-lg text-muted-foreground">{f.text}</p>
              <ul className="mt-6 grid max-w-xl gap-2.5 sm:grid-cols-2">
                {f.points.map((p) => <li key={p} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{p}</li>)}
              </ul>
            </div>
          </Container>
        </Section>
      ))}

      <Section className="border-t">
        <Container>
          <Eyebrow>Механика</Eyebrow>
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">Как работает показ</h2>
          <ol className="grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title}>
                <p className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <h2 className="mb-6 mt-14 text-2xl font-semibold tracking-tight">Таргетинги</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {home.network.targeting.map((t) => (
              <li key={t.title} className="rounded-xl border p-4"><p className="font-medium">{t.title}</p><p className="mt-1 text-sm text-muted-foreground">{t.text}</p></li>
            ))}
          </ul>
        </Container>
      </Section>

      <Cta title="Запустим кампанию в Wi-Fi" text="Расскажите о задаче, городе и аудитории — менеджер рассчитает медиаплан." />
    </>
  );
}
