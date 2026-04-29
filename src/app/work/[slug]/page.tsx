import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllProjectSlugs, getProjectBySlug } from "@/config/projects";
import { GalleryGrid } from "@/components/ui";
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
      <section className="relative w-full h-dvh bg-black overflow-hidden">
        {project.heroVideo ? (
          <video
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: project.heroVideo.objectFit ?? "cover",
              objectPosition: project.heroVideo.objectPosition ?? "center",
            }}
            playsInline
            autoPlay
            loop
            muted
            poster={project.heroVideo.poster}
            preload="metadata"
          >
            <source
              src={project.heroVideo.mobile || project.heroVideo.desktop}
              type="video/mp4"
              media="(max-width: 768px)"
            />
            <source src={project.heroVideo.desktop} type="video/mp4" />
          </video>
        ) : project.heroImage ? (
          project.heroImage.mobile ? (
            <picture>
              <source media="(max-width: 768px)" srcSet={project.heroImage.mobile} />
              <img
                src={project.heroImage.desktop}
                alt={project.heroImage.alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            </picture>
          ) : (
            <Image
              src={project.heroImage.desktop}
              alt={project.heroImage.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )
        ) : null}

        {/* Client logo overlay - hidden when hero video is present (logo baked into video) */}
        {project.clientLogo && !project.heroVideo && (
          <div className="absolute inset-0 flex items-end justify-start px-4 pb-6 md:items-center md:justify-end md:px-0 md:pb-0 md:pr-[10%]">
            <div className="relative w-full md:max-w-[549px] md:w-full h-auto">
              <Image
                src={project.clientLogo}
                alt={`${project.title} logo`}
                width={549}
                height={200}
                className="w-full h-auto"
                sizes="(max-width: 768px) 90vw, 549px"
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
              <h1 className="text-[26px] min-[400px]:text-[33px] leading-[1.03em] font-normal mb-[18px]">
                {project.title}
              </h1>
              <p className="text-[23px] leading-[1.48em] text-black">
                {project.subtitle || project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="mt-[143px]">
          <GalleryGrid media={project.media} fullRowSpacing={project.fullRowSpacing} />
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
