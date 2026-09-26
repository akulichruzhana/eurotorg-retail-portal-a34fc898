import { useMemo, useState } from "react";
import { toast } from "sonner";
import { STORES, STORE_FORMATS, formatMoney, type Placement } from "@/lib/portal/data";
import { usePortal, type RequestItem } from "@/lib/portal/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MAX_ITEMS = 12;

export function RequestDialog({
  placement,
  open,
  onClose,
  onBehalfOf,
  source = "portal",
}: {
  placement: Placement | null;
  open: boolean;
  onClose: () => void;
  onBehalfOf?: string;
  source?: "portal" | "offline";
}) {
  const { user, createRequest } = usePortal();
  const [selected, setSelected] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("");

  const stores = useMemo(() => STORES.filter((s) =>
    (!format || s.format === format) &&
    (!search.trim() || `${s.address} ${s.number}`.toLocaleLowerCase("ru").includes(search.trim().toLocaleLowerCase("ru")))
  ), [format, search]);

  if (!open || !placement) return null;
  const positions = placement.kind === "online" ? 1 : selected.length;
  const total = placement.price === null ? null : positions * placement.price;

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= MAX_ITEMS ? prev : [...prev, id],
    );

  const submit = () => {
    if (!from || !to || to < from) {
      toast.error("Укажите корректный срок размещения");
      return;
    }
    if (placement.kind !== "online" && selected.length === 0) {
      toast.error("Выберите хотя бы один торговый объект");
      return;
    }

    const items: RequestItem[] =
      placement.kind === "online"
        ? [
            {
              placementId: placement.id,
              placementName: placement.name,
              storeId: "online",
              storeAddress: "Онлайн-канал",
               price: placement.price,
            },
          ]
        : selected.map((id) => {
            const s = STORES.find((x) => x.id === id);
            if (!s) return null;
            return {
              placementId: placement.id,
              placementName: placement.name,
              storeId: s.id,
              storeAddress: `${s.address} · ${s.format} · ${s.number}`,
               price: placement.price,
            };
          }).filter((item): item is RequestItem => item !== null);

    const req = createRequest({
      items,
      periodFrom: from,
      periodTo: to,
      org: onBehalfOf ?? user?.org ?? "—",
      source,
    });
    toast.success(`Заявка ${req.number} отправлена на согласование`);
    setSelected([]);
    setFrom("");
    setTo("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{placement.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatMoney(placement.price)}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Закрыть
          </Button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Срок размещения с</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">по</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input px-3 py-2"
            />
          </div>
        </div>

        {placement.kind === "online" ? (
          <p className="mt-5 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Онлайн-размещение не привязано к торговым объектам.
          </p>
        ) : (
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Магазины и позиции</h3>
              <span className="text-xs text-muted-foreground">
                выбрано {selected.length} из {MAX_ITEMS}
              </span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input aria-label="Поиск торгового объекта по адресу или номеру" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Адрес или номер ТО" className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm" />
              <select aria-label="Формат торгового объекта" value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm">
                <option value="">Все форматы</option>
                {STORE_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Найдено: {stores.length}</p>
            <div className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-xl border border-border p-2">
              {stores.map((s) => (
                <label
                  key={s.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted",
                    selected.includes(s.id) && "bg-brand-soft",
                  )}
                >
                  <input
                    type="checkbox"
                    disabled={!selected.includes(s.id) && selected.length >= MAX_ITEMS}
                    checked={selected.includes(s.id)}
                    onChange={() => toggle(s.id)}
                    className="size-4 accent-[var(--brand)]"
                  />
                  <span className="flex-1">
                    {s.address} · {s.number}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.format}</span>
                </label>
              ))}
              {!stores.length && <p className="p-3 text-sm text-muted-foreground">Ничего не найдено.</p>}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-lg font-bold">Итого: {formatMoney(total)}</p>
            <p className="text-xs text-muted-foreground">{positions} позиц. · период размещения</p>
          </div>
          <Button
            onClick={submit}
            className="rounded-full bg-brand px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-brand-dark"
          >
            Отправить заявку
          </Button>
        </div>
      </div>
    </div>
  );
}
