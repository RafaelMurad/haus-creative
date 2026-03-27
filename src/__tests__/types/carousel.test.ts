import type { CarouselConfig } from "@/types/carousel";

describe("CarouselConfig type", () => {
  it("accepts a minimal config with only animation", () => {
    const config: CarouselConfig = {
      animation: "fade",
    };
    expect(config.animation).toBe("fade");
    expect(config.autoAdvanceTime).toBeUndefined();
    expect(config.homepageIndices).toBeUndefined();
  });

  it("accepts a full config with all fields", () => {
    const config: CarouselConfig = {
      animation: "slide",
      autoAdvanceTime: 2500,
      homepageIndices: [0, 1, 5],
    };
    expect(config.animation).toBe("slide");
    expect(config.autoAdvanceTime).toBe(2500);
    expect(config.homepageIndices).toEqual([0, 1, 5]);
  });

  it("accepts all six animation types", () => {
    const types = ["none", "fade", "slide", "slideUp", "scale", "blur"] as const;
    types.forEach((type) => {
      const config: CarouselConfig = { animation: type };
      expect(config.animation).toBe(type);
    });
  });
});
