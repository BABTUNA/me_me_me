import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BartieData } from "@/components/bartie-data";

export const metadata = {
  title: "Bartie, the data",
  description: "Browse the source and destination databases of a running Postgres CDC pipeline, side by side.",
};

export default function BartieDataPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Link href="/bartie/live" className="arrow-link text-xs text-[var(--color-fg-muted)] [&>svg]:rotate-180">
        <Arrow /> the live console
      </Link>
      <h1 className="mt-10 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">Both databases</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
        The source on the left is what gets written to. The destination on the right is what Bartie keeps in sync from
        the write-ahead log. Same table, same page, so you can read across.
      </p>
      <div className="mt-10">
        <BartieData />
      </div>
    </div>
  );
}
