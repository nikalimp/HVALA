import { site } from "@/content/site";
import { Bitmap } from "./bitmap";
import { Container, Section } from "./container";
import { Button } from "./ui/button";

export function Cta({ title = "Подключим Wi-Fi или запустим рекламу", text = "Оставьте заявку в Telegram — менеджер ответит и рассчитает стоимость под вашу задачу.", label = site.cta.label, payload }: { title?: string; text?: string; label?: string; payload?: string }) {
  return (
    // Финальный призыв перед подвалом — на красном фоне бренда, битмап белыми точками
    <Section className="relative isolate overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28">
      <Bitmap variant="rain" alpha={0.16} density={0.5} className="[--brand-vivid:var(--primary-foreground)] [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)]" />
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">{text}</p>
        <Button asChild size="lg" className="mt-8 h-12 bg-primary-foreground px-8 text-base font-semibold text-primary hover:bg-primary-foreground/90"><a href={site.cta.href} data-os-app="mail" data-os-payload={payload}>{label}</a></Button>
      </Container>
    </Section>
  );
}
