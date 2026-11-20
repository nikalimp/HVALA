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
  title: "Гостевой Wi-Fi HVALA для заведений и мероприятий",
  description: "Гостевой Wi-Fi с авторизацией по закону: для заведений за 29 900 ₽ без абонентской платы, на мероприятиях за 39 900 ₽. Цены и сроки подключения.",
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
          <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-5xl">Направления HVALA</h1>
          <p className="mx-auto mt-5 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">HVALA — гостевой Wi-Fi с авторизацией по закону. Заведения подключают его за 29 900 ₽ один раз, без абонентской платы, и получают базу гостей. Организаторы ставят такой же Wi-Fi на мероприятия и получают данные гостей.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">            {services.map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
          <h2 className="mb-6 mt-16 text-center text-3xl sm:text-4xl font-semibold tracking-tight">Как выбрать направление</h2>
          <ul className="mx-auto max-w-3xl space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">У вас кафе, ресторан, отель, салон или фитнес-клуб</strong> — подключите Wi-Fi для заведений: база гостей, акции, отзывы и рассылки.</li>
            <li><strong className="text-foreground">Вы проводите концерт, форум или выставку</strong> — поставьте Wi-Fi на мероприятие и получите данные гостей.</li>
          </ul>
          <h2 className="mb-6 mt-16 text-center text-3xl sm:text-4xl font-semibold tracking-tight">Зачем авторизация в Wi-Fi</h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">Постановления Правительства РФ № 758 и № 801 требуют идентифицировать пользователей публичного Wi-Fi. Значит, авторизация нужна каждому заведению и мероприятию с гостевой сетью. HVALA делает её по номеру телефона и превращает обязательную меру в маркетинг: каждый вход в сеть даёт вам контакт гостя. Вам не нужно настраивать это самому: мы подключаем сервис на вашем оборудовании от 2 рабочих дней, а инженер техподдержки отвечает 24/7. Подходит MikroTik, Ubiquiti UniFi, Cisco, TP-Link и другое оборудование.</p>
          <h2 className="mb-6 mt-16 text-center text-3xl sm:text-4xl font-semibold tracking-tight">Что общего у всех решений</h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">В основе всех решений — платформа HVALA: страница входа в Wi-Fi, авторизация по номеру телефона и личный кабинет с аналитикой. Платформа работает с любым провайдером и оборудованием. Техническая поддержка отвечает 24/7, а менеджер помогает выбрать решение и рассчитать стоимость. Подключение занимает от 2 рабочих дней: договор, оплата счёта, настройка оборудования и запуск страницы входа с вашим брендом.</p>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
