import { VideoHero, VideoCollection, CTALinks } from "@/components/home";
import { featuredProjects, ctaLinks } from "@/config/site";

export default function Home() {
  return (
    <>
      {/* Hero Video Section */}
      <VideoHero
        videoSrc="/videos/hero-reel.mp4"
        posterSrc="/images/hero-poster.jpg"
        fullVideoSrc="/videos/hero-full.mp4"
      />

      {/* Featured Projects */}
      <VideoCollection projects={featuredProjects} />

      {/* Call to Action Links */}
      <CTALinks links={ctaLinks} />
    </>
  );
}