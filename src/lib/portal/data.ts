export type Role =
  | "advertiser"
  | "supplier"
  | "operator"
  | "legal"
  | "retail"
  | "marketing"
  | "admin";

export type PortalUser = {
  login: string;
  password: string;
  role: Role;
  roleTitle: string;
  org: string;
};

export const ROLE_TITLES: Record<Role, string> = {
  advertiser: "рекламодатель",
  supplier: "поставщик",
  operator: "оператор",
  legal: "юрист",
  retail: "розница",
  marketing: "маркетинг",
  admin: "администратор",
};

export const USERS: PortalUser[] = [
  {
    login: "alpha",
    password: "alpha-pass",
    role: "advertiser",
    roleTitle: "рекламодатель",
    org: "ООО «Альфа»",
  },
  {
    login: "supplier",
    password: "supplier-pass",
    role: "supplier",
    roleTitle: "поставщик",
    org: "ООО «Гамма»",
  },
  {
    login: "operator",
    password: "operator-pass",
    role: "operator",
    roleTitle: "оператор",
    org: "ООО «Евроторг»",
  },
  {
    login: "legal",
    password: "legal-pass",
    role: "legal",
    roleTitle: "юрист",
    org: "ООО «Евроторг»",
  },
  {
    login: "retail",
    password: "retail-pass",
    role: "retail",
    roleTitle: "розница",
    org: "ООО «Евроторг»",
  },
  {
    login: "marketing",
    password: "marketing-pass",
    role: "marketing",
    roleTitle: "маркетинг",
    org: "ООО «Евроторг»",
  },
  {
    login: "admin",
    password: "admin-pass",
    role: "admin",
    roleTitle: "администратор",
    org: "ООО «Евроторг»",
  },
];

import serviceRows from "./services.json";
import storeRows from "./stores.json";

export type Placement = {
  id: string;
  name: string;
  kind: "offline" | "online";
  price: number | null;
  unit: string;
  description: string;
  specs: string[];
  storeFormats: string[];
};

export type Store = {
  id: string;
  address: string;
  number: string;
  format: string;
};

export const STORES: Store[] = storeRows;
export const STORE_FORMATS = [...new Set(STORES.map((store) => store.format))].sort((a, b) => a.localeCompare(b, "ru"));

export const PLACEMENTS: Placement[] = serviceRows.map((service) => ({
  ...service,
  kind: service.kind as Placement["kind"],
  unit: "1 размещение",
  specs: [],
  storeFormats: STORE_FORMATS,
}));

export const INSIGHTS = [
  { category: "Молочная продукция", abc: "A", share: "18.4%", yoy: "-2.1%" },
  { category: "Хлеб и выпечка", abc: "A", share: "9.7%", yoy: "0.4%" },
  { category: "Сладкие напитки", abc: "B", share: "6.2%", yoy: "3.8%" },
  { category: "Снеки", abc: "B", share: "4.9%", yoy: "1.6%" },
  { category: "Бытовая химия", abc: "C", share: "2.8%", yoy: "-0.7%" },
];

export const LIFT_PAIRS = [
  { pair: "Хлеб + молоко", lift: "1.42" },
  { pair: "Кофе + печенье", lift: "1.31" },
  { pair: "Пиво + снеки", lift: "1.28" },
  { pair: "Подгузники + детское питание", lift: "1.19" },
];

export const SEGMENTS = [
  { id: "seg1", name: "Семьи с детьми, 30–90 дней", size: 120000 },
  { id: "seg2", name: "Чувствительные к промо, категория А", size: 54000 },
  { id: "seg3", name: "Снижение частоты визитов", size: 31000 },
  { id: "seg4", name: "Покупатели готовой еды, будни", size: 47000 },
];

export const TARIFFS = PLACEMENTS.map((p) => ({
  id: p.id,
  name: p.name,
  kind: p.kind === "online" ? "Сайт" : "Торговый объект",
  price: p.price,
  unit: p.unit,
}));

export const formatMoney = (value: number | null) =>
  value === null ? "По запросу" : `${value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} р.`;
