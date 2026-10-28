import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Award, Briefcase, ChartColumn, Check, ClipboardList, Cpu, CreditCard, Crosshair, ExternalLink, FileText, Gamepad2, GraduationCap,
  LayoutTemplate, Layers, ListChecks, Mail, Maximize, Megaphone, Network, Palette, Radar, Repeat, ShieldCheck, Smartphone, Target,
  Ticket, TrendingUp, Truck, Upload, Users, UsersRound, Wifi, Wrench, type LucideIcon,
} from "lucide-react";
import { ServiceIllustration } from "@/components/service-illustration";

// Иконки пунктов «Что входит» — по полю icon в src/content/services.ts
const icons: Record<string, LucideIcon> = {
  award: Award, briefcase: Briefcase, chart: ChartColumn, clipboard: ClipboardList, cpu: Cpu, card: CreditCard, crosshair: Crosshair,
  external: ExternalLink, report: FileText, game: Gamepad2, study: GraduationCap, layout: LayoutTemplate, layers: Layers, list: ListChecks,
  mail: Mail, fullscreen: Maximize, megaphone: Megaphone, network: Network, palette: Palette, radar: Radar, repeat: Repeat, shield: ShieldCheck,
  phone: Smartphone, target: Target, ticket: Ticket, trend: TrendingUp, truck: Truck, upload: Upload, users: Users, lookalike: UsersRound,
  wifi: Wifi, wrench: Wrench,
};
import { serviceBySlug, services } from "@/content/services";
import { site } from "@/content/site";
import { Container, Eyebrow, Section } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { Cta } from "@/components/cta";
import { FaqList } from "@/components/faq";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Bitmap } from "@/components/bitmap";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, serviceSchema } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/services/${s.slug}/` },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `${site.url}/services/${s.slug}/`, images: ["/og.png"] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const path = `/services/${s.slug}/`;
  const related = s.related.map(serviceBySlug).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <JsonLd data={graph(serviceSchema(s), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Направления", path: "/services/" }, { name: s.title, path }]), s.faq.length > 0 && faqSchema(s.faq))} />

      <Section className="relative isolate overflow-hidden pt-12">
        <Bitmap variant="ripple" alpha={0.22} density={0.5} className="[mask-image:linear-gradient(to_top,black_10%,transparent_90%)]" />
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="max-w-3xl">
            <Crumbs items={[{ name: "Главная", path: "/" }, { name: "Направления", path: "/services/" }, { name: s.title }]} />
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">{s.h1}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{s.answer}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg"><a href={site.cta.href} data-os-app="mail" data-os-payload={s.title}>{s.ctaLabel}</a></Button>
              {s.prices[0] && <p className="text-sm text-muted-foreground">{s.prices[0].value} · {s.timeline}</p>}
            </div>
          </div>
          <ServiceIllustration slug={s.slug} className="mx-auto w-full max-w-72 lg:max-w-none" />
        </Container>
      </Section>

      {s.forWhom.length > 0 && (
        <Section className="border-t bg-card">
          <Container className="max-w-3xl">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Кому подходит</h2>
            <ul className="space-y-3">
              {s.forWhom.map((f) => (
                <li key={f} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{f}</li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section className="border-t">
        <Container className="max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">Что входит</h2>
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {s.includes.map((i) => {
              const Icon = icons[i.icon] ?? Check;
              return (
                <div key={i.title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-bg text-brand"><Icon className="size-5" aria-hidden /></span>
                  <div>
                    <h3 className="font-medium">{i.title}</h3>
                    <p className="mt-1.5 text-muted-foreground">{i.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="border-t bg-card">
        <Container className="max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">Этапы</h2>
          <ol className="space-y-6">
            {s.process.map((p, i) => (
              <li key={p.title} className="flex gap-4">
                <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="mt-1 text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="border-t">
        <Container className="max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">Стоимость</h2>
          <table className="w-full text-left">
            <tbody className="divide-y border-y">
              {s.prices.map((p) => (
                <tr key={p.name}>
                  <th scope="row" className="py-4 pr-4 font-medium">
                    {p.name}
                    {p.note && <span className="block text-sm font-normal text-muted-foreground">{p.note}</span>}
                  </th>
                  <td className="py-4 text-right font-semibold tabular-nums">{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-muted-foreground">Срок: {s.timeline}</p>
        </Container>
      </Section>

      {s.faq.length > 0 && (
        <Section className="border-t bg-card">
          <Container className="max-w-3xl">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Частые вопросы</h2>
            <FaqList items={s.faq} />
          </Container>
        </Section>
      )}

      {related.length > 0 && (
        <Section className="border-t">
          <Container>
            <Eyebrow>Вместе с этим</Eyebrow>
            <h2 className="mb-8 text-2xl font-semibold tracking-tight">Связанные направления</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <ServiceCard key={r.slug} s={r} />)}
            </div>
          </Container>
        </Section>
      )}

      <Cta label={s.ctaLabel} payload={s.title} />
    </>
  );
}
