import type { Metadata } from "next";
import { site } from "@/content/site";
import { caseGroups, cases } from "@/content/os";
import { Container, Eyebrow, Section } from "@/components/container";
import { Bitmap } from "@/components/bitmap";
import { CaseCard } from "@/components/case-card";
import { CaseSlider } from "@/components/case-slider";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Кейсы: гостевой Wi-Fi для заведений в цифрах",
  description: "Кейсы HVALA: заведения собирают базу гостей через Wi-Fi и возвращают их акциями, SMS и ретаргетингом. 1 723 гостя вернулись в сеть ресторанов.",
  alternates: { canonical: "/cases/" },
};

const groupAnchor: Record<string, string> = { Заведения: "venues", Реклама: "advertising", TRAP: "trap" };
const groupIntro: Record<string, string> = {
  Заведения: "Кафе и рестораны собирают базу гостей через Wi-Fi и возвращают их акциями, SMS и ретаргетингом по базе.",
  Реклама: "Бренды показывают полноэкранную рекламу в момент подключения к Wi-Fi в заведениях сети HVALA mobile.",
  TRAP: "Ритейл и заведения собирают офлайн-аудиторию у своей точки и запускают на неё рекламу в интернете.",
};

export default function Cases() {
  return (
    <>
      <JsonLd
        data={graph(
          { "@type": "CollectionPage", name: `Кейсы ${site.name}`, url: `${site.url}/cases/` },
        )}
      />
      <Section className="relative isolate overflow-hidden pt-12">
        <Bitmap variant="ripple" alpha={0.2} density={0.45} className="[mask-image:linear-gradient(to_top,black_10%,transparent_90%)]" />
        <Container className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Кейсы HVALA</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Здесь собраны результаты заведений, которые подключили гостевой Wi-Fi HVALA. Они собирают базу гостей через авторизацию и возвращают их акциями, SMS и ретаргетингом. В одном из кейсов сеть ресторанов вернула 1 723 гостя, которые давно не приходили.
          </p>
          {caseGroups.length > 1 && <nav aria-label="Разделы кейсов" className="mt-6 flex flex-wrap justify-center gap-2">
            {caseGroups.map((g) => (
              <a key={g} href={`#${groupAnchor[g]}`} className="rounded-full border bg-background px-3.5 py-1.5 text-sm font-medium hover:border-brand">{g}</a>
            ))}
          </nav>}
        </Container>
      </Section>
      {caseGroups.map((g, gi) => (
        <Section key={g} id={groupAnchor[g]} className={gi % 2 ? "border-t" : "border-t bg-card"}>
          <Container>
            <Eyebrow className="text-center">{g}</Eyebrow>
            <h2 className="mb-3 text-center text-3xl sm:text-4xl font-semibold tracking-tight">{g === "Заведения" ? "Кейсы заведений" : g === "Реклама" ? "Рекламные кампании" : "Кейсы TRAP"}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">{groupIntro[g]}</p>
            <CaseSlider label={`Кейсы: ${g}`}>
              {cases.filter((c) => c.group === g).map((c) => <CaseCard key={c.id} c={c} tall={cases.some((x) => x.group === g && (x.video || x.image))} className="w-full" />)}
            </CaseSlider>
          </Container>
        </Section>
      ))}
      <Section className="border-t">
        <Container className="max-w-3xl">
          <h2 className="mb-6 text-center text-3xl sm:text-4xl font-semibold tracking-tight">Как заведения получают такие результаты</h2>
          <ol className="list-decimal space-y-3 pl-5 text-muted-foreground">
            <li>Гость подключается к Wi-Fi и проходит авторизацию по номеру телефона — так требует закон о публичном Wi-Fi.</li>
            <li>Номер, пол, возраст и частота визитов сохраняются в личном кабинете заведения.</li>
            <li>Кабинет сам делит гостей на сегменты: новые, постоянные, давно не приходившие, именинники.</li>
            <li>Заведение показывает акцию на странице входа, отправляет SMS или выгружает сегмент в Яндекс Аудитории и MyTarget.</li>
            <li>Аналитика визитов показывает, сколько гостей вернулись после кампании.</li>
          </ol>
        </Container>
      </Section>
      <Cta title="Хотите такой же результат?" text="Расскажите о заведении. Менеджер ответит в Telegram и предложит решение." />
    </>
  );
}
