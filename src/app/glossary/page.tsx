import type { Metadata } from "next";
import Link from "next/link";
import { glossaryCategories, glossaryTerms } from "@/content/glossary";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { Bitmap } from "@/components/bitmap";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { definedTermSetSchema, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Глоссарий Wi-Fi, рекламы и маркетинга в общепите",
  description: "Словарь терминов HVALA о гостевом Wi-Fi, рекламе и общепите (HoReCa): Captive Portal, ПП РФ № 758 и 801, ретаргетинг, CPM, CTR, LTV, Retention и RFM.",
  alternates: { canonical: "/glossary/" },
};

export default function GlossaryPage() {
  return (
    <>
      <JsonLd data={graph(definedTermSetSchema(glossaryTerms))} />
      <Section className="relative isolate overflow-hidden pt-12">
        <Bitmap variant="ripple" alpha={0.2} density={0.45} className="[mask-image:linear-gradient(to_top,black_10%,transparent_90%)]" />
        <Container className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Глоссарий Wi-Fi, рекламы и общепита</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Справочник терминов для владельцев заведений, маркетологов и IT-специалистов. Команда HVALA простым языком объясняет, как работают гостевой Wi-Fi и авторизация по закону (Captive Portal, ПП РФ № 758 и № 801, SMS и Flash Call), сетевые технологии (RADIUS, Mesh, MAC-адрес), инструменты рекламы (ретаргетинг, CPM, CTR, Look-alike, O2O) и метрики общепита (HoReCa, LTV, Retention Rate, средний чек, RFM-анализ). В каждой статье — прямой ответ в первом абзаце, практический разбор для бизнеса, реальные цифры и ответы на частые вопросы.
          </p>
        </Container>
        <Container className="mt-12 space-y-12">
          {glossaryCategories.map((cat) => {
            const items = glossaryTerms.filter((t) => t.category === cat);
            return (
              <div key={cat}>
                <h2 className="text-2xl font-semibold tracking-tight">{cat}</h2>
                <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((t) => (
                    <li key={t.slug} className="flex">
                      <Link
                        href={`/glossary/${t.slug}/`}
                        className="group flex w-full flex-col rounded-2xl border bg-background p-5 transition-colors hover:border-brand"
                      >
                        <h3 className="text-lg font-semibold leading-snug group-hover:text-brand">{t.term}</h3>
                        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{t.answer}</p>
                        <span className="mt-auto pt-4 text-sm font-medium text-brand">Читать разбор →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Container>
        <Container className="mt-12 max-w-3xl text-center text-sm text-muted-foreground">
          <p>
            Не нашли нужный термин или хотите разобрать задачу вашего заведения? Напишите в Telegram команды {site.name} — подскажем, как настроить сеть по закону и собрать базу гостей.
          </p>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
