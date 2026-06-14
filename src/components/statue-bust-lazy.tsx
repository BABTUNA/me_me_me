"use client";

import { Suspense, lazy, type ComponentProps } from "react";
import { StatueBustLoader } from "./statue-bust-loader";
import type { StatueBust as StatueBustType } from "./statue-bust";

const LazyStatueBust = lazy(() =>
  import("./statue-bust").then((mod) => ({ default: mod.StatueBust })),
);

type StatueBustProps = ComponentProps<typeof StatueBustType>;

export function StatueBust(props: StatueBustProps) {
  const w = props.width ?? props.size ?? 260;
  const h = props.height ?? props.size ?? 260;

  return (
    <Suspense
      fallback={
        <StatueBustLoader width={w} height={h} className={props.className} />
      }
    >
      <LazyStatueBust {...props} />
    </Suspense>
  );
}
