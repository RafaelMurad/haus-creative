import { WorkGalleryItem } from "@/components/home";
import { SiteFooter } from "@/components/layout";
import { featuredProjects } from "@/config/site";
import { projects as projectDetails } from "@/config/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects and campaigns from Studio Haus Creative, spanning digital design, brand identity, creative direction, and motion design for global luxury brands.",
  alternates: {
    canonical: "/work",
  },
};

/** slug → project detail, for the tile hero videos (same lookup as home). */
const projectBySlug = new Map(projectDetails.map((p) => [p.slug, p]));

export default function WorkPage() {
  const [, ...projects] = featuredProjects;

  return (
    <>
      {/* Work Gallery Items - Each navigable to its own page, like Home but
          without IntroHero. Tiles play the same hero videos as home since
          2026-08-04 ("página work ainda está só com imagens não vídeos"). */}
      {projects
        .filter((project) => !projectBySlug.get(project.id)?.hidden)
        .map((project) => (
        <WorkGalleryItem
          key={project.id}
          project={project}
          heroVideo={projectBySlug.get(project.id)?.heroVideo}
        />
      ))}

      {/* Footer per review 2026-07-23 ("eu deixaria no WORK") — desktop-only,
          same treatment as home: mobile ends on the last full-bleed tile. */}
      <div className="hidden md:block">
        <SiteFooter />
      </div>
    </>
  );
}
