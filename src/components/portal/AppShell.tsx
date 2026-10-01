import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Bell, ChevronDown, LogOut, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "@/lib/portal/store";
import type { Role } from "@/lib/portal/data";
import { cn } from "@/lib/utils";

type NavItem = { to: "/ads" | "/services" | "/stores" | "/requests" | "/invoices" | "/analytics" | "/queue" | "/offline" | "/tickets" | "/admin" | "/notifications"; label: string; roles: Role[] };
const ALL: Role[] = ["advertiser", "supplier", "operator", "legal", "retail", "marketing", "admin"];
const CLIENTS: Role[] = ["advertiser", "supplier", "admin"];
const STAFF: Role[] = ["operator", "legal", "retail", "marketing", "admin"];
export const NAV: NavItem[] = [
  { to: "/ads", label: "Главная", roles: ALL },
  { to: "/services", label: "Рекламные услуги", roles: ALL },
  { to: "/stores", label: "Торговые объекты", roles: ALL },
  { to: "/requests", label: "Мои заявки", roles: CLIENTS },
  { to: "/invoices", label: "Счета", roles: CLIENTS },
  { to: "/analytics", label: "Аналитика", roles: CLIENTS },
  { to: "/queue", label: "Очередь", roles: STAFF },
  { to: "/offline", label: "Завести офлайн", roles: STAFF },
  { to: "/tickets", label: "Поддержка", roles: ALL },
  { to: "/admin", label: "Админ", roles: ["admin"] },
  { to: "/notifications", label: "Уведомления", roles: ALL },
];

// The sign-in screen deliberately continues to use this original brand treatment.
export function Logo({ className }: { className?: string }) {
  return <span className={cn("font-extrabold lowercase tracking-tight text-brand", className)}>евроопт</span>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, visibleNotifications, visibleRequests } = usePortal();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (user === null) {
      const raw = typeof window !== "undefined" ? localStorage.getItem("evrotorg-media-session-v1") : null;
      if (!raw) navigate({ to: "/" });
    }
  }, [user, navigate]);
  if (!user) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Загрузка портала…</div>;
  const unread = visibleNotifications.filter((n) => !n.read).length;
  const items = NAV.filter((i) => i.roles.includes(user.role));
  return <div className="portal-app min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link to="/ads" className="flex shrink-0 items-center gap-2 text-foreground" aria-label="Евроторг реклама — главная">
          <span className="size-8 rounded-md bg-portal-mark" />
          <span className="flex flex-col leading-none"><span className="text-[10px] font-bold text-muted-foreground">евроторг</span><span className="text-2xl font-extrabold">реклама</span></span>
        </Link>
        <div className="flex items-center gap-1 rounded-md bg-muted p-1 text-xs font-medium">
          <Link to="/services" className={cn("rounded px-3 py-2", pathname === "/services" ? "bg-foreground text-card" : "hover:bg-card")}>Офлайн реклама</Link>
          <Link to="/analytics" className={cn("rounded px-3 py-2", pathname === "/analytics" ? "bg-foreground text-card" : "hover:bg-card")}>Онлайн реклама</Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link to={CLIENTS.includes(user.role) ? "/requests" : "/queue"} className="flex items-center gap-1.5 hover:text-muted-foreground"><ShoppingCart className="size-4" /> Мои заявки <span className="text-muted-foreground">{visibleRequests.length}</span></Link>
          <Link to="/notifications" aria-label={`Уведомления: ${unread}`} className="relative p-1"><Bell className="size-4" />{unread > 0 && <span className="absolute -right-1 -top-1 size-2 rounded-full bg-brand-accent" />}</Link>
          <span className="hidden items-center gap-1 border-l border-border pl-3 text-xs sm:flex"><UserRound className="size-4" /> {user.login} <ChevronDown className="size-3" /></span>
          <Button variant="ghost" size="icon" title="Выйти" aria-label="Выйти" onClick={() => { logout(); navigate({ to: "/" }); }}><LogOut className="size-4" /></Button>
        </div>
      </div>
      <nav className="bg-foreground text-card" aria-label="Разделы портала"><div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 lg:px-8">
        {items.map((item) => <Link key={item.to} to={item.to} className={cn("shrink-0 border-b-2 px-3 py-3 text-xs font-medium transition-colors hover:bg-card/15", pathname === item.to ? "border-brand-accent text-card" : "border-transparent text-card/75")}>{item.label}</Link>)}
      </div></nav>
    </header>
    <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-8 lg:px-8">{children}</main>
    <footer className="mt-12 bg-foreground text-card"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_1fr_auto] lg:px-8">
      <div><p className="text-lg font-bold">евроторг реклама</p><p className="mt-3 max-w-xs text-xs leading-relaxed text-card/60">Рекламные возможности торговой сети Евроторг</p></div>
      <div className="flex flex-wrap content-start gap-x-6 gap-y-3 text-xs">{items.slice(0, 8).map((item) => <Link key={item.to} to={item.to} className="hover:underline">{item.label}</Link>)}</div>
      <div className="flex flex-col gap-2"><Button variant="secondary" asChild><Link to="/services">Заказать услуги</Link></Button><Button variant="outline" asChild><Link to="/tickets">Получить консультацию</Link></Button></div>
    </div></footer>
  </div>;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="mb-7 border-b border-border pb-5"><h1 className="text-3xl font-bold">{title}</h1>{subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}</div>;
}

export function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = usePortal();
  if (!user) return null;
  if (!roles.includes(user.role)) return <div className="border border-border p-8 text-center"><h2 className="text-lg font-semibold">Раздел недоступен для вашей роли</h2><p className="mt-2 text-sm text-muted-foreground">Текущая роль: {user.roleTitle}. Обратитесь к администратору портала.</p></div>;
  return <>{children}</>;
}
