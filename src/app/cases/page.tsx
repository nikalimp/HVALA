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
  title: "Кейсы: гостевой Wi-Fi, реклама в Wi-Fi и TRAP в цифрах",
  description: "20 кейсов HVALA: акции и SMS для заведений, рекламные кампании брендов в Wi-Fi с CTR до 6,7% и офлайн-аудитории TRAP. Результаты в цифрах.",
  alternates: { canonical: "/cases/" },
};

const groupAnchor: Record<string, string> = { Заведения: "venues", Реклама: "advertising", TRAP: "trap" };
const groupIntro: Record<string, string> = {
  Заведения: "Кафе и рестораны собирают базу гостей через Wi-Fi и возвращают их акциями, SMS и рекламой по базе.",
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
            Здесь собраны результаты клиентов HVALA по трём направлениям. Заведения возвращают гостей акциями и SMS по базе из Wi-Fi. Бренды получают CTR рекламы в Wi-Fi от 4% до 6,7%. TRAP переносит офлайн-аудиторию в онлайн-рекламу: в одном из кейсов бизнес-ланч получил 59 607 ₽ выручки при бюджете 10 000 ₽.
          </p>
          <nav aria-label="Разделы кейсов" className="mt-6 flex flex-wrap justify-center gap-2">
            {caseGroups.map((g) => (
              <a key={g} href={`#${groupAnchor[g]}`} className="rounded-full border bg-background px-3.5 py-1.5 text-sm font-medium hover:border-brand">{g}</a>
            ))}
          </nav>
        </Container>
      </Section>
      {caseGroups.map((g, gi) => (
        <Section key={g} id={groupAnchor[g]} className={gi % 2 ? "border-t" : "border-t bg-card"}>
          <Container>
            <Eyebrow className="text-center">{g}</Eyebrow>
            <h2 className="mb-3 text-center text-3xl sm:text-4xl font-semibold tracking-tight">{g === "Заведения" ? "Кейсы заведений" : g === "Реклама" ? "Рекламные кампании" : "Кейсы TRAP"}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">{groupIntro[g]}</p>
            <CaseSlider label={`Кейсы: ${g}`}>
              {cases.filter((c) => c.group === g).map((c) => <CaseCard key={c.id} c={c} tall={cases.some((x) => x.group === g && x.video)} className="w-full" />)}
            </CaseSlider>
          </Container>
        </Section>
      ))}
      <Cta title="Хотите такой же результат?" text="Расскажите о заведении или рекламной задаче. Менеджер ответит в Telegram и предложит решение." />
    </>
  );
}
