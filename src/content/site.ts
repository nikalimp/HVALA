// Единый источник правды о компании. Заполняется по specs/00-brief.md и specs/02-spec.md.
// Всё, что помечено TODO(клиент), должно быть заменено фактами до запуска: `npm run check` не пропустит TODO.

export type OrgType =
  | "Organization"
  | "LocalBusiness"
  | "ProfessionalService"
  | "Dentist"
  | "MedicalClinic"
  | "LegalService"
  | "EducationalOrganization"
  | "HomeAndConstructionBusiness"
  | "Store";

export const site = {
  url: "https://hvala.nikalimp.ru", // тестовый адрес v1; боевой домен — в «Пробелах» брифа
  name: "HVALA",
  legalName: "ООО «Креативный синдикат»",
  // Тип организации в Schema.org — самый точный из подходящих: https://schema.org/LocalBusiness#subtypes
  orgType: "Organization" as OrgType,
  title: "HVALA — гостевой Wi-Fi для бизнеса и реклама в Wi-Fi", // title главной, до 60 символов
  description: "HVALA превращает гостевой Wi-Fi в контакты гостей и рекламный канал: 2000+ заведений, 25+ городов, подключение от 29 900 ₽ без абонентской платы.",
  // Одна фраза о компании для llms.txt и футера
  tagline: "Гостевой Wi-Fi для бизнеса: контакты гостей, маркетинг заведения и реклама брендов в момент подключения.",
  lang: "ru",
  locale: "ru_RU",
  foundingYear: 2015, // «11 лет на рынке» (hvalawifi.ru/4u); ООО зарегистрировано в 2014
  areaServed: ["RU"],

  // Цифры компании — как на hvalawifi.ru/4u (решение Ника 23.10.2026)
  stats: [
    { value: "11 лет", label: "на рынке" },
    { value: "25+", label: "городов" },
    { value: "2K+", label: "заведений" },
    { value: "10M+", label: "пользователей" },
  ],

  contacts: {
    phone: "+78002341166", // формат +7XXXXXXXXXX; пусто — блок не показывается
    phoneDisplay: "8 800 234-11-66",
    email: "sales@hvalacloud.ru",
    telegram: "https://t.me/kirillSyndicate", // менеджер по продажам
    support: "https://t.me/hvalacloud_support", // инженер техподдержки
    whatsapp: "",
    address: {
      street: "", // офис по 2ГИС — ул. Пушкина, 9а; ждёт подтверждения клиента
      city: "Екатеринбург",
      region: "Свердловская область",
      postalCode: "",
      country: "RU",
    },
    geo: null as null | { lat: number; lng: number },
    hours: "",
    openingHours: [] as { days: string[]; opens: string; closes: string }[],
  },

  // Главное целевое действие — на него ведут все CTA. v1: Telegram менеджера; форма — P1 (spec §7)
  cta: {
    label: "Оставить заявку",
    href: "https://t.me/kirillSyndicate",
  },

  // Реквизиты для футера и политики ПДн (152-ФЗ)
  legal: {
    inn: "6686051134",
    ogrn: "1146686011867",
    privacyEmail: "",
  },

  // Профили бренда на внешних площадках
  sameAs: ["https://2gis.ru/ekaterinburg/firm/70000001080382589"] as string[],
  socials: [] as { label: string; href: string }[],
  metaNote: "",

  // Лицо компании — ждём от клиента (бриф, «Пробелы»)
  person: null as null | { name: string; jobTitle: string; description: string; sameAs: string[] },

  metrikaId: 0, // тестовый адрес без счётчика — исключение spec §9; к запуску обязателен
  darkTheme: true,

  features: {
    blog: true, // блог: /blog/ и статьи /blog/<slug>/ (статьи — content/blog/*.md)
  },
};

export const nav = [
  { href: "/about/", label: "О компании" },
  { href: "/services/", label: "Направления" },
  { href: "/cases/", label: "Кейсы" },
  { href: "/#formats", label: "Форматы" },
  ...(site.features.blog ? [{ href: "/blog/", label: "Блог" }] : []),
  { href: "/about/", label: "О компании" },
  { href: "/contacts/", label: "Контакты" },
];
