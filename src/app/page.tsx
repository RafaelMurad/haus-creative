import { IntroHero, WorkGalleryItem } from "@/components/home";
import { featuredProjects } from "@/config/site";
import { projects } from "@/config/projects";
import type { ProjectMedia } from "@/config/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HAUS | Creative Direction + Design",
  description:
    "Studio Haus Creative specialises in 360° campaigns, branded content, and immersive digital experiences for luxury and forward-thinking brands.",
  alternates: {
    canonical: "/",
  },
};

/** Build a lookup map from slug → project detail for O(1) access. */
const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

/**
 * Select which gallery media items to show on the homepage.
 * Uses homepageIndices from the carousel config if specified,
 * otherwise returns all media items.
 */
function getHomepageMedia(
  media: ProjectMedia[],
  homepageIndices?: number[],
): ProjectMedia[] {
  if (!homepageIndices || homepageIndices.length === 0) return media;
  return homepageIndices
    .filter((i) => i >= 0 && i < media.length)
    .map((i) => media[i]);
}

export default function Home() {
  // First project is the intro hero
  const [introProject, ...workProjects] = featuredProjects;

  return (
    <>
      {/* Introductory Hero - Full viewport, no text */}
      <IntroHero media={introProject.media} />

      {/* Work Gallery Items - Each navigable to its own page.
          Carousel effects are OFF by default. To enable per-project,
          add homepageIndices to the project's carousel config in projects.ts. */}
      {workProjects.map((project) => {
        const detail = projectBySlug.get(project.id);
        const carouselConfig = detail?.carousel;
        const hasHomepageCarousel = carouselConfig?.homepageIndices && carouselConfig.homepageIndices.length > 0;
        const galleryMedia = hasHomepageCarousel && detail
          ? getHomepageMedia(detail.media, carouselConfig!.homepageIndices)
          : undefined;

        return (
          <WorkGalleryItem
            key={project.id}
            project={project}
            heroVideo={detail?.heroVideo}
            galleryMedia={galleryMedia}
            carouselConfig={hasHomepageCarousel ? carouselConfig : undefined}
          />
        );
      })}
    </>
  );
}