import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoHero } from "@/components/home/VideoHero";

// Mock HTMLMediaElement.play
beforeAll(() => {
  HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
});

describe("VideoHero", () => {
  const defaultProps = {
    videoSrc: "/video/desktop.mp4",
  };

  it("renders a video element with the desktop source", () => {
    const { container } = render(<VideoHero {...defaultProps} />);
    const sources = container.querySelectorAll("source");
    expect(sources).toHaveLength(1);
    expect(sources[0]).toHaveAttribute("src", "/video/desktop.mp4");
  });

  it("renders mobile source when videoSrcMobile is provided", () => {
    const { container } = render(
      <VideoHero {...defaultProps} videoSrcMobile="/video/mobile.mp4" />
    );
    const sources = container.querySelectorAll("source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("src", "/video/mobile.mp4");
  });

  it("applies poster image when provided", () => {
    const { container } = render(
      <VideoHero {...defaultProps} posterSrc="/img/poster.jpg" />
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("poster", "/img/poster.jpg");
  });

  it("shows play button when fullVideoSrc is provided", () => {
    render(<VideoHero {...defaultProps} fullVideoSrc="/video/full.mp4" />);
    expect(
      screen.getByRole("button", { name: /view full video/i })
    ).toBeInTheDocument();
  });

  it("does not show play button when fullVideoSrc is not provided", () => {
    render(<VideoHero {...defaultProps} />);
    expect(
      screen.queryByRole("button", { name: /view full video/i })
    ).not.toBeInTheDocument();
  });

  it("plays full video when play button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <VideoHero {...defaultProps} fullVideoSrc="/video/full.mp4" />
    );

    const playButton = screen.getByRole("button", { name: /view full video/i });
    await user.click(playButton);

    // After clicking, the play button should disappear (isPlaying = true)
    expect(
      screen.queryByRole("button", { name: /view full video/i })
    ).not.toBeInTheDocument();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("sets data-playing attribute on the section", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoHero {...defaultProps} fullVideoSrc="/video/full.mp4" />
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("data-playing", "false");

    await user.click(screen.getByRole("button", { name: /view full video/i }));
    expect(section).toHaveAttribute("data-playing", "true");
  });
});
