# Figma Design Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Achieve full visual parity between the HAUS Creative portfolio website and the Figma source of truth. This includes all project assets, correct image counts, social post mockups, client logos, credits, and layout/typography alignment.

**Architecture:** Incremental, PR-per-phase approach. Each phase branches from `main` independently. Phases 7–9 (completed) handled initial asset optimisation and project setup. Phase 10 (completed) verified homepage/work listing. Phases 11–13 close asset gaps discovered via Figma MCP audit, add Bride Story, and align visual details.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3, cwebp (image conversion)

**Figma Source:** File key `DfLEWBgyOQxK8Utc1TSyQY` — accessed via `figma-developer-mcp` MCP server (configured in `opencode.json`, reads `FIGMA_API_KEY` from `.env`)

---

## Gallery-to-Project Mapping (Figma Order — Updated)

| Gallery | Figma Project | Slug | Local Files | Figma Images (est.) | Status |
|---------|--------------|------|-------------|---------------------|--------|
| gallery1 | Marie Claire Arabia | `marie-claire-arabia` | 10 | ~10 + 6 social posts + logo | Complete (gallery), social posts missing |
| gallery2 | YSL | `ysl` | 10 | ~10 | Complete |
| gallery3 | WAO COSMO | `wao-cosmo` | 2 (cover + video) | ~17 gallery + 6 social posts | **Incomplete** |
| gallery4 | VIVARA | `vivara` | 8 | ~8 | Complete |
| gallery5 | BUCHERER SUMMER | `bucherer-summer` | 2 (cover + video) | ~5 gallery + logo | **Incomplete** |
| gallery6 | SK | `sk` | 4 | ~18 | **Severely incomplete** |
| gallery7 | BFJ | `bfj` | 9 | ~24 | **Incomplete** |
| gallery8 | LIFE | `life` | 1 | ~13 | **Severely incomplete** |
| gallery9 | BRIDE STORY | `bride-story` | 0 | ~12 | **Missing entirely** |
| gallery10 | Ouronyx | `ouronyx` | 3 (cover + 2 videos) | ~23 | **Incomplete** |

---

## Completed Phases

### Phase 7: Asset Optimisation — DONE (PR #25)

- [x] Convert PNGs to high-quality WebP (q=90, method 6)
- [x] Remove unused gallery directories (gallery11, gallery12)
- [x] Update config file extensions (.png → .webp)

### Phase 8: Marie Claire Arabia Reference Implementation — DONE (PR #25)

- [x] Replace 12 generic `featuredProjects` with 9 named projects
- [x] Build Marie Claire Arabia ProjectDetail with full gallery and credits
- [x] Update sitemap with new slugs
- [x] Update tests (150 passing, 20 suites)

### Phase 9: Remaining Projects (Apply Template) — DONE (PR #25)

- [x] Complete all 9 explicit ProjectDetail entries in projects.ts
- [x] Remove auto-derivation logic
- [x] All tests passing, clean build

### Phase 10: Homepage & Work Listing Verification — DONE

- [x] Homepage shows Ouronyx hero + 8 project gallery items
- [x] /work page shows 8 project gallery items (no hero)
- [x] All 9 project detail pages render with full galleries
- [x] Playwright verification passed (all pages, screenshots captured)
- [x] Type-check, lint, tests, build all clean
- [ ] Run Lighthouse locally (deferred — not blocking)

---

## Phase 11: Asset Gap Closure

> **Branch:** `feature/phase-11-asset-gap-closure`

Download all missing images from Figma for projects with incomplete assets. Use the Figma MCP server (`figma_download_figma_images`) to export images, then convert to WebP.

### Task 11.1: Download Bride Story Assets (gallery9)

**Entirely new project — 0 of ~12 images exist locally.**

Figma frames: `Bride-Story1` through `Bride-Story9` (standalone frames, IDs 313:623–313:654)

Images to download:
| # | Figma Node Name | Classification |
|---|----------------|----------------|
| 1 | `01_capa_scavoneVERNIS 1` | Cover/hero |
| 2 | `Screenshot 2025-09-29 at 23.12.14 1` | Background |
| 3 | `Screenshot 2025-09-30 at 09.52.35 1` | Gallery |
| 4 | `Screenshot 2025-09-30 at 09.51.16 1` | Gallery |
| 5 | `_MG_6967 1` | Gallery (photo) |
| 6 | `Screenshot 2025-09-30 at 09.51.23 1` | Gallery |
| 7 | `Secao4-GIF-6 1` | Gallery (GIF frame) |
| 8 | `_MG_7628 copy 1` | Gallery (photo) |
| 9 | `Screenshot 2025-09-30 at 09.52.08 1` | Gallery |
| 10 | `_MG_7498 1` | Gallery (photo) |
| 11 | `Screenshot 2025-09-30 at 09.51.49 1` | Gallery |
| 12 | `Screenshot 2025-09-30 at 09.52.24 1` | Gallery |

- [ ] **Step 1:** Create `public/assets/gallery9/` directory
- [ ] **Step 2:** Use `figma_download_figma_images` to export all Bride Story image nodes as PNG
- [ ] **Step 3:** Convert to WebP (q=90, method 6)
- [ ] **Step 4:** Verify all 12 images present and high quality

### Task 11.2: Download Life Assets (gallery8)

**Only 1 of ~13 images exist locally.**

Figma frames: `LIFE - MOBILE`, `LIFE WEB - VIVARA_V2`

Missing images (names from Figma):
| # | Figma Node Name | Classification |
|---|----------------|----------------|
| 1 | `image 106` | Hero |
| 2 | `587887687_n` | Gallery / Logo |
| 3 | `587542277_n` | Gallery |
| 4 | `Captura de tela 2026-03-17 112750 1` | Gallery |
| 5 | `Captura de tela 2026-03-17 112528 1` | Gallery |
| 6 | `Captura de tela 2026-03-17 112946 1` | Gallery |
| 7 | `583006327_n` | Gallery |
| 8 | `582908105_n` | Gallery |
| 9 | `587595951_n` | Gallery |
| 10 | `588031033_n` | Gallery |
| 11 | `589177828_n` | Gallery |
| 12 | `588613959_n` | Gallery |

- [ ] **Step 1:** Use Figma MCP to get exact node IDs from LIFE frames
- [ ] **Step 2:** Download all image nodes
- [ ] **Step 3:** Convert to WebP, name as Gallery8-2 through Gallery8-13
- [ ] **Step 4:** Verify all ~13 images present

### Task 11.3: Download SK Assets (gallery6)

**Only 4 of ~18 images exist locally.**

Figma frames: `SK MOBILE`, `SK WEB`

Missing images include: `Gen5_Tangwei-ALP-*` series, `Gen5_Ayase_Haruka-ALP-*` series, multiple screenshots.

- [ ] **Step 1:** Use Figma MCP to get exact node IDs from SK frames
- [ ] **Step 2:** Download all unique image nodes not already in gallery6
- [ ] **Step 3:** Convert to WebP, name as Gallery6-5 through Gallery6-18
- [ ] **Step 4:** Verify all ~18 images present

### Task 11.4: Download BFJ Assets (gallery7)

**Only 9 of ~24 images exist locally.**

Figma frames: `BFJ MOBILE`, `BFJ WEB`

Missing images include: `SSLPJ001746_BUCHERER_BRAND_PERSONA_*` series, `Secao11-GIF-*` series, `IMG_1657`, `SUMMER-Print-AD-Single-5`, `SWA_BTL_MF_SL_27`, `SS19_*` series.

- [ ] **Step 1:** Use Figma MCP to get exact node IDs from BFJ frames
- [ ] **Step 2:** Download all unique image nodes not already in gallery7
- [ ] **Step 3:** Convert to WebP, name as Gallery7-10 through Gallery7-24
- [ ] **Step 4:** Verify all ~24 images present

### Task 11.5: Download Ouronyx Assets (gallery10)

**Only 3 files locally (1 cover + 2 videos). ~23 images in Figma.**

Figma frames: `OURO1` through `OURO6`, `OURO2-2` through `OURO2-6`

Missing images include: `IMG_3050` through `IMG_3061` (12 sequential photos), `PR00000844_OURONYX_*` campaign images (B&W and colour), `Ouronyx-Covers`, `OURONYX_MVP2020_BTS487`, multiple screenshots.

- [ ] **Step 1:** Use Figma MCP to get exact node IDs from OURO frames
- [ ] **Step 2:** Download all unique image nodes
- [ ] **Step 3:** Convert to WebP, name as Gallery10-1 through Gallery10-23
- [ ] **Step 4:** Verify all images present

### Task 11.6: Download Wao Cosmo Assets (gallery3)

**Only 2 files locally (cover + video). ~17 gallery + 6 social posts in Figma.**

Figma frames: `WAO COSMO` mobile and desktop, plus standalone WAO post frames

Gallery images: `WAO-4x5-COSMO-*` series, `WAO-Cosmo-17-extended`, `FLORA-*` series (multiple variants), `COSMOPOLITAN1020`
Social posts: `WAO-COSMO-Post*` series, `WAO-COSMO-LAYOUT1`

- [ ] **Step 1:** Use Figma MCP to get exact node IDs
- [ ] **Step 2:** Download gallery images and social post mockups
- [ ] **Step 3:** Convert to WebP
- [ ] **Step 4:** Verify all images present

### Task 11.7: Download Bucherer Summer Assets (gallery5)

**Only 2 files locally (cover + video). ~5 gallery images + logo in Figma.**

Figma frames: `BUCHERER SUMMER MOBILE`, `BUCHERER SUMMER WEB`

Missing images: `BUC-2-3`, `SUMMER-Print-AD-Single-5` variants, screenshots
Logo: `bucherer-logo-black-and-white`

- [ ] **Step 1:** Use Figma MCP to get exact node IDs
- [ ] **Step 2:** Download gallery images and logo
- [ ] **Step 3:** Convert to WebP
- [ ] **Step 4:** Verify all images present

### Task 11.8: Download Marie Claire Arabia Social Posts + Logo

**Gallery images complete. 6 social post mockups + client logo missing.**

Figma frames: `ProjectsPage2-MC` (118:46 mobile, 118:122 desktop)

Missing assets:
| # | Figma Node Name | Node ID (mobile) | Node ID (desktop) | Classification |
|---|----------------|-------------------|--------------------| ---------------|
| 1 | `MC-Post3-2 1` | 233:339 | 233:324 | Social post |
| 2 | `MC-Post1 2` | 233:469 | 233:405 | Social post |
| 3 | `MC-Post6-2 1` | 233:473 | 233:428 | Social post |
| 4 | `MC-9x16-7 2` | 233:477 | 233:407 | Social post (stories) |
| 5 | `MC-9x16-9 2` | 233:481 | 233:408 | Social post (stories) |
| 6 | `MC-Post3-3 2` | 233:488 | 233:424 | Social post |
| 7 | `logoMC 1` | 135:97 | 135:237 | Client logo |

- [ ] **Step 1:** Download social post images and logo via Figma MCP
- [ ] **Step 2:** Convert to WebP, save social posts as Gallery1-11 through Gallery1-16, logo separately
- [ ] **Step 3:** Verify all assets present

### Task 11.9: Convert All New Assets to WebP

- [ ] **Step 1:** Run conversion script on all new PNG downloads
- [ ] **Step 2:** Remove original PNGs
- [ ] **Step 3:** Verify no PNGs remain in any gallery directory

### Task 11.10: Commit

```bash
git add -A
git commit -m "feat: download missing Figma assets for all projects and add Bride Story"
```

---

## Phase 12: Update Project Configs

> **Branch:** `feature/phase-12-project-config-update`

Wire up all newly downloaded assets in config files, add Bride Story as 10th project.

### Task 12.1: Add Bride Story to Site Config

**Files:** `src/config/site.ts`

- [ ] **Step 1:** Add Bride Story to `featuredProjects` array (10th entry, after Life)

```typescript
// 9. BRIDE STORY
{
  id: "bride-story",
  title: "Bride Story",
  subtitle: "Editorial Design",
  href: "/work/bride-story",
  media: {
    type: "image",
    src: "/assets/gallery9/Gallery9-1.webp",
    alt: "Bride Story editorial",
  },
},
```

- [ ] **Step 2:** Run type-check

### Task 12.2: Add Bride Story ProjectDetail

**Files:** `src/config/projects.ts`

- [ ] **Step 1:** Create full ProjectDetail entry for Bride Story with all ~12 gallery images, credits, services, SEO metadata
- [ ] **Step 2:** Run type-check

### Task 12.3: Update Existing Project Media Arrays

**Files:** `src/config/projects.ts`

Update the `media[]` arrays for all projects that received new images:

| Project | Current media count | New media count |
|---------|-------------------|-----------------|
| Life | 1 | ~13 |
| SK | 4 | ~18 |
| BFJ | 9 | ~24 |
| Ouronyx | 3 | ~23 |
| Wao Cosmo | 2 | ~17+ |
| Bucherer Summer | 2 | ~5+ |
| Marie Claire Arabia | 10 | ~16 (+ social posts) |

- [ ] **Step 1:** Update Life (gallery8) media array with Gallery8-2 through Gallery8-13
- [ ] **Step 2:** Update SK (gallery6) media array with Gallery6-5 through Gallery6-18
- [ ] **Step 3:** Update BFJ (gallery7) media array with Gallery7-10 through Gallery7-24
- [ ] **Step 4:** Update Ouronyx (gallery10) media array with Gallery10-1 through Gallery10-23
- [ ] **Step 5:** Update Wao Cosmo (gallery3) media array
- [ ] **Step 6:** Update Bucherer Summer (gallery5) media array
- [ ] **Step 7:** Update Marie Claire Arabia (gallery1) media array with social posts
- [ ] **Step 8:** Wire up client logos where available (MC, Vivara, Bucherer)
- [ ] **Step 9:** Run type-check

### Task 12.4: Update Sitemap

**Files:** `src/app/sitemap.ts`

- [ ] **Step 1:** Add `/work/bride-story` to sitemap
- [ ] **Step 2:** Run build to verify

### Task 12.5: Update Tests

**Files:** `src/__tests__/config/site.test.ts`, `src/__tests__/config/projects.test.ts`

- [ ] **Step 1:** Update `featuredProjects` count from 9 to 10
- [ ] **Step 2:** Update `projects` array count from 9 to 10
- [ ] **Step 3:** Add test for `getProjectBySlug('bride-story')`
- [ ] **Step 4:** Update `getAllProjectSlugs()` to expect 10 slugs
- [ ] **Step 5:** Update media count assertions for projects that received new images
- [ ] **Step 6:** Run tests — all must pass

### Task 12.6: Full Verification

- [ ] **Step 1:** `npm run type-check` — clean
- [ ] **Step 2:** `npm run lint` — clean
- [ ] **Step 3:** `npm test` — all pass
- [ ] **Step 4:** `npm run build` — clean SSG build, 10 project pages
- [ ] **Step 5:** Commit

```bash
git add -A
git commit -m "feat: add Bride Story project and wire up all missing Figma assets"
```

---

## Phase 13: Visual Alignment

> **Branch:** `feature/phase-13-visual-alignment`

Compare website against Figma design and fix typography, spacing, layout, and colour differences.

### Task 13.1: Typography Audit

Use Figma MCP to extract text styles from key frames and compare against current CSS/Tailwind.

- [ ] **Step 1:** Extract all text styles from Figma (font family, size, weight, line-height, letter-spacing)
- [ ] **Step 2:** Compare against current `globals.css` and Tailwind config
- [ ] **Step 3:** Fix any discrepancies

### Task 13.2: Spacing & Layout Audit

- [ ] **Step 1:** Compare homepage section heights and padding against Figma
- [ ] **Step 2:** Compare project detail page layout (2-col grid, intro section, credits) against Figma
- [ ] **Step 3:** Compare mobile variants against Figma `-M` frames
- [ ] **Step 4:** Fix any discrepancies

### Task 13.3: Colour Audit

- [ ] **Step 1:** Extract all fill colours from Figma
- [ ] **Step 2:** Compare against Tailwind config and CSS custom properties
- [ ] **Step 3:** Fix any discrepancies

### Task 13.4: Component Detail Alignment

- [ ] **Step 1:** Header/nav — compare against Figma (Home-D, Home-M)
- [ ] **Step 2:** Footer — compare against Figma
- [ ] **Step 3:** Project hero section — compare against Figma (client logo overlay, image sizing)
- [ ] **Step 4:** Gallery grid — compare against Figma (2-col masked grid, spacing, aspect ratios)
- [ ] **Step 5:** Credits section — compare against Figma
- [ ] **Step 6:** About page — compare against Figma (About-M, About-D)
- [ ] **Step 7:** Contact page — compare against Figma (Contact-M, Contact-D)

### Task 13.5: Full Verification

- [ ] **Step 1:** `npm run type-check && npm run lint && npm test && npm run build`
- [ ] **Step 2:** Playwright visual verification of all pages
- [ ] **Step 3:** Lighthouse audit
- [ ] **Step 4:** Commit and PR

---

## Verification Checklist

After all phases:
- [ ] `npm run type-check` — clean
- [ ] `npm run lint` — clean
- [ ] `npm test` — all pass, coverage above 50%
- [ ] `npm run build` — clean SSG build
- [ ] All 10 project detail pages render with full image galleries
- [ ] Homepage: Ouronyx hero + 9 named projects (including Bride Story)
- [ ] /work: 9 named projects (same as homepage minus hero)
- [ ] Sitemap has correct URLs (10 project slugs)
- [ ] No references to old generic gallery slugs remain
- [ ] No .png files remain in galleries (all converted to .webp)
- [ ] Client logos rendered on project hero sections where available
- [ ] Social post mockups included in Marie Claire Arabia and Wao Cosmo galleries
- [ ] Typography, spacing, and colours match Figma source of truth
- [ ] Mobile layouts match Figma `-M` frame variants

## Notes

- **Shared hero assets:** `PRO00003037_2022_Bucherer_Summer_SL5_0001_01_F1A` appears in Bucherer Summer, SK, and BFJ — likely a placeholder. Verify with designer whether each project should have its own hero.
- **`image 106`** is reused across multiple projects as a hero overlay — may be a template element.
- **Social post mockups** exist only for Marie Claire Arabia (6 posts) and Wao Cosmo (6 posts). These are distinct from gallery photography.
- **Client logos** confirmed in Figma: `logoMC` (Marie Claire), `LOGO` (Vivara), `bucherer-logo-black-and-white` (Bucherer).
- **Gallery1-6.jpg** is the only non-WebP gallery image — should be converted in Phase 11.
