// Живая лента отзывов 2ГИС — официальный конструктор виджетов 2ГИС (disk.2gis.com/widget-constructor).
// Код виджета — тот же, что на hvalawifi.ru/4u (прислал Ник 26.10.2026). Вместо document.write из оригинального
// кода разметка передаётся через srcDoc: iframe рендерится без нашего JavaScript, скрипты 2ГИС грузятся внутри него.
export function TwoGisReviews({ orgId, branchId, title, className }: { orgId: string; branchId: string; title: string; className?: string }) {
  const doc =
    `<head><script>window.__size__='big';window.__theme__='light';window.__branchId__='${branchId}';window.__orgId__='${orgId}';</script>` +
    `<script crossorigin="anonymous" type="module" src="https://disk.2gis.com/widget-constructor/assets/iframe.js"></script>` +
    `<link rel="modulepreload" crossorigin="anonymous" href="https://disk.2gis.com/widget-constructor/assets/defaults.js">` +
    `<link rel="stylesheet" crossorigin="anonymous" href="https://disk.2gis.com/widget-constructor/assets/defaults.css"></head><body><div id="iframe"></div></body>`;
  return (
    <iframe
      title={title} srcDoc={doc} loading="lazy" height={824}
      sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      className={className}
    />
  );
}
