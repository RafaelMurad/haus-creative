import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { MediaSource } from "@/config/site";

// Mock next/image
jest.mock("next/image", () => {
  return function MockImage(props: Record<string, unknown>) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
});

describe("MediaRenderer", () => {
  describe("video rendering", () => {
    const videoMedia: MediaSource = {
      type: "video",
      src: "/assets/video.mp4",
      poster: "/assets/poster.png",
      autoPlay: true,
      loop: true,
      muted: true,
    };

    it("should render a video element for video type", () => {
      const { container } = render(<MediaRenderer media={videoMedia} />);
      const video = container.querySelector("video");
      expect(video).toBeInTheDocument();
    });

    it("should set poster attribute on video", () => {
      const { container } = render(<MediaRenderer media={videoMedia} />);
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("poster", "/assets/poster.png");
    });

    it("should include source element with correct src", () => {
      const { container } = render(<MediaRenderer media={videoMedia} />);
      const source = container.querySelector("source");
      expect(source).toHaveAttribute("src", "/assets/video.mp4");
    });

    it("should add mobile source when srcMobile is provided", () => {
      const mobileVideoMedia: MediaSource = {
        ...videoMedia,
        srcMobile: "/assets/video-mobile.mp4",
      };
      const { container } = render(
        <MediaRenderer media={mobileVideoMedia} />
      );
      const sources = container.querySelectorAll("source");
      expect(sources.length).toBe(2);
      expect(sources[0]).toHaveAttribute("src", "/assets/video-mobile.mp4");
    });

    it("should preload poster when priority is true", () => {
      const { container } = render(
        <MediaRenderer media={videoMedia} priority />
      );
      const link = container.querySelector('link[rel="preload"]');
      expect(link).toBeInTheDocument();
    });
  });

  describe("image rendering", () => {
    const imageMedia: MediaSource = {
      type: "image",
      src: "/assets/photo.png",
      alt: "Test image",
    };

    it("should render an image for image type", () => {
      render(<MediaRenderer media={imageMedia} />);
      const img = screen.getByAltText("Test image");
      expect(img).toBeInTheDocument();
    });

    it("should use empty alt text when alt is not provided", () => {
      const noAltMedia: MediaSource = {
        type: "image",
        src: "/assets/photo.png",
      };
      render(<MediaRenderer media={noAltMedia} />);
      const img = screen.getByAltText("");
      expect(img).toBeInTheDocument();
    });

    it("should render a picture element when srcMobile is provided", () => {
      const responsiveMedia: MediaSource = {
        type: "image",
        src: "/assets/photo.png",
        srcMobile: "/assets/photo-mobile.png",
        alt: "Responsive image",
      };
      const { container } = render(
        <MediaRenderer media={responsiveMedia} />
      );
      expect(container.querySelector("picture")).toBeInTheDocument();
    });

    it("should render with fill by default", () => {
      render(<MediaRenderer media={imageMedia} />);
      const img = screen.getByAltText("Test image");
      expect(img).toBeInTheDocument();
    });

    it("should render with explicit dimensions when fill is false", () => {
      render(<MediaRenderer media={imageMedia} fill={false} />);
      const img = screen.getByAltText("Test image");
      expect(img).toBeInTheDocument();
    });
  });

  describe("gif rendering", () => {
    const gifMedia: MediaSource = {
      type: "gif",
      src: "/assets/animation.gif",
      alt: "Test animation",
    };

    it("should render a gif image with unoptimized flag", () => {
      render(<MediaRenderer media={gifMedia} />);
      const img = screen.getByAltText("Test animation");
      expect(img).toBeInTheDocument();
    });

    it("should render gif with fill by default", () => {
      render(<MediaRenderer media={gifMedia} />);
      const img = screen.getByAltText("Test animation");
      expect(img).toBeInTheDocument();
    });

    it("should render gif without fill when fill is false", () => {
      render(<MediaRenderer media={gifMedia} fill={false} />);
      const img = screen.getByAltText("Test animation");
      expect(img).toBeInTheDocument();
    });
  });

  describe("className handling", () => {
    it("should apply className to the rendered element", () => {
      const media: MediaSource = {
        type: "image",
        src: "/assets/photo.png",
        alt: "Test",
      };
      render(<MediaRenderer media={media} className="custom-class" />);
      const img = screen.getByAltText("Test");
      expect(img).toHaveClass("custom-class");
    });
  });
});
