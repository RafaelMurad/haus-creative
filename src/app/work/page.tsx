import { WorkGalleryItem } from "@/components/home";
import { featuredProjects } from "@/config/site";

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
