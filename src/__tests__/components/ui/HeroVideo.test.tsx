import { render, act } from "@testing-library/react";
import { HeroVideo } from "@/components/ui/HeroVideo";

/**
 * Replaces the jest.setup.js matchMedia stub with a controllable mock so
 * tests can flip the breakpoint and assert the source swap.
 */
function mockMatchMedia(initialMatches: boolean) {
  let listener: ((event: { matches: boolean }) => void) | null = null;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: initialMatches,
    media: query,
    addEventListener: (_: string, cb: (event: { matches: boolean }) => void) => {
      listener = cb;
    },
    removeEventListener: jest.fn(),
  }));
  return {
    fire(matches: boolean) {
      act(() => listener?.({ matches }));
    },
  };
}

describe("HeroVideo", () => {
  it("resolves the desktop source on desktop viewports", () => {
    mockMatchMedia(false);
    const { container } = render(
      <HeroVideo desktop="/d.mp4" mobile="/m.mp4" />,
    );

    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );
  });

  it("resolves the mobile source on mobile viewports", () => {
    mockMatchMedia(true);
    const { container } = render(
      <HeroVideo desktop="/d.mp4" mobile="/m.mp4" />,
    );

    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/m.mp4",
    );
  });

  it("falls back to the desktop source on mobile when no mobile file exists", () => {
    mockMatchMedia(true);
    const { container } = render(<HeroVideo desktop="/d.mp4" />);

    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );
  });

  it("swaps the source when the viewport crosses the breakpoint", () => {
    const media = mockMatchMedia(false);
    const { container } = render(
      <HeroVideo desktop="/d.mp4" mobile="/m.mp4" />,
    );
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );

    media.fire(true);
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/m.mp4",
    );

    media.fire(false);
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );
  });
});
