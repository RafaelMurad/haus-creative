# Figma Design Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Achieve full visual parity between the HAUS Creative portfolio website and the Figma source of truth by replacing generic gallery content with 8 named Figma projects, converting images to WebP, and building Marie Claire Arabia as the reference project detail page.

**Architecture:** Incremental, PR-per-phase approach. Each phase branches from `main` independently. Phase 7 handles asset optimisation (PNG to WebP, remove unused galleries). Phase 8 builds Marie Claire Arabia as the template project detail page with full gallery, credits, and client logo. Phase 9 applies the template to the remaining 7 projects. Phase 10 aligns the homepage/work listing with Figma.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3, cwebp (image conversion)

---

## Gallery-to-Project Mapping (Figma Order)

| Gallery | Figma Project | Slug | Image Count | Type |
|---------|--------------|------|-------------|------|
| gallery1 | Marie Claire Arabia | `marie-claire-arabia` | 10 | Image |
| gallery2 | YSL | `ysl` | 10 | Image |
| gallery3 | WAO COSMO | `wao-cosmo` | 1 cover + video | Video |
| gallery4 | VIVARA | `vivara` | 8 | Image |
| gallery5 | BUCHERER SUMMER | `bucherer-summer` | 1 cover + video | Video |
| gallery6 | SK | `sk` | 4 | Image |
| gallery7 | BFJ | `bfj` | 9 | Image |
| gallery8 | LIFE | `life` | 1 | Image |
| gallery10 | Ouronyx | `ouronyx` | 1 cover + 2 videos | Video (hero) |
| gallery9 | *REMOVE* | — | — | — |
| gallery11 | *REMOVE* | — | — | — |
| gallery12 | *REMOVE* | — | — | — |

## File Structure

### Files to Create
- `scripts/convert-to-webp.sh` — One-time script to convert PNGs to WebP (high quality, q=90)

### Files to Modify
- `src/config/site.ts` — Replace 12 featuredProjects with 9 (Ouronyx hero + 8 named projects), update paths to .webp
- `src/config/projects.ts` — Replace 3 hardcoded projects with 9 full ProjectDetail objects (all gallery images, credits, services, etc.)
- `src/app/work/[slug]/page.tsx` — Enhanced project detail layout matching Figma (2-col masked grid, intro text, credits)
- `src/app/page.tsx` — May need CTA text updates
- `src/app/work/page.tsx` — Update if it references removed galleries
- `src/app/sitemap.ts` — Update URL list (remove old slugs, add new ones)
- `src/__tests__/config/projects.test.ts` — Update tests for new project data
- `src/__tests__/config/site.test.ts` — Update tests for new featuredProjects
- `public/assets/` — Convert PNGs to WebP, remove gallery9/11/12

### Files to Leave Unchanged
- `src/components/home/WorkGalleryItem.tsx` — Already correct pattern
- `src/components/home/IntroHero.tsx` — Already correct
- `src/components/ui/MediaRenderer.tsx` — Already handles all media types
- `src/components/layout/` — Header/Footer/MobileMenu unchanged
- `tailwind.config.js` — Font configs stay for future use

---

## Phase 7: Asset Optimisation

> **Branch:** `feature/phase-7-asset-optimisation`

### Task 7.1: Convert PNGs to High-Quality WebP

**Files:**
- Create: `scripts/convert-to-webp.sh`
- Modify: `public/assets/gallery{1-8,10}/*.png` -> `.webp`

- [ ] **Step 1: Create the conversion script**

```bash
#!/bin/bash
# Convert all gallery PNGs to high-quality WebP
# Preserves originals until verified, then removes them
set -euo pipefail

QUALITY=90
ASSETS_DIR="public/assets"

for dir in "$ASSETS_DIR"/gallery{1,2,3,4,5,6,7,8,10}; do
  [ -d "$dir" ] || continue
  echo "Processing $(basename "$dir")..."
  for png in "$dir"/*.png; do
    [ -f "$png" ] || continue
    webp="${png%.png}.webp"
    cwebp -q "$QUALITY" -m 6 "$png" -o "$webp"
    echo "  Converted: $(basename "$png") -> $(basename "$webp")"
  done
done

echo "Done. Verify WebP files, then remove PNGs with:"
echo "  find public/assets -name '*.png' -delete"
```

- [ ] **Step 2: Run the conversion script**

Run: `bash scripts/convert-to-webp.sh`
Expected: WebP files created alongside PNGs in each gallery folder

- [ ] **Step 3: Verify WebP quality and sizes**

Run: `for f in public/assets/gallery1/Gallery1-1.webp public/assets/gallery2/Gallery2-1.webp; do ls -lh "$f"; done`
Expected: WebP files significantly smaller than PNGs but visually identical

- [ ] **Step 4: Remove original PNGs (keep JPGs as-is, keep video files)**

Run: `find public/assets/gallery{1,2,3,4,5,6,7,8,10} -name "*.png" -delete`
Expected: Only .webp, .mp4, .jpg files remain

- [ ] **Step 5: Verify gallery1 has correct files**

Run: `ls public/assets/gallery1/`
Expected: Gallery1-1.webp through Gallery1-10.webp plus Gallery1-6.jpg

### Task 7.2: Remove Unused Galleries

**Files:**
- Delete: `public/assets/gallery9/`, `public/assets/gallery11/`, `public/assets/gallery12/`

- [ ] **Step 1: Remove the three unused gallery directories**

Run: `rm -rf public/assets/gallery9 public/assets/gallery11 public/assets/gallery12`
Expected: Directories removed, ~28MB freed

- [ ] **Step 2: Verify remaining gallery structure**

Run: `ls -d public/assets/gallery*/`
Expected: gallery1/ gallery2/ gallery3/ gallery4/ gallery5/ gallery6/ gallery7/ gallery8/ gallery10/

### Task 7.3: Update Config — File Extensions

**Files:**
- Modify: `src/config/site.ts` — Update all `.png` references to `.webp`

- [ ] **Step 1: Update all .png references in site.ts to .webp**

Every `MediaSource.src`, `poster`, `alt` path that references a `.png` in galleries 1-8, 10 must change to `.webp`. Example:
- `"/assets/gallery1/Gallery1-1.png"` -> `"/assets/gallery1/Gallery1-1.webp"`
- `"/assets/gallery10/Gallery10-Cover.png"` -> `"/assets/gallery10/Gallery10-Cover.webp"`

- [ ] **Step 2: Update projects.ts — File extensions**

Same pattern: all `.png` references to `.webp` in the hardcoded project entries.

- [ ] **Step 3: Run type-check and build**

Run: `npm run type-check && npm run build`
Expected: Clean build, no missing asset warnings

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "perf: convert gallery PNGs to high-quality WebP and remove unused galleries"
```

---

## Phase 8: Marie Claire Arabia Reference Implementation

> **Branch:** `feature/phase-8-marie-claire-template`

### Task 8.1: Update featuredProjects Config

**Files:**
- Modify: `src/config/site.ts:132-278`

Replace the 12 generic `featuredProjects` entries with 9 named projects. Ouronyx stays as first (hero). The remaining 8 follow Figma order.

- [ ] **Step 1: Replace featuredProjects array**

```typescript
export const featuredProjects: Project[] = [
  // Hero — Ouronyx (intro hero, not in work listing grid)
  {
    id: "ouronyx",
    title: "Ouronyx",
    subtitle: "Digital Experience",
    href: "/work/ouronyx",
    media: {
      type: "video",
      src: "/assets/gallery10/Gallery10-Ouronyx.mp4",
      srcMobile: "/assets/gallery10/Gallery10-Ouronyx-Mobile.mp4",
      poster: "/assets/gallery10/Gallery10-Cover.webp",
      autoPlay: true, loop: true, muted: true,
    },
  },
  // 1. Marie Claire Arabia
  {
    id: "marie-claire-arabia",
    title: "Marie Claire Arabia",
    subtitle: "Creative Direction",
    href: "/work/marie-claire-arabia",
    media: {
      type: "image",
      src: "/assets/gallery1/Gallery1-1.webp",
      alt: "Marie Claire Arabia editorial",
    },
  },
  // 2. YSL
  {
    id: "ysl",
    title: "YSL",
    subtitle: "Art Direction",
    href: "/work/ysl",
    media: {
      type: "image",
      src: "/assets/gallery2/Gallery2-1.webp",
      alt: "YSL campaign",
    },
  },
  // 3. WAO COSMO
  {
    id: "wao-cosmo",
    title: "Wao Cosmo",
    subtitle: "Visual Design",
    href: "/work/wao-cosmo",
    media: {
      type: "video",
      src: "/assets/gallery3/Gallery3-Video.mp4",
      poster: "/assets/gallery3/Gallery3-Cover.webp",
      autoPlay: true, loop: true, muted: true,
    },
  },
  // 4. VIVARA
  {
    id: "vivara",
    title: "Vivara",
    subtitle: "Art Direction",
    href: "/work/vivara",
    media: {
      type: "image",
      src: "/assets/gallery4/Gallery4-1.webp",
      alt: "Vivara jewellery campaign",
    },
  },
  // 5. BUCHERER SUMMER
  {
    id: "bucherer-summer",
    title: "Bucherer Summer",
    subtitle: "Creative Direction",
    href: "/work/bucherer-summer",
    media: {
      type: "video",
      src: "/assets/gallery5/Gallery5-Video.mp4",
      poster: "/assets/gallery5/Gallery5-Cover.webp",
      autoPlay: true, loop: true, muted: true,
    },
  },
  // 6. SK
  {
    id: "sk",
    title: "SK",
    subtitle: "Brand Development",
    href: "/work/sk",
    media: {
      type: "image",
      src: "/assets/gallery6/Gallery6-1.webp",
      alt: "SK brand showcase",
    },
  },
  // 7. BFJ
  {
    id: "bfj",
    title: "BFJ",
    subtitle: "Digital Design",
    href: "/work/bfj",
    media: {
      type: "image",
      src: "/assets/gallery7/Gallery7-1.webp",
      alt: "BFJ project showcase",
    },
  },
  // 8. LIFE
  {
    id: "life",
    title: "Life",
    subtitle: "Creative Strategy",
    href: "/work/life",
    media: {
      type: "image",
      src: "/assets/gallery8/Gallery8-1.webp",
      alt: "Life project showcase",
    },
  },
];
```

- [ ] **Step 2: Update ctaLinks text if needed**

Verify CTA text matches Figma. Current: "View all works" / "Work with us".

- [ ] **Step 3: Run type-check**

Run: `npm run type-check`
Expected: PASS

### Task 8.2: Build Marie Claire Arabia ProjectDetail

**Files:**
- Modify: `src/config/projects.ts`

Replace the 3 hardcoded project entries with a full Marie Claire Arabia entry that wires up ALL 10 gallery images, credits from Figma, and proper metadata.

- [ ] **Step 1: Write the Marie Claire Arabia project detail**

From Figma analysis:
- Title: "Marie Claire Arabia"
- Subtitle: "September Issue - Back to Work Editorial"
- Credits: Art Direction, Photographer (Ekin Can Bayrakdar), Stylist, etc.
- Gallery: 10 images from gallery1/ in 2-column masked grid layout
- Hero image: Gallery1-6.webp (or Gallery1-1.webp — matches Figma `Gallery1-6 1` background)

```typescript
{
  id: 'marie-claire-arabia',
  slug: 'marie-claire-arabia',
  client: 'Marie Claire Arabia',
  title: 'Marie Claire Arabia',
  subtitle: 'September Issue - Back to Work Editorial',
  description: 'Creative direction for the September Issue Back to Work editorial, combining bold fashion statements with refined art direction.',
  introText: 'A striking editorial for Marie Claire Arabia\'s September Issue, exploring the return to professional elegance through contemporary fashion photography.',
  
  heroImage: {
    desktop: '/assets/gallery1/Gallery1-6.webp',
    alt: 'Marie Claire Arabia September Issue editorial',
  },
  
  year: '2024',
  services: ['Creative Direction', 'Art Direction', 'Editorial Design'],
  credits: [
    { role: 'Art Direction', name: 'Studio Haus Creative' },
    { role: 'Photographer', name: 'Ekin Can Bayrakdar' },
  ],
  
  media: [
    { type: 'image', desktop: '/assets/gallery1/Gallery1-1.webp', alt: 'Marie Claire Arabia editorial look 1' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-2.webp', alt: 'Marie Claire Arabia editorial look 2' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-3.webp', alt: 'Marie Claire Arabia editorial look 3' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-4.webp', alt: 'Marie Claire Arabia editorial look 4' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-5.webp', alt: 'Marie Claire Arabia editorial look 5' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-7.webp', alt: 'Marie Claire Arabia editorial look 6' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-8.webp', alt: 'Marie Claire Arabia editorial look 7' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-9.webp', alt: 'Marie Claire Arabia editorial look 8' },
    { type: 'image', desktop: '/assets/gallery1/Gallery1-10.webp', alt: 'Marie Claire Arabia editorial look 9' },
  ],
  
  metaTitle: 'Marie Claire Arabia | HAUS Creative',
  metaDescription: 'Creative direction for Marie Claire Arabia September Issue - Back to Work Editorial by Studio Haus Creative.',
  ogImage: '/assets/gallery1/Gallery1-1.webp',
}
```

- [ ] **Step 2: Add remaining project stubs**

Add minimal ProjectDetail entries for the other 8 projects (Ouronyx, YSL, WAO COSMO, VIVARA, BUCHERER SUMMER, SK, BFJ, LIFE) with all their gallery images wired up. These use the same pattern but with appropriate gallery paths and image counts.

- [ ] **Step 3: Remove createProjectDetailFromFeatured and derivedFeaturedProjects**

The auto-derivation logic is no longer needed — all projects are now explicitly defined. Remove:
- `createProjectDetailFromFeatured()` function
- `derivedFeaturedProjects` computed map
- Update `getProjectBySlug()` to only search `projects` array
- Update `getAllProjectSlugs()` to only map `projects` array

- [ ] **Step 4: Run type-check**

Run: `npm run type-check`
Expected: PASS

### Task 8.3: Update Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Update sitemap to use new slugs**

Import `getAllProjectSlugs` and dynamically generate work URLs instead of hardcoding. Remove old generic gallery slugs, add new named project slugs.

- [ ] **Step 2: Run build to verify sitemap**

Run: `npm run build`
Expected: Sitemap generates with correct URLs

### Task 8.4: Update Tests

**Files:**
- Modify: `src/__tests__/config/site.test.ts`
- Modify: `src/__tests__/config/projects.test.ts`

- [ ] **Step 1: Update site.test.ts for new featuredProjects**

Update test expectations:
- `featuredProjects` has 9 entries (was 12)
- First entry is Ouronyx (unchanged)
- Second entry is Marie Claire Arabia (was "Gallery One")
- All entries have valid `.webp` or `.mp4` media paths

- [ ] **Step 2: Update projects.test.ts for new project data**

Update test expectations:
- `projects` array has 9 entries (was 3 hardcoded + 9 derived)
- `getProjectBySlug('marie-claire-arabia')` returns correct data
- `getProjectBySlug('gallery-1')` returns undefined (old slug removed)
- `getAllProjectSlugs()` returns 9 slugs
- No more `derivedFeaturedProjects` logic to test

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 4: Run full verification**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: All pass clean

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Marie Claire Arabia as reference project with full gallery and credits"
```

---

## Phase 9: Remaining Projects (Apply Template)

> **Branch:** `feature/phase-9-all-projects`

### Task 9.1: Complete All ProjectDetail Entries

**Files:**
- Modify: `src/config/projects.ts`

Apply the Marie Claire Arabia pattern to the remaining 7 projects. Each gets:
- Proper client name, title, subtitle from Figma
- All gallery images wired into `media[]` array
- Services and credits (where known from Figma)
- SEO metadata

Project details:

| Project | Gallery | Images | Hero |
|---------|---------|--------|------|
| YSL | gallery2 | Gallery2-1 through Gallery2-10 | Gallery2-1.webp |
| WAO COSMO | gallery3 | Gallery3-Cover.webp + Video | Gallery3-Video.mp4 |
| VIVARA | gallery4 | Gallery4-1 through Gallery4-8 | Gallery4-1.webp |
| BUCHERER SUMMER | gallery5 | Gallery5-Cover.webp + Video | Gallery5-Video.mp4 |
| SK | gallery6 | Gallery6-1 through Gallery6-4 | Gallery6-1.webp |
| BFJ | gallery7 | Gallery7-1 through Gallery7-9 | Gallery7-1.webp |
| LIFE | gallery8 | Gallery8-1.webp | Gallery8-1.webp |

- [ ] **Step 1: Complete all 9 ProjectDetail entries in projects.ts**
- [ ] **Step 2: Run type-check and build**
- [ ] **Step 3: Update tests for complete project set**
- [ ] **Step 4: Run full verification**
- [ ] **Step 5: Commit**

---

## Phase 10: Homepage & Work Listing Alignment

> **Branch:** `feature/phase-10-homepage-alignment`

### Task 10.1: Verify Homepage Renders Correctly

- [ ] **Step 1: Verify homepage shows Ouronyx hero + 8 project gallery items**
- [ ] **Step 2: Verify /work page shows 8 project gallery items (no hero)**
- [ ] **Step 3: Verify all project detail pages render with full galleries**
- [ ] **Step 4: Run Lighthouse locally**
- [ ] **Step 5: Final commit and PR**

---

## Verification Checklist

After all phases:
- [ ] `npm run type-check` — clean
- [ ] `npm run lint` — clean
- [ ] `npm test` — all pass, coverage above 50%
- [ ] `npm run build` — clean SSG build
- [ ] All 9 project detail pages render with full image galleries
- [ ] Homepage: Ouronyx hero + 8 named projects
- [ ] /work: 8 named projects (same as homepage minus hero)
- [ ] Sitemap has correct URLs
- [ ] No references to old gallery-N slugs remain
- [ ] No .png files remain in galleries (all converted to .webp)
