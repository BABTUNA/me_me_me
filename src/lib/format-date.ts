/** Frontmatter dates are calendar dates; UTC keeps them stable across time zones. */
export function formatDate(iso: string, month: "short" | "long" = "short") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}
