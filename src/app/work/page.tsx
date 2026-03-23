import { WorkGalleryItem } from "@/components/home";
import { featuredProjects } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects and campaigns from Studio Haus Creative, spanning digital design, brand identity, creative direction, and motion design for global luxury brands.",
  alternates: {
    canonical: "/work",
  },
};

export default function WorkPage() {
  const [, ...projects] = featuredProjects;

  return (
    <>
      {/* Work Gallery Items - Each navigable to its own page, like Home but without IntroHero */}
      {projects.map((project) => (
        <WorkGalleryItem key={project.id} project={project} />
      ))}
    </>
  );
}
