import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGuard } from "@/components/portal/AppShell";
import { formatMoney } from "@/lib/portal/data";
import { fmtDate, usePortal } from "@/lib/portal/store";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Счета — Евроторг Media" },
      { name: "description", content: "Счета по согласованным заявкам на рекламные размещения (черновик, без электронной подписи)." },
      { property: "og:title", content: "Счета — Евроторг Media" },
      { property: "og:description", content: "Счета по согласованным заявкам на рекламные размещения." },
    ],
  }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const { visibleInvoices } = usePortal();
  return (
    <AppShell>
      <RoleGuard roles={["advertiser", "supplier", "admin"]}>
        <PageHeader title="Счета" subtitle="Счета формируются автоматически после согласования заявки. Черновик, без ЭП." />
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-5 py-3">Счёт</th>
                <th className="px-5 py-3">Заявка</th>
                <th className="px-5 py-3">Юрлицо</th>
                <th className="px-5 py-3">Дата</th>
                <th className="px-5 py-3">Сумма</th>
                <th className="px-5 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {visibleInvoices.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-5 py-3 font-semibold">{i.number}</td>
                  <td className="px-5 py-3">{i.requestNumber}</td>
                  <td className="px-5 py-3">{i.org}</td>
                  <td className="px-5 py-3">{fmtDate(i.createdAt)}</td>
                  <td className="px-5 py-3">{formatMoney(i.amount)}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs">{i.status}</span>
                  </td>
                </tr>
              ))}
              {visibleInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    Счетов пока нет — они появятся после согласования заявки.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </RoleGuard>
    </AppShell>
  );
}
