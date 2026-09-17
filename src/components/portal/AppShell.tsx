import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { usePortal } from "@/lib/portal/store";
import type { Role } from "@/lib/portal/data";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; roles: Role[] };

const ALL: Role[] = ["advertiser", "supplier", "operator", "legal", "retail", "marketing", "admin"];
const LEGAL_ENTITIES: Role[] = ["advertiser", "supplier"];
const STAFF: Role[] = ["operator", "legal", "retail", "marketing", "admin"];

export const NAV: NavItem[] = [
  { to: "/ads", label: "Реклама", roles: ALL },
  { to: "/analytics", label: "Аналитика", roles: [...LEGAL_ENTITIES, "admin"] },
  { to: "/requests", label: "Мои заявки", roles: [...LEGAL_ENTITIES, "admin"] },
  { to: "/invoices", label: "Счета", roles: [...LEGAL_ENTITIES, "admin"] },
  { to: "/queue", label: "Очередь", roles: STAFF },
  { to: "/offline", label: "Завести офлайн", roles: STAFF },
  { to: "/tickets", label: "Тикеты", roles: ALL },
  { to: "/admin", label: "Админ", roles: ["admin"] },
  { to: "/notifications", label: "Уведомления", roles: ALL },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-extrabold lowercase tracking-tight text-brand", className)}>евроопт</span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, visibleNotifications } = usePortal();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (user === null) {
      const raw = typeof window !== "undefined" ? localStorage.getItem("evrotorg-media-session-v1") : null;
      if (!raw) navigate({ to: "/" });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Загрузка портала…
      </div>
    );
  }

  const items = NAV.filter((i) => i.roles.includes(user.role));
  const unread = visibleNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand px-4 py-1.5 text-xs text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>ООО «Евроторг»</span>
          <span>Корпоративный контур ДИТ</span>
        </div>
      </div>

      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <Link to="/ads" className="flex items-baseline gap-3">
              <Logo className="text-3xl" />
              <span className="text-lg font-bold">Евроторг Media</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">{user.org}</span>
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark">
                {user.roleTitle}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="rounded-full border border-border px-4 py-1.5 font-semibold transition-colors hover:bg-muted"
              >
                Выход
              </button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1 pb-3">
            {items.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active ? "bg-brand text-primary-foreground" : "text-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                  {item.to === "/notifications" && unread > 0 && (
                    <span className="ml-2 rounded-full bg-card px-1.5 text-xs font-bold text-brand-dark">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Евроторг Media · корпоративный контур · данные аналитики обезличены
      </footer>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = usePortal();
  if (!user) return null;
  if (!roles.includes(user.role)) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-semibold">Раздел недоступен для вашей роли</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Текущая роль: {user.roleTitle}. Обратитесь к администратору портала.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
