import { render } from "@testing-library/react";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

describe("JsonLd", () => {
  it("renders organisation schema by default", () => {
    const { container } = render(<JsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeInTheDocument();

    const schema = JSON.parse(script!.textContent!);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Studio Haus Creative");
    expect(schema.email).toBe(siteConfig.email);
    expect(schema.description).toBe(siteConfig.description);
  });

  it("includes social links as sameAs in organisation schema", () => {
    const { container } = render(<JsonLd type="organisation" />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script!.textContent!);

    expect(schema.sameAs).toEqual(
      siteConfig.socialLinks.map((link) => link.href),
    );
  });

  it("renders website schema when type is 'website'", () => {
    const { container } = render(<JsonLd type="website" />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script!.textContent!);

    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe("Studio Haus Creative");
    expect(schema.description).toBe(siteConfig.description);
    // WebSite schema should not have sameAs
    expect(schema.sameAs).toBeUndefined();
  });

  it("includes the configured site URL in both schema types", () => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://studiohauscreative.com";

    const { container: orgContainer } = render(<JsonLd type="organisation" />);
    const orgScript = orgContainer.querySelector(
      'script[type="application/ld+json"]',
    );
    const orgSchema = JSON.parse(orgScript!.textContent!);

    const { container: webContainer } = render(<JsonLd type="website" />);
    const webScript = webContainer.querySelector(
      'script[type="application/ld+json"]',
    );
    const webSchema = JSON.parse(webScript!.textContent!);

    expect(orgSchema.url).toBe(siteUrl);
    expect(webSchema.url).toBe(siteUrl);
  });
});
