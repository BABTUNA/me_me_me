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
