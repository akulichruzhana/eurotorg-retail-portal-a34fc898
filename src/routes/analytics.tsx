import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, RoleGuard } from "@/components/portal/AppShell";
import { RequestDialog } from "@/components/portal/RequestDialog";
import { INSIGHTS, LIFT_PAIRS, PLACEMENTS, SEGMENTS, type Placement } from "@/lib/portal/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Аналитика — Евроторг Media" },
      { name: "description", content: "Обезличенные агрегаты: категории ABC, связи корзины, сегменты аудиторий для рекламных кампаний." },
      { property: "og:title", content: "Аналитика — Евроторг Media" },
      { property: "og:description", content: "Категории ABC, lift-пары и сегменты аудиторий без персональных данных." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [tab, setTab] = useState<"insights" | "targeting" | "qlik">("insights");
  const [active, setActive] = useState<Placement | null>(null);

  return (
    <AppShell>
      <RoleGuard roles={["advertiser", "supplier", "admin"]}>
        <PageHeader title="Аналитика" subtitle="Анонимные агрегаты стенда. Живые вкладки Qlik Sense подключает ДИТ." />

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { id: "insights", label: "Инсайты" },
              { id: "targeting", label: "Таргетинг" },
              { id: "qlik", label: "Qlik" },
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

        {tab === "insights" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <h2 className="border-b border-border px-5 py-4 font-bold">Категории ABC</h2>
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="px-5 py-2">Категория</th>
                    <th className="px-5 py-2">ABC</th>
                    <th className="px-5 py-2">Доля</th>
                    <th className="px-5 py-2">г/г</th>
                  </tr>
                </thead>
                <tbody>
                  {INSIGHTS.map((r) => (
                    <tr key={r.category} className="border-t border-border">
                      <td className="px-5 py-3">{r.category}</td>
                      <td className="px-5 py-3 font-semibold">{r.abc}</td>
                      <td className="px-5 py-3">{r.share}</td>
                      <td
                        className={cn("px-5 py-3", r.yoy.startsWith("-") ? "text-destructive" : "text-success")}
                      >
                        {r.yoy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <h2 className="border-b border-border px-5 py-4 font-bold">Связи корзины (lift-пары)</h2>
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="px-5 py-2">Пара</th>
                    <th className="px-5 py-2">Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {LIFT_PAIRS.map((r) => (
                    <tr key={r.pair} className="border-t border-border">
                      <td className="px-5 py-3">{r.pair}</td>
                      <td className="px-5 py-3 font-semibold">{r.lift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-5">
                <button
                  onClick={() => setActive(PLACEMENTS[0] ?? null)}
                  className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-brand-dark"
                >
                  Запустить кампанию
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "targeting" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <p className="border-b border-border px-5 py-4 text-sm text-muted-foreground">
              Сегменты без номеров карт и ФИО. Не выгрузка ПДн.
            </p>
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-5 py-2">Сегмент</th>
                  <th className="px-5 py-2">Размер (анонимно)</th>
                  <th className="px-5 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {SEGMENTS.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="px-5 py-3">{s.name}</td>
                    <td className="px-5 py-3">{s.size.toLocaleString("ru-RU")}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => {
                          toast.info(`Кампания на сегмент «${s.name}»`);
                          setActive(PLACEMENTS.find((p) => p.kind === "online") ?? null);
                        }}
                        className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-brand-dark"
                      >
                        Кампания
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "qlik" && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold">Витрину для вашего юрлица подключает ДИТ</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Это не ошибка: живой отчёт Qlik Sense доступен только в корпоративном контуре.
            </p>
          </div>
        )}

        <RequestDialog placement={active} open={!!active} onClose={() => setActive(null)} />
      </RoleGuard>
    </AppShell>
  );
}
