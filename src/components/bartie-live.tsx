"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bartieApiUrl } from "@/lib/bartie";

// A window onto a running Bartie pipeline. Three beats: watch the numbers,
// change a row on the source and watch it land, ask the replicated data a
// question in live and batch mode. Everything here is a plain fetch against
// the control api; nothing is simulated.

const PIPELINE = "bartie";
const DEMO_TABLE = "public.observations";
const DEMO_PK = 9001;
const DEFAULT_NOTES =
  "Mosi the wildebeest was spotted resting on the SOUTH bank near the reeds.";
const DEFAULT_QUESTION = "Where was Mosi last seen? (observation 9001)";

type Usage = {
  tableStats: { tableName: string; count: number; latency: number | null }[];
  readerLagBytes: number | null;
  backlogMessages: number | null;
  mergeMs: { samples: number; p95: number; last: number } | null;
  lastAppliedAt: string | null;
  writerReachable: boolean;
};

type Summary = { status: string; hasBackfillingTables: boolean };

type RowView = {
  source: Record<string, unknown> | null;
  dest: (Record<string, unknown> & { __bartie_updated_at?: string }) | null;
};

type Answer = {
  mode: "live" | "batch";
  answer: string;
  asOf: string | null;
  staleBy: number | null;
  model: string;
  latencyMs: number;
  sources: { table: string; pk: Record<string, unknown>; text: string; updatedAt: string }[];
};

type Verify = {
  match: boolean;
  tables: { table: string; sourceRows: number; destRows: number; checksumMatch: boolean }[];
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${bartieApiUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body as T;
}

function ago(iso: string | null | undefined, now: number): string {
  if (!iso) return "—";
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s.toFixed(0)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

function kb(n: number | null): string {
  if (n === null) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function BartieLive() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [offline, setOffline] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Poll the numbers. Slow when nothing is happening, faster right after a poke.
  const fastUntil = useRef(0);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const [u, list] = await Promise.all([
          api<Usage>(`/pipelines/${PIPELINE}/usage`),
          api<{ items: Summary[] }>(`/pipelines`),
        ]);
        if (!active) return;
        setUsage(u);
        setSummary(list.items[0] ?? null);
        setOffline(false);
      } catch {
        if (active) setOffline(true);
      }
      if (!active) return;
      setNow(Date.now());
      timer = setTimeout(tick, Date.now() < fastUntil.current ? 1000 : 3000);
    };
    tick();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const avgLatency = (() => {
    if (!usage) return null;
    const rows = usage.tableStats.filter((t) => t.latency !== null && t.count > 0);
    if (rows.length === 0) return null;
    const total = rows.reduce((a, t) => a + t.count, 0);
    return rows.reduce((a, t) => a + (t.latency as number) * t.count, 0) / total;
  })();

  return (
    <div className="my-8 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-sm">
      <Header status={summary?.status} offline={offline} backfilling={summary?.hasBackfillingTables} />

      <div className="grid grid-cols-2 gap-px border-b border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
        <Stat label="latency" value={avgLatency === null ? "—" : `${avgLatency.toFixed(2)}s`} hint="source commit → destination apply, last hour" />
        <Stat label="reader lag" value={kb(usage?.readerLagBytes ?? null)} hint="source WAL ahead of the reader" />
        <Stat label="backlog" value={usage?.backlogMessages === null || usage?.backlogMessages === undefined ? "—" : `${usage.backlogMessages} msgs`} hint="published, not yet applied" />
        <Stat label="merge p95" value={usage?.mergeMs && usage.mergeMs.samples > 0 ? `${usage.mergeMs.p95.toFixed(0)} ms` : "—"} hint="destination MERGE time" />
      </div>

      <TablePanel disabled={offline} now={now} />
      <Poke disabled={offline} now={now} onPoked={() => { fastUntil.current = Date.now() + 15000; }} />
      <Ask disabled={offline} now={now} />
      <VerifyRow disabled={offline} />
    </div>
  );
}

function Header({ status, offline, backfilling }: { status?: string; offline: boolean; backfilling?: boolean }) {
  const label = offline ? "unreachable" : backfilling ? "backfilling" : status ?? "…";
  const dot = offline ? "bg-[var(--color-fg-dim)]" : label === "running" ? "bg-emerald-500" : label === "paused" ? "bg-amber-500" : "bg-[var(--color-accent)]";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3">
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className={`inline-block h-2 w-2 ${dot}`} />
        <span>terra → warehouse</span>
        <span className="text-[var(--color-fg-dim)]">{label}</span>
      </div>
      <span className="num">live · {bartieApiUrl.replace(/^https?:\/\//, "")}</span>
      {offline ? (
        <p className="w-full text-xs text-[var(--color-fg-muted)]">
          The demo box is not answering right now. It resets nightly and runs on one small VM; the rest of the post still stands.
        </p>
      ) : null}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-[var(--color-surface)] px-4 py-3" title={hint}>
      <div className="num">{label}</div>
      <div className="mt-1 font-mono text-lg tabular-nums">{value}</div>
    </div>
  );
}

// --- beat 0: watch traffic land --------------------------------------------

type TableRows = {
  table: string;
  pk: string;
  recency: string;
  source: Record<string, unknown>[];
  dest: (Record<string, unknown> & { __bartie_updated_at?: string })[];
};

const TABLES = ["public.observations", "public.animals", "public.watering_holes"] as const;
const HIDDEN = new Set(["__bartie_commit_ts", "__bartie_updated_at"]);

function cell(v: unknown): string {
  if (v === null || v === undefined) return "∅";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return s.slice(11, 19);
  return s.length > 48 ? s.slice(0, 47) + "…" : s;
}

function TablePanel({ disabled, now }: { disabled: boolean; now: number }) {
  const [table, setTable] = useState<(typeof TABLES)[number]>(TABLES[0]);
  const [rows, setRows] = useState<TableRows | null>(null);

  useEffect(() => {
    let active = true;
    const tick = () =>
      api<TableRows>(`/demo/table/${table}?limit=6`)
        .then((r) => { if (active) setRows(r); })
        .catch(() => {});
    tick();
    const id = setInterval(tick, 2000);
    return () => { active = false; clearInterval(id); };
  }, [table]);

  const columns = (() => {
    const first = rows?.source[0] ?? rows?.dest[0];
    if (!rows || !first) return [];
    const rest = Object.keys(first).filter((k) => !HIDDEN.has(k) && k !== rows.pk && k !== rows.recency);
    return [rows.pk, rows.recency, ...rest];
  })();

  const grid = (side: "source" | "dest") => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr className="text-left text-[var(--color-fg-dim)]">
            {columns.map((c) => <th key={c} className="whitespace-nowrap px-2 py-1 font-normal">{c}</th>)}
            {side === "dest" ? <th className="whitespace-nowrap px-2 py-1 font-normal">applied</th> : null}
          </tr>
        </thead>
        <tbody>
          {(rows?.[side] ?? []).map((r) => {
            const applied = side === "dest" ? (r as { __bartie_updated_at?: string }).__bartie_updated_at : undefined;
            const fresh = applied ? now - new Date(applied).getTime() < 6000 : false;
            return (
              <tr key={String(r[rows!.pk])} className={`border-t border-[var(--color-border)] ${fresh ? "bg-[var(--color-accent-soft)]" : ""}`}>
                {columns.map((c) => <td key={c} className="max-w-[16rem] truncate px-2 py-1 align-top" title={String(r[c] ?? "")}>{cell(r[c])}</td>)}
                {side === "dest" ? <td className="whitespace-nowrap px-2 py-1 text-[var(--color-fg-dim)]">{applied ? ago(applied, now) : "—"}</td> : null}
              </tr>
            );
          })}
          {rows && rows[side].length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="px-2 py-2 text-[var(--color-fg-dim)]">no rows</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="border-b border-[var(--color-border)] px-4 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-medium">1. Watch rows land</h3>
        <div className="flex gap-1">
          {TABLES.map((t) => (
            <button
              key={t}
              type="button"
              disabled={disabled}
              onClick={() => setTable(t)}
              className={`rounded-sm px-2 py-0.5 font-mono text-[11px] ${t === table ? "bg-[var(--color-fg)] text-[var(--color-bg)]" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"}`}
            >
              {t.replace("public.", "")}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-[11px] text-[var(--color-fg-dim)]">
        newest rows by {rows?.recency ?? "recency"} on each side. A ranger-log writer adds a sighting every couple of seconds; highlighted rows landed in the last few seconds.
      </p>
      <div className="mt-3 grid gap-px bg-[var(--color-border)]">
        <div className="bg-[var(--color-surface)] py-2"><div className="num px-2 pb-1">source (terra)</div>{grid("source")}</div>
        <div className="bg-[var(--color-surface)] py-2"><div className="num px-2 pb-1">destination (warehouse)</div>{grid("dest")}</div>
      </div>
    </section>
  );
}

// --- beat 1: change a row, watch it land ------------------------------------

function Poke({ disabled, now, onPoked }: { disabled: boolean; now: number; onPoked: () => void }) {
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [row, setRow] = useState<RowView | null>(null);
  const [commitTs, setCommitTs] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRow(await api<RowView>(`/demo/row/${DEMO_TABLE}/${DEMO_PK}`));
    } catch {
      /* the status strip already shows offline */
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [refresh]);

  const poke = async (op: "c" | "u" | "d") => {
    setBusy(true);
    setErr(null);
    try {
      const body: Record<string, unknown> = { op, table: DEMO_TABLE, pk: { observation_id: DEMO_PK } };
      if (op !== "d") body.set = { notes };
      const res = await api<{ commitTs: string }>(`/demo/poke`, { method: "POST", body: JSON.stringify(body) });
      setCommitTs(res.commitTs);
      onPoked();
      refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const srcNotes = row?.source ? String(row.source.notes ?? "") : null;
  const dstNotes = row?.dest ? String(row.dest.notes ?? "") : null;
  const landed = row !== null && srcNotes === dstNotes;
  const applied = row?.dest?.__bartie_updated_at;
  const tookMs = commitTs && applied && landed ? new Date(applied).getTime() - new Date(commitTs).getTime() : null;

  return (
    <section className="border-b border-[var(--color-border)] px-4 py-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium">2. Change a row on the source</h3>
        <span className="num">observations #{DEMO_PK}</span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={500}
        rows={2}
        disabled={disabled}
        className="mt-3 w-full resize-none rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs outline-none focus:border-[var(--color-accent)]"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <Btn onClick={() => poke(row?.source ? "u" : "c")} disabled={disabled || busy}>
          {row?.source ? "Update" : "Insert"}
        </Btn>
        <Btn onClick={() => poke("d")} disabled={disabled || busy || !row?.source} subtle>
          Delete
        </Btn>
        <button
          type="button"
          onClick={() => setNotes(notes.includes("SOUTH") ? notes.replace("SOUTH bank near the reeds", "NORTH ridge above the water") : DEFAULT_NOTES)}
          className="num underline-offset-4 hover:underline"
        >
          swap south/north
        </button>
        {err ? <span className="text-xs text-red-500">{err}</span> : null}
      </div>

      <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
        <Side title="source (terra)" notes={srcNotes} meta={row?.source ? "committed" : "no row"} />
        <Side
          title="destination (warehouse)"
          notes={dstNotes}
          meta={
            row?.dest
              ? `applied ${ago(applied, now)}${tookMs !== null ? ` · ${tookMs} ms after commit` : ""}`
              : row?.source
                ? "in flight…"
                : "no row"
          }
          highlight={row !== null && !landed}
        />
      </div>
    </section>
  );
}

function Side({ title, notes, meta, highlight }: { title: string; notes: string | null; meta: string; highlight?: boolean }) {
  return (
    <div className={`bg-[var(--color-surface)] px-3 py-3 ${highlight ? "outline outline-1 outline-[var(--color-accent)]" : ""}`}>
      <div className="num">{title}</div>
      <p className="mt-1 min-h-[2.5rem] font-mono text-xs leading-relaxed">{notes ?? <span className="text-[var(--color-fg-dim)]">∅</span>}</p>
      <div className="mt-1 text-[11px] text-[var(--color-fg-dim)]">{meta}</div>
    </div>
  );
}

// --- beat 2: ask the copy, live vs batch -----------------------------------

function Ask({ disabled, now }: { disabled: boolean; now: number }) {
  const [q, setQ] = useState(DEFAULT_QUESTION);
  const [live, setLive] = useState<Answer | null>(null);
  const [batch, setBatch] = useState<Answer | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ask = async () => {
    setBusy(true);
    setErr(null);
    try {
      const [l, b] = await Promise.allSettled([
        api<Answer>(`/ask`, { method: "POST", body: JSON.stringify({ q, mode: "live" }) }),
        api<Answer>(`/ask`, { method: "POST", body: JSON.stringify({ q, mode: "batch" }) }),
      ]);
      setLive(l.status === "fulfilled" ? l.value : null);
      setBatch(b.status === "fulfilled" ? b.value : null);
      const failed = [l, b].find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      if (failed) setErr((failed.reason as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="border-b border-[var(--color-border)] px-4 py-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium">3. Ask the replicated data</h3>
        <span className="num">pgvector · same question twice</span>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={500}
          disabled={disabled}
          onKeyDown={(e) => { if (e.key === "Enter") ask(); }}
          className="min-w-0 flex-1 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs outline-none focus:border-[var(--color-accent)]"
        />
        <Btn onClick={ask} disabled={disabled || busy}>{busy ? "…" : "Ask"}</Btn>
      </div>
      {err ? <p className="mt-2 text-xs text-red-500">{err}</p> : null}
      <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
        <AnswerCard title="live copy" sub="vector table the pipeline keeps seconds behind the source" a={live} now={now} />
        <AnswerCard title="batch copy" sub="snapshot refreshed every 5 minutes, standing in for nightly ETL" a={batch} now={now} />
      </div>
      {live ? (
        <p className="mt-2 text-[11px] text-[var(--color-fg-dim)]">
          answered by {live.model} · retrieval + answer {live.latencyMs} ms
        </p>
      ) : null}
    </section>
  );
}

function AnswerCard({ title, sub, a, now }: { title: string; sub: string; a: Answer | null; now: number }) {
  return (
    <div className="bg-[var(--color-surface)] px-3 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="num">{title}</span>
        {a ? (
          <span className="num">
            {a.mode === "batch" && a.staleBy !== null ? `data as of ${Math.round(a.staleBy)}s ago` : `data as of ${ago(a.asOf, now)}`}
          </span>
        ) : null}
      </div>
      <p className="mt-1 min-h-[3rem] text-xs leading-relaxed">
        {a ? a.answer : <span className="text-[var(--color-fg-dim)]">{sub}</span>}
      </p>
      {a?.sources?.[0] ? (
        <p className="mt-2 truncate font-mono text-[11px] text-[var(--color-fg-dim)]" title={a.sources[0].text}>
          ↳ {a.sources[0].text}
        </p>
      ) : null}
    </div>
  );
}

// --- beat 3: prove the copy is exact ---------------------------------------

function VerifyRow({ disabled }: { disabled: boolean }) {
  const [res, setRes] = useState<Verify | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      setRes(await api<Verify>(`/pipelines/${PIPELINE}/verify?timeout=10s`, { method: "POST" }));
    } catch {
      setRes(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex flex-wrap items-center gap-3 px-4 py-4">
      <h3 className="font-medium">4. Prove the copy is exact</h3>
      <Btn onClick={run} disabled={disabled || busy} subtle>{busy ? "checksumming…" : "Verify"}</Btn>
      {res ? (
        <span className={`font-mono text-xs ${res.match ? "text-emerald-500" : "text-amber-500"}`}>
          {res.match ? `all ${res.tables.length} tables MATCH` : "mismatch"} ·{" "}
          {res.tables.map((t) => `${t.table.replace("public.", "")} ${t.sourceRows}/${t.destRows}`).join(" · ")}
        </span>
      ) : (
        <span className="text-xs text-[var(--color-fg-dim)]">row counts and a full-content checksum of every table, source vs destination</span>
      )}
    </section>
  );
}

function Btn({ children, onClick, disabled, subtle }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; subtle?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-sm px-3 py-1.5 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        subtle
          ? "border border-[var(--color-border-strong)] hover:border-[var(--color-fg)]"
          : "bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:opacity-90"
      }`}
    >
      {children}
    </button>
  );
}
