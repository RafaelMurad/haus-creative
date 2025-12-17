import { WorkGalleryItem } from "@/components/home";
import { featuredProjects } from "@/config/site";

export default function WorkPage() {
  return (
    <>
      {/* Work Gallery Items - Each navigable to its own page, like Home but without IntroHero */}
      {featuredProjects.map((project) => (
        <WorkGalleryItem key={project.id} project={project} />
      ))}
    </>
  );
}
