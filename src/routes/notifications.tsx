import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { fmtDate, usePortal } from "@/lib/portal/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Уведомления — Евроторг Media" },
      { name: "description", content: "Лента событий портала: смены статусов заявок, сформированные счета и ответы по тикетам." },
      { property: "og:title", content: "Уведомления — Евроторг Media" },
      { property: "og:description", content: "Лента событий по заявкам, счетам и тикетам." },
       { property: "og:type", content: "website" },
       { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { visibleNotifications, markNotificationsRead } = usePortal();

  useEffect(() => {
    const t = setTimeout(() => markNotificationsRead(), 1200);
    return () => clearTimeout(t);
  }, [markNotificationsRead]);

  return (
    <AppShell>
      <PageHeader title="Уведомления" subtitle="События по заявкам, счетам и тикетам." />
      <div className="space-y-3">
        {visibleNotifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "rounded-2xl border border-border bg-card p-4",
              !n.read && "border-brand bg-brand-soft/40",
            )}
          >
            <p className="text-sm">{n.text}</p>
            <p className="mt-1 text-xs text-muted-foreground">{fmtDate(n.createdAt)}</p>
          </div>
        ))}
        {visibleNotifications.length === 0 && <p className="text-sm text-muted-foreground">Уведомлений нет.</p>}
      </div>
    </AppShell>
  );
}
