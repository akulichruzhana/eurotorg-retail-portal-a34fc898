import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, LayoutGrid, List, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestDialog } from "@/components/portal/RequestDialog";
import { PLACEMENTS, formatMoney, type Placement } from "@/lib/portal/data";
import retailImage from "@/assets/retail-placement.jpg";

const GROUPS = ["Все форматы", "Входная зона", "Прикассовая зона", "Зона выкладки товара", "Арендная зона", "Новые форматы", "Листовки", "Звуковое и фоновое воспроизведение"];
function groupFor(name: string) {
  const n = name.toLowerCase();
  if (/касс|разделител|лента/.test(n)) return GROUPS[2];
  if (/полк|шелф|стоппер|выклад/.test(n)) return GROUPS[3];
  if (/аренд|камер|тележ/.test(n)) return GROUPS[4];
  if (/флаер|листов|буклет/.test(n)) return GROUPS[6];
  if (/аудио|звук|радио/.test(n)) return GROUPS[7];
  if (/двер|арка|вход|ворот/.test(n)) return GROUPS[1];
  return GROUPS[5];
}
export function ServiceCatalogue({ compact = false }: { compact?: boolean }) {
  const [group, setGroup] = useState("Все форматы");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [active, setActive] = useState<Placement | null>(null);
  const services = useMemo(() => PLACEMENTS.filter((p) => (group === "Все форматы" || groupFor(p.name) === group) && (!query.trim() || `${p.name} ${p.description}`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")))).slice(0, compact ? 6 : undefined), [group, query, compact]);
  return <>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2"><Button size="sm" variant="default" onClick={() => setGroup("Все форматы")}>Все</Button><Button size="sm" variant="outline" onClick={() => setGroup("Входная зона")}>Входная зона</Button><Button size="sm" variant="outline" onClick={() => setGroup("Прикассовая зона")}>Прикассовая зона</Button></div><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Найдено: {services.length}</span><Button size="icon" variant={view === "list" ? "secondary" : "ghost"} title="Список" aria-label="Список" onClick={() => setView("list")}><List /></Button><Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} title="Плитка" aria-label="Плитка" onClick={() => setView("grid")}><LayoutGrid /></Button></div></div>
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]"><aside className="space-y-1"><label className="relative mb-4 block"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground"/><input aria-label="Поиск услуг" placeholder="Поиск услуг" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded border border-input py-2 pl-9 pr-3 text-sm" /></label>{GROUPS.map((g) => <Button key={g} variant="ghost" className={`h-auto w-full justify-between whitespace-normal px-3 py-2 text-left text-xs ${g === group ? "bg-muted font-bold" : ""}`} onClick={() => setGroup(g)}>{g}<ArrowUpRight className="size-3 shrink-0" /></Button>)}</aside>
      <div className={view === "grid" ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "divide-y divide-border border-y border-border"}>{services.map((p) => <article key={p.id} className={view === "grid" ? "flex min-w-0 flex-col border border-border p-4" : "flex min-w-0 flex-col gap-4 py-5 sm:flex-row sm:items-center"}>
        <div className={view === "grid" ? "mb-3 aspect-[4/3] overflow-hidden bg-muted" : "h-32 w-full shrink-0 overflow-hidden bg-muted sm:w-44"}><img src={retailImage} loading="lazy" width={1200} height={800} alt="Рекламное размещение в торговом объекте" className="size-full object-cover" /></div>
        <div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">{groupFor(p.name)}</p><h3 className="mt-1 text-base font-bold">{p.name}</h3><p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{p.description}</p><p className="mt-3 text-sm font-bold">{formatMoney(p.price)}</p></div>
        <div className={view === "grid" ? "mt-4 flex items-center justify-between gap-2" : "flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-stretch"}><Button size="sm" onClick={() => setActive(p)}><ShoppingCart /> Выбрать</Button><Button size="sm" variant="outline" asChild><Link to="/services/$serviceId" params={{ serviceId: p.id }}>Подробнее</Link></Button></div>
      </article>)}{services.length === 0 && <p className="py-12 text-sm text-muted-foreground">Услуги не найдены.</p>}</div>
    </div>
    {compact && <div className="mt-6 text-right"><Button variant="outline" asChild><Link to="/services">Показать все форматы <ArrowUpRight /></Link></Button></div>}
    <RequestDialog placement={active} open={!!active} onClose={() => setActive(null)} />
  </>;
}
