import robots from "@/app/robots";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://studiohauscreative.com";

describe("robots.ts", () => {
  it("returns valid robots config with allow and disallow rules", () => {
    const result = robots();

    expect(result.rules).toBeDefined();
    expect(Array.isArray(result.rules)).toBe(true);

    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules).toHaveLength(1);
    expect(rules[0]).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    });
  });

  it("includes sitemap URL", () => {
    const result = robots();

    expect(result.sitemap).toBeDefined();
    expect(result.sitemap).toContain("/sitemap.xml");
  });

  it("uses the configured site URL for the sitemap", () => {
    const result = robots();

    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});
