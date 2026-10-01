"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { superBartieApiUrl } from "@/lib/super-bartie";
import { ago, planColumns, SideTable, type RowSelect, type TableRows } from "@/components/data-table";

// A window onto a running Super Bartie pipeline. Three beats: watch the numbers,
// change a row on the source and watch it land, ask the replicated data a
// question in live and batch mode. Everything here is a plain fetch against
// the control api; nothing is simulated.

const PIPELINE = "bartie";
const DEMO_TABLE = "public.observations";
const DEMO_PK = 9001;
// the only values a visitor can write, the server holds the same list
// free text is never sent, so nothing a visitor types ends up on the page
const PLACES = [
  "the north ridge",
  "the south bank",
  "the reed bed",
  "the shallows",
  "the acacia line",
  "the dry channel",
  "the salt lick",
  "the far shore",
] as const;
const DEFAULT_PLACE = "the south bank";

// ids the page may change: its own demo rows, and sightings the traffic writer made
const DEMO_MIN = 9000;
const DEMO_MAX = 9099;
const TRAFFIC_MIN = 3_000_000_000;
const isDemo = (id: number) => id >= DEMO_MIN && id <= DEMO_MAX;
const isEditable = (id: number) => isDemo(id) || id >= TRAFFIC_MIN;

// the place is the last clause of a ranger log, like ", the reed bed."
const placeOf = (notes: string | null) => notes?.match(/,\s*([^,]*)\.\s*$/)?.[1] ?? null;

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
  const res = await fetch(`${superBartieApiUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body as T;
}

// Status colours. The 500 shades read fine on the dark surface but fall under
// 4.5:1 on the light one at 12px, so each gets a darker light-theme shade.
const OK_TEXT = "text-emerald-700 [[data-theme=dark]_&]:text-emerald-400";
const WARN_TEXT = "text-amber-700 [[data-theme=dark]_&]:text-amber-400";
const ERR_TEXT = "text-red-600 [[data-theme=dark]_&]:text-red-400";
const FIELD =
  "rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs outline-none focus:border-[var(--color-accent)] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] disabled:opacity-50";

function kb(n: number | null): string {
  if (n === null) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function SuperBartieLive() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [offline, setOffline] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  // which observation step 2 edits, picked by clicking a row in step 1
  const [picked, setPicked] = useState<number>(DEMO_PK);

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
  // Before the first poll lands the tiles show "…", not "—", so an empty
  // metric and a not-yet-fetched one do not look the same.
  const pending = usage === null && !offline;

  return (
    <div className="my-8 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-sm">
      <Header status={summary?.status} offline={offline} backfilling={summary?.hasBackfillingTables} />

      <div className="grid grid-cols-2 gap-px border-b border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
        <Stat label="latency" value={pending ? "…" : avgLatency === null ? "—" : `${avgLatency.toFixed(2)}s`} hint="source commit → destination apply, last hour" />
        <Stat label="reader lag" value={pending ? "…" : kb(usage?.readerLagBytes ?? null)} hint="source WAL ahead of the reader" />
        <Stat label="backlog" value={pending ? "…" : usage?.backlogMessages === null || usage?.backlogMessages === undefined ? "—" : `${usage.backlogMessages.toLocaleString()} msgs`} hint="published, not yet applied" />
        <Stat label="merge p95" value={pending ? "…" : usage?.mergeMs && usage.mergeMs.samples > 0 ? `${usage.mergeMs.p95.toFixed(0)} ms` : "—"} hint="destination MERGE time" />
      </div>

      <TablePanel disabled={offline} now={now} picked={picked} onPick={setPicked} />
      <Poke disabled={offline} now={now} pk={picked} onReset={() => setPicked(DEMO_PK)} onPoked={() => { fastUntil.current = Date.now() + 15000; }} />
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
        <span className={`inline-block h-2 w-2 shrink-0 ${dot}`} aria-hidden="true" />
        <span>terra → warehouse</span>
        <span className="text-[var(--color-fg-dim)]" role="status">{label}</span>
      </div>
      <span className="num">live · {superBartieApiUrl.replace(/^https?:\/\//, "")}</span>
      {offline ? (
        <p className="w-full text-xs text-[var(--color-fg-muted)]">
          The demo server is not responding right now. It runs on one small VM and resets every night.
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

const TABLES = ["public.observations", "public.animals", "public.watering_holes"] as const;

function TablePanel({ disabled, now, picked, onPick }: { disabled: boolean; now: number; picked: number; onPick: (id: number) => void }) {
  const [table, setTable] = useState<(typeof TABLES)[number]>(TABLES[0]);
  const [rows, setRows] = useState<TableRows | null>(null);
  const [traffic, setTraffic] = useState<boolean | null>(null);
  const [trafficErr, setTrafficErr] = useState<string | null>(null);

  // The demo writer can be switched off. When the api is token-gated the
  // switch needs a bearer token, read from localStorage["bartie_token"], so
  // visitors see the state and the owner can flip it.
  const toggleTraffic = async () => {
    if (traffic === null) return;
    setTrafficErr(null);
    try {
      let token = "";
      try { token = localStorage.getItem("bartie_token") ?? ""; } catch { /* private mode */ }
      const res = await api<{ enabled: boolean }>(`/demo/traffic`, {
        method: "POST",
        body: JSON.stringify({ enabled: !traffic }),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setTraffic(res.enabled);
    } catch (e) {
      setTrafficErr((e as Error).message.includes("token") ? "locked (owner only)" : (e as Error).message);
    }
  };

  useEffect(() => {
    let active = true;
    const tick = () =>
      Promise.all([
        api<TableRows>(`/demo/table/${table}?limit=6`),
        api<{ enabled: boolean }>(`/demo/traffic`),
      ])
        .then(([r, t]) => { if (active) { setRows(r); setTraffic(t.enabled); } })
        .catch(() => {});
    tick();
    const id = setInterval(tick, 2000);
    return () => { active = false; clearInterval(id); };
  }, [table]);

  const plan = planColumns(rows);

  // only observations can be edited, and only demo rows or traffic sightings
  const select: RowSelect | undefined =
    table === "public.observations"
      ? {
          canPick: (r) => isEditable(Number(r.observation_id)),
          onPick: (r) => onPick(Number(r.observation_id)),
          picked: String(picked),
        }
      : undefined;

  return (
    <section className="border-b border-[var(--color-border)] px-4 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
        <h3 className="font-medium">1. Watch rows land</h3>
        <div className="flex flex-wrap gap-2" aria-label="table">
          {TABLES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === table}
              disabled={disabled}
              onClick={() => setTable(t)}
              className={`rounded-sm px-2 py-1 font-mono text-[11px] transition-colors disabled:opacity-50 ${t === table ? "bg-[var(--color-fg)] text-[var(--color-bg)]" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"}`}
            >
              {t.replace("public.", "")}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] text-[var(--color-fg-dim)]">
        <span>
          Newest rows on each side. A script adds a sighting every two seconds. Highlighted rows arrived in the last few seconds. Click a sighting to edit it in step 2.{" "}
          <Link href="/super-bartie/data" className="underline underline-offset-2 hover:text-[var(--color-fg)]">browse both databases</Link>
        </span>
        <button
          type="button"
          onClick={toggleTraffic}
          disabled={disabled || traffic === null}
          aria-pressed={traffic === true}
          className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-border-strong)] px-2 py-1 font-mono text-[11px] text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50"
          title="pause or resume the demo writer"
        >
          <span className={`inline-block h-1.5 w-1.5 ${traffic ? "bg-emerald-500" : "bg-[var(--color-fg-dim)]"}`} aria-hidden="true" />
          traffic {traffic === null ? "…" : traffic ? "on" : "off"}
        </button>
        {trafficErr ? <span className={WARN_TEXT}>{trafficErr}</span> : null}
      </p>
      <div className="mt-3 grid min-w-0 gap-px bg-[var(--color-border)]">
        <div className="min-w-0 bg-[var(--color-surface)] py-2">
          <div className="num px-2 pb-1">source (terra)</div>
          {rows ? <SideTable side="source" rows={rows} plan={plan} now={now} layout="scroll" select={select} /> : <Placeholder disabled={disabled} />}
        </div>
        <div className="min-w-0 bg-[var(--color-surface)] py-2">
          <div className="num px-2 pb-1">destination (warehouse)</div>
          {rows ? <SideTable side="dest" rows={rows} plan={plan} now={now} layout="scroll" select={select} /> : <Placeholder disabled={disabled} />}
        </div>
      </div>
    </section>
  );
}

// Stands in for a table until the first fetch lands (or while the api is down).
function Placeholder({ disabled }: { disabled: boolean }) {
  return <div className="px-2 py-2 font-mono text-[11px] text-[var(--color-fg-dim)]">{disabled ? "unreachable" : "loading…"}</div>;
}

// --- beat 1: change a row, watch it land ------------------------------------

function Poke({ disabled, now, pk, onReset, onPoked }: { disabled: boolean; now: number; pk: number; onReset: () => void; onPoked: () => void }) {
  const [row, setRow] = useState<RowView | null>(null);
  const [commitTs, setCommitTs] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRow(await api<RowView>(`/demo/row/${DEMO_TABLE}/${pk}`));
    } catch {
      /* the status strip already shows offline */
    }
  }, [pk]);

  // a different row was picked: forget the old one's state and start polling the new one
  useEffect(() => {
    setRow(null);
    setCommitTs(null);
    setErr(null);
    refresh();
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [refresh]);

  const send = async (op: "c" | "u" | "d", id: number, place?: string) => {
    setBusy(true);
    setErr(null);
    try {
      const res = await api<{ commitTs: string }>(`/demo/poke`, {
        method: "POST",
        body: JSON.stringify({ op, pk: { observation_id: id }, ...(place ? { place } : {}) }),
      });
      setCommitTs(res.commitTs);
      onPoked();
      if (id === pk) refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  // back to the safe starting point: the demo row, in its default place
  // "c" creates the row or puts an existing one back, so this always works
  const reset = () => {
    onReset();
    send("c", DEMO_PK, DEFAULT_PLACE);
  };

  const srcNotes = row?.source ? String(row.source.notes ?? "") : null;
  const dstNotes = row?.dest ? String(row.dest.notes ?? "") : null;
  const landed = row !== null && srcNotes === dstNotes;
  const applied = row?.dest?.__bartie_updated_at;
  const tookMs = commitTs && applied && landed ? new Date(applied).getTime() - new Date(commitTs).getTime() : null;
  const current = placeOf(srcNotes);
  const demo = isDemo(pk);
  const gone = row !== null && !row.source;

  return (
    <section className="border-b border-[var(--color-border)] px-4 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h3 className="font-medium">2. Change a row on the source</h3>
        <span className="num">
          observations #{pk} · {demo ? "demo row" : "live sighting"}
        </span>
      </div>

      <p className="mt-2 text-[11px] text-[var(--color-fg-dim)]">
        {gone
          ? demo
            ? "This demo row does not exist yet. Reset creates it."
            : "This sighting was retracted by the traffic writer. Pick another row above, or reset."
          : "Move the sighting somewhere else. Pick a place and the change goes to the source."}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="move the sighting to">
        {PLACES.map((p) => {
          const active = p === current;
          return (
            <button
              key={p}
              type="button"
              disabled={disabled || busy || gone || active}
              aria-pressed={active}
              onClick={() => send("u", pk, p)}
              className={`rounded-sm border px-2 py-1 font-mono text-[11px] transition-colors disabled:cursor-not-allowed ${
                active
                  ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
                  : "border-[var(--color-border-strong)] hover:border-[var(--color-fg)] disabled:opacity-50"
              }`}
            >
              {p.replace(/^the /, "")}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Btn onClick={reset} disabled={disabled || busy} subtle>
          Reset to default
        </Btn>
        {demo ? (
          <Btn onClick={() => send("d", pk)} disabled={disabled || busy || gone} subtle>
            Delete
          </Btn>
        ) : null}
        <span className="text-[11px] text-[var(--color-fg-dim)]">
          reset goes back to demo row #{DEMO_PK} at {DEFAULT_PLACE.replace(/^the /, "")}
        </span>
        {err ? <span className={`text-xs ${ERR_TEXT}`} role="alert">{err}</span> : null}
      </div>

      <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
        <Side title="source (terra)" notes={srcNotes} meta={row === null ? (disabled ? "unreachable" : "loading…") : row.source ? "committed" : "no row"} />
        <Side
          title="destination (warehouse)"
          notes={dstNotes}
          meta={
            row === null
              ? disabled ? "unreachable" : "loading…"
              : row.dest
                ? `applied ${ago(applied, now)}${tookMs !== null ? ` · ${tookMs.toLocaleString()} ms after commit` : ""}`
                : row.source
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h3 className="font-medium">3. Ask the replicated data</h3>
        <span className="num">pgvector · same question twice</span>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={500}
          disabled={disabled}
          aria-label="question"
          onKeyDown={(e) => { if (e.key === "Enter" && !busy && !disabled) ask(); }}
          className={`min-w-0 flex-1 ${FIELD}`}
        />
        <Btn onClick={ask} disabled={disabled || busy} busy={busy}>{busy ? "asking…" : "Ask"}</Btn>
      </div>
      {err ? <p className={`mt-2 text-xs ${ERR_TEXT}`} role="alert">{err}</p> : null}
      <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
        <AnswerCard title="live copy" sub="updated by the pipeline, about two seconds behind the source" a={live} now={now} />
        <AnswerCard title="batch copy" sub="a snapshot taken every five minutes" a={batch} now={now} />
      </div>
      {live ? (
        <p className="mt-2 text-[11px] text-[var(--color-fg-dim)]">
          answered by {live.model} · retrieval + answer {live.latencyMs.toLocaleString()} ms
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
    <section className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-4">
      <h3 className="font-medium">4. Prove the copy is exact</h3>
      <Btn onClick={run} disabled={disabled || busy} subtle busy={busy}>{busy ? "checksumming…" : "Verify"}</Btn>
      {res ? (
        <span className={`min-w-0 font-mono text-xs ${res.match ? OK_TEXT : WARN_TEXT}`} role="status">
          {res.match ? `all ${res.tables.length} tables MATCH` : "mismatch"} ·{" "}
          {res.tables.map((t) => `${t.table.replace("public.", "")} ${t.sourceRows.toLocaleString()}/${t.destRows.toLocaleString()}`).join(" · ")}
        </span>
      ) : (
        <span className="min-w-0 text-xs text-[var(--color-fg-dim)]">compares row counts and a checksum of every table in both databases</span>
      )}
    </section>
  );
}

function Btn({ children, onClick, disabled, subtle, busy }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; subtle?: boolean; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy || undefined}
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
