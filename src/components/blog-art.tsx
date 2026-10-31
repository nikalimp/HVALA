// Обложки и инфографика статей блога — векторные, в токенах бренда (светлая и тёмная тема), шрифт сайта.
// Обложка: <BlogCover slug> (16:9) — в карточке блога и в шапке статьи. Инфографика: в markdown статьи
// пишем ![подпись](/infographic/<id>) — компонент <Infographic> рисует её на месте картинки.
// В инфографике — только факты из текста самой статьи.
import { cn } from "@/lib/utils";

const INK = "currentColor";
const RED = "var(--brand-vivid)";
const SOFT = "var(--brand-bg)";
const BG = "var(--background)";
const MUTED = "var(--muted-foreground)";

// Пиксельный узор бренда в углу обложки — как битмап на сайте
function Dither({ x, y, cols, rows }: { x: number; y: number; cols: number; rows: number }) {
  const cells = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if ((r * 7 + c * 13 + ((r * c) % 5)) % 3 === 0 && c + r < cols) cells.push(<rect key={`${r}-${c}`} x={x + c * 18} y={y + r * 18} width="12" height="12" rx="2" fill={RED} opacity={0.18 + ((c + r) % 4) * 0.08} />);
  }
  return <g>{cells}</g>;
}

function PhoneShape({ x, y, w = 150, h = 290, children }: { x: number; y: number; w?: number; h?: number; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="26" fill={BG} stroke={INK} strokeWidth="5" />
      <rect x={w / 2 - 22} y="12" width="44" height="9" rx="4.5" fill={INK} />
      {children}
    </g>
  );
}

const covers: Record<string, { tag: string; big: string; small: string; art: React.ReactNode }> = {
  "guest-wifi-guest-database": {
    tag: "Wi‑Fi для заведений", big: "4 шага", small: "от подключения к базе гостей",
    art: (
      <g>
        <PhoneShape x={760} y={170}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(18 ${48 + i * 56})`}>
              <circle cx="16" cy="16" r="16" fill={i === 3 ? RED : SOFT} />
              <rect x="42" y="6" width={64 - i * 6} height="9" rx="4.5" fill={INK} opacity=".8" />
              <rect x="42" y="21" width="44" height="7" rx="3.5" fill={MUTED} opacity=".5" />
            </g>
          ))}
        </PhoneShape>
        <g stroke={RED} strokeWidth="9" strokeLinecap="round" fill="none">
          <path d="M970 230 a40 40 0 0 1 56 0" /><path d="M948 206 a72 72 0 0 1 100 0" /><path d="M926 182 a104 104 0 0 1 144 0" />
        </g>
        <circle cx="998" cy="258" r="9" fill={RED} />
        <g transform="translate(940 330)">
          <rect width="190" height="74" rx="18" fill={BG} stroke={INK} strokeWidth="4" />
          <circle cx="38" cy="37" r="18" fill={RED} />
          <path d="M30 37 l6 6 l11 -12" stroke={BG} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="68" y="45" fontSize="26" fontWeight="600" fill={INK}>+1 гость</text>
        </g>
      </g>
    ),
  },
  "one-time-payment-vs-subscription": {
    tag: "Тарифы", big: "29 900 ₽", small: "раз или в год — что выбрать",
    art: (
      <g>
        {[{ x: 720, t: "Разово", s: "реклама партнёров", hot: false }, { x: 930, t: "В год", s: "без рекламы", hot: true }].map((c) => (
          <g key={c.t} transform={`translate(${c.x} 190)`}>
            <rect width="190" height="270" rx="24" fill={c.hot ? SOFT : BG} stroke={c.hot ? RED : INK} strokeWidth="5" />
            <text x="24" y="58" fontSize="26" fontWeight="600" fill={INK}>{c.t}</text>
            <text x="24" y="118" fontSize="34" fontWeight="700" fill={c.hot ? RED : INK}>29 900</text>
            <text x="24" y="150" fontSize="18" fill={MUTED}>{c.s}</text>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(24 ${182 + i * 28})`}>
                <path d="M0 8 l6 6 l12 -12" stroke={RED} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="28" y="2" width={96 - i * 14} height="9" rx="4.5" fill={INK} opacity=".55" />
              </g>
            ))}
          </g>
        ))}
      </g>
    ),
  },
  "wifi-ad-formats": {
    tag: "Реклама в Wi‑Fi", big: "4 формата", small: "баннеров в момент подключения",
    art: (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <PhoneShape key={i} x={690 + i * 122} y={410 + (i % 2) * 24} w={104} h={216}>
            <rect x="10" y="32" width="92" height="172" rx="12" fill={i === 0 ? RED : SOFT} />
            {i === 1 && [0, 1, 2].map((k) => <rect key={k} x="22" y={60 + k * 40} width="68" height="28" rx="8" fill={BG} stroke={RED} strokeWidth="3" />)}
            {i === 2 && [0, 1, 2].map((k) => <g key={k}><circle cx="30" cy={78 + k * 36} r="9" fill="none" stroke={RED} strokeWidth="3" /><rect x="46" y={73 + k * 36} width="44" height="9" rx="4.5" fill={INK} opacity=".55" /></g>)}
            {i === 3 && <><rect x="22" y="70" width="68" height="16" rx="6" fill={BG} /><rect x="22" y="96" width="68" height="16" rx="6" fill={BG} /><rect x="22" y="130" width="68" height="22" rx="11" fill={RED} /></>}
            {i === 0 && <circle cx="56" cy="110" r="26" fill={BG} opacity=".9" />}
          </PhoneShape>
        ))}
      </g>
    ),
  },
};

export function hasCover(slug: string) { return slug in covers; }

export function BlogCover({ slug, className }: { slug: string; className?: string }) {
  const c = covers[slug];
  if (!c) return null;
  return (
    <svg viewBox="0 0 1200 675" aria-hidden className={cn("block h-auto w-full rounded-xl text-foreground", className)} style={{ background: "var(--card)" }}>
      <Dither x={24} y={420} cols={14} rows={13} />
      <text x="72" y="132" fontSize="34" fontWeight="700" fill={RED} letterSpacing="1">{c.tag.toUpperCase()}</text>
      <text x="66" y="300" fontSize="132" fontWeight="700" fill={INK} letterSpacing="-4">{c.big}</text>
      <text x="72" y="372" fontSize="40" fill={MUTED}>{c.small}</text>
      {c.art}
    </svg>
  );
}

// ——— Инфографика внутри статей ———

function GuestSteps() {
  const steps = [
    { n: "1", t: "Гость подключается", s: "вводит номер на странице входа" },
    { n: "2", t: "Вы получаете контакт", s: "номер, пол, возраст, визиты" },
    { n: "3", t: "Собирается база", s: "постоянные, новые, именинники" },
    { n: "4", t: "Работает маркетинг", s: "акции, SMS, реклама по базе" },
  ];
  return (
    <svg viewBox="0 0 1000 300" className="block h-auto w-full text-foreground">
      <rect width="1000" height="300" rx="20" fill="var(--card)" />
      <path d="M125 110 H875" stroke={RED} strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
      {steps.map((st, i) => (
        <g key={st.n} transform={`translate(${125 + i * 250} 110)`}>
          <circle r="38" fill={i === 3 ? RED : BG} stroke={RED} strokeWidth="4" />
          <text y="13" textAnchor="middle" fontSize="36" fontWeight="700" fill={i === 3 ? BG : RED}>{st.n}</text>
          <text y="96" textAnchor="middle" fontSize="23" fontWeight="600" fill={INK}>{st.t}</text>
          <text y="130" textAnchor="middle" fontSize="18" fill={MUTED}>{st.s}</text>
        </g>
      ))}
    </svg>
  );
}

function TariffCompare() {
  const rows: [string, string, string][] = [
    ["Цена", "29 900 ₽ один раз", "29 900 ₽ в год"],
    ["Подключение", "входит в платёж", "бесплатно"],
    ["Реклама партнёров", "есть", "нет"],
    ["Поддержка 24/7", "да", "да"],
    ["Кабинет и инструменты", "да", "да"],
  ];
  return (
    <svg viewBox="0 0 1000 420" className="block h-auto w-full text-foreground">
      <rect width="1000" height="420" rx="20" fill="var(--card)" />
      <rect x="630" y="24" width="346" height="372" rx="18" fill={SOFT} stroke={RED} strokeWidth="3" />
      <text x="440" y="78" textAnchor="middle" fontSize="26" fontWeight="700" fill={INK}>Разовый платёж</text>
      <text x="803" y="78" textAnchor="middle" fontSize="26" fontWeight="700" fill={RED}>Годовая подписка</text>
      {rows.map(([k, a, b], i) => (
        <g key={k} transform={`translate(0 ${136 + i * 58})`}>
          <line x1="40" x2="960" y1="-36" y2="-36" stroke={MUTED} strokeOpacity=".25" />
          <text x="40" y="0" fontSize="20" fill={MUTED}>{k}</text>
          <text x="440" y="0" textAnchor="middle" fontSize="21" fontWeight={i === 0 ? 700 : 500} fill={INK}>{a}</text>
          <text x="803" y="0" textAnchor="middle" fontSize="21" fontWeight={i === 0 ? 700 : 500} fill={i === 2 ? RED : INK}>{b}</text>
        </g>
      ))}
    </svg>
  );
}

function AdCtr() {
  const data: [string, number, string][] = [["Академический", 6.7, "6,7%"], ["Соколов", 5.4, "5,4%"], ["Совкомбанк", 5, "5%"], ["СКМ", 4.95, "4,95%"]];
  const max = 7, x0 = 250, w = 640;
  return (
    <svg viewBox="0 0 1000 380" className="block h-auto w-full text-foreground">
      <rect width="1000" height="380" rx="20" fill="var(--card)" />
      <text x="40" y="58" fontSize="24" fontWeight="700" fill={INK}>CTR кампаний в сети HVALA mobile</text>
      {data.map(([name, v, label], i) => (
        <g key={name} transform={`translate(0 ${100 + i * 64})`}>
          <text x="40" y="30" fontSize="21" fill={INK}>{name}</text>
          <rect x={x0} y="6" width={w} height="34" rx="10" fill={SOFT} />
          <rect x={x0} y="6" width={(w * v) / max} height="34" rx="10" fill={i === 0 ? RED : INK} opacity={i === 0 ? 1 : 0.75} />
          <text x={x0 + (w * v) / max + 14} y="31" fontSize="21" fontWeight="700" fill={INK}>{label}</text>
        </g>
      ))}
      <text x="40" y="358" fontSize="17" fill={MUTED}>Средний CTR кампаний сети — от 3%</text>
    </svg>
  );
}

const infographics: Record<string, () => React.ReactElement> = { "guest-steps": GuestSteps, "tariff-compare": TariffCompare, "ad-ctr": AdCtr };

export function Infographic({ id, alt }: { id: string; alt: string }) {
  const Art = infographics[id];
  if (!Art) return null;
  return (
    <figure className="my-8 overflow-hidden">
      <Art />
      <figcaption className="mt-2 text-sm text-muted-foreground">{alt}</figcaption>
    </figure>
  );
}
