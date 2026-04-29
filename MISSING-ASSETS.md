# Missing / Incorrect Assets

Track assets that need to be re-exported or corrected by the design team.
Once a file is delivered, drop it in the correct `/public/assets/{project}/` folder and remove the entry here.

---

## Bucherer Summer (`/public/assets/bucherer/`)

| File | Status | What it should be |
|------|--------|-------------------|
| `bucherer-1.webp` | **Wrong content** | Desktop hero — pink top-down ice cream with jewellery. Currently a grey BUCHERER logo placeholder. Same content as `bucherer-1-mobile.webp` but sized for desktop (wider/landscape crop). |
| `bucherer-9.webp` | **Missing** | 8th gallery image (desktop) — Row 4 Right. Dark navy BUCHERER "The Summer of Indulgence" poster. Mobile already exists as `bucherer-9-mobile.webp`. |

**Temporary fallbacks:** hero desktop → `bucherer-1-mobile.webp` · Row 4 right desktop → `bucherer-9-mobile.webp`

---

## BFJ (`/public/assets/bfj/`)

| File | Status | What it should be |
|------|--------|-------------------|
| `bfj-12-mobile.webp` | **Missing** | Mobile version of `bfj-12.webp` (landscape 1261×820). |
| `bfj-8-mobile.webp` | **Verify** | Current file on disk is 3072×4096 (portrait) but `bfj-8.webp` desktop is 2050×1163 (landscape) — likely wrong export. Should be the mobile crop of `bfj-8` content. The existing `bfj-8-mobile.webp` is being used as mobile for slot 9 (bfj-9 desktop is also 3072×4096). |

---

## Bride Story (`/public/assets/bride-story/`)

| File | Status | What it should be |
|------|--------|-------------------|
| `bride-story-9-mobile.webp` | **Missing** | Mobile version of `bride-story-9.webp` (gallery slot 10). |
| `bride-story-11-mobile.webp` | **Missing** | Mobile version of `bride-story-11.webp` (last gallery slot, full-width). |

---

## Harrods (`/public/assets/harrods/`)

| File | Status | What it should be |
|------|--------|-------------------|
| `harrods-9-mobile.webp` | **Missing** | Mobile version of `harrods-9.webp` |
| `harrods-11-mobile.webp` | **Missing** | Mobile version of `harrods-11.webp` |
| `harrods-14-mobile.webp` | **Missing** | Mobile version of `harrods-14.webp` |
| `harrods-15-mobile.webp` | **Missing** | Mobile version of `harrods-15.webp` |

---

## Notes

- Projects with no missing assets: **MC Arabia**, **YSL**, **Vivara**, **Life**, **SK**, **Wao Cosmo**, **Ouronyx**
- `harrods-4-mobile`, `harrods-6-mobile`, `harrods-8-mobile` were delivered and are now assigned in config.
