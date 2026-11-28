import type { Metadata } from "next";
import Link from "next/link";
import { equipmentCategories, equipmentVendors } from "@/content/equipment";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { Bitmap } from "@/components/bitmap";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { equipmentListSchema, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Совместимое оборудование для гостевого Wi-Fi",
  description: "Особенности настройки Hotspot и гостевого Wi-Fi HVALA на MikroTik, Cisco, Ubiquiti UniFi, TP-Link Omada, Ruckus, Grandstream, Keenetic, Aruba, Huawei и Eltex.",
  alternates: { canonical: "/equipment/" },
};

export default function EquipmentPage() {
  return (
    <>
      <JsonLd data={graph(equipmentListSchema(equipmentVendors))} />
      <Section className="relative isolate overflow-hidden pt-12">
        <Bitmap variant="ripple" alpha={0.2} density={0.45} className="[mask-image:linear-gradient(to_top,black_10%,transparent_90%)]" />
        <Container className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Оборудование для гостевого Wi-Fi</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Платформа {site.name} работает с вашим действующим интернет-провайдером и популярным сетевым оборудованием: MikroTik, Cisco, Ubiquiti (UniFi), TP-Link (Omada), Ruckus, Grandstream, Keenetic, D-Link, HPE Aruba, Huawei, Eltex и Zyxel. Выберите марку вашего роутера или контроллера, чтобы узнать особенности настройки Hotspot, Walled Garden, VLAN и бесшовного роуминга по требованиям ПП РФ № 2607.
          </p>
        </Container>
        <Container className="mt-12 space-y-12">
          {equipmentCategories.map((cat) => {
            const items = equipmentVendors.filter((v) => v.category === cat);
            return (
              <div key={cat}>
                <h2 className="text-2xl font-semibold tracking-tight">{cat}</h2>
                <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((v) => (
                    <li key={v.slug} className="flex">
                      <Link
                        href={`/equipment/${v.slug}/`}
                        className="group flex w-full flex-col rounded-2xl border bg-background p-5 transition-colors hover:border-brand"
                      >
                        <p className="text-xs font-medium uppercase tracking-wider text-brand">{v.shortName}</p>
                        <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-brand">{v.name}</h3>
                        <p className="mt-2 text-xs text-muted-foreground">{v.models}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{v.answer}</p>
                        <span className="mt-auto pt-4 text-sm font-medium text-brand">Особенности настройки →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Container>
        <Container className="mt-12 max-w-3xl text-center text-sm text-muted-foreground">
          <p>
            Не нашли свою модель роутера? Напишите инженеру техподдержки {site.name} — проверим совместимость бесплатно и подскажем оптимальную схему подключения.
          </p>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
