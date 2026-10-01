import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { ServiceCatalogue } from "@/components/portal/ServiceCatalogue";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/services")({ head: () => ({meta: [{title:"Рекламные услуги — Евроторг Media"},{name:"description",content:"Каталог рекламных услуг торговой сети Евроторг."},{property:"og:title",content:"Рекламные услуги — Евроторг Media"},{property:"og:description",content:"Выберите рекламный формат для размещения в сети Евроторг."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}), component: ServicesPage });
function ServicesPage() {return <AppShell><div className="mb-3 text-xs text-muted-foreground">Главная / Рекламные услуги</div><div className="flex flex-wrap items-start justify-between gap-3"><PageHeader title="Рекламные услуги"/><Button asChild><Link to="/order" search={{ stores: "" }}>Оформить заявку</Link></Button></div><ServiceCatalogue /></AppShell>}
