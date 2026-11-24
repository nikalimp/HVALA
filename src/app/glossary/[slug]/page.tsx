import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { glossaryBySlug, glossaryTerms } from "@/content/glossary";
import { serviceBySlug } from "@/content/services";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, definedTermSchema, faqSchema, graph } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = glossaryBySlug((await params).slug);
  if (!t) return { robots: { index: false } };
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/glossary/${t.slug}/` },
    openGraph: {
      type: "article",
      title: `${t.metaTitle} — ${site.name}`,
      description: t.metaDescription,
      url: `${site.url}/glossary/${t.slug}/`,
      images: ["/og.png"],
    },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = glossaryBySlug((await params).slug);
  if (!t) notFound();
  const service = serviceBySlug(t.serviceSlug);
  const related = t.related.map(glossaryBySlug).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <JsonLd
        data={graph(
          definedTermSchema(t),
          faqSchema(t.faq),
          breadcrumbs([
            { name: "Главная", path: "/" },
            { name: "Глоссарий", path: "/glossary/" },
            { name: t.shortTitle, path: `/glossary/${t.slug}/` },
          ]),
        )}
      />
      <Section className="pt-12">
        <Container className="max-w-3xl">
          <div className="text-center">
            <Crumbs
              items={[
                { name: "Главная", path: "/" },
                { name: "Глоссарий", path: "/glossary/" },
                { name: t.shortTitle },
              ]}
            />
            <p className="text-xs font-medium uppercase tracking-wider text-brand">{t.category}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">{t.term}</h1>
          </div>

          <article className="prose-site mt-10">
            <p className="rounded-2xl border bg-card p-5 font-medium text-foreground">{t.answer}</p>

            {t.sections.map((sec) => (
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

            {t.faq.length > 0 && (
              <section>
                <h2>Частые вопросы</h2>
                <div className="space-y-4">
                  {t.faq.map((f) => (
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
              <p className="text-xs font-medium uppercase tracking-wider text-brand">Связанное решение HVALA</p>
              <h2 className="mt-1 text-xl font-semibold">{service.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{service.short}</p>
              <Link
                href={`/services/${service.slug}/`}
                className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Подробнее об услуге →
              </Link>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">Связанные термины</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/glossary/${r.slug}/`}
                      className="block rounded-xl border bg-background p-4 transition-colors hover:border-brand"
                    >
                      <p className="font-medium">{r.term}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.answer}</p>
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
