import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectBySlug } from "@/config/projects";
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
    openGraph: {
      title: project.title,
      description: project.description,
      siteName: "HAUS Creative",
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
  
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Top gradient overlay for header visibility */}
      <div className="fixed top-0 left-0 w-full h-[120px] bg-gradient-to-b from-black/30 to-transparent z-10 pointer-events-none" />

      {/* Hero Section - Full viewport with video/image */}
      <section className="relative w-full h-screen bg-black overflow-hidden">
        {project.heroVideo ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
            loop
            muted
            poster={project.heroVideo.poster}
          >
            <source 
              src={project.heroVideo.mobile || project.heroVideo.desktop} 
              type="video/mp4" 
              media="(max-width: 768px)" 
            />
            <source src={project.heroVideo.desktop} type="video/mp4" />
          </video>
        ) : project.heroImage ? (
          <picture>
            {project.heroImage.mobile && (
              <source srcSet={project.heroImage.mobile} media="(max-width: 768px)" />
            )}
            <img
              src={project.heroImage.desktop}
              alt={project.heroImage.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
        ) : null}
      </section>

      {/* Project Intro Section */}
      <section className="pt-8 md:pt-12 bg-white">
        <div className="px-4 md:px-5 lg:px-20">
          {/* Main intro content */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-20">
            {/* Label column */}
            <div className="w-full md:w-60 flex-shrink-0">
              <p className="text-[15px] leading-[21px] uppercase tracking-wide text-gray-400">
                Intro
              </p>
            </div>
            
            {/* Content column */}
            <div className="flex-1">
              <h1 className="text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] font-normal mb-4">
                {project.title}
              </h1>
              <p className="text-[20px] leading-[26px] md:text-[28px] md:leading-[36px] font-normal text-gray-700">
                {project.description}
              </p>
            </div>
          </div>
          
          {/* Metadata section */}
          {(project.services || project.credits) && (
            <div className="flex flex-col md:flex-row gap-8 md:gap-20 mt-16 md:mt-20">
              <div className="w-full md:w-60" />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                  {project.services && project.services.length > 0 && (
                    <div className="mb-10 md:mb-0">
                      <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                        Services
                      </h3>
                      <ul className="space-y-1">
                        {project.services.map((service) => (
                          <li key={service} className="text-[15px] leading-[21px]">
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {project.credits && project.credits.length > 0 && (
                    <div className="mb-10 md:mb-0">
                      <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                        Credits
                      </h3>
                      <ul className="space-y-1">
                        {project.credits.map((credit, index) => (
                          <li key={index} className="text-[15px] leading-[21px]">
                            <span className="text-gray-600">{credit.role}</span>
                            <br />
                            {credit.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Media Gallery - Full bleed images/videos */}
      <div className="mt-0 space-y-0">
        {project.media.map((item, index) => (
          <section key={index} className="relative w-full bg-white">
            {item.type === 'video' ? (
              <video
                className="w-full h-auto"
                playsInline
                autoPlay
                loop
                muted
              >
                <source 
                  src={item.mobile || item.desktop} 
                  type="video/mp4" 
                  media="(max-width: 768px)" 
                />
                <source src={item.desktop} type="video/mp4" />
              </video>
            ) : (
              <picture>
                {item.mobile && (
                  <source srcSet={item.mobile} media="(max-width: 768px)" />
                )}
                <img
                  src={item.desktop}
                  alt={item.alt}
                  className="w-full h-auto"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </picture>
            )}
            {item.caption && (
              <p className="px-4 md:px-5 lg:px-20 py-4 text-sm text-gray-600">
                {item.caption}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
