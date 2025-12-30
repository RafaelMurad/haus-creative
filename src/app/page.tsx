import { IntroHero, WorkGalleryItem, CTALinks } from "@/components/home";
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

      {/* CTA Banner */}
      <CTALinks
        links={[
          { title: "Discover all projects", href: "/work", variant: "default" },
          { title: "Contact us", href: "/contact", variant: "highlight" },
        ]}
      />
    </>
  );
}