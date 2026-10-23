// Данные рабочего стола (первый экран главной): приложения, кейсы, форматы рекламы, корзина.
// Факты — из specs/00-brief.md и specs/source/ (действующие сайты HVALA, снято 23.10.2026). Не выдумывать.

export type AppId =
  | "about"
  | "cases"
  | "mail"
  | "calendar"
  | "messages"
  | "launchpad"
  | "spotlight"
  | "tools"
  | "now"
  | "gallery"
  | "trash"
  | "wifi"
  | "directions";

// Страницы сайта, которые открываются окнами поверх рабочего стола
export const pageApps = [
  { id: "page:guest-wifi", href: "/services/guest-wifi/", label: "Wi‑Fi для заведений", icon: "wifi" },
  { id: "page:advertising", href: "/services/advertising/", label: "Реклама в Wi‑Fi", icon: "megaphone" },
  { id: "page:event-wifi", href: "/services/event-wifi/", label: "Мероприятия", icon: "party" },
  { id: "page:trap", href: "/services/trap/", label: "TRAP", icon: "radar" },
  { id: "page:franchise", href: "/services/franchise/", label: "Франшиза", icon: "handshake" },
  { id: "page:about", href: "/about/", label: "О компании", icon: "building" },
  { id: "page:contacts", href: "/contacts/", label: "Контакты", icon: "phone" },
  { id: "page:blog", href: "/blog/", label: "Блог", icon: "newspaper" },
] as const;

// Приложения: окна, которые существуют только на рабочем столе
export const apps: { id: AppId; label: string; title: string; icon: string; dock: boolean; desktop?: boolean; fallback: string }[] = [
  { id: "directions", label: "Направления", title: "Направления", icon: "folder-wifi", dock: false, desktop: true, fallback: "/services/" },
  { id: "cases", label: "Кейсы", title: "Кейсы", icon: "folder", dock: true, desktop: true, fallback: "/cases/" },
  { id: "launchpad", label: "Все разделы", title: "Все разделы", icon: "grid", dock: true, fallback: "/services/" },
  { id: "mail", label: "Заявка", title: "Новая заявка", icon: "mail", dock: true, fallback: "https://t.me/kirillSyndicate" },
  { id: "calendar", label: "Созвон", title: "Созвон", icon: "calendar", dock: true, fallback: "https://t.me/kirillSyndicate" },
  { id: "messages", label: "Спросить HVALA", title: "Сообщения", icon: "message", dock: true, fallback: "/#faq" },
  { id: "spotlight", label: "Поиск", title: "Поиск", icon: "search", dock: false, fallback: "/services/" },
  { id: "wifi", label: "Демо Wi‑Fi", title: "Демо: Wi-Fi гостя", icon: "smartphone", dock: false, fallback: "/services/guest-wifi/" },
  { id: "tools", label: "Инструменты", title: "Инструменты", icon: "blocks", dock: false, fallback: "/services/guest-wifi/" },
  { id: "gallery", label: "Форматы рекламы", title: "Форматы рекламы", icon: "images", dock: true, fallback: "/services/advertising/" },
  { id: "trash", label: "Корзина", title: "Корзина", icon: "trash", dock: true, fallback: "/" },
];

export type CaseItem = {
  id: string;
  group: "Заведения" | "Реклама" | "TRAP";
  title: string;
  brand?: string;
  text: string;
  metrics: string[];
  tags: string[];
  video?: string; // креатив кампании с banners.hvala.me — грузится только при открытии кейса
};

export const caseGroups = ["Заведения", "Реклама", "TRAP"] as const;

export const cases: CaseItem[] = [
  { id: "popup", group: "Заведения", title: "Всплывающая акция", text: "Акция на весь экран при входе в Wi-Fi заведения.", metrics: ["40 уникальных подключений в день (~1 200 показов в месяц)", "средний чек 1 500 ₽", "конверсия 4%"], tags: ["Акции"] },
  { id: "sms", group: "Заведения", title: "SMS со скидкой на доставку", text: "Собрали номера гостей из Wi-Fi и отправили SMS со скидкой на доставку.", metrics: ["80% SMS доставлено", "конверсия 1,5%", "средний чек доставки 1 000 ₽"], tags: ["SMS"] },
  { id: "festival", group: "Заведения", title: "Реклама фестиваля по базе гостей", text: "Выгрузили номера гостей в Яндекс и показали рекламу фестиваля.", metrics: ["25 000 номеров выгружено", "аудитория в Яндексе — 13 862", "45 000 показов, CTR 1,41%"], tags: ["Яндекс Аудитории"] },
  { id: "return", group: "Заведения", title: "Возврат гостей сети ресторанов", text: "Реклама с новым меню и спецпредложениями для гостей, которые давно не приходили.", metrics: ["охват 26 000", "вернулись 1 723 гостя"], tags: ["Ретаргетинг"] },
  { id: "sokolov", group: "Реклама", brand: "Соколов", title: "Подвеска за визит в магазин", text: "Анимированный баннер в ресторанах рядом с магазинами, ЦА 18⁠–⁠45.", metrics: ["охват 540 000", "CTR 5,4%"], tags: ["Анимация", "Гео"] },
  { id: "t2", group: "Реклама", brand: "T2", title: "Максимальный охват в кафе и ресторанах", text: "Fullscreen в кафе, кофейнях и ресторанах.", metrics: ["CTR 4,7%"], tags: ["Fullscreen"], video: "https://banners.hvala.me/Hvala/IMG_0847.MP4" },
  { id: "tank", group: "Реклама", brand: "Tank", title: "Переход на лендинг бренда", text: "Fullscreen для мужчин 25⁠–⁠45.", metrics: ["охват 230 000", "CTR 4,9%"], tags: ["Fullscreen"] },
  { id: "litres", group: "Реклама", brand: "ЛитРес", title: "2 месяца подписки в подарок", text: "Fullscreen с промокодом на подписку.", metrics: ["CTR 4,8%"], tags: ["Fullscreen"] },
  { id: "haval", group: "Реклама", brand: "HAVAL", title: "Лиды для автодилера", text: "Fullscreen для мужчин 25⁠–⁠45 с переходом на лендинг бренда.", metrics: ["1 018 лидов"], tags: ["Fullscreen", "Лиды"] },
  { id: "sovcombank", group: "Реклама", brand: "Совкомбанк", title: "Заявка на карту прямо в баннере", text: "2 Level Banner: заявка из баннера уходит в CRM банка, ЦА 18+.", metrics: ["CTR 5%"], tags: ["2 Level", "Лиды"] },
  { id: "ubrir", group: "Реклама", brand: "УБРиР", title: "Кредитная карта с заявкой в баннере", text: "Интерактивный баннер с формой заявки.", metrics: ["143 заявки", "56 выданных карт"], tags: ["Лиды"] },
  { id: "metro", group: "Реклама", brand: "METRO", title: "Гостевая карта через Wi-Fi", text: "Fullscreen с предложением скачать гостевую карту.", metrics: ["700+ скачанных карт"], tags: ["Fullscreen"] },
  { id: "shateau", group: "Реклама", brand: "Shateau Tamagne", title: "Новогодняя кампания", text: "Анимированный fullscreen с новогодней ёлкой.", metrics: ["охват 300 000", "CTR 4,3%"], tags: ["Анимация"], video: "https://banners.hvala.me/Hvala/IMG_0862.MOV" },
  { id: "vkusvill", group: "Реклама", brand: "ВкусВилл", title: "Установки приложения", text: "Анимированный fullscreen ведёт в App Store, Google Play или AppGallery по ОС пользователя.", metrics: ["CTR 4,3%"], tags: ["Анимация", "Приложение"], video: "https://banners.hvala.me/Hvala/IMG_7505.MOV" },
  { id: "skm", group: "Реклама", brand: "СКМ", title: "Премиальные заведения", text: "Анимированный баннер с таргетингом на премиальные заведения.", metrics: ["охват 304 000", "15 000 кликов", "CTR 4,95%"], tags: ["Анимация"], video: "https://banners.hvala.me/Hvala/IMG_7496.MP4" },
  { id: "talitskoe", group: "Реклама", brand: "Талицкое молоко", title: "Сегмент ресторанов", text: "Fullscreen в ресторанах.", metrics: ["охват 10 000", "CTR 4,7%"], tags: ["Fullscreen"], video: "https://banners.hvala.me/Hvala/IMG_7725.MP4" },
  { id: "akadem", group: "Реклама", brand: "Академический", title: "Выбор планировки в жилом комплексе", text: "Fullscreen ведёт на выбор планировки.", metrics: ["CTR 6,7%"], tags: ["Fullscreen"], video: "https://banners.hvala.me/Hvala/IMG_7724.MOV" },
  { id: "trap-mall", group: "TRAP", title: "Конверсия рекламы в торговом центре", text: "TRAP на каждом входе ТЦ. MAC-адреса тех, кто видел баннер в сети HVALA, сопоставили с посетителями.", metrics: ["83 000 показов", "1 743 посетителя", "конверсия 2,1%"], tags: ["Офлайн-аудитория"] },
  { id: "trap-lunch", group: "TRAP", title: "Бизнес-ланч для прохожих", text: "Месяц сбора аудитории, реклама прохожим с 12:00 до 16:00 в Яндексе и Mail.", metrics: ["33 759 MAC-адресов", "173 гостя вернулись", "+253 ланча за месяц", "+59 607 ₽ выручки при бюджете 10 000 ₽"], tags: ["Офлайн-аудитория", "Яндекс Аудитории"] },
  { id: "trap-promo", group: "TRAP", title: "Промопродукция", text: "78 799 MAC-адресов, 12 279 из них обогащены номерами телефонов через HVALA.", metrics: ["56 000 показов за 6 000 ₽", "870 человек вернулись", "конверсия 1,5%"], tags: ["Офлайн-аудитория"] },
];

export const caseTags = [...new Set(cases.flatMap((c) => c.tags))];

// Форматы рекламы — видео с hvalamobile.com (Action banner — с CDN Tilda; перенести в репозиторий — долг в 05-tasks.md)
export const formats = [
  { id: "fullscreen", title: "Fullscreen", text: "Баннер на весь экран — один из самых эффективных форматов с максимальным имиджевым воздействием.", points: ["Имиджевый формат", "Кликабельный", "Интерактивный", "Максимальная видимость"], video: "https://banners.hvala.me/Hvala/IMG_7484.MOV" },
  { id: "action", title: "Action banner", text: "Интерактивный баннер с игровой механикой: человек участвует сам, и вовлечённость растёт.", points: ["Игровая механика", "Запоминающийся формат", "Несколько кликабельных зон", "Длительный контакт с брендом"], video: "https://static.tildacdn.com/vide3138-3461-4531-b762-633438303431/IMG_7915.mp4" },
  { id: "survey", title: "Survey banner", text: "Баннер-опрос: пользователь сам выбирает, что ему интересно.", points: ["Многослойный баннер", "Таргетированный показ", "Сбор первичных данных", "Высокая глубина касания"], video: "https://banners.hvala.me/Hvala/IMG_7909.MOV" },
  { id: "second", title: "2 Level Banner", text: "Двухуровневый баннер: на втором уровне — форма заявки для лояльной аудитории.", points: ["Сбор лидов: телефон, email, имя", "Двухступенчатая конверсия", "Высокое качество лидов", "Длительный контакт с брендом"], video: "https://banners.hvala.me/Hvala/IMG_0872.MP4" },
];

export const trashFiles = [
  "потерянные_контакты_гостей.xlsx",
  "скучная_страница_входа.png",
  "рассылка_вручную_FINAL_v3.docx",
  "роутер_без_авторизации.cfg",
];
