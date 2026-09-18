import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader, RoleGuard } from "@/components/portal/AppShell";
import { formatMoney } from "@/lib/portal/data";
import { fmtDate, usePortal, type AdRequest } from "@/lib/portal/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Мои заявки — Евроторг Media" },
      { name: "description", content: "Статусы и история заявок на рекламные размещения в сети Евроопт." },
      { property: "og:title", content: "Мои заявки — Евроторг Media" },
      { property: "og:description", content: "Статусы и история заявок на рекламные размещения." },
    ],
  }),
  component: RequestsPage,
});

export function StatusBadge({ request }: { request: AdRequest }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        request.stage === "done"
          ? "bg-brand-soft text-brand-dark"
          : request.stage === "rejected"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground",
      )}
    >
      {request.status}
    </span>
  );
}

function RequestsPage() {
  const { visibleRequests } = usePortal();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AppShell>
      <RoleGuard roles={["advertiser", "supplier", "admin"]}>
        <PageHeader title="Мои заявки" subtitle="Статусы и история согласования: юристы → розница → маркетинг." />
        <div className="space-y-4">
          {visibleRequests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {r.number}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      от {fmtDate(r.createdAt)} · источник: {r.source === "offline" ? "офлайн" : "кабинет"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {r.items.length} позиц. · период {r.periodFrom} — {r.periodTo}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge request={r} />
                  <span className="font-bold">{formatMoney(r.total)}</span>
                  <button
                    onClick={() => setOpen(open === r.id ? null : r.id)}
                    className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
                  >
                    {open === r.id ? "Скрыть" : "Детали"}
                  </button>
                </div>
              </div>

              {open === r.id && (
                <div className="mt-4 grid gap-6 border-t border-border pt-4 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold">Состав заявки</h3>
                    <table className="mt-2 w-full text-sm">
                      <tbody>
                        {r.items.map((i, idx) => (
                          <tr key={idx} className="border-b border-border last:border-0">
                            <td className="py-2">{i.placementName}</td>
                            <td className="py-2 text-muted-foreground">{i.storeAddress}</td>
                            <td className="py-2 text-right">{formatMoney(i.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">История</h3>
                    <ul className="mt-2 space-y-2 text-sm">
                      {r.history.map((h, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          <span className="text-foreground">{h.text}</span> · {fmtDate(h.at)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
          {visibleRequests.length === 0 && (
            <p className="text-sm text-muted-foreground">Заявок пока нет. Оформите первую в разделе «Реклама».</p>
          )}
        </div>
      </RoleGuard>
    </AppShell>
  );
}
