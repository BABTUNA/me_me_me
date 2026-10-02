import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { SuperBartieLive } from "@/components/super-bartie-live";

export const metadata = {
  title: "Super Bartie, live",
  description:
    "A running Postgres CDC pipeline. Watch rows get replicated, change one yourself, and ask questions about the data.",
};

export default function SuperBartieLivePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Link href="/blog/super-bartie" className="arrow-link text-xs text-[var(--color-fg-muted)] [&>svg]:rotate-180">
        <Arrow /> the writeup
      </Link>
      <h1 className="mt-10 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">Super Bartie, live</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
        This is a Postgres CDC pipeline running on one VM. Changes go from the source&apos;s WAL through Redpanda into
        a second Postgres, and each row is also stored as a vector. The panels below call the running system.
      </p>

      <SuperBartieLive />
    </div>
  );
}
