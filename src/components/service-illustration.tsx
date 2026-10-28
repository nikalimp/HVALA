// Векторные анимированные иллюстрации для hero страниц направлений — по одной на направление.
// Чистый SVG + CSS-анимации (классы .il-* в globals.css): без JavaScript, без внешних файлов.
// Цвета — только токены: контуры currentColor, акцент var(--brand-vivid), подложки var(--muted) / var(--background).
// prefers-reduced-motion — статичный кадр. Для экранных читалок иллюстрация скрыта: смысл — в тексте рядом.
import { cn } from "@/lib/utils";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const BRAND = "var(--brand-vivid)";

function Phone({ x, y, children }: { x: number; y: number; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="120" height="220" rx="20" {...S} fill="var(--background)" />
      <rect x="44" y="10" width="32" height="7" rx="3.5" fill="currentColor" />
      {children}
    </g>
  );
}

function WifiArcs({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} {...S} stroke={BRAND} strokeWidth={5}>
      <circle cx="0" cy="0" r="4" fill={BRAND} stroke="none" />
      <path className="il-arc il-arc-1" d="M-14 -12 a19 19 0 0 1 28 0" />
      <path className="il-arc il-arc-2" d="M-26 -22 a35 35 0 0 1 52 0" />
      <path className="il-arc il-arc-3" d="M-38 -32 a51 51 0 0 1 76 0" />
    </g>
  );
}

// Wi‑Fi для заведений: гость входит по номеру — у заведения появляется новый контакт
function GuestWifi() {
  return (
    <>
      <WifiArcs x={160} y={72} />
      <Phone x={100} y={84}>
        <rect x="14" y="34" width="92" height="40" rx="8" fill="var(--muted)" />
        <rect x="26" y="48" width="44" height="6" rx="3" fill="currentColor" opacity=".5" />
        <rect x="14" y="88" width="92" height="22" rx="6" {...S} strokeWidth={2} />
        <g className="il-type">
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={26 + i * 11} cy="99" r="3" fill="currentColor" style={{ animationDelay: `${i * 0.18}s` }} />)}
        </g>
        <rect className="il-press" x="14" y="122" width="92" height="24" rx="8" fill={BRAND} />
      </Phone>
      <g className="il-pop">
        <rect x="196" y="190" width="104" height="52" rx="12" {...S} fill="var(--background)" strokeWidth={2.5} />
        <circle cx="218" cy="216" r="11" fill={BRAND} />
        <path d="M213 216 l4 4 l7 -8" {...S} stroke="var(--background)" strokeWidth={2.5} />
        <rect x="236" y="206" width="50" height="6" rx="3" fill="currentColor" />
        <rect x="236" y="220" width="34" height="6" rx="3" fill="currentColor" opacity=".4" />
      </g>
    </>
  );
}

// Реклама в Wi‑Fi: при подключении баннер бренда выезжает на весь экран
function Advertising() {
  return (
    <>
      <WifiArcs x={60} y={92} s={0.8} />
      <Phone x={100} y={50}>
        <rect x="10" y="26" width="100" height="184" rx="10" fill="var(--muted)" />
        <g clipPath="url(#il-screen)">
          <g className="il-banner">
            <rect x="10" y="26" width="100" height="184" rx="10" fill={BRAND} />
            <circle cx="60" cy="92" r="24" fill="var(--background)" opacity=".9" />
            <rect x="28" y="134" width="64" height="8" rx="4" fill="var(--background)" />
            <rect x="38" y="150" width="44" height="6" rx="3" fill="var(--background)" opacity=".7" />
            <rect x="26" y="176" width="68" height="20" rx="10" fill="var(--background)" />
          </g>
        </g>
        <defs><clipPath id="il-screen"><rect x="10" y="26" width="100" height="184" rx="10" /></clipPath></defs>
      </Phone>
      <g className="il-tap">
        <circle cx="160" cy="236" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="160" cy="236" r="5" fill="currentColor" />
      </g>
      <g className="il-pop" style={{ animationDelay: "1.6s" }}>
        <rect x="236" y="96" width="70" height="34" rx="10" {...S} fill="var(--background)" strokeWidth={2.5} />
        <path d="M250 120 l10 -10 l8 6 l14 -14" {...S} stroke={BRAND} strokeWidth={3} />
      </g>
    </>
  );
}

// Wi‑Fi на мероприятиях: сеть накрывает площадку, гости подключаются один за другим
function EventWifi() {
  const crowd = Array.from({ length: 18 }, (_, i) => ({ x: 52 + (i % 6) * 43 + (Math.floor(i / 6) % 2) * 20, y: 196 + Math.floor(i / 6) * 34 }));
  return (
    <>
      <path d="M40 132 h240" {...S} />
      <path d="M70 132 v-34 h180 v34" {...S} />
      <WifiArcs x={160} y={88} s={1.1} />
      {crowd.map((p, i) => (
        <g key={i} className="il-guest" style={{ animationDelay: `${(i * 0.23) % 3.2}s` }}>
          <circle cx={p.x} cy={p.y - 9} r="7" fill="currentColor" />
          <path d={`M${p.x - 11} ${p.y + 12} a11 11 0 0 1 22 0`} fill="currentColor" />
        </g>
      ))}
    </>
  );
}

// TRAP: радар собирает смартфоны вокруг точки и отправляет аудиторию в рекламу
function Trap() {
  const dots = [[80, 96], [236, 84], [262, 196], [70, 214], [118, 262], [214, 262], [150, 70], [276, 136]];
  return (
    <>
      <g {...S} strokeWidth={2} opacity=".35">
        <circle cx="160" cy="170" r="50" />
        <circle cx="160" cy="170" r="90" />
        <circle cx="160" cy="170" r="128" strokeDasharray="4 8" />
      </g>
      <g className="il-sweep" style={{ transformOrigin: "160px 170px" }}>
        <path d="M160 170 L160 42 A128 128 0 0 1 250 80 Z" fill={BRAND} opacity=".18" />
        <path d="M160 170 L160 42" stroke={BRAND} strokeWidth="3" />
      </g>
      {dots.map(([x, y], i) => (
        <g key={i} className="il-blip" style={{ animationDelay: `${i * 0.5}s` }}>
          <rect x={x - 7} y={y - 11} width="14" height="22" rx="4" fill="var(--background)" stroke="currentColor" strokeWidth="2.5" />
          <circle cx={x} cy={y} r="2.5" fill={BRAND} />
        </g>
      ))}
      <rect x="138" y="150" width="44" height="40" rx="10" fill="currentColor" />
      <circle cx="160" cy="170" r="7" fill={BRAND} className="il-led" />
    </>
  );
}

// Франшиза: точки HVALA загораются в новых городах и соединяются в сеть
function Franchise() {
  const pins = [[70, 120], [132, 84], [204, 110], [258, 76], [100, 206], [176, 186], [246, 222], [150, 262]];
  const links = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [4, 7], [7, 6]];
  return (
    <>
      <g {...S} strokeWidth={2} opacity=".25">
        {[60, 110, 160, 210, 260].map((y) => <path key={y} d={`M30 ${y} h260`} strokeDasharray="2 10" />)}
      </g>
      {links.map(([a, b], i) => (
        <path key={i} className="il-link" style={{ animationDelay: `${i * 0.35}s` }} d={`M${pins[a][0]} ${pins[a][1]} L${pins[b][0]} ${pins[b][1]}`} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" pathLength={1} />
      ))}
      {pins.map(([x, y], i) => (
        <g key={i} className="il-pin" style={{ animationDelay: `${i * 0.35}s`, transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r="13" fill={BRAND} opacity=".18" />
          <circle cx={x} cy={y} r="7" fill={BRAND} />
        </g>
      ))}
    </>
  );
}

const map: Record<string, () => React.ReactElement> = {
  "guest-wifi": GuestWifi, advertising: Advertising, "event-wifi": EventWifi, trap: Trap, franchise: Franchise,
};

export function ServiceIllustration({ slug, className }: { slug: string; className?: string }) {
  const Art = map[slug];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 320 320" aria-hidden className={cn("il text-foreground", className)}>
      <Art />
    </svg>
  );
}
