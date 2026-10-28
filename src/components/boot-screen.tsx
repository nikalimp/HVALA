import { Logo } from "./logo";

// Загрузочный экран в стиле ОС: логотип и полоса загрузки, ~1,5 с. Только при первом заходе за сессию
// (скрипт в <head> ставит класс .booted, если экран уже показывали). Работает без JavaScript —
// исчезает по CSS-анимации, поэтому контент никогда не остаётся закрытым. Для экранных читалок скрыт.
export const bootScript = `(function(){try{if(sessionStorage.getItem('hvala-boot'))document.documentElement.classList.add('booted');else sessionStorage.setItem('hvala-boot','1')}catch(e){}})()`;

export function BootScreen() {
  return (
    <div aria-hidden className="boot fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-background">
      <Logo className="h-12 w-auto text-foreground sm:h-14" />
      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-foreground/10">
        <div className="boot-bar h-full rounded-full bg-foreground" />
      </div>
    </div>
  );
}
