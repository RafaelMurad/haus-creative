# HAUS Creative

Static portfolio site for a luxury creative agency. Next.js App Router with SSG.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3.
`npm` for packages. Path alias: `@/*` → `./src/*`.
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
- CSS-first animations — do not add Framer Motion
- Use `siteConfig` from `src/config/site.ts` for emails, social links, nav — never hardcode
- Test utilities in `src/__tests__/utils.tsx` — use them for rendering and mock data
