import { siteConfig } from "@/config/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studiohauscreative.com";

interface JsonLdProps {
  type?: "organisation" | "website";
}

/**
 * Renders JSON-LD structured data for SEO.
 *
 * Supports Organisation and WebSite schema types.
 */
export function JsonLd({ type = "organisation" }: JsonLdProps) {
  const organisationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Studio Haus Creative",
    url: siteUrl,
    email: siteConfig.email,
    description: siteConfig.description,
    sameAs: siteConfig.socialLinks.map((link) => link.href),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Studio Haus Creative",
    url: siteUrl,
    description: siteConfig.description,
  };

  const schema = type === "website" ? websiteSchema : organisationSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
