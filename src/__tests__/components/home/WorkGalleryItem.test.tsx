import { render, screen } from "@testing-library/react";
import { WorkGalleryItem } from "@/components/home/WorkGalleryItem";
import type { Project } from "@/config/site";

// Mock hooks and components to isolate WorkGalleryItem
jest.mock("@/hooks/useSlideInOnView", () => ({
  useSlideInOnView: () => ({
    ref: { current: null },
    isVisible: false,
  }),
}));

jest.mock("@/components/ui", () => ({
  MediaRenderer: ({ media, className }: { media: { src: string }; className?: string }) => (
    <div data-testid="media-renderer" data-src={media.src} className={className} />
  ),
}));

describe("WorkGalleryItem", () => {
  const mockProject: Project = {
    id: "test-project",
    title: "Test Project",
    subtitle: "A test project",
    href: "/work/test-project",
    media: {
      type: "image",
      src: "/assets/projects/test.jpg",
      alt: "Test project image",
    },
  };

  it("renders a link to the project page", () => {
    render(<WorkGalleryItem project={mockProject} />);
    const link = screen.getByRole("link", { name: /view test project project/i });
    expect(link).toHaveAttribute("href", "/work/test-project");
  });

  it("renders the project title", () => {
    render(<WorkGalleryItem project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders the MediaRenderer with project media", () => {
    render(<WorkGalleryItem project={mockProject} />);
    const renderer = screen.getByTestId("media-renderer");
    expect(renderer).toHaveAttribute("data-src", "/assets/projects/test.jpg");
  });

  it("renders within a full-screen section", () => {
    const { container } = render(<WorkGalleryItem project={mockProject} />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("h-screen");
  });
});
