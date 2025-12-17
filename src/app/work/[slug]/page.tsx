import { notFound } from "next/navigation";
import Link from "next/link";
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

        {/* Client logo overlay - centered */}
        {project.clientLogo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={project.clientLogo}
              alt={`${project.title} logo`}
              className="max-w-[300px] md:max-w-[549px] h-auto"
            />
          </div>
        )}
      </section>

      {/* Project Content Section */}
      <section className="bg-white">
        {/* Intro Section */}
        <div className="px-5 md:px-[34px] pt-[51px]">
          <div className="flex flex-col md:flex-row gap-6 md:gap-0">
            {/* Label column */}
            <div className="md:w-[264px] flex-shrink-0">
              <p className="text-[15px] leading-[18px] uppercase tracking-wide text-gray-500">
                Intro
              </p>
            </div>

            {/* Content column */}
            <div className="flex-1">
              <h1 className="text-[28px] leading-[34px] md:text-[34px] md:leading-[34px] font-normal mb-4">
                {project.title}
              </h1>
              <p className="text-[24px] leading-[34px] md:text-[34px] md:leading-[34px] font-normal text-black">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Media Gallery - 2-column grid on desktop */}
        <div className="mt-[229px]">
          {/* Group images in pairs for desktop 2-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {project.media.map((item, index) => (
              <div key={index} className="relative w-full overflow-hidden">
                {item.type === 'video' ? (
                  <video
                    className="w-full h-auto object-cover"
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
                      className="w-full h-auto object-cover"
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  </picture>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credits Section */}
        {project.credits && project.credits.length > 0 && (
          <div className="px-5 md:px-[34px] mt-20 md:mt-[81px]">
            <div className="flex flex-col md:flex-row gap-6 md:gap-0">
              {/* Label column - aligned to second column on desktop */}
              <div className="md:w-1/2 flex-shrink-0">
                <p className="text-[15px] leading-[18px] uppercase tracking-wide text-gray-500 md:pl-[686px]">
                  Credits
                </p>
              </div>

              {/* Content column */}
              <div className="flex-1">
                <div className="text-[15px] leading-[21px] space-y-1">
                  {project.credits.map((credit, index) => (
                    <p key={index}>
                      <span className="text-black">{credit.role}</span>
                      <span className="text-black"> : </span>
                      <span className="text-black">{credit.name}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="px-5 md:px-[34px] mt-20 md:mt-[269px]">
          <div className="border-t border-gray-200" />
        </div>

        {/* Footer Section */}
        <div className="px-5 md:px-[34px] py-8 md:py-[41px]">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            {/* Contact Email */}
            <div>
              <Link
                href="mailto:contact@studiohauscreative.com"
                className="text-[15px] leading-[18px] hover:opacity-50 transition-opacity"
              >
                contact@studiohauscreative.com
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-6">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] leading-[18px] hover:opacity-50 transition-opacity"
              >
                Instagram
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] leading-[18px] hover:opacity-50 transition-opacity"
              >
                Linkedin
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
