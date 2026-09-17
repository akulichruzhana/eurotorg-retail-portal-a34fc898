import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePortal } from "@/lib/portal/store";
import { Logo } from "@/components/portal/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Вход — Евроторг Media" },
      { name: "description", content: "Корпоративный портал рекламных размещений торговой сети Евроопт: каталог, заявки, согласование, аналитика." },
      { property: "og:title", content: "Вход — Евроторг Media" },
      { property: "og:description", content: "Корпоративный портал рекламных размещений торговой сети Евроопт." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = usePortal();
  const navigate = useNavigate();
  const [l, setL] = useState("");
  const [p, setP] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/ads" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(l, p)) {
      setError("");
      navigate({ to: "/ads" });
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand px-4 py-1.5 text-xs text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>ООО «Евроторг»</span>
          <span>Корпоративный контур ДИТ</span>
        </div>
      </div>
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center px-4 py-12">
        <form
          onSubmit={submit}
          className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.25)]"
        >
          <p className="text-sm text-muted-foreground">Корпоративный контур</p>
          <Logo className="mt-3 block text-5xl" />
          <h1 className="mt-4 text-xl font-bold">Евроторг Media</h1>

          <label className="mt-6 block text-sm font-semibold" htmlFor="login">
            Логин
          </label>
          <input
            id="login"
            value={l}
            onChange={(e) => setL(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 outline-none focus:border-brand"
            autoComplete="username"
          />

          <label className="mt-4 block text-sm font-semibold" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={p}
            onChange={(e) => setP(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 outline-none focus:border-brand"
            autoComplete="current-password"
          />

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-brand py-3 font-bold text-primary-foreground transition-colors hover:bg-brand-dark"
          >
            Войти
          </button>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Стенд: alpha/alpha-pass · supplier/supplier-pass · operator/operator-pass · legal/legal-pass ·
            retail/retail-pass · marketing/marketing-pass · admin/admin-pass
          </p>
        </form>
      </div>
    </div>
  );
}
