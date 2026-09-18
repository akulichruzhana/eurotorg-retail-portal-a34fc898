import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader, RoleGuard } from "@/components/portal/AppShell";
import { TARIFFS, USERS, formatMoney } from "@/lib/portal/data";
import { usePortal } from "@/lib/portal/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Админ — Евроторг Media" },
      { name: "description", content: "Администрирование портала: пользователи и роли, тарифы рекламных размещений, сводка по заявкам." },
      { property: "og:title", content: "Админ — Евроторг Media" },
      { property: "og:description", content: "Пользователи, роли и тарифы портала Евроторг Media." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { state } = usePortal();
  const [tab, setTab] = useState<"users" | "tariffs" | "stats">("users");

  return (
    <AppShell>
      <RoleGuard roles={["admin"]}>
        <PageHeader title="Админ" subtitle="Справочник пользователей и тарифов, сводка по стенду." />
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { id: "users", label: "Пользователи" },
              { id: "tariffs", label: "Тарифы" },
              { id: "stats", label: "Сводка" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium",
                tab === t.id ? "border-brand bg-brand text-primary-foreground" : "border-border bg-card hover:bg-muted",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-5 py-3">Логин</th>
                  <th className="px-5 py-3">Роль</th>
                  <th className="px-5 py-3">Юрлицо</th>
                </tr>
              </thead>
              <tbody>
                {USERS.map((u) => (
                  <tr key={u.login} className="border-t border-border">
                    <td className="px-5 py-3 font-semibold">{u.login}</td>
                    <td className="px-5 py-3">{u.roleTitle}</td>
                    <td className="px-5 py-3">{u.org}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "tariffs" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-5 py-3">Услуга</th>
                  <th className="px-5 py-3">Тип</th>
                  <th className="px-5 py-3">Цена</th>
                  <th className="px-5 py-3">Единица</th>
                </tr>
              </thead>
              <tbody>
                {TARIFFS.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">{t.name}</td>
                    <td className="px-5 py-3">{t.kind}</td>
                    <td className="px-5 py-3">{formatMoney(t.price)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "stats" && (
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { label: "Заявок всего", value: state.requests.length },
              { label: "На согласовании", value: state.requests.filter((r) => ["legal", "retail", "marketing"].includes(r.stage)).length },
              { label: "Счетов", value: state.invoices.length },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 text-3xl font-bold">{c.value}</p>
              </div>
            ))}
          </div>
        )}
      </RoleGuard>
    </AppShell>
  );
}
