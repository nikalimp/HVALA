import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { formatDate, getPosts } from "@/lib/posts";
import { Container, Section } from "@/components/container";
import { Bitmap } from "@/components/bitmap";
import { JsonLd } from "@/components/json-ld";
import { graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Блог о гостевом Wi-Fi и рекламе в Wi-Fi",
  description: "Статьи HVALA о гостевом Wi-Fi для бизнеса: авторизация по закону, сбор базы гостей, маркетинг заведения и реклама в Wi-Fi-сетях.",
  alternates: { canonical: "/blog/" },
  ...(!site.features.blog && { robots: { index: false, follow: true } }),
};

export default function Blog() {
  const posts = getPosts();
  return (
    <>
      <JsonLd data={graph({ "@type": "Blog", name: `Блог ${site.name}`, url: `${site.url}/blog/` })} />
      <Section className="relative isolate overflow-hidden pt-12">
        <Bitmap variant="ripple" alpha={0.2} density={0.45} className="[mask-image:linear-gradient(to_top,black_10%,transparent_90%)]" />
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Блог HVALA</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Статьи о гостевом Wi-Fi для бизнеса от команды HVALA. Мы пишем о том, как заведению собрать базу гостей через Wi-Fi и вернуть их акциями, какой тариф выбрать и как бренды покупают рекламу в момент подключения к Wi-Fi. В статьях — только факты из нашей работы: цены, сроки и цифры кейсов. Ответ на главный вопрос — в первом абзаце каждой статьи, подробности, таблицы и частые вопросы — ниже.</p>
          <div className="mt-10 divide-y border-y">
            {posts.length === 0 && <p className="py-6 text-muted-foreground">Статьи скоро появятся.</p>}
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="block py-6 hover:opacity-80">
                <p className="text-sm text-muted-foreground"><time dateTime={p.date}>{formatDate(p.date)}</time></p>
                <h2 className="mt-1 text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-muted-foreground">{p.body.split("\n\n")[0].replace(/\*\*/g, "")}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
