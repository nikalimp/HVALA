import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { Container } from "./container";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { MenubarExtras } from "./os/menubar-extras";
import { MenubarNav } from "./os/menubar-nav";

// Мобильное меню на <details>: открывается без JavaScript, ссылки — обычные <a>.
function MobileMenu() {
  return (
    <details className="group/m md:hidden">
      <summary aria-label="Открыть меню" className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-md hover:bg-accent [&::-webkit-details-marker]:hidden">
        <Menu className="size-5 group-open/m:hidden" />
        <X className="hidden size-5 group-open/m:block" />
      </summary>
      <div className="absolute inset-x-0 top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b bg-background px-4 pb-6 pt-2 shadow-lg">
        <ul className="border-b py-3">
          {nav.map((n) => (
            <li key={n.href}><a href={n.href} className="block py-2.5 text-[15px]">{n.label}</a></li>
          ))}
        </ul>
        <Button asChild size="lg" className="mt-5 w-full"><a href={site.cta.href} data-os-app="mail">{site.cta.label}</a></Button>
      </div>
    </details>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl">
      <Container className="flex h-14 max-w-none items-center gap-4">
        <Link href="/" className="shrink-0 text-brand-vivid" aria-label={`${site.name} — на главную`}><Logo className="h-[18px] w-auto" /></Link>
        <MenubarNav />
        <div className="ml-auto flex items-center justify-end gap-1">
          <MenubarExtras />
          {site.darkTheme && <ThemeToggle />}
          <Button asChild size="sm" className="hidden sm:inline-flex"><a href={site.cta.href} data-os-app="mail">{site.cta.label}</a></Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
