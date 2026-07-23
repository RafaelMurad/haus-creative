import { Fragment } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllProjectSlugs, getProjectBySlug } from "@/config/projects";
import { GalleryGrid, HeroVideo } from "@/components/ui";
import { SiteFooter } from "@/components/layout";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) return {};

  return {
    title: project.metaTitle || `${project.title} | HAUS Creative`,
    description: project.metaDescription || project.description,
    alternates: {
      canonical: `/work/${params.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      siteName: "Studio Haus Creative",
      images: project.ogImage ? [{ url: project.ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.ogImage ? [project.ogImage] : [],
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Dev-only hero slot label. Gated by NODE_ENV; do not remove — used during
  // slot-level review feedback to identify which asset the hero is rendering.
  const heroSrc =
    project.heroVideo?.desktop ||
    project.heroVideo?.mobile ||
    project.heroImage?.desktop ||
    "";
  const heroMatch = heroSrc.match(/\/([^/]+)\.(?:webp|mp4|jpg|png)$/i);
  const heroLabel = heroMatch ? heroMatch[1] : "hero";

  // The " - " in a campaign title is a line delimiter (client review
  // 2026-07-23): brand on the first line, campaign beneath, separator
  // dropped. Hyphen-less titles render as-is. The bare hyphen in "SK-II"
  // is untouched — only the spaced separator splits.
  const titleParts = project.title.split(" - ");

  return (
    <div id="top" className="min-h-screen bg-white text-black">
      {/* Hero Section.
          Three height modes (video first — its children are absolutely
          positioned, so the section must own its height or it collapses):
          1. heroVideo → h-dvh on desktop; mobile uses the 440/864 design box
             when a mobile hero asset exists (matches delivered mobile videos).
          2. heroImage.objectFit === "contain" → no h-dvh; image renders at
             natural aspect (full width, auto height). Used when client-supplied
             titles need to stay un-cropped (e.g. Bride Story "BRIDE" text).
          3. Default → h-dvh on both breakpoints. */}
      <section
        id="project-hero"
        className={`relative w-full bg-black overflow-hidden ${
          project.heroVideo?.desktop
            ? project.heroVideo.objectFit === "contain"
              ? // Whole-frame hero (e.g. Bride's baked left-edge title):
                // the portrait edit fills its design box up to lg (heroes
                // swap files at the lg boundary), then the landscape banner
                // renders as a natural-aspect band that scales with the
                // viewport — the whole frame stays visible at any size.
                "aspect-[440/864] lg:aspect-[1920/1080] lg:h-auto"
              : project.heroImage?.mobile
                ? "aspect-[440/864] md:aspect-auto md:h-dvh"
                : "h-dvh"
            : project.heroImage?.objectFit === "contain"
              ? project.heroImage?.mobileFit === "natural"
                ? "h-auto"
                : "h-dvh md:h-auto"
              : "h-dvh"
        }`}
      >
        {process.env.NODE_ENV === "development" && (
          <div
            className="absolute top-2 left-2 z-50 px-2 py-1 rounded bg-black/80 text-white font-mono text-[11px] leading-none pointer-events-none select-none"
            data-slot-badge
          >
            {heroLabel}
            <span className="ml-1 opacity-60">·hero</span>
          </div>
        )}
        {project.heroVideo?.desktop ? (
          <>
            {/* Mobile fallback: static heroImage only when no mobile video was
                delivered — the Jul 2 batch added true portrait crops for most
                projects, and those play the video on mobile instead. */}
            {!project.heroVideo.mobile && project.heroImage?.mobile && (
              <div className="absolute inset-0 md:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.heroImage.mobile}
                  alt={project.heroImage.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}
            <div
              className={`absolute inset-0 ${
                !project.heroVideo.mobile && project.heroImage?.mobile
                  ? "hidden md:block"
                  : ""
              }`}
            >
              <HeroVideo
                desktop={project.heroVideo.desktop}
                mobile={project.heroVideo.mobile}
                poster={project.heroVideo.poster}
                posterMobile={project.heroVideo.posterMobile}
                objectFit={project.heroVideo.objectFit}
                objectPosition={project.heroVideo.objectPosition}
                hasAudio={project.heroVideo.hasAudio}
              />
            </div>
          </>
        ) : project.heroImage ? (
          (() => {
            const isContain = project.heroImage.objectFit === "contain";
            const posStyle = project.heroImage.objectPosition
              ? { objectPosition: project.heroImage.objectPosition }
              : undefined;
            if (isContain) {
              const naturalMobile = project.heroImage.mobileFit === "natural";
              // Two-image render so each breakpoint gets its own fit strategy:
              // - Mobile: cover the h-dvh section (image fills viewport; minor side
              //   crop is acceptable for portrait-oriented mobile crops). When
              //   `mobileFit: "natural"` is set, render at natural aspect instead —
              //   used for mobile assets with edge content that cropping would clip.
              // - Desktop: natural width × auto height so client-supplied titles
              //   (e.g. "BRIDE", "Harrods Dining Hall") don't get cropped.
              return (
                <>
                  {/* Mobile static image yields to a mobile hero video below */}
                  {project.heroImage.mobile && !project.heroVideo?.mobile && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.heroImage.mobile}
                      alt={project.heroImage.alt}
                      className={
                        naturalMobile
                          ? "block w-full h-auto md:hidden"
                          : "absolute inset-0 w-full h-full object-cover md:hidden"
                      }
                      style={posStyle}
                      loading="eager"
                    />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.heroImage.desktop}
                    alt={project.heroImage.alt}
                    className={`block w-full h-auto ${project.heroImage.mobile ? "hidden md:block" : ""}`}
                    style={posStyle}
                    loading="eager"
                  />
                </>
              );
            }
            return project.heroImage.mobile ? (
              <picture>
                <source media="(max-width: 767.98px)" srcSet={project.heroImage.mobile} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.heroImage.desktop}
                  alt={project.heroImage.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={posStyle}
                  loading="eager"
                />
              </picture>
            ) : (
              <Image
                src={project.heroImage.desktop}
                alt={project.heroImage.alt}
                fill
                className="object-cover"
                style={posStyle}
                sizes="100vw"
                priority
              />
            );
          })()
        ) : null}

        {/* Mobile-only hero video (e.g. MC Arabia): the static heroImage above
            keeps the desktop; crossing the breakpoint swaps the source to the
            delivered portrait banner (HeroVideo renders nothing on desktop). */}
        {!project.heroVideo?.desktop && project.heroVideo?.mobile && (
          <div className="absolute inset-0 md:hidden">
            <HeroVideo
              mobile={project.heroVideo.mobile}
              poster={project.heroVideo.poster}
              posterMobile={project.heroVideo.posterMobile}
              objectFit={project.heroVideo.objectFit}
              objectPosition={project.heroVideo.objectPosition}
              hasAudio={project.heroVideo.hasAudio}
            />
          </div>
        )}

        {/* Client logo overlay - hidden when hero video is present (logo baked into video) */}
        {project.clientLogo && !project.heroVideo && (
          <div className="absolute inset-0 flex items-end justify-start px-4 pb-6 md:items-center md:justify-end md:px-0 md:pb-0 md:pr-[10%]">
            <div className="relative w-full md:max-w-[549px] md:w-full h-auto">
              <Image
                src={project.clientLogo}
                alt={`${project.title} logo`}
                width={549}
                height={200}
                className="w-full h-auto"
                sizes="(max-width: 768px) 90vw, 549px"
              />
            </div>
          </div>
        )}
      </section>

      {/* Project Content Section */}
      <section className="bg-white">
        {/* Intro Section — two-column layout below hero.
            Left: title + campaign tagline (uppercase) + agency line.
            Right: description body. Mobile: stacked single column.
            Title cap sized so the longest hyphen-split line ("The
            Summer of Indulgence", ~415px in Inter at 33px) holds one
            line while short titles stay near the description body —
            client review 2026-07-23. */}
        <div className="px-[21px] md:px-[34px] pt-[70px] md:pt-[70px]">
          <div className="flex flex-col gap-[24px] md:flex-row md:gap-[60px]">
            {/* Left column: title + discipline (uppercase) + location +
                agency — lines render only when the client copy provides
                them (order per the 2026-07-20 text delivery). */}
            <div className="flex-1 md:max-w-[430px]">
              <h1 className="text-[26px] min-[400px]:text-[33px] leading-[1.03em] font-normal mb-[18px]">
                {titleParts.map((part, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {part}
                  </Fragment>
                ))}
              </h1>
              {project.editorialSubtitle && (
                <p className="text-[14px] leading-[1.4em] uppercase tracking-wide mb-[14px]">
                  {project.editorialSubtitle}
                </p>
              )}
              {project.location && (
                <p className="text-[14px] leading-[1.4em] mb-[14px]">
                  {project.location}
                </p>
              )}
              {project.agency && (
                <p className="text-[14px] leading-[1.4em]">
                  <span className="font-semibold">Agency:</span>{" "}
                  {project.agency}
                </p>
              )}
            </div>

            {/* Right column: intro body — one <p> per paragraph. Desktop
                unchanged; mobile stacks tightly under the agency (gap-24,
                was 49 — Figma #20). */}
            <div className="flex-1 md:max-w-[560px] space-y-[1em]">
              {(Array.isArray(project.introText)
                ? project.introText
                : [project.introText ?? project.description]
              ).map((paragraph, i) => (
                <p key={i} className="text-[14px] leading-[1.4em] text-black">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="mt-[60px] md:mt-[110px]">
          <GalleryGrid media={project.media} fullRowSpacing={project.fullRowSpacing} />
        </div>

        {/* Credits Section with Back-to-top link.
            Desktop: ↑ Back to top sits in the left column (where the spacer
            was), Credits label + content fill the right half.
            Mobile: Credits stacked first, then Back to top below. */}
        {project.credits && project.credits.length > 0 && (
          <div className="px-[34px] md:px-0 mt-[44px] md:mt-[50px]">
            {/* Gap above = the standard inter-asset spacing (44 mobile /
                50 desktop) so the section break reads consistent site-wide. */}
            <div className="flex flex-col md:flex-row">
              {/* Back to top — desktop only, in left column */}
              <div className="hidden md:block md:w-1/2 md:pl-[34px]">
                <a
                  href="#top"
                  className="text-[14px] font-semibold leading-[1.21em] text-black hover:opacity-50 transition-opacity inline-flex items-center gap-1"
                >
                  <span aria-hidden>↑</span> Back to top
                </a>
              </div>

              {/* Label column */}
              <div className="md:w-[120px] flex-shrink-0 mb-[55px] md:mb-0">
                <p className="text-[14px] font-semibold leading-[1.21em] text-black">
                  Credits
                </p>
              </div>

              {/* Content column — Figma spec: Inter 18px / 28px line-height */}
              <div className="flex-1">
                <div className="text-[18px] leading-[28px]">
                  {project.credits.map((credit, index) => (
                    <p key={index}>
                      <span className="text-black">{credit.role}</span>
                      <span className="text-black"> : </span>
                      <span className="text-black">{credit.name}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Back to top — mobile only, below credits */}
            <div className="md:hidden mt-[55px]">
              <a
                href="#top"
                className="text-[14px] font-semibold leading-[1.21em] text-black hover:opacity-50 transition-opacity inline-flex items-center gap-1"
              >
                <span aria-hidden>↑</span> Back to top
              </a>
            </div>
          </div>
        )}

        {/* Divider — both mobile + desktop per updated Figma */}
        {/* Footer Section — shared component (also on home) */}
        <SiteFooter />
      </section>
    </div>
  );
}
