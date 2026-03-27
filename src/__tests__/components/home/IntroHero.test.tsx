import { render } from "@testing-library/react";
import { IntroHero } from "@/components/home/IntroHero";
import type { MediaSource } from "@/config/site";

// Mock MediaRenderer to isolate IntroHero tests
jest.mock("@/components/ui", () => ({
  MediaRenderer: ({ media, className, priority }: {
    media: MediaSource;
    className?: string;
    priority?: boolean;
  }) => (
    <div
      data-testid="media-renderer"
      data-src={media.src}
      data-type={media.type}
      data-priority={priority}
      className={className}
    />
  ),
}));

describe("IntroHero", () => {
  const mockMedia: MediaSource = {
    type: "image",
    src: "/assets/hero.jpg",
    alt: "Hero image",
  };

  it("renders a full-viewport section using dynamic viewport height", () => {
    const { container } = render(<IntroHero media={mockMedia} />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section?.className).toContain("h-dvh");
  });

  it("passes media and priority to MediaRenderer", () => {
    const { getByTestId } = render(<IntroHero media={mockMedia} />);
    const renderer = getByTestId("media-renderer");
    expect(renderer).toHaveAttribute("data-src", "/assets/hero.jpg");
    expect(renderer).toHaveAttribute("data-type", "image");
    expect(renderer).toHaveAttribute("data-priority", "true");
  });
});
