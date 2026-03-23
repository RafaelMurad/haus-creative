# HAUS Creative

Static portfolio site for a luxury creative agency. Next.js App Router with SSG.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3.
`npm` for packages. Path alias: `@/*` -> `./src/*`.
All project data is hardcoded in `src/config/site.ts` and `src/config/projects.ts`.
No database, no API routes, no authentication.

## Development

```bash
npm run type-check   # must pass clean
npm run lint         # must pass clean
npm test             # must pass, 50% coverage threshold
npm run build        # verify before finishing
```

## Conventions

- British English throughout (colour, centre, behaviour)
- CSS-first animations — do not add new Framer Motion usage
- Use `siteConfig` from `src/config/site.ts` for emails, social links, nav — never hardcode
- Use Next.js `<Image>` for all images, never raw `<img>`
- Hooks in `src/hooks/`, utils in `src/utils/`, types in `src/types/`
- Components: `src/components/{home,layout,ui}/` with barrel exports
- Tests: `src/__tests__/` mirroring source structure, AAA pattern, behaviour-focused names
- Existing test utilities in `src/__tests__/utils.tsx` — use them

## Installed Skills

- `next-best-practices` — Next.js patterns, error handling, image optimisation
- `seo-audit` — SEO audit framework for marketing site
- `test-driven-development` — TDD workflow (red-green-refactor)
- `writing-plans` — spec-driven implementation plans
- `webapp-testing` — Playwright-based visual/functional testing
- `audit-website` — full site audit (230+ rules, SEO, security, a11y, perf)
