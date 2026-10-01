"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bartieApiUrl } from "@/lib/bartie";
import { planColumns, SideTable, type TableRows } from "@/components/data-table";

// The whole of both databases, one table at a time, side by side. Pages
// through by primary key or shows newest first; refreshes on a timer so
// traffic shows up while you look.

const TABLES = [
  "public.observations",
  "public.animals",
  "public.watering_holes",
  "public.bartie_vectors",
] as const;
type Table = (typeof TABLES)[number];
type Order = "recent" | "pk";
const PAGE = 50;

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${bartieApiUrl}${path}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body as T;
}

const fmt = (n: number) => n.toLocaleString("en-US");

// Toolbar buttons share one shape so tap targets stay ~28px tall on a phone.
const BTN = "min-h-7 rounded-sm px-2.5 py-1 font-mono text-xs transition-colors disabled:opacity-40";
const PAGER =
  "min-w-9 border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)] disabled:hover:border-[var(--color-border)] disabled:hover:text-inherit";

export function BartieData() {
  const [table, setTable] = useState<Table>(TABLES[0]);
  const [order, setOrder] = useState<Order>("recent");
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState<TableRows | null>(null);
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Every control resets paging or moves it; the fetch below keys on all three.
  const pick = (t: Table) => { setTable(t); setOffset(0); setPending(true); };
  const sort = (o: Order) => { setOrder(o); setOffset(0); setPending(true); };
  const page = (o: number) => { setOffset(o); setPending(true); };

  useEffect(() => {
    let active = true;
    const tick = () =>
      api<TableRows>(`/demo/table/${table}?limit=${PAGE}&offset=${offset}&order=${order}`)
        .then((r) => { if (active) { setRows(r); setErr(null); setNow(Date.now()); } })
        .catch((e) => { if (active) setErr((e as Error).message); })
        .finally(() => { if (active) setPending(false); });
    tick();
    const id = setInterval(tick, 3000);
    return () => { active = false; clearInterval(id); };
  }, [table, order, offset]);

  const plan = planColumns(rows);
  const total = Math.max(rows?.counts?.source ?? 0, rows?.counts?.dest ?? 0);
  const first = Math.min(offset + 1, total);
  const last = Math.min(offset + PAGE, total);
  const mismatch = rows?.counts && !rows.destOnly && rows.counts.source !== rows.counts.dest;

  const count = (n: number | null | undefined) => (n === null || n === undefined ? "—" : fmt(n));
  const range = rows === null ? "…" : total === 0 ? "0 of 0" : `${fmt(first)}–${fmt(last)} of ${fmt(total)}`;

  // Keep the last page on screen while the next one loads; just dim it.
  const body = (side: "source" | "dest") =>
    rows === null ? (
      <p className="px-3 py-2 font-mono text-[11px] text-[var(--color-fg-dim)]">{err ? "unavailable" : "loading…"}</p>
    ) : (
      <SideTable side={side} rows={rows} plan={plan} now={now} freshMs={10000} layout="scroll" />
    );

  return (
    <div className="text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--color-border)] pb-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label="table">
          {TABLES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === table}
              onClick={() => pick(t)}
              className={`${BTN} ${t === table ? "bg-[var(--color-fg)] text-[var(--color-bg)]" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"}`}
            >
              {t.replace("public.", "")}
            </button>
          ))}
        </div>
        <div className="flex gap-1" role="group" aria-label="order">
          {(["recent", "pk"] as const).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={o === order}
              onClick={() => sort(o)}
              className={`${BTN} border ${o === order ? "border-[var(--color-fg)]" : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"}`}
            >
              {o === "recent" ? "newest first" : "by id"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 font-mono text-xs text-[var(--color-fg-muted)]" role="group" aria-label="page">
          <button type="button" aria-label="previous page" onClick={() => page(Math.max(0, offset - PAGE))} disabled={offset === 0} className={`${BTN} ${PAGER}`}>‹</button>
          <span className="whitespace-nowrap tabular-nums" aria-live="polite">{range}</span>
          <button type="button" aria-label="next page" onClick={() => page(offset + PAGE)} disabled={rows === null || last >= total} className={`${BTN} ${PAGER}`}>›</button>
        </div>
      </div>

      {err ? (
        <p role="status" className="mt-4 text-xs text-[var(--color-fg-muted)]">
          The demo box is not answering ({err}). It runs on one small VM and resets nightly.
          {rows ? " Showing the last page it sent." : ""}
        </p>
      ) : null}

      <div className={`mt-4 grid gap-6 transition-opacity lg:grid-cols-2 ${pending && rows ? "opacity-60" : ""}`} aria-busy={pending}>
        <Pane title="source · terra" sub={`${count(rows?.counts?.source)} rows${rows?.destOnly ? " (this table exists only downstream)" : ""}`}>
          {body("source")}
        </Pane>
        <Pane title="destination · warehouse" sub={`${count(rows?.counts?.dest)} rows${mismatch ? " · counts differ (events in flight, or run verify)" : ""}`} warn={!!mismatch}>
          {body("dest")}
        </Pane>
      </div>

      <p className="mt-6 text-xs text-[var(--color-fg-dim)]">
        Tables scroll sideways; the id column stays put. Highlighted destination rows were applied in the last ten seconds. The <code className="font-mono">bartie_vectors</code> table is the second destination: one embedded document per animal and observation, which is what the Ask panel on the{" "}
        <Link href="/bartie/live" className="content-link">live page</Link> searches. Its embedding column is left out of the view.
      </p>
    </div>
  );
}

function Pane({ title, sub, warn, children }: { title: string; sub: string; warn?: boolean; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-[var(--color-border)] px-3 py-2">
        <h2 className="font-mono text-xs font-normal">{title}</h2>
        <span className={`num min-w-0 ${warn ? "text-amber-500" : ""}`}>{sub}</span>
      </div>
      <div className="py-1">{children}</div>
    </section>
  );
}
