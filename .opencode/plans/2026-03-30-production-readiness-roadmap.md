# HAUS Creative — Production Readiness Roadmap

> **Created:** 2026-03-30
> **Last updated:** 2026-03-30
> **Status:** Active — Phase 21 in progress

---

## Progress to Date

### Pre-production push (Nov 2025 – Dec 2025)

| PR | What |
|----|------|
| #1–#3 | Gallery display improvements, add remaining galleries |
| #6–#12 | Dark theme redesign, stabilisation, accessibility, feature flags |
| #13–#16 | Component cleanup, header layout, gallery enhancements |
| #17 | Design alignment |
| #18 | Mobile scroll jitter fix |

### Production readiness push (Mar 2026)

| Phase | PR | Branch | What |
|-------|----|--------|------|
| 0 | — | — | Agentic infrastructure (skills, AGENTS.md, subagents) |
| 1 | #19 | `feature/phase-1-critical-fixes` | Security headers, contact email, social handles, config corrections |
| 2 | #20 | `feature/phase-2-seo-marketing` | SEO metadata, sitemap, robots.txt, JSON-LD structured data |
| 3 | #21 | `feature/phase-3-testing-quality` | Test suite from ~11% to 77% coverage |
| 4 | #22 | `feature/phase-4-ci-cd` | GitHub Actions CI (type-check, lint, test, build, Lighthouse) |
| 5 | #23 | `feature/phase-5-cleanup-polish` | Unused deps, .env.example, v1.0.0 |
| 6 | #24 | `fix/phase-6-audit-a11y` | aria-hidden-focus a11y fix |
| 7–8 | #25 | `feature/phase-7-asset-optimisation` | PNG→WebP conversion, 9 named Figma projects |
| 11 | #26 | `feature/phase-11-asset-gap-closure` | 124 Figma asset downloads, Bride Story project |
| 13 | #27 | `feature/phase-13-visual-alignment` | Figma design token alignment |
| 14 | #28 | `feature/phase-14-visual-audit` | Full visual audit — all pages aligned to Figma |
| 15 | #29 | `feature/phase-15-project-data-gaps` | MC Arabia credits/logo, YSL title, 21 missing gallery images |
| 16 | #30 | `feature/phase-16-gallery-layouts-and-cleanup` | GalleryGrid per-project layouts matching Figma |
| 17 | #31 | `feature/phase-17-carousel-gallery-effects` | Homepage SimpleCarousel with per-project animation configs |
| 18 | #32 | `fix/mobile-polish` | dvh viewport, touch swipe, iOS scroll lock, responsive spacing |
| 19 | #33 | `perf/video-optimisation` | LazyVideo component, poster images, preload attributes |
| 20 | #34 | `test/coverage-boost` | Coverage 70% → 93%+ (266 tests, 32 suites) |
| 21 | #35 | `test/playwright-visual` | Playwright visual regression testing (open) |

### Current state

- **Live:** https://haus-creative.vercel.app (auto-deploys from `main`)
- **Quality gates:** type-check ✓, lint ✓, 266 unit tests ✓, 93%+ coverage, CI pipeline
- **Assets:** All WebP, 4 MP4 videos, 10 projects with full gallery data
- **Accessibility:** Skip link, landmarks, ARIA, focus-visible, reduced-motion
- **SEO:** Sitemap, robots.txt, JSON-LD, canonical URLs, per-page metadata

---

## Remaining Phases

### Phase 22: Code Cleanup & Dead Code Removal
**Priority:** Medium | **Branch:** `refactor/code-cleanup` | **Effort:** Small

Remove dead code identified in the audit. No functional changes.

- [ ] Remove `VideoHero` component (superseded by `IntroHero` + `MediaRenderer`, never imported)
- [ ] Remove dead `assetPath.ts` utilities (`getAssetPath`, `getGalleryAssets`, `titleToFileName` — only referenced in tests)
- [ ] Remove `LazyVideo` component if confirmed unused (exported but never imported)
- [ ] Remove unused font families from `tailwind.config.js` (`times`, `diatype`, `monument-grotesk-mono` — CSS vars never defined)
- [ ] Remove unused content path `./src/pages/**/*` from `tailwind.config.js`
- [ ] Remove placeholder fallback `"/images/placeholder.jpg"` from `createMediaSource()` in `site.ts` (file doesn't exist)
- [ ] Centralise `NEXT_PUBLIC_SITE_URL` pattern (repeated in 4 files → move to `siteConfig`)
- [ ] Unify external link pattern (`<a>` vs `<Link>` for external URLs)
- [ ] Update `<html lang="en">` → `<html lang="en-GB">` (British English site)
- [ ] Update affected tests

### Phase 23: Production Meta & Icons
**Priority:** Medium | **Branch:** `feat/production-meta` | **Effort:** Small

Complete the production metadata — OG image, favicons, manifest.

- [ ] Design/source OG image (1200×630) — may need designer input
- [ ] Add `apple-touch-icon.png` (180×180) to `public/`
- [ ] Add `site.webmanifest` with name, theme colour, icons
- [ ] Add `openGraph.images` and `twitter.images` to root layout metadata
- [ ] Export explicit `viewport` with `themeColor` from layout
- [ ] Verify social share previews with OpenGraph debugger

### Phase 24: Security Hardening (CSP)
**Priority:** Medium | **Branch:** `fix/csp-header` | **Effort:** Small

Add Content-Security-Policy header. Static site with no third-party scripts makes this straightforward.

- [ ] Define CSP directives (self-only for scripts/styles, data: for images, media-src for videos)
- [ ] Add CSP header to `next.config.js` security headers
- [ ] Test that all pages render correctly with CSP enabled
- [ ] Verify no console CSP violations

### Phase 25: CI Pipeline Improvements
**Priority:** Low | **Branch:** `ci/pipeline-improvements` | **Effort:** Small

Strengthen the CI pipeline based on audit findings.

- [ ] Add `npm run format:check` step (Prettier)
- [ ] Add `npm audit --audit-level=moderate` step
- [ ] Upload coverage report as GitHub Actions artifact
- [ ] Add mobile Lighthouse preset alongside desktop
- [ ] Increase Lighthouse `numberOfRuns` to 3 for stability
- [ ] Consider adding visual regression test step (requires Playwright in CI)

### Phase 26: SEO Enhancements
**Priority:** Low | **Branch:** `feat/seo-enhancements` | **Effort:** Small

Improve structured data and SEO signals.

- [ ] Add `BreadcrumbList` JSON-LD to project detail pages
- [ ] Add `CreativeWork` or `ImageGallery` schema to project pages
- [ ] Enrich Organisation schema with `logo`, `address` (if available)
- [ ] Verify all structured data with Google Rich Results Test

### Phase 27: Accessibility Polish
**Priority:** Low | **Branch:** `fix/a11y-polish` | **Effort:** Small

Address remaining accessibility gaps.

- [ ] Add `aria-label` to decorative video containers (describe visual content)
- [ ] Return focus to menu toggle on mobile menu close
- [ ] Consider `<track kind="descriptions">` for videos (WCAG AAA, optional)
- [ ] Audit with axe-core or Lighthouse accessibility

### Phase 28: Font Loading Strategy
**Priority:** Low | **Branch:** `feat/font-loading` | **Effort:** Small

Resolve the Inter font ambiguity — either load it properly or remove references.

- [ ] Decide: load Inter via `next/font/google` or remove all Inter references
- [ ] If loading: add to `layout.tsx`, apply via CSS variable, update Tailwind config
- [ ] If removing: strip from `tailwind.config.js`, `globals.css`, `fonts.ts`
- [ ] Verify no FOUT (Flash of Unstyled Text)

### Phase 29: Performance Optimisation
**Priority:** Low | **Branch:** `perf/optimisations` | **Effort:** Small

Minor performance wins identified in the audit.

- [ ] Add `priority` prop to first `WorkGalleryItem` (above-fold on scroll/link navigation)
- [ ] Consider WebM video alternatives for Chrome/Firefox (smaller files)
- [ ] Review `MediaRenderer` raw `<img>` path — convert to `<Image>` or remove

---

## Blocked / Needs Designer Input

These items cannot proceed without assets or decisions from the designer:

| Item | Dependency |
|------|-----------|
| OG image (1200×630) | Needs design/branding asset |
| apple-touch-icon (180×180) | Needs design/branding asset |
| HD gallery assets | User will provide and reorder later |
| Non-MC Arabia project credits | Real photographer/stylist credits needed |
| Placeholder subtitles | Real copy needed for project descriptions |
| Phone frame fidelity (Vivara, Life, SK) | Confirm if current mockups match Figma intent |

## Domain & Deployment

| Item | Status |
|------|--------|
| Vercel auto-deploy from `main` | ✅ Working |
| `studiohauscreative.com` custom domain | ⬜ Pending — connect on Vercel |
| `NEXT_PUBLIC_SITE_URL` env var | ⬜ Update to `https://studiohauscreative.com` when domain is live |
| SSL certificate | Automatic via Vercel once domain is connected |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-23 | Phases branch from `main` independently | PRs can merge in any order |
| 2026-03-24 | WebP q=90, pngScale: 2 for Figma exports | Balance quality vs file size for luxury portfolio |
| 2026-03-26 | Keep project title overlays on homepage | UX enhancement not in Figma — user confirmed |
| 2026-03-26 | Keep Ouronyx video hero as homepage landing | Not the MC Arabia hero from Figma |
| 2026-03-26 | Keep GalleryGrid on detail pages | User chose scrollable grid over carousel for detail |
| 2026-03-26 | No coloured backgrounds on YSL | Figma has no colorFrame for YSL |
| 2026-03-27 | CSS-only animations, no Framer Motion | Project convention, existing carousel uses CSS transitions |
| 2026-03-27 | Gallery effects are hand-crafted per-project | Each project has deliberate animation/timing choices |
| 2026-03-30 | Hash-based screenshot comparison | Pure-Python pixel diffing too slow for 106MB+ screenshots |
| 2026-03-30 | Baselines gitignored, not committed | 106MB too heavy for git; regenerate with npm script |
