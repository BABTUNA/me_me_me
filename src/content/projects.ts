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
    slug: "gradual-agents",
    title: "Gradual AI Agents",
    summary:
      "Architected AI Agents in Next.js with MCP connections to GitHub, MongoDB, and ClickHouse to query 100GB+ of company events data and to generate charts/graphs using AI SDK.",
    year: "2025",
    tags: ["next.js", "mcp", "kubernetes", "ai sdk"],
    status: "shipped",
  },
  {
    slug: "space4all",
    title: "Space4All",
    summary:
      "Constructed educational full stack platform with Angular to teach planetology to K-12 with Gemini batch-generated learning and testing cards along with leaderboard display, winning 5th place.",
    year: "2024",
    tags: ["angular", "spring boot", "postgresql", "gemini"],
    status: "shipped",
  },
  {
    slug: "medsave",
    title: "MedSave",
    summary:
      "Spearheaded application using ReactJS, Express, and MySQL (raw queries) to automate medical coding translation for 100+ records of custom patient data using Gemini, achieving accuracy of 67%.",
    year: "2024",
    tags: ["react", "express", "mysql", "gemini"],
    status: "shipped",
  },
];
