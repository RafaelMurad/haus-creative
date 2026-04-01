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

  // Images only — first image is the hero banner, rest go into the gallery
  const images = project.media.filter((m) => m.type === "image");
  const heroImage = images[0];
  const galleryImages = images.slice(1);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section - Full width, height follows image aspect ratio */}
      <section className="relative w-full bg-black">
        {heroImage && (
          <Image
            src={heroImage.desktop}
            alt={heroImage.alt}
            width={1920}
            height={1080}
            className="w-full h-auto"
            sizes="100vw"
            priority
          />
        )}

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
              <h1 className="text-[26px] min-[400px]:text-[33px] leading-[1.03em] font-normal mb-[18px]">
                {project.title}
              </h1>
              <p className="text-[23px] leading-[1.48em] text-black">
                {project.subtitle || project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Media Gallery — images only, excluding the hero banner */}
        <div className="mt-[143px]">
          <GalleryGrid media={galleryImages} />
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
