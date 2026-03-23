import { SIMPLE_ANIMATIONS, getSimpleAnimation } from "@/utils/animationConfigs";
import type { SimpleAnimationType } from "@/utils/animationConfigs";

describe("SIMPLE_ANIMATIONS", () => {
  it("should have all expected animation types", () => {
    const expectedTypes: SimpleAnimationType[] = [
      "none",
      "fade",
      "slide",
      "slideUp",
      "scale",
      "blur",
    ];

    expectedTypes.forEach((type) => {
      expect(SIMPLE_ANIMATIONS[type]).toBeDefined();
      expect(SIMPLE_ANIMATIONS[type].type).toBe(type);
    });
  });

  it("should have valid duration values for all animations", () => {
    Object.values(SIMPLE_ANIMATIONS).forEach((config) => {
      expect(typeof config.duration).toBe("number");
      expect(config.duration).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have CSS easing strings for all animations", () => {
    Object.values(SIMPLE_ANIMATIONS).forEach((config) => {
      expect(typeof config.easing).toBe("string");
      expect(config.easing.length).toBeGreaterThan(0);
    });
  });

  it("should have zero duration for 'none' animation", () => {
    expect(SIMPLE_ANIMATIONS.none.duration).toBe(0);
  });
});

describe("getSimpleAnimation", () => {
  it("should return the correct animation config for a valid type", () => {
    const fadeConfig = getSimpleAnimation("fade");
    expect(fadeConfig).toBe(SIMPLE_ANIMATIONS.fade);
    expect(fadeConfig.type).toBe("fade");
  });

  it("should return fade as fallback for an unknown type", () => {
    const fallback = getSimpleAnimation("nonexistent");
    expect(fallback).toBe(SIMPLE_ANIMATIONS.fade);
  });

  it("should return correct config for each animation type", () => {
    expect(getSimpleAnimation("none")).toBe(SIMPLE_ANIMATIONS.none);
    expect(getSimpleAnimation("slide")).toBe(SIMPLE_ANIMATIONS.slide);
    expect(getSimpleAnimation("slideUp")).toBe(SIMPLE_ANIMATIONS.slideUp);
    expect(getSimpleAnimation("scale")).toBe(SIMPLE_ANIMATIONS.scale);
    expect(getSimpleAnimation("blur")).toBe(SIMPLE_ANIMATIONS.blur);
  });
});
