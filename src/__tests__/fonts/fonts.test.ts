import { inter } from "@/fonts/fonts";

describe("fonts", () => {
  it("exports inter with a CSS variable name", () => {
    expect(inter.variable).toBe("--font-inter");
  });

  it("provides a system font stack as fallback", () => {
    expect(inter.style.fontFamily).toContain("system-ui");
    expect(inter.style.fontFamily).toContain("-apple-system");
    expect(inter.style.fontFamily).toContain("sans-serif");
  });
});
