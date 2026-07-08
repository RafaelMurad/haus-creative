# Asks for Vitor — video delivery gaps

Status as of **2026-07-07**, after wiring the July 2 video batch (PR #41).
Everything below blocks a specific slot on the site; all other videos are wired.

## 1. YSL — mobile home banner is the wrong file

`EXPORT/Yves Saint Laurent/MOBILE/VIDEO/YSL-HomeBanner-Mobile.mp4` (uploaded
24 Feb from the `milito@oui.a…` account) is a **byte-for-byte duplicate of
gallery clip 3** (the man-in-black LIBRE clip — same md5 `534aebbc…` as
`WEB/VIDEO/YSL-Video3.mp4` and `MOBILE/VIDEO/03.mp4`). It is not a portrait
version of the gold-logo banner animation.

**Ask:** re-export the YSL home banner as a portrait/mobile cut
(720×1280 or 440×864, mp4) and replace the file in that folder.

**Meanwhile on the site:** the desktop banner plays on mobile, center-cropped
(the YSL logo is centered, so it crops safely). Swapping in the real file
later is a one-line config change.

## 2. SK-II — confirm the empty mobile VIDEO folder

Per review (2026-07-08), SK plays the delivered video in the **sk-8 gallery
slot on desktop only** — mobile shows the static image, as designed (SK's
hero is static on both breakpoints). But `EXPORT/SK-II/MOBILE/VIDEO/` was
created on 7 Jul and left empty.

**Ask (low priority):** confirm the empty folder is vestigial and no SK-II
mobile video is coming. If one is intended after all, upload it there and
we'll wire it.

## Resolved — no action needed

- **MC Arabia desktop banner** — not missing after all: per the Figma tags,
  the MC hero is video on mobile only; desktop keeps the static editorial
  image. Wired accordingly.

## Pending on our side (not client asks)

- ~~WAO~~ resolved 2026-07-08: all 10 clips mapped via the tagged columns to
  slots wao-2 and wao-13…21 (hero untagged → stays static). Wired.
- ~~Bucherer Summer~~ resolved 2026-07-08: the tagged column shows one video
  (both frames) at the bucherer-8 collage slot — the March `4x5.mp4` covers
  it; no banner expected. Wired.

**All 11 projects are now reviewed against their Figma tags and wired.** The
only outstanding items are asks #1 and #2 above.
