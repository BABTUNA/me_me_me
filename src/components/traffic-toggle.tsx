"use client";

import { useEffect, useState } from "react";
import { superBartieApiUrl } from "@/lib/super-bartie";

// shows whether the demo traffic script is writing and lets anyone switch it
// used on the live console and the data browser so both pages agree
// a pause lasts ten minutes at most, then the server turns traffic back on

const WARN_TEXT = "text-amber-700 [[data-theme=dark]_&]:text-amber-400";

export function TrafficToggle({ disabled = false }: { disabled?: boolean }) {
  const [on, setOn] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const tick = () =>
      fetch(`${superBartieApiUrl}/demo/traffic`)
        .then((r) => r.json())
        .then((t: { enabled: boolean }) => { if (active) setOn(t.enabled); })
        .catch(() => {});
    tick();
    const id = setInterval(tick, 3000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const toggle = async () => {
    if (on === null) return;
    setErr(null);
    try {
      const res = await fetch(`${superBartieApiUrl}/demo/traffic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !on }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setOn(body.enabled);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || on === null}
        aria-pressed={on === true}
        title="pause or resume the demo writer, it resumes on its own after ten minutes"
        className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-border-strong)] px-2 py-1 font-mono text-[11px] text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={`inline-block h-1.5 w-1.5 ${on ? "bg-emerald-500" : "bg-[var(--color-fg-dim)]"}`} aria-hidden="true" />
        traffic {on === null ? "…" : on ? "on" : "off"}
      </button>
      {err ? <span className={`text-[11px] ${WARN_TEXT}`}>{err}</span> : null}
    </span>
  );
}
