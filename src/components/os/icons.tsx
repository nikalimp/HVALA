import {
  Blocks, Building2, FolderOpen, Handshake, Images, LayoutGrid, Mail, Megaphone, MessageCircle, PartyPopper, Phone, Radar,
  Search, Smartphone, StickyNote, Trash, Wifi, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  wifi: Wifi, megaphone: Megaphone, party: PartyPopper, radar: Radar, handshake: Handshake, building: Building2, phone: Phone,
  folder: FolderOpen, grid: LayoutGrid, mail: Mail, message: MessageCircle, search: Search, smartphone: Smartphone,
  blocks: Blocks, images: Images, note: StickyNote, trash: Trash,
};

const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

// Плитка приложения. Календарь показывает сегодняшнюю дату, как в macOS.
export function AppGlyph({ icon, className = "size-6", today }: { icon: string; className?: string; today?: Date | null }) {
  if (icon === "calendar") {
    const d = today ?? null;
    return (
      <span aria-hidden className="flex flex-col items-center leading-none">
        <span className="text-[9px] font-semibold uppercase text-brand">{d ? months[d.getMonth()] : "дата"}</span>
        <span className="text-[17px] font-semibold tabular-nums text-foreground">{d ? d.getDate() : "··"}</span>
      </span>
    );
  }
  const Icon = map[icon] ?? FolderOpen;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
