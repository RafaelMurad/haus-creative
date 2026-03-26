import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllProjectSlugs, getProjectBySlug } from "@/config/projects";
import { siteConfig } from "@/config/site";
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
    alternates: {
      canonical: `/work/${params.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      siteName: "Studio Haus Creative",
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
    <div className="min-h-screen bg-white text-black">
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
          <Image
            src={project.heroImage.desktop}
            alt={project.heroImage.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : null}

        {/* Client logo overlay - centered */}
        {project.clientLogo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative max-w-[300px] md:max-w-[549px] w-full h-auto">
              <Image
                src={project.clientLogo}
                alt={`${project.title} logo`}
                width={549}
                height={200}
                className="w-full h-auto"
                sizes="(max-width: 768px) 300px, 549px"
              />
            </div>
          </div>
        )}
      </section>

      {/* Project Content Section */}
      <section className="bg-white">
        {/* Intro Section */}
        <div className="px-[21px] md:px-[34px] pt-[51px]">
          <div className="flex flex-col md:flex-row gap-[49px] md:gap-0">
            {/* Label column */}
            <div className="md:w-[264px] flex-shrink-0">
              <p className="text-[14px] leading-[1.21em] text-black">
                Intro
              </p>
            </div>

            {/* Content column */}
            <div className="flex-1 max-w-[663px]">
              <h1 className="text-[33px] leading-[1.03em] font-normal mb-[18px]">
                {project.title}
              </h1>
              <p className="text-[23px] leading-[1.48em] text-black">
                {project.subtitle || project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Media Gallery - 2-column grid on desktop */}
        <div className="mt-[143px]">
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
                  <Image
                    src={item.desktop}
                    alt={item.alt}
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credits Section */}
        {project.credits && project.credits.length > 0 && (
          <div className="px-[34px] md:px-0 mt-20 md:mt-[81px]">
            <div className="flex flex-col md:flex-row">
              {/* Empty left spacer on desktop (aligns credits to right column) */}
              <div className="hidden md:block md:w-1/2" />

              {/* Label column */}
              <div className="md:w-[264px] flex-shrink-0 mb-4 md:mb-0">
                <p className="text-[14px] leading-[1.21em] text-black">
                  Credits
                </p>
              </div>

              {/* Content column */}
              <div className="flex-1">
                <div className="text-[15px] leading-[1.53em] md:text-[18px] md:leading-[1.56em] space-y-1">
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

        {/* Divider - mobile only per Figma (desktop has no divider) */}
        <div className="px-[17px] mt-[71px] md:hidden">
          <div className="w-full h-[0.5px] bg-black" />
        </div>

        {/* Footer Section */}
        <div className="px-[21px] md:px-[41px] md:pr-[44px]">
          {/* Mobile: stacked vertically. Desktop: email left, social right */}
          <div className="flex flex-col md:flex-row md:justify-between pt-[71px] md:pt-[175px] pb-[107px] md:pb-[107px]">
            {/* Contact Email */}
            <div>
              <Link
                href={`mailto:${siteConfig.email}`}
                className="text-[15px] leading-[1.21em] hover:opacity-50 transition-opacity"
              >
                {siteConfig.email}
              </Link>
            </div>

            {/* Social Links - vertical on mobile, horizontal on desktop */}
            <div className="flex flex-col md:flex-row gap-[18px] md:gap-[21px] mt-[38px] md:mt-0">
              {siteConfig.socialLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] leading-[1.21em] hover:opacity-50 transition-opacity"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
