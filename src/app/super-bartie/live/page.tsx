import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { SuperBartieLive } from "@/components/super-bartie-live";
import { superBartieRepoUrl } from "@/lib/super-bartie";

export const metadata = {
  title: "Super Bartie, live",
  description:
    "A running Postgres CDC pipeline you can poke: change a row, watch it land, ask the replicated data a question.",
};

export default function SuperBartieLivePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Link href="/blog/super-bartie" className="arrow-link text-xs text-[var(--color-fg-muted)] [&>svg]:rotate-180">
        <Arrow /> the writeup
      </Link>
      <h1 className="mt-10 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">Super Bartie, live</h1>
      <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
        A Postgres CDC pipeline running on one small VM: source WAL to Redpanda to a destination Postgres, plus a
        pgvector copy for retrieval. Everything below hits the real thing.
      </p>

      <SuperBartieLive />

      <div className="space-y-3 text-sm text-[var(--color-fg-muted)]">
        <p>
          <strong className="text-[var(--color-fg)]">What you are looking at.</strong> The numbers say where the
          latency is, not just how much: reader lag is the source WAL ahead of the reader, backlog is what the broker
          holds that the writer has not applied, merge p95 is the destination&apos;s MERGE time. One of those three
          grows when something is slow, and which one names the bottleneck.
        </p>
        <p>
          <strong className="text-[var(--color-fg)]">Why two answers.</strong> An AI reading a nightly copy of your
          data will confidently tell you yesterday. The live column reads a vector table the pipeline keeps a couple of
          seconds behind the source; the batch column reads a snapshot refreshed every five minutes, which is generous
          to batch. Edit the row, ask again, and watch them disagree.
        </p>
        <p>
          The demo row is fenced to one primary key range and reset nightly. Code, deploy files, and the MCP server
          that exposes these same endpoints to Claude Code are in the{" "}
          <a href={superBartieRepoUrl} className="content-link" target="_blank" rel="noopener noreferrer">
            repo
          </a>
          .
        </p>
      </div>
    </div>
  );
}
