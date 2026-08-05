import { render, screen } from "@testing-library/react";
import WorkPage from "@/app/work/page";
import { featuredProjects } from "@/config/site";
import { projects } from "@/config/projects";

// Mock child components to isolate the page logic
jest.mock("@/components/home", () => ({
  WorkGalleryItem: ({
    project,
  }: {
    project: { id: string; title: string };
  }) => <div data-testid={`gallery-${project.id}`}>{project.title}</div>,
}));

const hiddenIds = new Set(
  projects.filter((p) => p.hidden).map((p) => p.slug),
);
const visibleWork = (list: typeof featuredProjects) =>
  list.filter((p) => !hiddenIds.has(p.id));

describe("Work page", () => {
  it("renders WorkGalleryItem for each project except the first (intro)", () => {
    render(<WorkPage />);

    // First project is the intro hero, excluded from work page
    const [, ...workProjects] = featuredProjects;

    visibleWork(workProjects).forEach((project) => {
      expect(
        screen.getByTestId(`gallery-${project.id}`),
      ).toBeInTheDocument();
    });
    // Hidden projects (YSL, deactivated 2026-08-04) render no tile here either.
    workProjects
      .filter((p) => hiddenIds.has(p.id))
      .forEach((project) => {
        expect(
          screen.queryByTestId(`gallery-${project.id}`),
        ).not.toBeInTheDocument();
      });
  });

  it("excludes the intro entry, rendering the intro project only once", () => {
    render(<WorkPage />);

    // The work page drops featuredProjects[0] (the intro hero, SK). SK still
    // appears once via the numbered work list, so exactly one gallery-sk tile is
    // expected — guarding against the intro entry being rendered a second time.
    const introProject = featuredProjects[0];
    expect(
      screen.getAllByTestId(`gallery-${introProject.id}`),
    ).toHaveLength(1);
  });

  it("renders the correct number of gallery items", () => {
    render(<WorkPage />);

    const [, ...workProjects] = featuredProjects;
    const items = screen.getAllByTestId(/^gallery-/);
    expect(items).toHaveLength(visibleWork(workProjects).length);
  });
});
