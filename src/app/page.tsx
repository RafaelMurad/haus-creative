import { VideoHero, VideoCollection, CTALinks } from "@/components/home";
import { featuredProjects, ctaLinks } from "@/config/site";

export default function Home() {
  return (
    <>
      {/* Hero Video Section */}
      <VideoHero
        videoSrc="/assets/gallery10/Gallery10-Ouronyx.mp4"
        posterSrc="/assets/gallery10/Gallery10-Cover.png"
      />

      {/* Featured Projects */}
      <VideoCollection projects={featuredProjects} />

      {/* Call to Action Links */}
      <CTALinks links={ctaLinks} />
    </>
  );
}