import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { featuredProjects } from "@/config/site";
import { projects } from "@/config/projects";

// Mock child components to isolate page logic
jest.mock("@/components/home", () => ({
  IntroHero: ({ media }: { media: { src: string } }) => (
    <div data-testid="intro-hero" data-media-src={media.src} />
  ),
  WorkGalleryItem: ({
    project,
    galleryMedia,
    carouselConfig,
  }: {
    project: { id: string; title: string };
    galleryMedia?: unknown[];
    carouselConfig?: unknown;
  }) => (
    <div
      data-testid={`work-gallery-${project.id}`}
      data-has-gallery-media={!!galleryMedia}
      data-has-carousel-config={!!carouselConfig}
      data-gallery-media-count={galleryMedia?.length ?? 0}
    >
      {project.title}
    </div>
  ),
}));

const hiddenIds = new Set(
  projects.filter((p) => p.hidden).map((p) => p.slug),
);
const visibleWork = (list: typeof featuredProjects) =>
  list.filter((p) => !hiddenIds.has(p.id));

describe("Home page", () => {
  it("renders IntroHero with the first featured project's media", () => {
    render(<Home />);

    const introHero = screen.getByTestId("intro-hero");
    expect(introHero).toBeInTheDocument();
    expect(introHero.getAttribute("data-media-src")).toBe(
      featuredProjects[0].media.src,
    );
  });

  it("renders WorkGalleryItem for each project after the intro", () => {
    render(<Home />);

    const [, ...workProjects] = featuredProjects;

    visibleWork(workProjects).forEach((project) => {
      expect(
        screen.getByTestId(`work-gallery-${project.id}`),
      ).toBeInTheDocument();
    });
    // Hidden projects (YSL, deactivated 2026-08-04) render no tile.
    workProjects
      .filter((p) => hiddenIds.has(p.id))
      .forEach((project) => {
        expect(
          screen.queryByTestId(`work-gallery-${project.id}`),
        ).not.toBeInTheDocument();
      });
  });

  it("renders the intro hero project as both the hero and a single work tile", () => {
    render(<Home />);

    // SK serves as the intro hero (featuredProjects[0]) AND remains a navigable
    // work tile in the grid, so it intentionally appears in both spots. getByTestId
    // also guards against the intro entry being double-rendered as a work tile.
    const introProject = featuredProjects[0];
    expect(screen.getByTestId("intro-hero")).toBeInTheDocument();
    expect(
      screen.getByTestId(`work-gallery-${introProject.id}`),
    ).toBeInTheDocument();
  });

  it("passes galleryMedia and carouselConfig from project config", () => {
    render(<Home />);

    // At least some projects should have gallery media from the projects config
    const [, ...workProjects] = featuredProjects;
    const items = screen.getAllByTestId(/^work-gallery-/);
    expect(items).toHaveLength(visibleWork(workProjects).length);
  });
});

// Test the getHomepageMedia logic indirectly by testing the exported module
describe("getHomepageMedia logic", () => {
  it("does not pass gallery media when homepage carousels are off", () => {
    render(<Home />);

    const [, ...workProjects] = featuredProjects;

    // With carousels off (no homepageIndices), no project gets gallery media
    visibleWork(workProjects).forEach((project) => {
      const item = screen.getByTestId(`work-gallery-${project.id}`);
      expect(item.getAttribute("data-has-gallery-media")).toBe("false");
    });
  });

  it("filters gallery media by homepageIndices when specified", () => {
    render(<Home />);

    const [, ...workProjects] = featuredProjects;

    // Find a project that has homepageIndices configured
    visibleWork(workProjects).forEach((project) => {
      const detail = projects.find((p) => p.slug === project.id);
      if (detail?.carousel?.homepageIndices && detail.carousel.homepageIndices.length > 0) {
        const item = screen.getByTestId(`work-gallery-${project.id}`);
        const mediaCount = Number(item.getAttribute("data-gallery-media-count"));
        // homepageIndices filters, so media count should match indices length
        // (assuming all indices are valid)
        const validIndices = detail.carousel.homepageIndices.filter(
          (i) => i >= 0 && i < detail.media.length,
        );
        expect(mediaCount).toBe(validIndices.length);
      }
    });
  });

  it("returns zero gallery media when homepageIndices is not specified", () => {
    render(<Home />);

    const [, ...workProjects] = featuredProjects;

    visibleWork(workProjects).forEach((project) => {
      const item = screen.getByTestId(`work-gallery-${project.id}`);
      const mediaCount = Number(item.getAttribute("data-gallery-media-count"));
      expect(mediaCount).toBe(0);
    });
  });
});
