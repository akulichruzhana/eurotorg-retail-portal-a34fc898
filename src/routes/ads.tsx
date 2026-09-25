import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { RequestDialog } from "@/components/portal/RequestDialog";
import {
  PLACEMENTS,
  STORES,
  STORE_FORMATS,
  formatMoney,
  type Placement,
} from "@/lib/portal/data";
import { Button } from "@/components/ui/button";

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

type Tab = "all" | "stores";
const PAGE_SIZE = 40;

function AdsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [format, setFormat] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [active, setActive] = useState<Placement | null>(null);
  const [details, setDetails] = useState<Placement | null>(null);
  const stores = useMemo(() => STORES.filter((s) =>
    (!format || s.format === format) &&
    (!query.trim() || `${s.address} ${s.number}`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")))
  ), [format, query]);

  return (
    <AppShell>
      <PageHeader title="Каталог размещений" subtitle="Услуги и торговые объекты сети Евроторг" />
      <div className="mb-6 flex gap-2">
        <Button variant={tab === "all" ? "default" : "outline"} onClick={() => setTab("all")}>Услуги</Button>
        <Button variant={tab === "stores" ? "default" : "outline"} onClick={() => setTab("stores")}>Торговые объекты</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit border-r border-border pr-5">
          <h2 className="text-sm font-bold">Поиск ТО</h2>
          <label htmlFor="store-query" className="mt-4 block text-xs font-semibold uppercase text-muted-foreground">Адрес или номер ТО</label>
          <input id="store-query" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="Введите адрес или номер" className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-sm" />
          <label htmlFor="store-format" className="mt-5 block text-xs font-semibold uppercase text-muted-foreground">Формат ТО</label>
          <select id="store-format" value={format} onChange={(e) => { setFormat(e.target.value); setPage(0); }} className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-sm">
            <option value="">Все форматы</option>
            {STORE_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <p className="mt-4 text-xs text-muted-foreground">Найдено: {stores.length.toLocaleString("ru-RU")}</p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => { setQuery(""); setFormat(""); setPage(0); }}>Сбросить</Button>
        </aside>
        <div className="min-w-0">
          {tab === "stores" ? (
            <div>
              <div className="overflow-x-auto border border-border bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left"><tr><th className="px-4 py-3">Номер ТО</th><th className="px-4 py-3">Формат</th><th className="px-4 py-3">Адрес торгового объекта</th></tr></thead>
                  <tbody>{stores.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((s) => (
                    <tr key={s.id} className="border-t border-border"><td className="px-4 py-3">{s.number}</td><td className="px-4 py-3">{s.format}</td><td className="px-4 py-3 font-medium">{s.address}</td></tr>
                  ))}</tbody>
                </table>
                {!stores.length && <p className="p-4 text-sm text-muted-foreground">Торговые объекты не найдены.</p>}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm"><Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Назад</Button><span>{stores.length ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, stores.length)} из ${stores.length}` : "0 объектов"}</span><Button variant="outline" disabled={(page + 1) * PAGE_SIZE >= stores.length} onClick={() => setPage((p) => p + 1)}>Далее</Button></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PLACEMENTS.map((p) => (
                <div key={p.id} className="flex flex-col border border-border bg-card p-5">
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
                  <p className="mt-4 font-bold">{formatMoney(p.price)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button onClick={() => setActive(p)}>Оформить заявку</Button>
                    <Button variant="outline" onClick={() => setDetails(p)}>Подробнее</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <RequestDialog placement={active} open={!!active} onClose={() => setActive(null)} />
      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-card p-6">
            <div className="flex items-start justify-between gap-4"><h2 className="text-xl font-bold">{details.name}</h2><Button variant="ghost" onClick={() => setDetails(null)}>Закрыть</Button></div>
            <p className="mt-3 text-sm text-muted-foreground">{details.description}</p>
            <p className="mt-4 text-lg font-bold">{formatMoney(details.price)}</p>
            <Button className="mt-5 w-full" onClick={() => { setActive(details); setDetails(null); }}>Оформить заявку</Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
