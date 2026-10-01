import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { SuperBartieData } from "@/components/super-bartie-data";

export const metadata = {
  title: "Super Bartie, the data",
  description: "Browse the source and destination databases of a running Postgres CDC pipeline, side by side.",
};

export default function SuperBartieDataPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Link href="/super-bartie/live" className="arrow-link text-xs text-[var(--color-fg-muted)] [&>svg]:rotate-180">
        <Arrow /> the live console
      </Link>
      <h1 className="mt-10 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">Both databases</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
        The source is on the left and the destination is on the right. Bartie copies changes from the source&apos;s
        write-ahead log into the destination. Both sides show the same table and the same page of rows.
      </p>
      <div className="mt-10">
        <SuperBartieData />
      </div>
    </div>
  );
}
