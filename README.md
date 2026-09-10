# me_me_me

Ben Barrera’s personal portfolio and blog. Built with Next.js 15 (App Router), React 19, Tailwind CSS, and MDX.

## Pages

- **Home** — introduction, featured projects, and recent writing
- **Work** — projects and open-source contributions
- **Blog** — technical writing and career notes
- **About** — biography, experience, and contact

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Validate

```bash
npm run typecheck
npm run build
```

## Content

- Add projects in `src/content/projects.ts`; set `featured: true` to show a project on the homepage. Use `linkLabel` for a descriptive project or case-study link.
- Add writing in `src/content/blog/*.mdx` with a title, date (`YYYY-MM-DD`), summary, category, and authorship in frontmatter.
- Update employment details in `src/content/experience.ts`.

## Deploy

Deploy as a Next.js application on Vercel or another host with Next.js support. `npm run build` creates the production build; `npm start` serves it. Static export is not enabled in the current configuration.

Set `NEXT_PUBLIC_SITE_URL` to the canonical origin (for example, `https://your-domain.com`) before building. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used automatically if no override is set. The sitemap includes Work and all articles. When no origin is configured, local builds omit public sitemap entries rather than publish a placeholder domain.

The GitHub repository’s listed homepage (`me-me-me-rose.vercel.app`) returned `DEPLOYMENT_NOT_FOUND` during the September 2026 review. Check the production domain in Vercel and update the repository homepage when restoring deployment.
