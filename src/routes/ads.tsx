import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { RequestDialog } from "@/components/portal/RequestDialog";
import {
  BUNDLES,
  CITIES,
  PLACEMENTS,
  STORES,
  STORE_FORMATS,
  formatMoney,
  type Placement,
} from "@/lib/portal/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ads")({
  head: () => ({
    meta: [
      { title: "Каталог размещений — Евроторг Media" },
      { name: "description", content: "Витрина офлайн- и онлайн-размещений сети Евроопт: форматы, цены, оформление заявки." },
      { property: "og:title", content: "Каталог размещений — Евроторг Media" },
      { property: "og:description", content: "Витрина офлайн- и онлайн-размещений сети Евроопт." },
    ],
  }),
  component: AdsPage,
});

type Tab = "all" | "offline" | "online" | "bundles" | "stores";

function AdsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [formats, setFormats] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [active, setActive] = useState<Placement | null>(null);
  const [details, setDetails] = useState<Placement | null>(null);

  const list = useMemo(() => {
    let items = PLACEMENTS;
    if (tab === "offline") items = items.filter((p) => p.kind === "offline");
    if (tab === "online") items = items.filter((p) => p.kind === "online");
    if (formats.length)
      items = items.filter((p) => p.kind === "online" || p.storeFormats.some((f) => formats.includes(f)));
    if (cities.length) {
      const allowed = new Set(STORES.filter((s) => cities.includes(s.city)).map((s) => s.format));
      items = items.filter((p) => p.kind === "online" || p.storeFormats.some((f) => allowed.has(f)));
    }
    return items;
  }, [tab, formats, cities]);

  const toggle = (arr: string[], set: (v: string[]) => void, value: string) =>
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "offline", label: "Офлайн" },
    { id: "online", label: "Онлайн" },
    { id: "bundles", label: "Пакеты услуг" },
    { id: "stores", label: "Торговые объекты" },
  ];

  return (
    <AppShell>
      <PageHeader title="Каталог размещений" subtitle="Витрина услуг: выберите формат и оформите заявку." />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-brand bg-brand text-primary-foreground"
                : "border-border bg-card hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold">Фильтры</h2>
          <p className="mt-4 text-xs font-semibold uppercase text-muted-foreground">Регион</p>
          <div className="mt-2 space-y-1.5">
            {CITIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cities.includes(c)}
                  onChange={() => toggle(cities, setCities, c)}
                  className="size-4 accent-[var(--brand)]"
                />
                {c}
              </label>
            ))}
          </div>
          <p className="mt-5 text-xs font-semibold uppercase text-muted-foreground">Формат ТО</p>
          <div className="mt-2 space-y-1.5">
            {STORE_FORMATS.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formats.includes(f)}
                  onChange={() => toggle(formats, setFormats, f)}
                  className="size-4 accent-[var(--brand)]"
                />
                {f}
              </label>
            ))}
          </div>
          <button
            onClick={() => {
              setCities([]);
              setFormats([]);
            }}
            className="mt-5 w-full rounded-full border border-border py-2 text-sm hover:bg-muted"
          >
            Очистить
          </button>
        </aside>

        <div>
          {tab === "bundles" && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {BUNDLES.map((b) => (
                <div key={b.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-bold">{b.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
                  <ul className="mt-4 flex-1 space-y-1 text-sm">
                    {b.items.map((i) => (
                      <li key={i}>• {i}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xl font-bold">{formatMoney(b.price)}</p>
                  <p className="text-sm text-muted-foreground line-through">{formatMoney(b.oldPrice)}</p>
                  <button
                    onClick={() => setActive(PLACEMENTS[0] ?? null)}
                    className="mt-4 rounded-full bg-brand px-5 py-2.5 font-bold text-primary-foreground hover:bg-brand-dark"
                  >
                    Заказать пакет
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "stores" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="px-4 py-3">Адрес</th>
                    <th className="px-4 py-3">Город</th>
                    <th className="px-4 py-3">Район</th>
                    <th className="px-4 py-3">Номер</th>
                    <th className="px-4 py-3">Формат</th>
                  </tr>
                </thead>
                <tbody>
                  {STORES.filter((s) => !cities.length || cities.includes(s.city))
                    .filter((s) => !formats.length || formats.includes(s.format))
                    .map((s) => (
                      <tr key={s.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{s.address}</td>
                        <td className="px-4 py-3">{s.city}</td>
                        <td className="px-4 py-3">{s.district}</td>
                        <td className="px-4 py-3">{s.number}</td>
                        <td className="px-4 py-3">{s.format}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {(tab === "all" || tab === "offline" || tab === "online") && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <div key={p.id} className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm">
                  <div className="relative h-32 bg-gradient-to-br from-brand to-brand-dark">
                    <span className="absolute bottom-3 left-4 rounded-full bg-card px-3 py-1 text-xs font-semibold">
                      {p.kindLabel}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold">{p.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
                    <p className="mt-4 font-bold">{formatMoney(p.price)}</p>
                    <p className="text-xs text-muted-foreground">{p.unit}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setActive(p)}
                        className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-brand-dark"
                      >
                        Оформить заявку
                      </button>
                      <button
                        onClick={() => setDetails(p)}
                        className="rounded-full border border-border px-4 py-2.5 text-sm hover:bg-muted"
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <p className="text-sm text-muted-foreground">По выбранным фильтрам услуг не найдено.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <RequestDialog placement={active} open={!!active} onClose={() => setActive(null)} />

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">{details.name}</h2>
              <button onClick={() => setDetails(null)} className="rounded-full px-3 py-1 text-sm hover:bg-muted">
                Закрыть
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{details.description}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {details.specs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <span className="font-semibold">Форматы ТО:</span> {details.storeFormats.join(", ")}
            </p>
            <p className="mt-4 text-lg font-bold">
              {formatMoney(details.price)}{" "}
              <span className="text-sm font-normal text-muted-foreground">{details.unit}</span>
            </p>
            <button
              onClick={() => {
                setActive(details);
                setDetails(null);
              }}
              className="mt-5 w-full rounded-full bg-brand py-3 font-bold text-primary-foreground hover:bg-brand-dark"
            >
              Оформить заявку
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
