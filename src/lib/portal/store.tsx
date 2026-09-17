import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PLACEMENTS, USERS, type PortalUser, type Role } from "./data";

export type RequestStage = "legal" | "retail" | "marketing" | "done" | "rejected";

export type RequestItem = {
  placementId: string;
  placementName: string;
  storeId: string;
  storeAddress: string;
  price: number;
};

export type HistoryEntry = { at: string; text: string };

export type AdRequest = {
  id: string;
  number: string;
  org: string;
  author: string;
  source: "portal" | "offline";
  createdAt: string;
  periodFrom: string;
  periodTo: string;
  items: RequestItem[];
  total: number;
  stage: RequestStage;
  status: string;
  comment?: string | undefined;
  history: HistoryEntry[];
};

export type Invoice = {
  id: string;
  number: string;
  requestNumber: string;
  org: string;
  amount: number;
  createdAt: string;
  status: "Черновик" | "Оплачен";
};

export type Ticket = {
  id: string;
  subject: string;
  message: string;
  author: string;
  org: string;
  createdAt: string;
  status: "Открыт" | "В работе" | "Закрыт";
  answers: HistoryEntry[];
};

export type Notification = {
  id: string;
  text: string;
  createdAt: string;
  read: boolean;
  org: string | "all";
};

type State = {
  requests: AdRequest[];
  invoices: Invoice[];
  tickets: Ticket[];
  notifications: Notification[];
};

const STORAGE_KEY = "evrotorg-media-state-v1";
const SESSION_KEY = "evrotorg-media-session-v1";

const now = () => new Date().toISOString();
const fmtDate = (iso: string) => new Date(iso).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });

const STAGE_LABEL: Record<RequestStage, string> = {
  legal: "На согласовании: юристы",
  retail: "На согласовании: розница",
  marketing: "На согласовании: маркетинг",
  done: "Согласована",
  rejected: "Отклонена",
};

export const stageLabel = (s: RequestStage) => STAGE_LABEL[s];
export const stageForRole = (role: Role): RequestStage | null =>
  role === "legal" ? "legal" : role === "retail" ? "retail" : role === "marketing" ? "marketing" : null;

function seed(): State {
  const p1 = PLACEMENTS[0]!;
  const p2 = PLACEMENTS[5]!;
  const created = new Date(Date.now() - 86400000 * 3).toISOString();
  const req: AdRequest = {
    id: "r1",
    number: "ЗЯВ-1001",
    org: "ООО «Альфа»",
    author: "alpha",
    source: "portal",
    createdAt: created,
    periodFrom: "2026-10-01",
    periodTo: "2026-10-31",
    items: [
      { placementId: p1.id, placementName: p1.name, storeId: "s1", storeAddress: "ул. Нёманская, 18А, Минск", price: p1.price },
      { placementId: p1.id, placementName: p1.name, storeId: "s2", storeAddress: "ул. Тарханова, 15, Минск", price: p1.price },
      { placementId: p2.id, placementName: p2.name, storeId: "online", storeAddress: "Онлайн-канал", price: p2.price },
    ],
    total: p1.price * 2 + p2.price,
    stage: "legal",
    status: STAGE_LABEL.legal,
    history: [{ at: created, text: "Заявка создана в кабинете" }],
  };
  const created2 = new Date(Date.now() - 86400000 * 9).toISOString();
  const p3 = PLACEMENTS[3]!;
  const req2: AdRequest = {
    id: "r2",
    number: "ЗЯВ-1000",
    org: "ООО «Альфа»",
    author: "operator",
    source: "offline",
    createdAt: created2,
    periodFrom: "2026-09-01",
    periodTo: "2026-09-30",
    items: [
      { placementId: p3.id, placementName: p3.name, storeId: "s4", storeAddress: "ул. Болеслава Берута, 3Б, Минск", price: p3.price },
    ],
    total: p3.price,
    stage: "done",
    status: STAGE_LABEL.done,
    history: [
      { at: created2, text: "Заявка заведена оператором (офлайн)" },
      { at: created2, text: "Юристы: принято" },
      { at: created2, text: "Розница: принято" },
      { at: created2, text: "Маркетинг: принято" },
    ],
  };
  return {
    requests: [req, req2],
    invoices: [
      {
        id: "i1",
        number: "СЧ-2026-0007",
        requestNumber: "ЗЯВ-1000",
        org: "ООО «Альфа»",
        amount: p3.price,
        createdAt: created2,
        status: "Черновик",
      },
    ],
    tickets: [
      {
        id: "t1",
        subject: "Не отображается счёт",
        message: "Заявка согласована, а счёт не появился в разделе «Счета».",
        author: "alpha",
        org: "ООО «Альфа»",
        createdAt: created2,
        status: "Закрыт",
        answers: [{ at: created2, text: "Поддержка: счёт сформирован, проверьте раздел «Счета»." }],
      },
    ],
    notifications: [
      { id: "n1", text: "Заявка ЗЯВ-1000 согласована. Сформирован счёт СЧ-2026-0007.", createdAt: created2, read: false, org: "ООО «Альфа»" },
      { id: "n2", text: "Заявка ЗЯВ-1001 отправлена на согласование (юристы).", createdAt: created, read: false, org: "ООО «Альфа»" },
    ],
  };
}

type Ctx = {
  user: PortalUser | null;
  login: (login: string, password: string) => boolean;
  logout: () => void;
  state: State;
  createRequest: (data: {
    items: RequestItem[];
    periodFrom: string;
    periodTo: string;
    org: string;
    source: "portal" | "offline";
  }) => AdRequest;
  decideRequest: (id: string, accept: boolean, comment: string, role: Role) => void;
  createTicket: (subject: string, message: string) => void;
  markNotificationsRead: () => void;
  visibleRequests: AdRequest[];
  visibleInvoices: Invoice[];
  visibleTickets: Ticket[];
  visibleNotifications: Notification[];
  queue: AdRequest[];
};

const PortalContext = createContext<Ctx | null>(null);

const isStaff = (r: Role) => ["operator", "legal", "retail", "marketing", "admin"].includes(r);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [state, setState] = useState<State>(() => seed());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as State);
      const s = localStorage.getItem(SESSION_KEY);
      if (s) {
        const found = USERS.find((u) => u.login === s);
        if (found) setUser(found);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const login = useCallback((l: string, p: string) => {
    const found = USERS.find((u) => u.login === l.trim() && u.password === p.trim());
    if (!found) return false;
    setUser(found);
    localStorage.setItem(SESSION_KEY, found.login);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const notify = (text: string, org: string) => ({
    id: `n${Math.random().toString(36).slice(2, 9)}`,
    text,
    createdAt: now(),
    read: false,
    org,
  });

  const createRequest: Ctx["createRequest"] = useCallback(
    ({ items, periodFrom, periodTo, org, source }) => {
      const total = items.reduce((s, i) => s + i.price, 0);
      const req: AdRequest = {
        id: `r${Math.random().toString(36).slice(2, 9)}`,
        number: `ЗЯВ-${1002 + Math.floor(Math.random() * 8000)}`,
        org,
        author: user?.login ?? "system",
        source,
        createdAt: now(),
        periodFrom,
        periodTo,
        items,
        total,
        stage: "legal",
        status: STAGE_LABEL.legal,
        history: [
          {
            at: now(),
            text: source === "offline" ? "Заявка заведена сотрудником (офлайн)" : "Заявка создана в кабинете",
          },
        ],
      };
      setState((prev) => ({
        ...prev,
        requests: [req, ...prev.requests],
        notifications: [
          notify(`Заявка ${req.number} отправлена на согласование (юристы).`, org),
          ...prev.notifications,
        ],
      }));
      return req;
    },
    [user],
  );

  const decideRequest: Ctx["decideRequest"] = useCallback((id, accept, comment, role) => {
    setState((prev) => {
      const requests = [...prev.requests];
      const idx = requests.findIndex((r) => r.id === id);
      if (idx === -1) return prev;
      const req = { ...requests[idx]! };
      const roleName = role === "legal" ? "Юристы" : role === "retail" ? "Розница" : "Маркетинг";
      let invoices = prev.invoices;
      let notifications = prev.notifications;

      if (!accept) {
        req.stage = "rejected";
        req.status = STAGE_LABEL.rejected;
        req.comment = comment;
        req.history = [...req.history, { at: now(), text: `${roleName}: отклонено. ${comment}` }];
        notifications = [notify(`Заявка ${req.number} отклонена (${roleName.toLowerCase()}).`, req.org), ...notifications];
      } else {
        req.history = [...req.history, { at: now(), text: `${roleName}: принято.${comment ? " " + comment : ""}` }];
        const next: RequestStage = req.stage === "legal" ? "retail" : req.stage === "retail" ? "marketing" : "done";
        req.stage = next;
        req.status = STAGE_LABEL[next];
        if (next === "done") {
          const inv: Invoice = {
            id: `i${Math.random().toString(36).slice(2, 9)}`,
            number: `СЧ-2026-${String(1000 + Math.floor(Math.random() * 8999)).slice(-4)}`,
            requestNumber: req.number,
            org: req.org,
            amount: req.total,
            createdAt: now(),
            status: "Черновик",
          };
          invoices = [inv, ...invoices];
          notifications = [notify(`Заявка ${req.number} согласована. Сформирован счёт ${inv.number}.`, req.org), ...notifications];
        } else {
          notifications = [notify(`Заявка ${req.number}: ${STAGE_LABEL[next].toLowerCase()}.`, req.org), ...notifications];
        }
      }
      requests[idx] = req;
      return { ...prev, requests, invoices, notifications };
    });
  }, []);

  const createTicket: Ctx["createTicket"] = useCallback(
    (subject, message) => {
      if (!user) return;
      const t: Ticket = {
        id: `t${Math.random().toString(36).slice(2, 9)}`,
        subject,
        message,
        author: user.login,
        org: user.org,
        createdAt: now(),
        status: "Открыт",
        answers: [],
      };
      setState((prev) => ({
        ...prev,
        tickets: [t, ...prev.tickets],
        notifications: [notify(`Тикет «${subject}» зарегистрирован.`, user.org), ...prev.notifications],
      }));
    },
    [user],
  );

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const staff = user ? isStaff(user.role) : false;
    const visibleRequests = !user
      ? []
      : staff
        ? state.requests
        : state.requests.filter((r) => r.org === user.org);
    const visibleInvoices = !user ? [] : staff ? state.invoices : state.invoices.filter((i) => i.org === user.org);
    const visibleTickets = !user ? [] : staff ? state.tickets : state.tickets.filter((t) => t.org === user.org);
    const visibleNotifications = !user
      ? []
      : staff
        ? state.notifications
        : state.notifications.filter((n) => n.org === user.org || n.org === "all");
    const myStage = user ? stageForRole(user.role) : null;
    const queue = !user
      ? []
      : user.role === "operator" || user.role === "admin"
        ? state.requests.filter((r) => ["legal", "retail", "marketing"].includes(r.stage))
        : myStage
          ? state.requests.filter((r) => r.stage === myStage)
          : [];

    return {
      user,
      login,
      logout,
      state,
      createRequest,
      decideRequest,
      createTicket,
      markNotificationsRead,
      visibleRequests,
      visibleInvoices,
      visibleTickets,
      visibleNotifications,
      queue,
    };
  }, [user, state, login, logout, createRequest, decideRequest, createTicket, markNotificationsRead]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}

export { fmtDate, isStaff };
