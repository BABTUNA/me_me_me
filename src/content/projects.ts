export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  tags: string[];
  href?: string;
  status?: "shipped" | "wip" | "archived";
};

export const projects: Project[] = [
  {
    slug: "me-me-me",
    title: "me_me_me",
    summary:
      "This site. A monochrome portfolio + blog built with Next.js, Tailwind, and MDX.",
    year: "2026",
    tags: ["next.js", "tailwind", "mdx"],
    href: "https://github.com/BABTUNA/me_me_me",
    status: "shipped",
  },
  {
    slug: "project-two",
    title: "Project Two",
    summary:
      "Placeholder project. Replace this with a short pitch — one or two sentences max, focused on outcome.",
    year: "2025",
    tags: ["typescript", "api"],
    status: "shipped",
  },
  {
    slug: "project-three",
    title: "Project Three",
    summary:
      "Placeholder project. A tool / experiment / contribution worth showing. Keep the copy crisp.",
    year: "2025",
    tags: ["python", "ml"],
    status: "wip",
  },
  {
    slug: "project-four",
    title: "Project Four",
    summary:
      "Placeholder project. Anything you've shipped and are proud of can live here.",
    year: "2024",
    tags: ["go", "infra"],
    status: "archived",
  },
];
