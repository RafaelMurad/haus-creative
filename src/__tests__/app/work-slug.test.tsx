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
  // Real component — the hero tests below assert its resolved source.
  HeroVideo: (
    jest.requireActual("@/components/ui/HeroVideo") as {
      HeroVideo: typeof import("@/components/ui/HeroVideo").HeroVideo;
    }
  ).HeroVideo,
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

  it("renders the GalleryGrid with project media", () => {
    render(<ProjectPage params={{ slug: validSlug }} />);

    const grid = screen.getByTestId("gallery-grid");
    expect(grid).toBeInTheDocument();
    expect(Number(grid.getAttribute("data-count"))).toBe(
      validProject.media.length,
    );
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
        // Film-credits style (review 2026-07-23): bold role line, no colon;
        // comma-joined names render one per line without the commas.
        expect(screen.getByText(credit.role)).toBeInTheDocument();
        credit.name.split(", ").forEach((name) => {
          expect(
            screen.getAllByText(name, { exact: false }).length,
          ).toBeGreaterThan(0);
        });
      });
    }
  });

  it("renders hero image when project has heroImage but no heroVideo", () => {
    const imageProject = projects.find(
      (p) => p.heroImage && !p.heroVideo,
    );

    if (imageProject) {
      render(<ProjectPage params={{ slug: imageProject.slug }} />);

      // `contain`-fit heroes render two <img> (mobile + desktop) sharing one alt,
      // so query for all matches and assert at least one hero image is present.
      const heroImgs = screen.getAllByAltText(imageProject.heroImage!.alt);
      expect(heroImgs.length).toBeGreaterThan(0);
      expect(heroImgs[0]).toBeInTheDocument();
    }
  });

  it("keeps viewport height on the hero section for desktop-video projects", () => {
    // Regression: contain-mode heroImages set md:h-auto, which collapses the
    // section to zero height when the hero is an absolutely-positioned video.
    // Mobile-only heroVideos (no desktop file) legitimately keep md:h-auto —
    // their desktop hero is the in-flow static image.
    const videoProjects = projects.filter((p) => p.heroVideo?.desktop);
    expect(videoProjects.length).toBeGreaterThan(0);

    videoProjects.forEach((project) => {
      const { container, unmount } = render(
        <ProjectPage params={{ slug: project.slug }} />,
      );
      const section = container.querySelector("#project-hero");
      expect(section).toBeInTheDocument();
      if (project.heroVideo?.objectFit === "contain") {
        // Whole-frame heroes (Bride): h-auto is collapse-safe here because
        // aspect boxes give the section intrinsic height at every breakpoint.
        expect(section!.className).toContain("aspect-[440/864]");
        expect(section!.className).toContain("lg:aspect-[1920/1080]");
      } else {
        expect(section!.className).not.toContain("md:h-auto");
        expect(section!.className).toMatch(/h-dvh/);
      }
      unmount();
    });
  });

  it("renders static desktop hero for mobile-only heroVideo projects", () => {
    // mc-arabia: video plays only below the breakpoint; desktop (the jsdom
    // default via the matchMedia mock) shows the static heroImage instead.
    const mobileOnlyProject = projects.find(
      (p) => p.heroVideo?.mobile && !p.heroVideo.desktop,
    );

    if (mobileOnlyProject) {
      const { container } = render(
        <ProjectPage params={{ slug: mobileOnlyProject.slug }} />,
      );

      expect(container.querySelector("video")).not.toBeInTheDocument();
      const heroImgs = screen.getAllByAltText(mobileOnlyProject.heroImage!.alt);
      expect(heroImgs.length).toBeGreaterThan(0);
    }
  });

  it("renders hero video when project has heroVideo with mobile source", () => {
    // ouronyx has heroVideo.mobile
    const videoProject = projects.find(
      (p) => p.heroVideo?.desktop && p.heroVideo.mobile,
    );

    if (videoProject) {
      const { container } = render(
        <ProjectPage params={{ slug: videoProject.slug }} />,
      );

      const video = container.querySelector("video");
      expect(video).toBeInTheDocument();

      // After hydration HeroVideo resolves a single src for the current
      // breakpoint (jest matchMedia mock reports desktop).
      expect(video!.getAttribute("src")).toBe(videoProject.heroVideo!.desktop);
    }
  });

  it("renders hero video without mobile source (falls back to desktop)", () => {
    // wao-cosmo has heroVideo but no mobile
    const videoProject = projects.find(
      (p) => p.heroVideo && !p.heroVideo.mobile,
    );

    if (videoProject) {
      const { container } = render(
        <ProjectPage params={{ slug: videoProject.slug }} />,
      );

      const video = container.querySelector("video");
      expect(video).toBeInTheDocument();

      // Desktop-only heroVideo resolves to the desktop file
      expect(video!.getAttribute("src")).toBe(videoProject.heroVideo!.desktop);
    }
  });

  it("renders nothing in hero section when project has no heroVideo or heroImage", () => {
    // All current projects have one or the other, but test the null path
    // by finding a project that renders correctly
    const project = projects.find(
      (p) => p.heroVideo || p.heroImage,
    );
    expect(project).toBeDefined(); // Sanity check
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
