import sitemap from "@/app/sitemap";
import { getAllProjectSlugs } from "@/config/projects";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://studiohauscreative.com";

describe("sitemap.ts", () => {
  it("returns an array of sitemap entries", () => {
    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes static pages (home, work, about, contact)", () => {
    const result = sitemap();
    const urls = result.map((entry) => entry.url);

    expect(urls).toContain(siteUrl);
    expect(urls).toContain(`${siteUrl}/work`);
    expect(urls).toContain(`${siteUrl}/about`);
    expect(urls).toContain(`${siteUrl}/contact`);
  });

  it("includes all project pages from config", () => {
    const result = sitemap();
    const slugs = getAllProjectSlugs();
    const urls = result.map((entry) => entry.url);

    slugs.forEach((slug) => {
      expect(urls).toContain(`${siteUrl}/work/${slug}`);
    });
  });

  it("assigns correct priorities to pages", () => {
    const result = sitemap();

    const home = result.find((e) => e.url === siteUrl);
    const work = result.find((e) => e.url === `${siteUrl}/work`);
    const about = result.find((e) => e.url === `${siteUrl}/about`);

    expect(home?.priority).toBe(1);
    expect(work?.priority).toBe(0.9);
    expect(about?.priority).toBe(0.7);
  });

  it("sets lastModified as a Date on all entries", () => {
    const result = sitemap();

    result.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date);
    });
  });

  it("sets project pages to priority 0.8 with monthly changeFrequency", () => {
    const result = sitemap();
    const slugs = getAllProjectSlugs();

    slugs.forEach((slug) => {
      const entry = result.find(
        (e) => e.url === `${siteUrl}/work/${slug}`,
      );
      expect(entry?.priority).toBe(0.8);
      expect(entry?.changeFrequency).toBe("monthly");
    });
  });
});
