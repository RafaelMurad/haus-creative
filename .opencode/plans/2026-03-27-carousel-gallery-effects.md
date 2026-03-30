# Phase 17: SimpleCarousel & Gallery Effects Restoration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore hand-crafted per-project gallery carousel effects on the homepage — replacing static single-image sections with auto-advancing CSS-only carousels.

**Architecture:** A `SimpleCarousel` component (CSS transitions only) renders stacked slides with configurable animation types and auto-advance timing. Each project's `ProjectDetail` gains a `gallery` config. The homepage `WorkGalleryItem` cycles through multiple gallery images. Project detail pages keep `GalleryGrid` unchanged.

**Tech Stack:** React 18, TypeScript, CSS transitions, Next.js `<Image>`, existing `animationConfigs.ts`

**Branch:** `feature/phase-17-carousel-gallery-effects` (from `main`)

---

## Tasks

### Task 1: GalleryConfig type
- Create: `src/types/gallery.ts`
- Modify: `src/config/projects.ts` — add `gallery?` field to `ProjectDetail`
- Test: `src/__tests__/types/gallery.test.ts`

### Task 2: Per-project gallery configs
- Modify: `src/config/projects.ts` — add `gallery` to all 10 projects

### Task 3: SimpleCarousel component
- Create: `src/components/ui/SimpleCarousel.tsx`
- Test: `src/__tests__/components/ui/SimpleCarousel.test.tsx`

### Task 4: Barrel export
- Modify: `src/components/ui/index.ts`

### Task 5: Homepage integration
- Modify: `src/components/home/WorkGalleryItem.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/__tests__/components/home/WorkGalleryItem.test.tsx`

### Task 6: Build verification + PR
