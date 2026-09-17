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

export type Placement = {
  id: string;
  name: string;
  kind: "offline" | "online";
  kindLabel: string;
  price: number;
  unit: string;
  description: string;
  specs: string[];
  storeFormats: string[];
};

export const PLACEMENTS: Placement[] = [
  {
    id: "mobile-kso",
    name: "Подвесной мобайл в зоне КСО",
    kind: "offline",
    kindLabel: "Офлайн ТО",
    price: 3000,
    unit: "1 конструкция / 1 месяц",
    description:
      "Подвесная конструкция в зоне касс самообслуживания — контакт с покупателем в момент оплаты.",
    specs: [
      "Расположение: зона КСО",
      "Тип конструкции: подвесной",
      "Крепление: обсуждается индивидуально",
      "Материал: гофрокартон",
    ],
    storeFormats: ["Евроопт Hyper", "Евроопт Super", "Евроопт Маркет"],
  },
  {
    id: "arch",
    name: "Арка",
    kind: "offline",
    kindLabel: "Офлайн ТО",
    price: 3000,
    unit: "1 арка / 1 месяц",
    description:
      "Брендирование арки на входе в торговый зал, которая охватывает всех посетителей магазина.",
    specs: [
      "Расположение: вход в торговый зал",
      "Тип конструкции: напольный",
      "Размер: индивидуальный",
      "Материал: гофрокартон",
    ],
    storeFormats: ["Евроопт Hyper", "Евроопт Маркет"],
  },
  {
    id: "bike-parking",
    name: "Брендирование П-образной велопарковки",
    kind: "offline",
    kindLabel: "Офлайн ТО",
    price: 3000,
    unit: "1 парковка / 1 месяц",
    description: "Наружное брендирование велопарковки при входе в магазин.",
    specs: [
      "Расположение: на улице при входе в магазин",
      "Крепление: чехол на завязках с вырезами сверху",
      "Ширина чехла: 67 см",
      "Высота чехла: 60 см",
    ],
    storeFormats: ["Евроопт Hyper", "Евроопт Super"],
  },
  {
    id: "shelf-stopper",
    name: "Шелфстоппер в зоне выкладки",
    kind: "offline",
    kindLabel: "Офлайн ТО",
    price: 1200,
    unit: "1 позиция / 1 месяц",
    description: "Привлечение внимания к товару непосредственно на полке.",
    specs: ["Расположение: зона выкладки товара", "Материал: пластик", "Размер: 10×7 см"],
    storeFormats: ["Евроопт Маркет", "Евроопт Минимаркет", "Хит! Грошык"],
  },
  {
    id: "promo-action",
    name: "Промоакция (дегустация, сэмплинг)",
    kind: "offline",
    kindLabel: "Офлайн ТО",
    price: 1000,
    unit: "1 точка / 1 месяц",
    description: "Промостойка с промоутером в арендной зоне торгового объекта.",
    specs: ["Расположение: арендная зона", "Оборудование: промостойка", "Промоутер: подрядчик клиента"],
    storeFormats: ["Евроопт Hyper", "Евроопт Super", "Евроопт Prime"],
  },
  {
    id: "eplus-banner",
    name: "Баннер в приложении Еплюс",
    kind: "online",
    kindLabel: "Онлайн",
    price: 4500,
    unit: "1 размещение / 1 неделя",
    description: "Баннер на главном экране приложения Еплюс.",
    specs: ["Формат: 1080×540", "Показ: главный экран", "Период: неделя"],
    storeFormats: ["Онлайн-канал"],
  },
  {
    id: "email-blast",
    name: "E-mail рассылка по базе Еплюс",
    kind: "online",
    kindLabel: "Онлайн",
    price: 2800,
    unit: "1 рассылка",
    description: "Блок в регулярной рассылке программы лояльности.",
    specs: ["Охват: до 500 000 подписчиков", "Блок: 1 позиция в письме"],
    storeFormats: ["Онлайн-канал"],
  },
  {
    id: "site-catalog",
    name: "Приоритет в каталоге e-shop",
    kind: "online",
    kindLabel: "Онлайн",
    price: 3600,
    unit: "1 категория / 1 неделя",
    description: "Приоритетная выдача товара в категории интернет-магазина.",
    specs: ["Позиция: топ категории", "Период: неделя"],
    storeFormats: ["Онлайн-канал"],
  },
];

export type Store = {
  id: string;
  address: string;
  city: string;
  district: string;
  number: string;
  format: string;
};

export const STORES: Store[] = [
  { id: "s1", address: "ул. Нёманская, 18А", city: "Минск", district: "Фрунзенский район", number: "№700", format: "Евроопт Hyper" },
  { id: "s2", address: "ул. Тарханова, 15", city: "Минск", district: "Советский район", number: "№701", format: "Евроопт Hyper" },
  { id: "s3", address: "ул. Бурдейного, 45", city: "Минск", district: "Фрунзенский район", number: "№702", format: "Евроопт Super" },
  { id: "s4", address: "ул. Болеслава Берута, 3Б", city: "Минск", district: "Московский район", number: "№703", format: "Евроопт Маркет" },
  { id: "s5", address: "пр. Дзержинского, 104", city: "Минск", district: "Ленинский район", number: "№704", format: "Евроопт Prime" },
  { id: "s6", address: "ул. Московская, 210", city: "Брест", district: "Ленинский район", number: "№810", format: "Евроопт Hyper" },
  { id: "s7", address: "б-р Космонавтов, 58", city: "Брест", district: "Московский район", number: "№811", format: "Евроопт Маркет" },
  { id: "s8", address: "ул. Великий Гостинец, 143", city: "Молодечно", district: "Центр", number: "№920", format: "Евроопт Минимаркет" },
  { id: "s9", address: "ул. Городокская, 12", city: "Молодечно", district: "Центр", number: "№921", format: "Хит! Грошык" },
];

export const STORE_FORMATS = [
  "Евроопт Prime",
  "Евроопт Hyper",
  "Евроопт Super",
  "Евроопт Маркет",
  "Евроопт Минимаркет",
  "Хит! Грошык",
];

export const CITIES = ["Минск", "Брест", "Молодечно"];

export type Bundle = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  items: string[];
};

export const BUNDLES: Bundle[] = [
  {
    id: "b1",
    name: "Пакет «Старт»",
    description: "Базовое присутствие в 5 объектах формата Маркет на 1 месяц.",
    price: 8500,
    oldPrice: 11000,
    items: ["Шелфстоппер — 5 ТО", "Промоакция — 1 ТО", "Баннер в приложении Еплюс — 1 неделя"],
  },
  {
    id: "b2",
    name: "Пакет «Максимум»",
    description: "Полное покрытие гипермаркетов Минска на 1 месяц.",
    price: 32000,
    oldPrice: 41000,
    items: ["Арка — 6 ТО", "Подвесной мобайл в зоне КСО — 6 ТО", "E-mail рассылка — 2 шт."],
  },
  {
    id: "b3",
    name: "Пакет «Онлайн+»",
    description: "Только цифровые каналы: приложение, рассылка, каталог.",
    price: 9900,
    oldPrice: 12900,
    items: ["Баннер в приложении Еплюс — 2 недели", "E-mail рассылка — 1 шт.", "Приоритет в каталоге — 1 неделя"],
  },
];

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
  kind: p.kindLabel,
  price: p.price,
  unit: p.unit,
}));

export const formatMoney = (value: number) =>
  `${value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} р.`;
