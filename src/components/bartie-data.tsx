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
const PAGE = 50;

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${bartieApiUrl}${path}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body as T;
}

export function BartieData() {
  const [table, setTable] = useState<Table>(TABLES[0]);
  const [order, setOrder] = useState<"recent" | "pk">("recent");
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState<TableRows | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => { setOffset(0); }, [table, order]);

  useEffect(() => {
    let active = true;
    const tick = () =>
      api<TableRows>(`/demo/table/${table}?limit=${PAGE}&offset=${offset}&order=${order}`)
        .then((r) => { if (active) { setRows(r); setErr(null); setNow(Date.now()); } })
        .catch((e) => { if (active) setErr((e as Error).message); });
    tick();
    const id = setInterval(tick, 3000);
    return () => { active = false; clearInterval(id); };
  }, [table, order, offset]);

  const plan = planColumns(rows);
  const total = Math.max(rows?.counts?.source ?? 0, rows?.counts?.dest ?? 0);
  const last = Math.min(offset + PAGE, total);
  const mismatch = rows?.counts && !rows.destOnly && rows.counts.source !== rows.counts.dest;

  const count = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n.toLocaleString());

  return (
    <div className="text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--color-border)] pb-3">
        <div className="flex flex-wrap gap-1">
          {TABLES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTable(t)}
              className={`rounded-sm px-2 py-0.5 font-mono text-xs ${t === table ? "bg-[var(--color-fg)] text-[var(--color-bg)]" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"}`}
            >
              {t.replace("public.", "")}
            </button>
          ))}
        </div>
        <div className="flex gap-1 font-mono text-xs">
          {(["recent", "pk"] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrder(o)}
              className={`rounded-sm border px-2 py-0.5 ${o === order ? "border-[var(--color-fg)]" : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]"}`}
            >
              {o === "recent" ? "newest first" : "by id"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 font-mono text-xs text-[var(--color-fg-muted)]">
          <button type="button" onClick={() => setOffset(Math.max(0, offset - PAGE))} disabled={offset === 0} className="rounded-sm border border-[var(--color-border)] px-2 py-0.5 disabled:opacity-40">‹</button>
          <span className="tabular-nums">{total === 0 ? "0" : `${(offset + 1).toLocaleString()}–${last.toLocaleString()}`} of {total.toLocaleString()}</span>
          <button type="button" onClick={() => setOffset(offset + PAGE)} disabled={last >= total} className="rounded-sm border border-[var(--color-border)] px-2 py-0.5 disabled:opacity-40">›</button>
        </div>
      </div>

      {err ? (
        <p className="mt-4 text-xs text-[var(--color-fg-muted)]">
          The demo box is not answering ({err}). It runs on one small VM and resets nightly.
        </p>
      ) : null}

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <Pane title="source · terra" sub={`${count(rows?.counts?.source)} rows${rows?.destOnly ? " (this table exists only downstream)" : ""}`}>
          <SideTable side="source" rows={rows} plan={plan} now={now} freshMs={10000} layout="scroll" />
        </Pane>
        <Pane title="destination · warehouse" sub={`${count(rows?.counts?.dest)} rows${mismatch ? " · counts differ (events in flight, or run verify)" : ""}`} warn={!!mismatch}>
          <SideTable side="dest" rows={rows} plan={plan} now={now} freshMs={10000} layout="scroll" />
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
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--color-border)] px-3 py-2">
        <span className="font-mono text-xs">{title}</span>
        <span className={`num ${warn ? "text-amber-500" : ""}`}>{sub}</span>
      </div>
      <div className="py-1">{children}</div>
    </section>
  );
}
