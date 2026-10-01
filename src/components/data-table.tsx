"use client";

// Fixed-layout tables for Bartie rows, shared by the live console's "watch
// rows land" panel and the full data browser. One sizing plan is computed
// for a pair of tables so source and destination columns line up.

export type Row = Record<string, unknown> & { __bartie_updated_at?: string };

export type TableRows = {
  table: string;
  pk: string;
  recency: string;
  destOnly?: boolean;
  limit?: number;
  offset?: number;
  counts?: { source: number | null; dest: number | null };
  source: Row[];
  dest: Row[];
};

export const HIDDEN = new Set(["__bartie_commit_ts", "__bartie_updated_at"]);

export function cell(v: unknown): string {
  if (v === null || v === undefined) return "∅";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return s.slice(11, 19);
  return s;
}

export function ago(iso: string | null | undefined, now: number): string {
  if (!iso) return "—";
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s.toFixed(0)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

// Column sizing for a fixed-layout table. Every column gets a width in ch from
// its longest visible value (or the longest word of its header, since headers
// wrap at underscores), clamped so one long id cannot hog the row. The
// wordiest column gets no width and soaks up whatever is left, truncating with
// an ellipsis. Below fixed + FLEX_MIN_CH the table stops shrinking and the
// wrapper scrolls instead, so the card never widens the page.
const MIN_CH = 5;
const MAX_CH = 12;
const FLEX_MIN_CH = 12;
const CELL_PAD_PX = 16; // px-2 on both sides; th is border-box so widths carry it
const APPLIED_CH = 7; // "applied" / "59s ago"

function headerWordLength(c: string): number {
  const parts = c.split("_");
  return Math.max(...parts.map((w, i) => w.length + (i < parts.length - 1 ? 1 : 0)));
}

export type Plan = { columns: string[]; widths: Record<string, number>; flex: string | null };

export function planColumns(rows: TableRows | null): Plan {
  const first = rows?.source[0] ?? rows?.dest[0];
  if (!rows || !first) return { columns: [], widths: {}, flex: null };
  const rest = Object.keys(first).filter((k) => !HIDDEN.has(k) && k !== rows.pk && k !== rows.recency);
  const columns = [rows.pk, rows.recency, ...rest];

  const all = [...rows.source, ...rows.dest];
  const longest = (c: string) => all.reduce((m, r) => Math.max(m, cell(r[c]).length), 0);
  const candidates = columns.filter((c) => c !== rows.pk && c !== rows.recency);
  const flex = candidates.length > 0 ? candidates.reduce((a, b) => (longest(b) > longest(a) ? b : a)) : null;
  const widths: Record<string, number> = {};
  for (const c of columns) {
    if (c !== flex) widths[c] = Math.min(MAX_CH, Math.max(MIN_CH, longest(c), headerWordLength(c)));
  }
  return { columns, widths, flex };
}

export function SideTable({
  side,
  rows,
  plan,
  now,
  freshMs = 6000,
}: {
  side: "source" | "dest";
  rows: TableRows | null;
  plan: Plan;
  now: number;
  freshMs?: number;
}) {
  const { columns, widths, flex } = plan;
  const cols = side === "dest" ? [...columns, "applied"] : columns;
  const chOf = (c: string) => (c === "applied" ? APPLIED_CH : widths[c]);
  const fixedCh = cols.reduce((sum, c) => sum + (chOf(c) ?? 0) + 0.5, 0);
  const minWidth = `calc(${fixedCh + (flex ? FLEX_MIN_CH : 0)}ch + ${cols.length * CELL_PAD_PX}px)`;
  const width = (c: string) => {
    const ch = chOf(c);
    return ch === undefined ? undefined : `calc(${ch + 0.5}ch + ${CELL_PAD_PX}px)`;
  };
  const list = rows?.[side] ?? [];
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full table-fixed border-collapse font-mono text-[11px]" style={{ minWidth }}>
        <thead>
          <tr className="text-left text-[var(--color-fg-dim)]">
            {cols.map((c) => (
              <th key={c} className="break-words px-2 py-1 font-normal align-bottom" style={{ width: width(c) }} title={c}>
                {c.replace(/_/g, "_​")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((r, i) => {
            const applied = side === "dest" ? r.__bartie_updated_at : undefined;
            const fresh = applied ? now - new Date(applied).getTime() < freshMs : false;
            return (
              <tr key={`${String(r[rows!.pk])}-${i}`} className={`border-t border-[var(--color-border)] ${fresh ? "bg-[var(--color-accent-soft)]" : ""}`}>
                {columns.map((c) => <td key={c} className="truncate px-2 py-1 align-top" title={String(r[c] ?? "")}>{cell(r[c])}</td>)}
                {side === "dest" ? <td className="truncate px-2 py-1 align-top text-[var(--color-fg-dim)]">{applied ? ago(applied, now) : "—"}</td> : null}
              </tr>
            );
          })}
          {rows && list.length === 0 ? (
            <tr><td colSpan={cols.length} className="px-2 py-2 text-[var(--color-fg-dim)]">{side === "source" && rows.destOnly ? "destination only" : "no rows"}</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
