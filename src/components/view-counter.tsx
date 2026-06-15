"use client";

import { useEffect, useState } from "react";

// Free, no-auth hit counter (https://abacus.jasoncameron.dev). No DB required.
// Swap NAMESPACE/API or replace this component if you ever move to Vercel KV.
const API = "https://abacus.jasoncameron.dev";
const NAMESPACE = "bb-me-me-me-blog";

// Guards against double-counting from React strict mode and client-side
// re-navigation within the same session.
const counted = new Set<string>();

type ViewCounterProps = {
  slug: string;
  /** Increment the count (use on the article page, not on list views). */
  increment?: boolean;
  className?: string;
};

export function ViewCounter({
  slug,
  increment = false,
  className = "",
}: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const key = encodeURIComponent(slug);
    const shouldHit = increment && !counted.has(slug);
    if (shouldHit) counted.add(slug);

    const url = `${API}/${shouldHit ? "hit" : "get"}/${NAMESPACE}/${key}`;

    fetch(url)
      .then((res) => {
        if (res.ok) return res.json();
        // A never-visited post has no key yet — treat as zero for read views.
        if (!shouldHit) return { value: 0 };
        return null;
      })
      .then((data) => {
        if (active && data && typeof data.value === "number") {
          setViews(data.value);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [slug, increment]);

  if (views === null) return null;

  return (
    <span className={`num ${className}`}>
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  );
}
