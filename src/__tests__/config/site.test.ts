import { getMediaType, createMediaSource } from "@/config/site";

describe("getMediaType", () => {
  it("should return 'video' for mp4 files", () => {
    expect(getMediaType("/assets/video.mp4")).toBe("video");
  });

  it("should return 'video' for webm files", () => {
    expect(getMediaType("/assets/video.webm")).toBe("video");
  });

  it("should return 'video' for ogg files", () => {
    expect(getMediaType("/assets/video.ogg")).toBe("video");
  });

  it("should return 'video' for mov files", () => {
    expect(getMediaType("/assets/video.mov")).toBe("video");
  });

  it("should return 'gif' for gif files", () => {
    expect(getMediaType("/assets/animation.gif")).toBe("gif");
  });

  it("should return 'image' for png files", () => {
    expect(getMediaType("/assets/photo.png")).toBe("image");
  });

  it("should return 'image' for jpg files", () => {
    expect(getMediaType("/assets/photo.jpg")).toBe("image");
  });

  it("should return 'image' for unknown extensions", () => {
    expect(getMediaType("/assets/file.unknown")).toBe("image");
  });

  it("should return 'image' for files without extension", () => {
    expect(getMediaType("/assets/noextension")).toBe("image");
  });
});

describe("createMediaSource", () => {
  it("should return existing media if already provided", () => {
    const media = {
      type: "video" as const,
      src: "/test.mp4",
      autoPlay: true,
      loop: true,
      muted: true,
    };
    const result = createMediaSource({ media });
    expect(result).toBe(media);
  });

  it("should create video media source from legacy videoSrc", () => {
    const result = createMediaSource({
      videoSrc: "/assets/video.mp4",
      videoSrcMobile: "/assets/video-mobile.mp4",
      posterSrc: "/assets/poster.png",
    });

    expect(result.type).toBe("video");
    expect(result.src).toBe("/assets/video.mp4");
    expect(result.srcMobile).toBe("/assets/video-mobile.mp4");
    expect(result.poster).toBe("/assets/poster.png");
    expect(result.autoPlay).toBe(true);
    expect(result.loop).toBe(true);
    expect(result.muted).toBe(true);
  });

  it("should create image media source from legacy imageSrc", () => {
    const result = createMediaSource({
      imageSrc: "/assets/photo.png",
      title: "Test Project",
    });

    expect(result.type).toBe("image");
    expect(result.src).toBe("/assets/photo.png");
    expect(result.alt).toBe("Test Project");
  });

  it("should create gif media source from legacy imageSrc with gif extension", () => {
    const result = createMediaSource({
      imageSrc: "/assets/animation.gif",
      title: "Animated",
    });

    expect(result.type).toBe("gif");
    expect(result.src).toBe("/assets/animation.gif");
    expect(result.autoPlay).toBe(true);
    expect(result.loop).toBe(true);
  });

  it("should return fallback media source when no media data is provided", () => {
    const result = createMediaSource({});

    expect(result.type).toBe("image");
    expect(result.src).toBe("/images/placeholder.jpg");
    expect(result.alt).toBe("Project");
  });

  it("should use title for fallback alt text", () => {
    const result = createMediaSource({ title: "My Project" });

    expect(result.alt).toBe("My Project");
  });
});
