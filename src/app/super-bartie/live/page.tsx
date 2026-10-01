import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { SuperBartieLive } from "@/components/super-bartie-live";
import { superBartieRepoUrl } from "@/lib/super-bartie";

export const metadata = {
  title: "Super Bartie, live",
  description:
    "A running Postgres CDC pipeline. Watch rows get replicated, change one yourself, and ask questions about the data.",
};

export default function SuperBartieLivePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Link href="/blog/super-bartie" className="arrow-link text-xs text-[var(--color-fg-muted)] [&>svg]:rotate-180">
        <Arrow /> the writeup
      </Link>
      <h1 className="mt-10 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">Super Bartie, live</h1>
      <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
        This is a Postgres CDC pipeline running on one VM. Changes go from the source&apos;s WAL through Redpanda into
        a second Postgres, and each row is also stored as a vector. The panels below call the running system.
      </p>

      <SuperBartieLive />

      <div className="space-y-3 text-sm text-[var(--color-fg-muted)]">
        <p>
          <strong className="text-[var(--color-fg)]">The four numbers at the top.</strong> Latency is how long a
          change takes to reach the destination. Reader lag is how far the source&apos;s WAL is ahead of the reader.
          Backlog is how many messages are waiting in Redpanda. Merge p95 is how long the destination takes to apply a
          batch. When the pipeline is slow, one of the last three goes up, and that tells you which part is slow.
        </p>
        <p>
          <strong className="text-[var(--color-fg)]">Live and batch.</strong> Step 3 asks the same question against two
          copies of the data. The live copy is updated by the pipeline and is about two seconds behind. The batch copy
          is a snapshot taken every five minutes. If you change a row and ask again, the live copy has the new answer
          and the batch copy does not.
        </p>
        <p>
          You can only change the demo row and the sightings the traffic script creates, and the data resets every
          night. The code is in the{" "}
          <a href={superBartieRepoUrl} className="content-link" target="_blank" rel="noopener noreferrer">
            repo
          </a>
          .
        </p>
      </div>
    </div>
  );
}
