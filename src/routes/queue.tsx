import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, RoleGuard } from "@/components/portal/AppShell";
import { formatMoney } from "@/lib/portal/data";
import { fmtDate, stageForRole, usePortal } from "@/lib/portal/store";

export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "Очередь согласования — Евроторг Media" },
      { name: "description", content: "Заявки, ожидающие согласования: юридическая, розничная и финальная маркетинговая ступень." },
      { property: "og:title", content: "Очередь согласования — Евроторг Media" },
      { property: "og:description", content: "Заявки, ожидающие согласования сотрудниками Евроторга." },
       { property: "og:type", content: "website" },
       { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QueuePage,
});

function QueuePage() {
  const { user, queue, decideRequest } = usePortal();
  const [comments, setComments] = useState<Record<string, string>>({});

  const myStage = user ? stageForRole(user.role) : null;

  return (
    <AppShell>
      <RoleGuard roles={["operator", "legal", "retail", "marketing", "admin"]}>
        <PageHeader
          title="Очередь"
          subtitle={
            myStage
              ? "Заявки на вашей ступени согласования: примите или отклоните с комментарием."
              : "Все заявки в процессе согласования (наблюдение)."
          }
        />
        <div className="space-y-4">
          {queue.map((r) => {
            const canDecide = !!myStage && r.stage === myStage;
            return (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {r.number} · {r.org}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fmtDate(r.createdAt)} · источник: {r.source === "offline" ? "офлайн" : "кабинет"} ·{" "}
                      {r.items.length} позиц.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{r.status}</span>
                    <span className="font-bold">{formatMoney(r.total)}</span>
                  </div>
                </div>

                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {r.items.map((i, idx) => (
                    <li key={idx}>
                      {i.placementName} — {i.storeAddress}
                    </li>
                  ))}
                </ul>

                {canDecide && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                    <input
                      placeholder="Комментарий"
                      value={comments[r.id] ?? ""}
                      onChange={(e) => setComments((p) => ({ ...p, [r.id]: e.target.value }))}
                      className="min-w-[220px] flex-1 rounded-xl border border-input px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => {
                        decideRequest(r.id, true, comments[r.id] ?? "", user!.role);
                        toast.success(`Заявка ${r.number} принята`);
                      }}
                      className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-brand-dark"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => {
                        if (!comments[r.id]?.trim()) {
                          toast.error("Укажите причину отклонения");
                          return;
                        }
                        decideRequest(r.id, false, comments[r.id] ?? "", user!.role);
                        toast.message(`Заявка ${r.number} отклонена`);
                      }}
                      className="rounded-full border border-destructive px-5 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {queue.length === 0 && <p className="text-sm text-muted-foreground">Очередь пуста.</p>}
        </div>
      </RoleGuard>
    </AppShell>
  );
}
