import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORES, STORE_FORMATS } from "@/lib/portal/data";

export function StorePicker({ selected, onChange, max = 12 }: { selected: string[]; onChange: (ids: string[]) => void; max?: number }) {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("");
  const [city, setCity] = useState("");
  const cities = useMemo(() => [...new Set(STORES.map((s) => s.address.split(",")[0]?.trim()).filter((c): c is string => !!c))].sort((a,b) => a.localeCompare(b,"ru")), []);
  const filtered = useMemo(() => STORES.filter((s) => (!format || s.format === format) && (!city || s.address.startsWith(city)) && (!search.trim() || `${s.address} ${s.number}`.toLocaleLowerCase("ru").includes(search.trim().toLocaleLowerCase("ru")))), [search, format, city]);
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((v) => v !== id) : selected.length < max ? [...selected, id] : selected);
  return <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
    <aside className="space-y-4 text-xs"><div><label className="mb-1.5 block font-semibold">В каком регионе размещать?</label><select aria-label="Город" value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded border border-input p-2"><option value="">Все города</option>{cities.map((c) => <option key={c}>{c}</option>)}</select></div><div><label className="mb-1.5 block font-semibold">Выберите формат ТО</label><select aria-label="Формат ТО" value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded border border-input p-2"><option value="">Все форматы</option>{STORE_FORMATS.map((f) => <option key={f}>{f}</option>)}</select></div><Button variant="outline" size="sm" onClick={() => {setSearch("");setCity("");setFormat("");}}>Очистить фильтры <X /></Button><p className="text-muted-foreground">Выбрано: {selected.length} из {max}</p></aside>
    <div className="min-w-0"><div className="mb-3 flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground"/><input aria-label="Поиск торгового объекта по адресу или номеру" placeholder="Поиск адреса или номера ТО" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded border border-input py-2 pl-9 pr-3 text-sm" /></div><span className="hidden text-xs text-muted-foreground sm:block">{filtered.length} объектов</span></div>
      <div className="max-h-[420px] divide-y divide-border overflow-y-auto border-y border-border">{filtered.slice(0, 100).map((s) => <label key={s.id} className="flex cursor-pointer items-center gap-3 p-3 text-sm hover:bg-muted"><input type="checkbox" checked={selected.includes(s.id)} disabled={!selected.includes(s.id) && selected.length >= max} onChange={() => toggle(s.id)} className="size-4 accent-[var(--brand-accent)]"/><span className="min-w-0 flex-1"><strong className="block truncate">{s.address}</strong><span className="text-xs text-muted-foreground">{s.format} · {s.number}</span></span>{selected.includes(s.id) ? <Check className="size-4 text-success"/> : <ChevronDown className="size-4 text-muted-foreground"/>}</label>)}{filtered.length > 100 && <p className="p-3 text-xs text-muted-foreground">Показаны первые 100. Уточните адрес или номер для поиска остальных.</p>}{filtered.length === 0 && <p className="p-5 text-sm text-muted-foreground">Объекты не найдены.</p>}</div>
    </div>
  </div>;
}
