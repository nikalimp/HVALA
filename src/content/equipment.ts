// Справочник совместимого сетевого оборудования для гостевого Wi-Fi HVALA.
// Одна запись — одна страница /equipment/<slug>/. Прямой ответ в первом абзаце (GEO),
// объём ≥ 270 слов в <main>, без упоминания RADIUS и устаревших ПП № 758/801 (только ПП РФ № 2607).
import type { Faq } from "./services";

export type EquipmentCategory = string;

export type EquipmentVendor = {
  slug: string;
  name: string;
  shortName: string;
  category: EquipmentCategory;
  metaTitle: string; // + " — HVALA" = 40–65 символов
  metaDescription: string; // 120–160 символов
  models: string; // популярные линейки
  bestFor: string; // кому подходит
  answer: string; // прямой ответ в первом абзаце
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faq: Faq[];
  relatedVendors: string[];
  relatedGlossary: string[];
  updated: string;
};

export const equipmentCategories: EquipmentCategory[] = [
  "Самые популярные в заведениях",
  "Корпоративный и отельный сегмент",
  "Малый бизнес и локальные точки",
];

export const equipmentVendors: EquipmentVendor[] = [
  {
    slug: "mikrotik",
    name: "Настройка Hotspot на оборудовании MikroTik",
    shortName: "MikroTik",
    category: "Самые популярные в заведениях",
    metaTitle: "Настройка Hotspot на MikroTik для гостевого Wi-Fi",
    metaDescription: "Особенности настройки Hotspot, Walled Garden, CAPsMAN и VLAN на MikroTik RouterOS 6 и 7 для гостевого Wi-Fi HVALA по ПП РФ № 2607.",
    models: "hAP ax2/ax3, RB5009, cAP ax, L009, CCR, RouterOS 6/7",
    bestFor: "Кофейни, рестораны, сети заведений, бары и мероприятия",
    answer:
      "MikroTik — самое популярное оборудование для гостевого Wi-Fi в заведениях России. Встроенный сервер Hotspot в RouterOS 6 и RouterOS 7 поддерживает гибкую настройку Walled Garden, лимиты времени сессии и трафика, MAC-cookies, изоляцию через VLAN + Bridge и централизованный роуминг CAPsMAN. Подключение MikroTik к платформе HVALA занимает от 2 рабочих дней — вручную или с выгрузкой конфигурации через API.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на MikroTik",
        paragraphs: [
          "Роутеры MikroTik дают администратору полный контроль над гостевой сетью без ежемесячных лицензий за контроллер. При подключении к HVALA настраивают связку из нескольких ключевых узлов RouterOS:",
        ],
        bullets: [
          "выгрузка и обновление конфигурации Hotspot — от ручной настройки в WinBox до автоматической выгрузки конфигов через API для сетевых заведений;",
          "Walled Garden и Walled Garden IP List — открытие доменов и IP-адресов портала авторизации и сервисов проверки Apple/Android до входа гостя;",
          "таймеры idle-timeout, session-timeout и MAC-cookies — баланс между автоматическим повторным входом постоянных гостей и защитой от «засиживания»;",
          "изоляция кассовой и гостевой подсетей через VLAN tagged/untagged (Bridge VLAN Filtering), NAT и правила Firewall Filter / Mangle;",
          "бесшовный Wi-Fi на CAPsMAN 2.4/5 ГГц и новом CAPsMAN в RouterOS 7+ с модулями wifi-qcom (ax) для залов от 100 м².",
        ],
      },
      {
        heading: "Как HVALA подключает MikroTik под ключ",
        paragraphs: [
          "Инженеры HVALA настраивают ваш действующий MikroTik удалённо поверх текущего интернет-провайдера. Если роутер ещё не куплен, мы подбираем модель под площадь зала и число одновременных гостей — от компактного hAP ax2 для кофейни до связки RB5009 + cAP ax для двухэтажного ресторана.",
          "Авторизация гостей выполняется по требованиям Постановления Правительства РФ от 31 декабря 2021 г. № 2607, а техподдержка инженеров отвечает 24/7. Стоимость подключения — 29 900 ₽ разово без абонентской платы.",
        ],
      },
    ],
    faq: [
      {
        q: "Поддерживает ли HVALA новую RouterOS 7 и точки доступа с Wi-Fi 6 (ax)?",
        a: "Да. Инженеры HVALA работают и с классической RouterOS 6, и с RouterOS 7+, включая новый CAPsMAN для ax-модулей.",
      },
      {
        q: "Можно ли развернуть конфиг HVALA сразу на 10⁠–⁠50 точках MikroTik?",
        a: "Да. Для сетей заведений поддерживается стандартизированная выгрузка конфигураций Hotspot, что ускоряет запуск новых филиалов.",
      },
    ],
    relatedVendors: ["ubiquiti", "tp-link", "cisco"],
    relatedGlossary: ["walled-garden", "capsman", "hotspot-timeouts-mac-cookies", "vlan-trunk-bridge"],
    updated: "2026-11-28",
  },
  {
    slug: "cisco",
    name: "Настройка Hotspot на оборудовании Cisco",
    shortName: "Cisco",
    category: "Корпоративный и отельный сегмент",
    metaTitle: "Настройка Hotspot на Cisco для гостевого Wi-Fi",
    metaDescription: "Особенности подключения Cisco WLC, Catalyst 9800 и Meraki к платформе гостевого Wi-Fi HVALA: внешний Captive Portal, ACL, VLAN и соблюдение ПП РФ № 2607.",
    models: "Catalyst 9800, AireOS WLC, Cisco Meraki MR, Aironet",
    bestFor: "Отели, торговые центры, бизнес-центры, автосалоны и крупные сети",
    answer:
      "Оборудование Cisco (контроллеры Catalyst 9800, AireOS WLC и облачные точки Meraki) рассчитано на высокую плотность подключений и круглосуточную нагрузку в отелях, ТЦ и бизнес-центрах. При подключении к платформе HVALA на контроллере Cisco настраивают внешний Captive Portal (External Web Auth), списки Pre-Auth ACL и отдельный гостевой VLAN — без замены существующей инфраструктуры.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на Cisco",
        paragraphs: [
          "В отличие от малых роутеров, у Cisco логика гостевого доступа строится вокруг центрального контроллера (WLC) или облачной панели Meraki Dashboard. Важные нюансы, которые учитывают инженеры при запуске:",
        ],
        bullets: [
          "Pre-Auth ACL (аналог Walled Garden) — явное разрешение DNS, DHCP, доменов и IP-адресов портала авторизации до прохождения проверки;",
          "перенаправление HTTP/HTTPS-запросов (Web Auth Redirect) и корректная обработка системных проверок Captive Network Assistant на iOS и Android;",
          "выделенный VLAN и trunk-порты на коммутаторах для строгой изоляции гостевого сегмента от корпоративных сервисов и PMS-систем отеля;",
          "ограничение полосы пропускания на клиента (Per-User Rate Limit) и контроль времени сессии, чтобы канал не перегружался в часы пик.",
        ],
      },
      {
        heading: "Запуск HVALA на существующей сети Cisco",
        paragraphs: [
          "Если в отеле, автосалоне или торговом центре уже смонтированы точки доступа Cisco, менять оборудование не требуется. Инженеры HVALA согласуют параметры с вашим IT-отделом, выдадут список правил для Walled Garden / ACL и проведут совместное тестирование на iOS и Android.",
          "Заведение получает идентификацию гостей по ПП РФ № 2607, брендированную стартовую страницу, сбор базы, NPS и аналитику визитов в личном кабинете.",
        ],
      },
    ],
    faq: [
      {
        q: "Работает ли HVALA с облачными точками Cisco Meraki?",
        a: "Да. В Cisco Meraki настраивается внешний Splash Page (Click-through / External Captive Portal) с белым списком Walled Garden.",
      },
      {
        q: "Повлияет ли настройка гостевого портала на корпоративный Wi-Fi сотрудников?",
        a: "Нет. Гостевой SSID работает в отдельном VLAN с собственными правилами доступа и не затрагивает служебную сеть.",
      },
    ],
    relatedVendors: ["aruba", "ruckus", "huawei"],
    relatedGlossary: ["walled-garden", "captive-portal-android-ios", "vlan-trunk-bridge", "pp-2607"],
    updated: "2026-11-28",
  },
  {
    slug: "ubiquiti",
    name: "Настройка Hotspot на оборудовании Ubiquiti (UniFi)",
    shortName: "Ubiquiti (UniFi)",
    category: "Самые популярные в заведениях",
    metaTitle: "Настройка Hotspot на Ubiquiti UniFi для гостевого Wi-Fi",
    metaDescription: "Особенности настройки External Portal Server, Pre-Authorization Allowances и роуминга на Ubiquiti UniFi для гостевого Wi-Fi HVALA.",
    models: "UniFi U6/U7 Pro, UAP-AC-Pro, UniFi Express, Dream Machine",
    bestFor: "Рестораны, кофейни, бутик-отели, фитнес-клубы и салоны красоты",
    answer:
      "Ubiquiti UniFi — один из самых популярных комплектов для ресторанов, фитнес-клубов и бутик-отелей благодаря стабильному бесшовному роумингу и удобному контроллеру UniFi Network. Платформа HVALA интегрируется с UniFi через встроенный режим External Portal Server или в связке со шлюзом MikroTik, сохраняя быстрый роуминг между точками доступа.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на Ubiquiti UniFi",
        paragraphs: [
          "Главная особенность экосистемы UniFi — необходимость постоянного контроллера (Cloud Key, Dream Machine или выделенный сервер UniFi Network), который управляет гостевыми политиками всех точек доступа:",
        ],
        bullets: [
          "Pre-Authorization Allowances — список разрешённых доменов и подсетей (аналог Walled Garden), без которого страница входа HVALA не откроется;",
          "Post-Authorization Restrictions — автоматическая блокировка доступа гостей к локальным подсетям (192.168.0.0/16, 10.0.0.0/8) для защиты касс;",
          "выбор схемы: авторизация напрямую через UniFi Guest Portal или передача гостевого VLAN на шлюз MikroTik для расширенных лимитов и API;",
          "корректная настройка перенаправления HTTPS и таймаутов сессии, чтобы гости на iPhone и Android видели брендированный экран за 1⁠–⁠2 секунды.",
        ],
      },
      {
        heading: "Подключение вашей сети UniFi к HVALA",
        paragraphs: [
          "Если в заведении уже висят точки UniFi, инженеры HVALA подключат авторизацию за 2 рабочих дня без перепрокладки кабеля. При необходимости мы поможем настроить разнесение каналов 2.4 и 5 ГГц, чтобы в заполненном зале не было просадок скорости.",
          "Вы закрываете требования ПП РФ № 2607 и начинаете собирать базу гостей, показывать акции на входе и измерять возвращаемость в личном кабинете HVALA.",
        ],
      },
    ],
    faq: [
      {
        q: "Нужно ли держать контроллер UniFi включённым 24/7 для работы гостевого портала?",
        a: "Если авторизация идёт средствами самого UniFi Guest Portal — да, контроллер должен быть доступен постоянно. При схеме через шлюз MikroTik точки UniFi работают как чистый радиослой, и зависимость от контроллера снимается.",
      },
      {
        q: "Сохранится ли бесшовный роуминг между точками UniFi после подключения HVALA?",
        a: "Да. Гость проходит авторизацию один раз и свободно перемещается между залами и этажами без обрыва связи.",
      },
    ],
    relatedVendors: ["mikrotik", "tp-link", "ruckus"],
    relatedGlossary: ["mesh-wifi", "walled-garden", "captive-portal-android-ios", "guest-wifi"],
    updated: "2026-11-28",
  },
  {
    slug: "tp-link",
    name: "Настройка Hotspot на оборудовании TP-Link (Omada)",
    shortName: "TP-Link (Omada)",
    category: "Самые популярные в заведениях",
    metaTitle: "Настройка Hotspot на TP-Link Omada для Wi-Fi",
    metaDescription: "Особенности настройки гостевого Wi-Fi и External Portal на TP-Link Omada (EAP, OC200/OC300) для заведений по ПП РФ № 2607.",
    models: "Omada EAP610/650, EAP225/245, контроллеры OC200/OC300, ER605",
    bestFor: "Кафе, рестораны, гостиницы, клиники и сетевые точки с оптимальным бюджетом",
    answer:
      "TP-Link Omada SDN — популярная и доступная по бюджету альтернатива корпоративным Wi-Fi-системам для кафе, ресторанов, клиник и мини-отелей. Точки доступа серии EAP и контроллеры OC200/OC300 поддерживают внешний портал авторизации (External Portal), гостевую изоляцию, VLAN и бесшовный роуминг, что позволяет подключить платформу HVALA за 2 рабочих дня.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на TP-Link Omada",
        paragraphs: [
          "Важно различать домашние роутеры TP-Link Archer и бизнес-линейку TP-Link Omada. Для коммерческого гостевого Wi-Fi с авторизацией по закону используется именно серия Omada с аппаратным или программным контроллером:",
        ],
        bullets: [
          "вкладка Authentication → Portal в Omada Controller позволяет указать внешний сервер авторизации и настроить перенаправление гостей;",
          "Pre-Authentication Access (Walled Garden) задаёт список IP и доменов, доступных до ввода номера телефона;",
          "Guest Network и VLAN-тегирование изолируют посетителей от локальных касс и сетевых принтеров;",
          "при больших нагрузках точки TP-Link Omada часто комбинируют с маршрутизатором MikroTik в роли Hotspot-шлюза — это даёт максимум гибкости по лимитам сессии и трафика.",
        ],
      },
      {
        heading: "Запуск HVALA на точках TP-Link Omada",
        paragraphs: [
          "Инженеры HVALA подключают Omada удалённо на канале вашего действующего провайдера. Мы проверяем открытие страницы входа на iOS и Android, настраиваем лимиты скорости на устройство и передаём вам доступ к личному кабинету с базой гостей, акциями, NPS и аналитикой.",
        ],
      },
    ],
    faq: [
      {
        q: "Подойдёт ли обычный домашний роутер TP-Link Archer для гостевого Wi-Fi?",
        a: "У домашних моделей нет полноценного Hotspot и Walled Garden. Для законной авторизации лучше использовать линейку TP-Link Omada или поставить перед точками компактный шлюз MikroTik.",
      },
      {
        q: "Поддерживается ли бесшовный роуминг 802.11k/v на точках Omada?",
        a: "Да, при управлении через контроллер OC200/OC300 или программный Omada Controller переключение между точками проходит плавно и без повторного ввода номера.",
      },
    ],
    relatedVendors: ["mikrotik", "ubiquiti", "grandstream"],
    relatedGlossary: ["mesh-wifi", "walled-garden", "wifi-session-limits", "pp-2607"],
    updated: "2026-11-28",
  },
  {
    slug: "ruckus",
    name: "Настройка Hotspot на оборудовании Ruckus",
    shortName: "Ruckus",
    category: "Корпоративный и отельный сегмент",
    metaTitle: "Настройка Hotspot на Ruckus для гостевого Wi-Fi",
    metaDescription: "Особенности настройки Hotspot и Walled Garden на Ruckus SmartZone и Unleashed для отелей, ресторанов, ТЦ и массовых мероприятий с HVALA.",
    models: "Ruckus R550/R650/R750, T350 (уличные), SmartZone, Unleashed",
    bestFor: "Крупные отели, торговые центры, концертные площадки и фестивали",
    answer:
      "Точки доступа Ruckus созданы для площадок с экстремально высокой плотностью пользователей благодаря адаптивным антеннам BeamFlex+. На контроллерах SmartZone и в режиме Unleashed поддерживается внешний портал авторизации (Web Auth / WISPr), Walled Garden и гостевые VLAN — это позволяет подключать Ruckus к платформе HVALA в отелях, ТЦ и на мероприятиях.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на Ruckus",
        paragraphs: [
          "Ruckus уверенно держит сотни одновременных подключений на одну точку доступа, но требует аккуратной конфигурации профилей гостевого доступа:",
        ],
        bullets: [
          "настройка профиля Hotspot / Web Authentication с перенаправлением на внешний Captive Portal HVALA;",
          "Walled Garden в SmartZone и Unleashed — разрешение доменов авторизации и системных проверок iOS/Android;",
          "клиентская изоляция (Client Isolation) и отдельный VLAN, чтобы гости не видели друг друга и корпоративное оборудование;",
          "балансировка нагрузки между диапазонами 2.4 и 5 ГГц и ограничение скорости на клиента на массовых мероприятиях.",
        ],
      },
      {
        heading: "Опыт HVALA на крупных площадках",
        paragraphs: [
          "Команда HVALA настроила больше 300 гостевых сетей на мероприятиях и подключила 2 000+ заведений по всей России. Мы работаем с вашей существующей инфраструктурой Ruckus или разворачиваем высоконагруженную сеть под ключ с соблюдением ПП РФ № 2607.",
        ],
      },
    ],
    faq: [
      {
        q: "Можно ли подключить Ruckus в режиме Unleashed без отдельного контроллера SmartZone?",
        a: "Да. В режиме Unleashed одна из точек берёт на себя роль мастера и позволяет настроить гостевой WLAN с внешним порталом или передать гостевой VLAN на шлюз.",
      },
      {
        q: "Подходит ли Ruckus для уличных фестивалей и летних веранд?",
        a: "Да, уличные модели серии T (например, T350) отлично работают на открытых площадках в паре с решением HVALA Event.",
      },
    ],
    relatedVendors: ["cisco", "aruba", "ubiquiti"],
    relatedGlossary: ["hotspot", "mesh-wifi", "walled-garden", "pp-2607"],
    updated: "2026-11-28",
  },
  {
    slug: "grandstream",
    name: "Настройка Hotspot на оборудовании Grandstream",
    shortName: "Grandstream",
    category: "Самые популярные в заведениях",
    metaTitle: "Настройка Hotspot на Grandstream (GWN) для Wi-Fi",
    metaDescription: "Особенности настройки Captive Portal и Walled Garden на точках Grandstream GWN и GWN.Cloud для гостевого Wi-Fi HVALA по ПП РФ № 2607.",
    models: "GWN7660/7664, GWN7605, GWN7630LR, GWN.Cloud",
    bestFor: "Кафе, рестораны, отели, офисы и клиники среднего масштаба",
    answer:
      "Точки доступа Grandstream серии GWN удобны тем, что имеют встроенный контроллер прямо внутри точки и бесплатное облако GWN.Cloud. Они поддерживают внешний Captive Portal, Walled Garden, VLAN и ограничение пропускной способности на клиента, что делает их практичным выбором для запуска гостевого Wi-Fi HVALA.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на Grandstream",
        paragraphs: [
          "В панели GWN.Cloud или локального мастер-контроллера все параметры гостевого доступа собраны в одном разделе Captive Portal:",
        ],
        bullets: [
          "поддержка External Portal с передачей параметров клиента и возвратом после подтверждения номера;",
          "настройка Pre-Authentication Rules (Walled Garden) для доменов платформы и корректного всплытия окна на iOS/Android;",
          "Client Isolation и привязка гостевого SSID к отдельному VLAN для защиты кассовой сети;",
          "удобный контроль сессий (Idle Timeout / Client Expiration) и скорости на каждого гостя.",
        ],
      },
      {
        heading: "Подключение Grandstream к HVALA",
        paragraphs: [
          "Инженеры HVALA подключают ваши точки Grandstream за 2 рабочих дня. Вы получаете авторизацию по ПП РФ № 2607, брендированную страницу входа с акциями и отзывами, личный кабинет со статистикой и поддержку 24/7.",
        ],
      },
    ],
    faq: [
      {
        q: "Нужно ли покупать отдельный аппаратный контроллер для точек Grandstream GWN?",
        a: "Нет. Контроллер уже встроен в прошивку точек доступа, также доступно бесплатное облачное управление GWN.Cloud.",
      },
      {
        q: "Работают ли уличные точки Grandstream LR с платформой HVALA?",
        a: "Да, модели серии LR (Long Range) хорошо подходят для летних веранд, баз отдыха и открытых площадок.",
      },
    ],
    relatedVendors: ["tp-link", "ubiquiti", "mikrotik"],
    relatedGlossary: ["captive-portal", "walled-garden", "wifi-session-limits", "ssid"],
    updated: "2026-11-28",
  },
  {
    slug: "keenetic",
    name: "Настройка гостевого Wi-Fi на оборудовании Keenetic",
    shortName: "Keenetic",
    category: "Малый бизнес и локальные точки",
    metaTitle: "Гостевой Wi-Fi на Keenetic: особенности настройки Hotspot",
    metaDescription: "Как подключить роутеры Keenetic к гостевому Wi-Fi HVALA по ПП РФ № 2607: гостевой сегмент, VLAN, Wi-Fi-система и связка со шлюзом.",
    models: "Keenetic Peak, Ultra, Giga, Hopper, Orbiter Pro",
    bestFor: "Небольшие кофейни, барбершопы, салоны красоты и пекарни",
    answer:
      "Роутеры Keenetic часто уже установлены в небольших кофейнях, салонах красоты и пекарнях. У Keenetic удобная Wi-Fi-система (Mesh) и встроенный гостевой сегмент с изоляцией от касс, а для полноценного коммерческого Hotspot по ПП РФ № 2607 их используют в режиме внешнего Captive Portal (линейка Pro) либо в связке с компактным шлюзом, сохраняя точки Keenetic для раздачи Wi-Fi.",
    sections: [
      {
        heading: "Особенности настройки гостевого Wi-Fi на Keenetic",
        paragraphs: [
          "При подключении заведений на Keenetic инженеры учитывают поколение модели и объём гостевого трафика:",
        ],
        bullets: [
          "разделение на основной и гостевой сегменты (изолированная подсеть и VLAN) — касса и терминалы полностью скрыты от посетителей;",
          "настройка ограничений скорости на гостевой сегмент, чтобы один клиент не занимал весь канал;",
          "сохранение единой Wi-Fi-системы Keenetic (бесшовный роуминг 802.11k/r/v) при подключении гостевого VLAN через шлюз авторизации;",
          "корректная работа страницы входа на смартфонах iOS и Android без ручного ввода адреса в браузере.",
        ],
      },
      {
        heading: "Как запустить HVALA, если у вас уже стоит Keenetic",
        paragraphs: [
          "Не спешите менять всё оборудование: пришлите инженеру HVALA модель вашего Keenetic и схему помещения. Мы подскажем самый быстрый и недорогой способ подключения, настроим авторизацию по ПП РФ № 2607 за 2 рабочих дня и поможем запустить сбор базы гостей.",
        ],
      },
    ],
    faq: [
      {
        q: "Подойдёт ли Keenetic для большой кофейни или ресторана на 100+ гостей?",
        a: "Для малых залов до 20⁠–⁠30 одновременных гостей Keenetic работает стабильно. При высокой плотности посадки лучше использовать бизнес-точки MikroTik, UniFi или Omada.",
      },
      {
        q: "Можно ли оставить Keenetic как точку доступа, а авторизацию вынести на шлюз?",
        a: "Да, это частая схема: Keenetic продолжает раздавать Wi-Fi в зале, а гостевой VLAN и Hotspot обрабатывает выделенный маршрутизатор.",
      },
    ],
    relatedVendors: ["mikrotik", "tp-link", "d-link"],
    relatedGlossary: ["guest-wifi", "vlan-trunk-bridge", "mesh-wifi", "pp-2607"],
    updated: "2026-11-28",
  },
  {
    slug: "d-link",
    name: "Настройка Hotspot на оборудовании D-Link",
    shortName: "D-Link",
    category: "Малый бизнес и локальные точки",
    metaTitle: "Настройка Hotspot на D-Link (Nuclias / DAP) для Wi-Fi",
    metaDescription: "Особенности настройки гостевого Wi-Fi, Captive Portal и VLAN на оборудовании D-Link Nuclias и серии DAP для подключения к HVALA.",
    models: "D-Link Nuclias DBA/DAP, DAP-2680/2662, контроллеры DWC",
    bestFor: "Небольшие гостиницы, кафе, магазины и офисные пространства",
    answer:
      "Бизнес-линейка D-Link (точки доступа серии DAP, облачная платформа Nuclias и контроллеры DWC) поддерживает гостевые SSID, тегирование VLAN и перенаправление на внешний Captive Portal. Если в вашем заведении уже установлено оборудование D-Link, инженеры HVALA помогут подключить авторизацию по ПП РФ № 2607 без полной замены сети.",
    sections: [
      {
        heading: "Особенности настройки гостевого Wi-Fi на D-Link",
        paragraphs: [
          "Как и у других производителей, бытовые роутеры DIR не подходят для коммерческого Hotspot, но бизнес-серия DAP и Nuclias закрывает базовые требования:",
        ],
        bullets: [
          "выделение отдельного гостевого SSID и изоляция клиентов (WLAN Partition / L2 Isolation), чтобы гости не видели кассовую сеть;",
          "проброс гостевого VLAN на маршрутизатор или настройка внешнего портала через Nuclias / DWC;",
          "добавление доменов и IP-адресов портала HVALA в список разрешённых ресурсов до авторизации (Walled Garden);",
          "ограничение скорости на клиента и контроль времени простоя (idle-timeout).",
        ],
      },
      {
        heading: "Поддержка инженеров HVALA",
        paragraphs: [
          "Перед подключением наши специалисты бесплатно проверят совместимость ваших моделей D-Link и предложат оптимальную схему запуска. Подключение занимает от 2 рабочих дней и стоит 29 900 ₽ разово без абонентской платы.",
        ],
      },
    ],
    faq: [
      {
        q: "Нужно ли менять точки D-Link DAP, если они уже висят на потолке?",
        a: "Чаще всего нет: точки DAP переводят в режим работы с отдельным гостевым VLAN, а функции Hotspot выполняет маршрутизатор на входе.",
      },
      {
        q: "Работает ли HVALA с облачной платформой D-Link Nuclias?",
        a: "Да, Nuclias поддерживает внешний Captive Portal и правила Walled Garden.",
      },
    ],
    relatedVendors: ["tp-link", "keenetic", "zyxel"],
    relatedGlossary: ["vlan-trunk-bridge", "walled-garden", "hotspot", "pp-2607"],
    updated: "2026-11-28",
  },
  {
    slug: "aruba",
    name: "Настройка Hotspot на оборудовании HPE Aruba",
    shortName: "HPE Aruba",
    category: "Корпоративный и отельный сегмент",
    metaTitle: "Настройка Hotspot на HPE Aruba (Instant / Central)",
    metaDescription: "Особенности подключения HPE Aruba Instant, Aruba Central и Aruba Instant On к платформе гостевого Wi-Fi HVALA с внешним Captive Portal.",
    models: "Aruba AP-505/515/635, Aruba Instant, Aruba Central, Instant On",
    bestFor: "Отели, бизнес-центры, клиники, автодилеры и крупные рестораны",
    answer:
      "HPE Aruba (Aruba Instant, Aruba Central и линейка для малого бизнеса Instant On) широко применяется в сетевых отелях, бизнес-центрах и автосалонах. Оборудование Aruba поддерживает внешний Captive Portal, гибкие роли доступа (User Roles), Walled Garden и встроенный бесшовный роуминг — всё это позволяет подключить HVALA с соблюдением ПП РФ № 2607 без замены точек доступа.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на HPE Aruba",
        paragraphs: [
          "В архитектуре Aruba доступ гостя управляется через ролевую модель (Pre-Auth Role и Authenticated Role), что делает изоляцию максимально надёжной:",
        ],
        bullets: [
          "External Captive Portal Profile — указание URL страницы авторизации HVALA и параметров редиректа;",
          "Walled Garden (Whitelist / Pre-Auth ACL) — разрешение доменов и IP-адресов портала до подтверждения номера;",
          "строгое разделение трафика на уровне VLAN и блокировка обращения к локальным сетям отеля или клиники;",
          "стабильная работа роуминга ClientMatch при переходе гостей между этажами и конференц-залами.",
        ],
      },
      {
        heading: "Внедрение HVALA на базе Aruba",
        paragraphs: [
          "Инженеры HVALA работают напрямую с вашим IT-специалистом или интегратором: передаём точную спецификацию правил Walled Garden, проверяем работу Captive Portal на iOS/Android и запускаем брендированную страницу входа, сбор базы и опросы NPS.",
        ],
      },
    ],
    faq: [
      {
        q: "Поддерживается ли линейка Aruba Instant On?",
        a: "Да. В Aruba Instant On можно подключить внешний портал или вывести гостевой VLAN на шлюз авторизации.",
      },
      {
        q: "Можно ли показывать разные страницы входа для разных корпусов отеля?",
        a: "Да. Платформа HVALA позволяет задавать отдельные брендированные страницы и акции для каждой локации в одном личном кабинете.",
      },
    ],
    relatedVendors: ["cisco", "ruckus", "huawei"],
    relatedGlossary: ["walled-garden", "captive-portal-android-ios", "mesh-wifi", "nps"],
    updated: "2026-11-28",
  },
  {
    slug: "huawei",
    name: "Настройка Hotspot на оборудовании Huawei",
    shortName: "Huawei",
    category: "Корпоративный и отельный сегмент",
    metaTitle: "Настройка Hotspot на Huawei (AirEngine / CloudCampus)",
    metaDescription: "Особенности настройки гостевого Wi-Fi, External Portal и Walled Garden на Huawei AirEngine, AC-контроллерах и CloudCampus с HVALA.",
    models: "Huawei AirEngine 5761/6761, контроллеры AC6508/AC6805, CloudCampus",
    bestFor: "Отели, торговые центры, вузы, бизнес-центры и крупные сети",
    answer:
      "Точки доступа Huawei AirEngine с поддержкой Wi-Fi 6/7 и контроллеры серии AC активно используются в российских отелях, торговых центрах, университетах и крупных сетях. Оборудование Huawei поддерживает внешний веб-портал (Portal Authentication), Free-Rule (Walled Garden), гибкие ACL и VLAN — платформа HVALA подключается к ним без перестройки сети.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на Huawei",
        paragraphs: [
          "На контроллерах Huawei (VRP) и в облачной платформе iMaster NCE-Campus гостевая авторизация настраивается через шаблоны Portal Server и Free-Rule:",
        ],
        bullets: [
          "Portal Server Profile — подключение внешнего URL страницы входа HVALA и параметров передачи данных устройства;",
          "Free-Rule (аналог Walled Garden) — разрешение DNS, доменов и IP-адресов портала авторизации до входа гостя;",
          "разделение служебного и гостевого трафика через VLAN и trunk-порты коммутаторов;",
          "контроль скорости на пользователя (Traffic Profile) и таймаутов неактивности (idle-cut).",
        ],
      },
      {
        heading: "Запуск гостевого Wi-Fi HVALA на Huawei",
        paragraphs: [
          "Мы помогаем IT-командам настроить шаблоны на контроллерах Huawei, проверяем корректное открытие страницы входа на iOS и Android и закрываем требования ПП РФ № 2607. Подключение занимает от 2 рабочих дней.",
        ],
      },
    ],
    faq: [
      {
        q: "Работает ли HVALA с точками Huawei в режиме Fat AP без контроллера?",
        a: "Для малых объектов точки Huawei в режиме Fat AP часто объединяют со шлюзом MikroTik для управления Hotspot; при наличии контроллера AC или CloudCampus портал настраивается централизованно.",
      },
      {
        q: "Выдержит ли связка Huawei AirEngine + HVALA конференцию на 500+ человек?",
        a: "Да. Оборудование Huawei AirEngine рассчитано на высокую плотность клиентов, а облачная платформа HVALA стабильно обрабатывает пиковые нагрузки.",
      },
    ],
    relatedVendors: ["cisco", "aruba", "eltex"],
    relatedGlossary: ["walled-garden", "vlan-trunk-bridge", "hotspot-timeouts-mac-cookies", "pp-2607"],
    updated: "2026-11-28",
  },
  {
    slug: "eltex",
    name: "Настройка Hotspot на оборудовании Eltex",
    shortName: "Eltex",
    category: "Корпоративный и отельный сегмент",
    metaTitle: "Настройка Hotspot на Eltex (WEP / SoftWLC) для Wi-Fi",
    metaDescription: "Особенности подключения российского оборудования Eltex (точки WEP/WOP, контроллер SoftWLC) к платформе гостевого Wi-Fi HVALA по ПП РФ № 2607.",
    models: "Eltex WEP-2ac/3ax, уличные WOP-2ac/3ax, контроллер SoftWLC, ESR",
    bestFor: "Госсектор, вузы, санатории, отели и компании с требованиями импортозамещения",
    answer:
      "Eltex — ведущий российский производитель сетевого оборудования, который широко используют в вузах, санаториях, отелях, ТЦ и компаниях с требованиями импортозамещения. Точки доступа WEP/WOP, маршрутизаторы ESR и контроллер SoftWLC поддерживают внешний Captive Portal, белые списки (Walled Garden) и изоляцию VLAN для подключения к HVALA по ПП РФ № 2607.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на Eltex",
        paragraphs: [
          "При развёртывании гостевого Wi-Fi на оборудовании Eltex используют либо связку с контроллером SoftWLC, либо вывод гостевого VLAN на сервисный шлюз:",
        ],
        bullets: [
          "настройка профиля Captive Portal и списка разрешённых доменов/IP до авторизации;",
          "поддержка уличных точек серии WOP для открытых территорий санаториев, парков и городских мероприятий;",
          "разделение корпоративного и гостевого трафика на коммутаторах MES и маршрутизаторах ESR через VLAN tagged/untagged;",
          "полное соответствие требованиям российского законодательства (ПП РФ № 2607 и 152-ФЗ).",
        ],
      },
      {
        heading: "Подключение Eltex к платформе HVALA",
        paragraphs: [
          "Инженеры HVALA имеют опыт работы с российским сетевым оборудованием и помогут интегрировать вашу инфраструктуру Eltex в единую платформу авторизации, сбора базы гостей и аналитики визитов за 2 рабочих дня.",
        ],
      },
    ],
    faq: [
      {
        q: "Подходит ли связка Eltex + HVALA для университетов и санаториев?",
        a: "Да. Оборудование Eltex обеспечивает надёжное покрытие больших корпусов, а HVALA закрывает законную идентификацию пользователей и аналитику.",
      },
      {
        q: "Обязателен ли контроллер SoftWLC для небольшого объекта на 2⁠–⁠3 точках Eltex?",
        a: "Для малых объектов достаточно вывести гостевой SSID в отдельный VLAN и подключить шлюз авторизации без развёртывания тяжёлого сервера SoftWLC.",
      },
    ],
    relatedVendors: ["huawei", "cisco", "mikrotik"],
    relatedGlossary: ["pp-2607", "vlan-trunk-bridge", "walled-garden", "mesh-wifi"],
    updated: "2026-11-28",
  },
  {
    slug: "zyxel",
    name: "Настройка Hotspot на оборудовании Zyxel",
    shortName: "Zyxel",
    category: "Малый бизнес и локальные точки",
    metaTitle: "Настройка Hotspot на Zyxel (Nebula / NWA) для Wi-Fi",
    metaDescription: "Особенности настройки Captive Portal и Walled Garden на точках доступа Zyxel Nebula (NWA, WAX) для гостевого Wi-Fi HVALA по ПП РФ № 2607.",
    models: "Zyxel NWA50AX/90AX/110AX, WAX510D/610D, Nebula Cloud",
    bestFor: "Кафе, небольшие отели, фитнес-студии, клиники и офисы",
    answer:
      "Точки доступа Zyxel серий NWA и WAX под управлением облачной платформы Nebula Cloud позволяют быстро развернуть гостевую сеть без покупки отдельного контроллера. В Nebula поддерживаются внешний Captive Portal, Walled Garden, изоляция клиентов (Layer-2 Isolation) и ограничение скорости, что удобно для подключения к HVALA.",
    sections: [
      {
        heading: "Особенности настройки Hotspot на Zyxel Nebula",
        paragraphs: [
          "Облачное управление Nebula удобно для небольших сетей из 2⁠–⁠10 точек, где нет штатного сисадмина на каждой локации:",
        ],
        bullets: [
          "раздел Access Point → Access control позволяет включить External Captive Portal и задать URL страницы входа HVALA;",
          "Walled Garden открывает доступ к доменам и IP-адресам платформы авторизации до подтверждения номера;",
          "Layer-2 Isolation и отдельный гостевой VLAN закрывают доступ посетителей к кассовым терминалам и офисным ПК;",
          "лимиты полосы пропускания на клиента (Bandwidth Control) гарантируют ровную скорость для всего зала.",
        ],
      },
      {
        heading: "Запуск HVALA на оборудовании Zyxel",
        paragraphs: [
          "Инженеры HVALA настроят ваши точки Zyxel удалённо за 2 рабочих дня, проверят работу страницы входа на смартфонах и подключат личный кабинет с базой гостей, акциями и поддержкой 24/7.",
        ],
      },
    ],
    faq: [
      {
        q: "Нужна ли платная подписка Nebula Pro для работы с гостевым Wi-Fi HVALA?",
        a: "Базовый функционал облачного управления и VLAN доступен в бесплатной версии Nebula; если нужны расширенные сценарии Hotspot, точки Zyxel легко работают в паре со шлюзом.",
      },
      {
        q: "Подойдут ли точки Zyxel NWA для двухэтажного кафе?",
        a: "Да, модели NWA/WAX с поддержкой Wi-Fi 6 обеспечивают стабильный роуминг между этажами при проводном подключении точек.",
      },
    ],
    relatedVendors: ["tp-link", "grandstream", "d-link"],
    relatedGlossary: ["captive-portal", "walled-garden", "wifi-session-limits", "guest-wifi"],
    updated: "2026-11-28",
  },
];

export const equipmentBySlug = (slug: string) => equipmentVendors.find((v) => v.slug === slug);
