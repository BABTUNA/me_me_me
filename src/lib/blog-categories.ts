export const BLOG_CATEGORIES = {
  career: { label: "Career" },
  technical: { label: "Technical" },
  meta: { label: "Meta" },
} as const;

export type BlogCategory = keyof typeof BLOG_CATEGORIES;

export function getCategoryLabel(category: string | undefined): string | null {
  if (!category) return null;
  if (category in BLOG_CATEGORIES) {
    return BLOG_CATEGORIES[category as BlogCategory].label;
  }
  return category;
}

/** How a post was written, surfaced as a badge so readers know the provenance. */
export const AUTHORSHIP = {
  handwritten: {
    label: "Written by me",
    dot: "#4ade80",
    description: "Written entirely by me, no AI.",
  },
  hybrid: {
    label: "Me + AI",
    dot: "#f5a623",
    description: "Written by me with help from AI for editing and structure.",
  },
  ai: {
    label: "AI-written",
    dot: "var(--color-accent)",
    description:
      "An AI-generated summary of my work, lightly reviewed by me (prob from LinkedIn).",
  },
} as const;

export type Authorship = keyof typeof AUTHORSHIP;

export type AuthorshipMeta = {
  label: string;
  dot: string;
  description: string;
};

export function getAuthorship(
  authorship: string | undefined,
): AuthorshipMeta | null {
  if (!authorship) return null;
  if (authorship in AUTHORSHIP) {
    return AUTHORSHIP[authorship as Authorship];
  }
  return { label: authorship, dot: "var(--color-fg-dim)", description: "" };
}
