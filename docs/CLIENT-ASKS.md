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

## 2. SK-II — mobile banner never uploaded

`EXPORT/SK-II/MOBILE/VIDEO/` was created on **7 Jul at 11:19** but is still
empty. Desktop (`SK II - BANNER DESKTOP.mp4`) is delivered and live.

**Ask:** upload the SK-II mobile banner video into that folder.

**Meanwhile on the site:** SK's mobile hero shows the static mobile image.

## Resolved — no action needed

- **MC Arabia desktop banner** — not missing after all: per the Figma tags,
  the MC hero is video on mobile only; desktop keeps the static editorial
  image. Wired accordingly.

## Pending on our side (not client asks)

- **WAO** — 10 new clips in `EXPORT/WAO/VIDEOS/` need Figma slot mapping
  (none labeled "banner"); waiting on the tagged column screenshot.
- **Bucherer Summer** — only the March `4x5.mp4` exists; the design marks the
  project as video. Confirm against the tagged Figma column whether that file
  covers it or a banner is expected (if a banner is expected, it becomes ask #3).
