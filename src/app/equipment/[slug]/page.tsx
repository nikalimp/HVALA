import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { equipmentBySlug, equipmentVendors } from "@/content/equipment";
import { glossaryBySlug } from "@/content/glossary";
import { serviceBySlug } from "@/content/services";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, equipmentSchema, faqSchema, graph } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return equipmentVendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const v = equipmentBySlug((await params).slug);
  if (!v) return { robots: { index: false } };
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    alternates: { canonical: `/equipment/${v.slug}/` },
    openGraph: {
      type: "article",
      title: `${v.metaTitle} — ${site.name}`,
      description: v.metaDescription,
      url: `${site.url}/equipment/${v.slug}/`,
      images: ["/og.png"],
    },
  };
}

export default async function EquipmentVendorPage({ params }: { params: Promise<{ slug: string }> }) {
  const v = equipmentBySlug((await params).slug);
  if (!v) notFound();
  const service = serviceBySlug("guest-wifi");
  const relatedVendors = v.relatedVendors.map(equipmentBySlug).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const relatedTerms = v.relatedGlossary.map(glossaryBySlug).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <JsonLd
        data={graph(
          equipmentSchema(v),
          faqSchema(v.faq),
          breadcrumbs([
            { name: "Главная", path: "/" },
            { name: "Оборудование", path: "/equipment/" },
            { name: v.shortName, path: `/equipment/${v.slug}/` },
          ]),
        )}
      />
      <Section className="pt-12">
        <Container className="max-w-3xl">
          <div className="text-center">
            <Crumbs
              items={[
                { name: "Главная", path: "/" },
                { name: "Оборудование", path: "/equipment/" },
                { name: v.shortName },
              ]}
            />
            <p className="text-xs font-medium uppercase tracking-wider text-brand">{v.category}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">{v.name}</h1>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border bg-card p-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Популярные линейки</p>
              <p className="mt-1 font-medium text-foreground">{v.models}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Кому подходит</p>
              <p className="mt-1 font-medium text-foreground">{v.bestFor}</p>
            </div>
          </div>

          <article className="prose-site mt-8">
            <p className="rounded-2xl border bg-card p-5 font-medium text-foreground">{v.answer}</p>

            {v.sections.map((sec) => (
              <section key={sec.heading}>
                <h2>{sec.heading}</h2>
                {sec.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {sec.bullets && (
                  <ul>
                    {sec.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {v.faq.length > 0 && (
              <section>
                <h2>Частые вопросы</h2>
                <div className="space-y-4">
                  {v.faq.map((f) => (
                    <details key={f.q} open className="rounded-xl border bg-background p-4">
                      <summary className="cursor-pointer font-semibold text-foreground">{f.q}</summary>
                      <p className="mt-2 text-muted-foreground">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>

          {service && (
            <div className="mt-10 rounded-2xl border bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-brand">Подключение под ключ</p>
              <h2 className="mt-1 text-xl font-semibold">{service.title} на оборудовании {v.shortName}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Настроим Hotspot, Walled Garden и авторизацию по ПП РФ № 2607 удалённо за 2 рабочих дня. Разовый платёж 29 900 ₽ без абонентской платы.
              </p>
              <Link
                href={`/services/${service.slug}/`}
                className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Подробнее об услуге →
              </Link>
            </div>
          )}

          {relatedTerms.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">Связанные термины для сисадминов</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {relatedTerms.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/glossary/${t.slug}/`}
                      className="block rounded-xl border bg-background p-4 transition-colors hover:border-brand"
                    >
                      <p className="font-medium">{t.shortTitle}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.metaDescription}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedVendors.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">Другое совместимое оборудование</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                {relatedVendors.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/equipment/${r.slug}/`}
                      className="block rounded-xl border bg-background p-4 transition-colors hover:border-brand"
                    >
                      <p className="font-medium">{r.shortName}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.models}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>
      <Cta />
    </>
  );
}
