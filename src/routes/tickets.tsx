import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { fmtDate, usePortal } from "@/lib/portal/store";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Тикеты — Евроторг Media" },
      { name: "description", content: "Обращения в поддержку портала Евроторг Media: тема, сообщение, статус обращения." },
      { property: "og:title", content: "Тикеты — Евроторг Media" },
      { property: "og:description", content: "Обращения в поддержку портала Евроторг Media." },
       { property: "og:type", content: "website" },
       { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TicketsPage,
});

function TicketsPage() {
  const { visibleTickets, createTicket } = usePortal();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <AppShell>
      <PageHeader title="Тикеты" subtitle="Обращения в поддержку портала." />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!subject.trim() || !message.trim()) {
              toast.error("Заполните тему и сообщение");
              return;
            }
            createTicket(subject.trim(), message.trim());
            toast.success("Тикет зарегистрирован");
            setSubject("");
            setMessage("");
          }}
          className="h-fit rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="font-bold">Новое обращение</h2>
          <label className="mt-4 block text-sm font-semibold">Тема</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input px-3 py-2"
          />
          <label className="mt-4 block text-sm font-semibold">Сообщение</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="mt-1.5 w-full rounded-xl border border-input px-3 py-2"
          />
          <button className="mt-4 w-full rounded-full bg-brand py-2.5 font-bold text-primary-foreground hover:bg-brand-dark">
            Отправить
          </button>
        </form>

        <div className="space-y-4">
          {visibleTickets.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{t.subject}</h3>
                <span className="rounded-full bg-muted px-3 py-1 text-xs">{t.status}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t.org} · {t.author} · {fmtDate(t.createdAt)}
              </p>
              {t.answers.map((a, i) => (
                <p key={i} className="mt-3 rounded-xl bg-muted p-3 text-sm">
                  {a.text}
                </p>
              ))}
            </div>
          ))}
          {visibleTickets.length === 0 && <p className="text-sm text-muted-foreground">Обращений пока нет.</p>}
        </div>
      </div>
    </AppShell>
  );
}
