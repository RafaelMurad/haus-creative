# Asks for Vitor — video delivery gaps

Status as of **2026-07-07**, after wiring the July 2 video batch (PR #41).
Everything below blocks a specific slot on the site; all other videos are wired.

## ~~1. YSL — mobile home banner is the wrong file~~ RESOLVED 2026-07-15

The Drive copy was re-downloaded and md5-verified: still byte-identical to
gallery clip 3 (`534aebbc…`) — no re-export ever landed. **Decision
(Rafael):** the delivered file plays as the mobile banner as-is. It's a
proper 720×1280 portrait edit (gold logo → embossed box → EID MUBARAK
title), so no crop workaround needed; wired as
`ysl-hero-video-mobile.mp4` with its audio track. No further ask.

## 2. SK-II — confirm the empty mobile VIDEO folder

Per review (2026-07-08), SK plays the delivered video in the **sk-8 gallery
slot on desktop only** — mobile shows the static image, as designed (SK's
hero is static on both breakpoints). But `EXPORT/SK-II/MOBILE/VIDEO/` was
created on 7 Jul and left empty.

**Ask (low priority):** confirm the empty folder is vestigial and no SK-II
mobile video is coming. If one is intended after all, upload it there and
we'll wire it.

## ~~4. Ouronyx — real credits list~~ RESOLVED 2026-07-20

Delivered in the site-text batch: Creative Directors Vitor Milito & Jessica
Clark, Photographer Scott Trindle, Film Director Kloss Films, Talent Daniel
Ricciardo / Caroline Issa / Jessica Kahawaty, Post Spring Studios. Wired.

## 8. Harrods — credits list (2026-07-20)

The site-text batch covered every project's credits EXCEPT Harrods (its
section has intro copy only). The page still shows the shared placeholder
crew. **Ask:** the Harrods Restaurants credits — roles + names (or confirm
the credits block should be dropped for this project).

## 5. Ouronyx — hi-res re-exports for the small clips (2026-07-14)

Vitor's review flagged Ouronyx video quality (worst: the wordmark card, his
"qualidade muito ruim" note). Verified: the shipped files are lossless
remuxes of the delivery — the quality ceiling is the exports themselves.
`WEB 2/3/5` are 484×638 and `MOBILE 2/3` are 300×388; all are logo/phone-UI
animations (vector-origin), soft even at native size, upscaled 2–4× on the
site. **Answer to Vitor's question: yes, it's an export problem.**

**Ask (via Diego):** re-export OURONYX WEB 2, WEB 3, WEB 5 at ≥720w and
MOBILE 1, MOBILE 2, MOBILE 3 at ≥720w, same content/timing. (MOBILE 1 is the
film title card — 440×550 at a lavish 2.7 Mbps, i.e. a low-res export of a
higher-res master; its text can't survive the ~3× phone upscale.) Meanwhile
we render them smaller in-frame to reduce the upscale.

## 6. BFJ — original of the balcony image (bfj-11) via Diego (2026-07-14)

Vitor: "BFJ mobile ta sem qualidade essa imagem, é o Diego que tem [o
original]". Confirmed: both variants (720×901 desktop, 440×523 mobile) come
from the same soft master — it reads like a video frame-grab; no better copy
exists in any delivery. **Ask:** the original still (≥1440w), and we swap it
in with no config change.

## 7. Silent audio tracks in 12 exports (2026-07-15, FYI)

For the audio-toggle rollout we muxed each clip's delivered soundtrack back
onto the site files (they were previously stripped). Twelve exports carry
**digitally silent tracks** (max −91 dB) — those clips got no speaker
button. If any were meant to have sound, re-export with the mix:

- **Bride Story** — mobile banner only (the desktop banner has a full mix)
- **Bucherer Summer** — the 4x5 clip
- **WAO** — Video1 (teaser) and Video3
- **Ouronyx** — WEB 2/3/5/7/8 + MOBILE 2/3/9 (the phone/tablet/wordmark
  cards and two interview edits; desktop WEB 9 has sound, its mobile edit
  doesn't)

No action needed if silence is intentional (likely for the UI mockups).

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

**Tag-reviewed and wired:** MC Arabia, YSL, Vivara, SK, Bucherer Summer, WAO,
Ouronyx (comment pins, PR #45), Harrods (comment pins, PR #46).
**Still to review against tagged columns:** Life / Bride Story / BFJ
(hero banners live from filename inference; tags not yet checked).
