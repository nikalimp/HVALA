import { site } from "@/content/site";
import { Bitmap } from "./bitmap";
import { Container, Section } from "./container";
import { Button } from "./ui/button";

export function Cta({ title = "Подключим Wi-Fi или запустим рекламу", text = "Оставьте заявку в Telegram — менеджер ответит и рассчитает стоимость под вашу задачу." }: { title?: string; text?: string }) {
  return (
    <Section className="relative isolate overflow-hidden border-t">
      <Bitmap variant="rain" alpha={0.18} density={0.5} className="[mask-image:radial-gradient(ellipse_at_center,transparent_25%,black_80%)]" />
      <Container className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{text}</p>
        <Button asChild size="lg" className="mt-7"><a href={site.cta.href}>{site.cta.label}</a></Button>
      </Container>
    </Section>
  );
}
