import { render, screen } from "@testing-library/react";
import WorkPage from "@/app/work/page";
import { featuredProjects } from "@/config/site";

// Mock child components to isolate the page logic
jest.mock("@/components/home", () => ({
  WorkGalleryItem: ({
    project,
  }: {
    project: { id: string; title: string };
  }) => <div data-testid={`gallery-${project.id}`}>{project.title}</div>,
}));

describe("Work page", () => {
  it("renders WorkGalleryItem for each project except the first (intro)", () => {
    render(<WorkPage />);

    // First project is the intro hero, excluded from work page
    const [, ...workProjects] = featuredProjects;

    workProjects.forEach((project) => {
      expect(
        screen.getByTestId(`gallery-${project.id}`),
      ).toBeInTheDocument();
    });
  });

  it("does not render the first (intro) project", () => {
    render(<WorkPage />);

    const introProject = featuredProjects[0];
    expect(
      screen.queryByTestId(`gallery-${introProject.id}`),
    ).not.toBeInTheDocument();
  });

  it("renders the correct number of gallery items", () => {
    render(<WorkPage />);

    const [, ...workProjects] = featuredProjects;
    const items = screen.getAllByTestId(/^gallery-/);
    expect(items).toHaveLength(workProjects.length);
  });
});
