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
- Use Next.js `<Image>` for all images, never raw `<img>`
- Hooks in `src/hooks/`, utils in `src/utils/`, types in `src/types/`
- Components: `src/components/{home,layout,ui}/` with barrel exports
- Tests: `src/__tests__/` mirroring source structure, AAA pattern, behaviour-focused names
- Test utilities in `src/__tests__/utils.tsx` — use them for rendering and mock data

## Current Branch

`feature/gallery-layout-fidelity` — simplified gallery layout config and replaced all gallery assets.

## Gallery Layout Model

- Mobile: 1 image per row, full width, stacked
- Desktop: 1 or 2 images per row, full width, stacked
- Per-media-item config: `span` (full/half), `frame` (mask/inset/phone/colorFrame), `bgColor`, `padding` ([mobile, desktop] px)
- Removed from scope: `aspectRatio` per item, `galleryGap` per project
- Framed items always use hardcoded `aspect-[3/4]`

## Hero Strategy

All 11 projects have video. ALL get `heroVideo` (first/only video). ALL images (including 01) go into `media[]`. Multi-video projects (Harrods, YSL): first video = heroVideo, remaining videos = additional `media[]` items appended after images. `heroVideo.poster` = first WEB image path.

## Projects (11 total, presentation order)

Ouronyx (intro hero), Marie Claire, YSL, WAO, Vivara, Bucherer, SK-II, BFJ, Life, Bride, Harrods.

### Slug changes from old config

- `marie-claire-arabia` -> `marie-claire`
- `wao-cosmo` -> `wao`
- `bucherer-summer` -> `bucherer`
- `sk` -> `sk-ii`
- `bride-story` -> `bride`
- `harrods` — completely new

### Asset counts per project

| slug | web imgs | mob imgs | web vids | mob vids | notes |
|------|----------|----------|----------|----------|-------|
| bfj | 15 (BUC_WEB_01-15) | 16 (BUC_MOB_01-16) | 1 | 1 | Images use BUC_ prefix. Item 16 mobile-only. |
| bride | 11 (BRD_WEB_01-11) | 11 (BRD_MOB_01-11) | 1 | 1 | Perfect match |
| bucherer | 9 (BUC_WEB_01-09) | 9 (BUC_MOB_01-09) | 1 | 1 | Also BUC_ prefix (different folder) |
| harrods | 17 (HAR_WEB_01-16 + 12-1) | 16 (HAR_MOB_01-16) | 8 | 8 | WEB has extra 12-1 image. 8 video pairs. |
| life | 14 (LIFE_WEB_01-02,04-15) | 15 (LIFE_MOB_01-15) | 1 | 1 | WEB missing 03 (mob-only) |
| marie-claire | 10 (MC_WEB_01-09,11) | 11 (MC_MOB_01-11) | 1 | 1 | WEB missing 10 (mob-only) |
| ouronyx | 8 (OUR_WEB_01-08) | 8 (OUR_MOB_01-08) | 1 | 1 | Perfect match |
| sk-ii | 16 (SKII-WEB-01-16) | 16 (SKII-MOB-01-16) | 1 | 1 | Uses hyphens not underscores |
| vivara | 18 (VIV_WEB_01-18) | 18 (VIV_MOB_01-18) | 1 | 1 | Perfect match |
| wao | 21 (WAO_WEB_01-21) | 21 (WAO_MOB_01-12,14-22) | 1 | 1 | MOB missing 13 (web-only), MOB has 22 (mob-only) |
| ysl | 13 (YSL_WEB_01-13) | 12 (YSL_MOB_01-09,11-13) | 4 | 4 | MOB missing 10 (web-only) |

### Harrods video mapping (renamed from long names to numbered)

video-01=Paid Dining Hall 16-9, video-02=DH Caviar Champagne, video-03=DH Cheese Lovers, video-04=DH Mocktails, video-05=SUSHI, video-06=Grill/Christmas Chocolate, video-07=Sparkly Outfits Champagne, video-08=VIDEO INTRODUÇÃO

### Carousel configs

ouronyx: fade/2000ms, marie-claire: fade/2000ms, ysl: none/800ms, wao: none/no-auto, vivara: fade/1000ms, bucherer: none/no-auto, sk-ii: slide/2500ms, bfj: fade/2000ms, life: fade/3000ms, bride: fade/2000ms, harrods: fade/2000ms

## Completed Work

- Simplified GalleryGrid: removed `aspectRatio` and `galleryGap` from types/components
- Deleted old gallery assets (gallery1-gallery10)
- Downloaded, converted (WebP q85), compressed (CRF 23 H.264) all 11 projects (306 images, 42 videos, 298 MB total)
- Restructured folders: `public/assets/{slug}/web/` and `public/assets/{slug}/mobile/`
- Rewrote `src/config/projects.ts` with all 11 projects, new slugs, all media items in order
- Updated `src/config/site.ts` featuredProjects array (all 11, all video type)
- Updated tests: `projects.test.ts`, `work-slug.test.tsx`
- All checks pass: type-check, lint, 267 tests, build (20 pages)
- All media items currently set to defaults (mask frame, half span, no bgColor/padding)

## Next Steps

- **Gallery styling**: Set specific `frame`, `span`, `bgColor`, `padding` per media item to match intended design (use Figma MCP to pull design data)
- **Visual review**: Check site in browser to confirm assets load and layouts look correct
- **Animation/transitions**: Deferred

## Key Files

- `src/config/projects.ts` — all 11 projects, media items, carousel configs
- `src/config/site.ts` — featuredProjects array, siteConfig
- `src/components/ui/GalleryGrid.tsx` — gallery layout component
- `src/app/work/[slug]/page.tsx` — project detail page
- Assets: `public/assets/{slug}/web/` and `public/assets/{slug}/mobile/`

## Installed Skills

- `next-best-practices` — Next.js patterns, error handling, image optimisation
- `seo-audit` — SEO audit framework for marketing site
- `test-driven-development` — TDD workflow (red-green-refactor)
- `writing-plans` — spec-driven implementation plans
- `webapp-testing` — Playwright-based visual/functional testing
- `audit-website` — full site audit (230+ rules, SEO, security, a11y, perf)
