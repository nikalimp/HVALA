import type { Metadata } from "next";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { Cta } from "@/components/cta";
import { ServiceCard } from "@/components/service-card";
import { Bitmap } from "@/components/bitmap";
import { JsonLd } from "@/components/json-ld";
import { graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Направления: Wi-Fi для бизнеса, реклама, TRAP, франшиза",
  description: "Пять направлений HVALA: гостевой Wi-Fi для заведений от 29 900 ₽, реклама в Wi-Fi, Wi-Fi на мероприятиях, TRAP и франшиза. Цены и сроки.",
  alternates: { canonical: "/services/" },
};

export default function Services() {
  return (
    <>
      <JsonLd
        data={graph(
          { "@type": "ItemList", name: `Направления ${site.name}`, itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${site.url}/services/${s.slug}/` })) },
        )}
      />
      <Section className="relative isolate overflow-hidden pt-12">
        <Bitmap variant="ripple" alpha={0.2} density={0.45} className="[mask-image:linear-gradient(to_top,black_10%,transparent_90%)]" />
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Направления HVALA</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">У HVALA пять направлений на одной технологии гостевого Wi-Fi. Заведения подключают Wi-Fi с авторизацией гостей за 29 900 ₽ без абонентской платы. Бренды покупают рекламу в момент подключения к Wi-Fi в 2000 заведений. Организаторы ставят Wi-Fi на мероприятия, ритейл собирает офлайн-аудиторию через TRAP, а партнёры открывают франшизу в своём городе.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">            {services.map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
          <h2 className="mb-4 mt-14 text-2xl font-semibold tracking-tight">Как выбрать направление</h2>
          <ul className="max-w-3xl space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">У вас кафе, ресторан, отель, салон или фитнес-клуб</strong> — подключите Wi-Fi для заведений: база гостей, акции, отзывы и рассылки.</li>
            <li><strong className="text-foreground">Вы продвигаете бренд</strong> — закажите рекламу в сети HVALA mobile: полноэкранный баннер в 2000 заведений и отчёт по кампании.</li>
            <li><strong className="text-foreground">Вы проводите концерт, форум или выставку</strong> — поставьте Wi-Fi на мероприятие и получите данные гостей.</li>
            <li><strong className="text-foreground">Вам нужна аудитория вашей точки для рекламы</strong> — установите TRAP и передайте аудиторию в Яндекс Аудитории и MyTarget.</li>            <li><strong className="text-foreground">Вы хотите свой бизнес</strong> — станьте партнёром HVALA по франшизе в своём городе.</li>
          </ul>
          <h2 className="mb-4 mt-14 text-2xl font-semibold tracking-tight">Что общего у всех направлений</h2>
          <p className="max-w-3xl text-muted-foreground">В основе всех продуктов — платформа HVALA: страница входа в Wi-Fi, авторизация по номеру телефона и личный кабинет с аналитикой. Платформа работает с любым провайдером и оборудованием. Техническая поддержка отвечает 24/7, а менеджер помогает выбрать решение и рассчитать стоимость.</p>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
