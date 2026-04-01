import { render, screen } from "@testing-library/react";
import ProjectPage from "@/app/work/[slug]/page";
import { generateStaticParams, generateMetadata } from "@/app/work/[slug]/page";
import { projects, getAllProjectSlugs } from "@/config/projects";
import { siteConfig } from "@/config/site";

// Keep a reference to the real getProjectBySlug
const actualProjects = jest.requireActual("@/config/projects");
const realGetProjectBySlug = actualProjects.getProjectBySlug;

// Mock the projects module so we can control getProjectBySlug in specific tests
jest.mock("@/config/projects", () => ({
  ...jest.requireActual("@/config/projects"),
  getProjectBySlug: jest.fn((...args: unknown[]) =>
    (jest.requireActual("@/config/projects") as { getProjectBySlug: (...a: unknown[]) => unknown }).getProjectBySlug(...args),
  ),
}));

// Import the mocked version
import { getProjectBySlug } from "@/config/projects";

// Mock notFound from next/navigation
const mockNotFound = jest.fn();
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  notFound: () => {
    mockNotFound();
    // Throw to stop rendering (Next.js behaviour)
    throw new Error("NEXT_NOT_FOUND");
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock GalleryGrid to avoid rendering the full gallery tree
jest.mock("@/components/ui", () => ({
  GalleryGrid: ({ media }: { media: unknown[] }) => (
    <div data-testid="gallery-grid" data-count={media.length} />
  ),
}));

describe("ProjectPage", () => {
  const validSlug = projects[0].slug;
  const validProject = projects[0];

  beforeEach(() => {
    mockNotFound.mockClear();
    // Reset getProjectBySlug to use the real implementation
    (getProjectBySlug as jest.Mock).mockImplementation((...args: unknown[]) => realGetProjectBySlug(...args));
  });

  it("renders the project title", () => {
    render(<ProjectPage params={{ slug: validSlug }} />);

    expect(screen.getByText(validProject.title)).toBeInTheDocument();
  });

  it("renders the project description or subtitle", () => {
    render(<ProjectPage params={{ slug: validSlug }} />);

    const expectedText = validProject.subtitle || validProject.description;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it("renders the GalleryGrid with project images (excluding hero banner)", () => {
    render(<ProjectPage params={{ slug: validSlug }} />);

    const images = validProject.media.filter((m) => m.type === "image");
    const expectedGalleryCount = images.length - 1; // first image is hero

    const grid = screen.getByTestId("gallery-grid");
    expect(grid).toBeInTheDocument();
    expect(Number(grid.getAttribute("data-count"))).toBe(expectedGalleryCount);
  });

  it("renders the contact email from siteConfig in the footer", () => {
    render(<ProjectPage params={{ slug: validSlug }} />);

    const emailLinks = screen.getAllByText(siteConfig.email);
    expect(emailLinks.length).toBeGreaterThan(0);
  });

  it("renders social links from siteConfig", () => {
    render(<ProjectPage params={{ slug: validSlug }} />);

    siteConfig.socialLinks.forEach((link) => {
      expect(screen.getByText(link.title)).toBeInTheDocument();
    });
  });

  it("calls notFound for an invalid slug", () => {
    expect(() => {
      render(<ProjectPage params={{ slug: "nonexistent-project" }} />);
    }).toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders credits when present", () => {
    // Find a project that has credits
    const projectWithCredits = projects.find(
      (p) => p.credits && p.credits.length > 0,
    );

    if (projectWithCredits) {
      render(<ProjectPage params={{ slug: projectWithCredits.slug }} />);

      expect(screen.getByText("Credits")).toBeInTheDocument();
      projectWithCredits.credits!.forEach((credit) => {
        expect(screen.getByText(credit.role)).toBeInTheDocument();
        expect(screen.getByText(credit.name)).toBeInTheDocument();
      });
    }
  });

  it("renders first image as hero banner on project page", () => {
    // The hero banner uses the first image from the media array
    const project = projects.find((p) => p.media.some((m) => m.type === "image"));
    expect(project).toBeDefined();

    render(<ProjectPage params={{ slug: project!.slug }} />);

    const firstImage = project!.media.find((m) => m.type === "image")!;
    const heroImg = screen.getByAltText(firstImage.alt);
    expect(heroImg).toBeInTheDocument();
  });

  it("does not render video element on project pages", () => {
    const { container } = render(
      <ProjectPage params={{ slug: validSlug }} />,
    );

    const video = container.querySelector("video");
    expect(video).not.toBeInTheDocument();
  });

  it("uses first image media item as hero regardless of heroVideo/heroImage config", () => {
    // Hero always comes from media[0] (first image), not heroVideo or heroImage
    render(<ProjectPage params={{ slug: validSlug }} />);

    const project = projects.find((p) => p.slug === validSlug)!;
    const firstImage = project.media.find((m) => m.type === "image")!;
    const heroImg = screen.getByAltText(firstImage.alt);
    expect(heroImg).toBeInTheDocument();
  });

  it("does not render credits section when project has no credits", () => {
    const projectWithoutCredits = projects.find(
      (p) => !p.credits || p.credits.length === 0,
    );

    if (projectWithoutCredits) {
      render(
        <ProjectPage params={{ slug: projectWithoutCredits.slug }} />,
      );

      // "Credits" label should not appear
      expect(screen.queryByText("Credits")).not.toBeInTheDocument();
    }
  });

  it("does not render client logo when project has none", () => {
    const projectWithoutLogo = projects.find((p) => !p.clientLogo);

    if (projectWithoutLogo) {
      render(
        <ProjectPage params={{ slug: projectWithoutLogo.slug }} />,
      );

      expect(
        screen.queryByAltText(`${projectWithoutLogo.title} logo`),
      ).not.toBeInTheDocument();
    }
  });
});

describe("generateStaticParams", () => {
  it("returns slug params for all projects", async () => {
    const params = await generateStaticParams();
    const slugs = getAllProjectSlugs();

    expect(params).toHaveLength(slugs.length);
    slugs.forEach((slug) => {
      expect(params).toContainEqual({ slug });
    });
  });
});

describe("generateMetadata", () => {
  it("returns metadata for a valid project slug", async () => {
    const slug = projects[0].slug;
    const metadata = await generateMetadata({ params: { slug } });

    expect(metadata.title).toBeDefined();
    expect(metadata.description).toBeDefined();
    expect(metadata.alternates?.canonical).toBe(`/work/${slug}`);
  });

  it("returns empty object for an invalid slug", async () => {
    const metadata = await generateMetadata({
      params: { slug: "nonexistent" },
    });

    expect(metadata).toEqual({});
  });

  it("includes openGraph metadata", async () => {
    const slug = projects[0].slug;
    const project = getProjectBySlug(slug)!;
    const metadata = await generateMetadata({ params: { slug } });

    expect(metadata.openGraph?.title).toBe(project.title);
    expect(metadata.openGraph?.description).toBe(project.description);
  });

  it("uses metaTitle when available, falls back to generated title", async () => {
    const slug = projects[0].slug;
    const project = getProjectBySlug(slug)!;
    const metadata = await generateMetadata({ params: { slug } });

    const expectedTitle =
      project.metaTitle || `${project.title} | HAUS Creative`;
    expect(metadata.title).toBe(expectedTitle);
  });

  it("falls back to generated title when metaTitle is absent", async () => {
    const originalProject = realGetProjectBySlug(projects[0].slug)!;

    (getProjectBySlug as jest.Mock).mockReturnValue({
      ...originalProject,
      metaTitle: undefined,
    });

    const metadata = await generateMetadata({ params: { slug: projects[0].slug } });
    expect(metadata.title).toBe(`${originalProject.title} | HAUS Creative`);
  });

  it("falls back to project description when metaDescription is absent", async () => {
    const originalProject = realGetProjectBySlug(projects[0].slug)!;

    (getProjectBySlug as jest.Mock).mockReturnValue({
      ...originalProject,
      metaDescription: undefined,
    });

    const metadata = await generateMetadata({ params: { slug: projects[0].slug } });
    expect(metadata.description).toBe(originalProject.description);
  });

  it("omits openGraph images when ogImage is absent", async () => {
    const originalProject = realGetProjectBySlug(projects[0].slug)!;

    (getProjectBySlug as jest.Mock).mockReturnValue({
      ...originalProject,
      ogImage: undefined,
    });

    const metadata = await generateMetadata({ params: { slug: projects[0].slug } });
    expect(metadata.openGraph?.images).toEqual([]);
    expect(metadata.twitter?.images).toEqual([]);
  });
});
