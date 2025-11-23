import { IntroHero, WorkGalleryItem } from "@/components/home";
import { featuredProjects } from "@/config/site";

export default function Home() {
  // First project is the intro hero
  const [introProject, ...workProjects] = featuredProjects;

  return (
    <>
      {/* Introductory Hero - Full viewport, no text */}
      <IntroHero media={introProject.media} />

      {/* Work Gallery Items - Each navigable to its own page */}
      {workProjects.map((project) => (
        <WorkGalleryItem key={project.id} project={project} />
      ))}
    </>
  );
}