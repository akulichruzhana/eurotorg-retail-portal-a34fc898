import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader, RoleGuard } from "@/components/portal/AppShell";
import { RequestDialog } from "@/components/portal/RequestDialog";
import { PLACEMENTS, formatMoney, type Placement } from "@/lib/portal/data";

const ORGS = ["ООО «Альфа»", "ООО «Гамма»", "ООО «Бета»"];

export const Route = createFileRoute("/offline")({
  head: () => ({
    meta: [
      { title: "Завести офлайн-заявку — Евроторг Media" },
      { name: "description", content: "Оформление заявки от имени клиента, полученной по телефону или при визите, с тем же маршрутом согласования." },
      { property: "og:title", content: "Завести офлайн-заявку — Евроторг Media" },
      { property: "og:description", content: "Заявка от имени клиента, оформленная вне кабинета." },
       { property: "og:type", content: "website" },
       { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OfflinePage,
});

function OfflinePage() {
  const [org, setOrg] = useState(ORGS[0]!);
  const [active, setActive] = useState<Placement | null>(null);

  return (
    <AppShell>
      <RoleGuard roles={["operator", "legal", "retail", "marketing", "admin"]}>
        <PageHeader
          title="Завести офлайн"
          subtitle="Заявка клиента, оформленная вне кабинета (звонок, визит). Помечается источником «офлайн» и идёт тем же маршрутом согласования."
        />

        <div className="mb-6 max-w-md rounded-2xl border border-border bg-card p-5">
          <label className="text-sm font-semibold">Юрлицо клиента</label>
          <select
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2"
          >
            {ORGS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PLACEMENTS.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <h3 className="mt-1 font-bold">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-3 font-bold">{formatMoney(p.price)}</p>
              <button
                onClick={() => setActive(p)}
                className="mt-3 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-brand-dark"
              >
                Оформить за клиента
              </button>
            </div>
          ))}
        </div>

        <RequestDialog
          placement={active}
          open={!!active}
          onClose={() => setActive(null)}
          onBehalfOf={org}
          source="offline"
        />
      </RoleGuard>
    </AppShell>
  );
}
