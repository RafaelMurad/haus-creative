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

## ~~3. Ouronyx — two gallery images never delivered~~ RESOLVED 2026-07-10

Rafael exported the two missing pair-partner stills from Figma directly
(720×900, matching the delivery format); rows 9–12 are wired with the
phone-UI and tablet-mockup videos plus their mobile edits. Only note for
Vitor: mobile crops for the Ouronyx statics (slots 9, 12, 14–18) don't
exist — desktop images render on mobile meanwhile. Send OUR_MOB exports
if dedicated crops are wanted.

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

**Tag-reviewed and wired:** MC Arabia, YSL, Vivara, SK, Bucherer Summer, WAO.
**Still to review against tagged columns:** Harrods and Ouronyx (their
numbered gallery clips — 7 and 9 files — are delivered but unwired; their
hero banners are live from filename inference), plus Life / Bride Story / BFJ
(hero banners live from inference; tags not yet checked).
