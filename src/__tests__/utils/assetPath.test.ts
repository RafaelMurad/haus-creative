import { getAssetPath, getGalleryAssets, titleToFileName } from "../../utils/assetPath";

describe("getAssetPath", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalEnv !== undefined) {
      (process.env as { NODE_ENV?: string }).NODE_ENV = originalEnv;
    }
  });

  it("returns correct path for gallery and filename", () => {
    const result = getAssetPath("mc-arabia", "image.jpg");
    expect(result).toBe("/assets/mc-arabia/image.jpg");
  });

  it("sanitizes gallery ID with special characters", () => {
    const result = getAssetPath("mc@#$%arabia", "image.jpg");
    expect(result).toBe("/assets/mcarabia/image.jpg");
  });

  it("converts gallery ID to lowercase", () => {
    const result = getAssetPath("MC-Arabia", "image.jpg");
    expect(result).toBe("/assets/mc-arabia/image.jpg");
  });

  it("handles gallery ID with hyphens and underscores", () => {
    const result = getAssetPath("gallery-one_test", "image.jpg");
    expect(result).toBe("/assets/gallery-one_test/image.jpg");
  });

  it("handles various file extensions", () => {
    expect(getAssetPath("mc-arabia", "video.mp4")).toBe("/assets/mc-arabia/video.mp4");
    expect(getAssetPath("mc-arabia", "image.png")).toBe("/assets/mc-arabia/image.png");
    expect(getAssetPath("mc-arabia", "animation.gif")).toBe("/assets/mc-arabia/animation.gif");
  });

  it("logs debug message in development mode", () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation();
    (process.env as { NODE_ENV?: string }).NODE_ENV = "development";

    getAssetPath("mc-arabia", "image.jpg");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Asset path generated: /assets/mc-arabia/image.jpg"
    );

    consoleSpy.mockRestore();
  });

  it("does not log in production mode", () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation();
    (process.env as { NODE_ENV?: string }).NODE_ENV = "production";

    getAssetPath("mc-arabia", "image.jpg");

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe("getGalleryAssets", () => {
  it("returns an empty array (placeholder implementation)", async () => {
    const result = await getGalleryAssets("mc-arabia");

    expect(result).toEqual([]);
  });

  it("accepts any gallery ID without error", async () => {
    const result = await getGalleryAssets("some-gallery-id");

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});

describe("titleToFileName", () => {
  it("converts title to lowercase", () => {
    expect(titleToFileName("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(titleToFileName("my project title")).toBe("my-project-title");
  });

  it("removes special characters", () => {
    expect(titleToFileName("Project: Test!")).toBe("project-test");
  });

  it("handles multiple spaces", () => {
    expect(titleToFileName("hello   world")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(titleToFileName("")).toBe("");
  });

  it("preserves numbers", () => {
    expect(titleToFileName("Project 2024")).toBe("project-2024");
  });

  it("handles complex titles", () => {
    expect(titleToFileName("My Project #1 - The Beginning!")).toBe(
      "my-project-1---the-beginning"
    );
  });
});
