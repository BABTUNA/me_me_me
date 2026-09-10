"use client";

import { Component, Suspense, lazy, type ComponentProps, type ReactNode } from "react";
import { StatueBustLoader } from "./statue-bust-loader";
import type { StatueBust as StatueBustType } from "./statue-bust";

const LazyStatueBust = lazy(() =>
  import("./statue-bust").then((mod) => ({ default: mod.StatueBust })),
);

type StatueBustProps = ComponentProps<typeof StatueBustType>;

// A decorative model must never prevent visitors from reading the page.
class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function StatueBust(props: StatueBustProps) {
  const w = props.width ?? props.size ?? 260;
  const h = props.height ?? props.size ?? 260;

  return (
    <ModelBoundary key={props.model}>
      <Suspense
        fallback={
          <StatueBustLoader width={w} height={h} className={props.className} />
        }
      >
        <LazyStatueBust {...props} />
      </Suspense>
    </ModelBoundary>
  );
}
