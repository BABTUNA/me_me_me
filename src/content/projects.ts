export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  tags: string[];
  href?: string;
  status?: "shipped" | "wip" | "archived";
  featured?: boolean;
  category?: string;
  linkLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "lattis",
    title: "Lattis",
    summary:
      "An interactive system design curriculum with 3D walkthroughs. Follow the decisions behind caches, queues, and sharding as each architecture grows.",
    year: "2026",
    tags: ["system design", "3D", "education"],
    href: "/blog/lattis-system-design",
    linkLabel: "Read the story",
    status: "wip",
    featured: true,
    category: "Interactive learning",
  },
  {
    slug: "daft",
    title: "Making Daft faster",
    summary:
      "Contributions to a distributed dataframe engine in Rust: inline min/max accumulators, string fast paths, and simpler aggregation dispatch.",
    year: "2026",
    tags: ["rust", "open source", "performance"],
    href: "/blog/daft-inline-aggregation",
    linkLabel: "Read the technical write-up",
    featured: true,
    category: "Open source",
  },
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
    slug: "gradual-agents",
    title: "Gradual AI Agents",
    summary:
      "Built AI agents that query 100GB+ of company event data across GitHub, MongoDB, and ClickHouse, then turn the results into charts with the AI SDK.",
    year: "2025",
    tags: ["next.js", "mcp", "kubernetes", "ai sdk"],
    status: "shipped",
  },
  {
    slug: "space4all",
    title: "Space4All",
    summary:
      "A planetology learning platform for K–12 students, with Gemini-generated study cards, quizzes, and a leaderboard. Placed fifth in its competition.",
    year: "2024",
    tags: ["angular", "spring boot", "postgresql", "gemini"],
    status: "shipped",
  },
  {
    slug: "medsave",
    title: "MedSave",
    summary:
      "A medical coding prototype using React, Express, MySQL, and Gemini. Tested automated translation on 100+ custom patient records, reaching 67% accuracy.",
    year: "2024",
    tags: ["react", "express", "mysql", "gemini"],
    status: "shipped",
  },
];
