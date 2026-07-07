import { getProjectBySlug, getAllProjectSlugs, projects } from "@/config/projects";

describe("getProjectBySlug", () => {
  it("should return a project that exists in the projects array", () => {
    const project = getProjectBySlug("ouronyx");
    expect(project).toBeDefined();
    expect(project?.id).toBe("ouronyx");
    expect(project?.title).toBe("OURONYX");
  });

  it("should return undefined for a non-existent slug", () => {
    const project = getProjectBySlug("does-not-exist");
    expect(project).toBeUndefined();
  });

  it("should return Marie Claire Arabia by slug", () => {
    const project = getProjectBySlug("marie-claire-arabia");
    expect(project).toBeDefined();
    expect(project?.client).toBe("Marie Claire Arabia");
    expect(project?.credits).toBeDefined();
    expect(project?.credits?.length).toBeGreaterThan(0);
  });

  it("should return undefined for removed gallery slugs", () => {
    expect(getProjectBySlug("gallery-1")).toBeUndefined();
    expect(getProjectBySlug("brand-identity")).toBeUndefined();
    expect(getProjectBySlug("motion-design")).toBeUndefined();
  });

  it("should return project with correct structure", () => {
    const project = getProjectBySlug("ysl");
    expect(project).toBeDefined();
    expect(project).toHaveProperty("id");
    expect(project).toHaveProperty("slug");
    expect(project).toHaveProperty("client");
    expect(project).toHaveProperty("title");
    expect(project).toHaveProperty("description");
    expect(project).toHaveProperty("media");
    expect(Array.isArray(project?.media)).toBe(true);
  });
});

describe("getAllProjectSlugs", () => {
  it("should return an array of strings", () => {
    const slugs = getAllProjectSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    slugs.forEach((slug) => {
      expect(typeof slug).toBe("string");
    });
  });

  it("should include all 10 named project slugs", () => {
    const slugs = getAllProjectSlugs();
    expect(slugs).toContain("ouronyx");
    expect(slugs).toContain("marie-claire-arabia");
    expect(slugs).toContain("ysl");
    expect(slugs).toContain("wao-cosmo");
    expect(slugs).toContain("vivara");
    expect(slugs).toContain("bucherer-summer");
    expect(slugs).toContain("sk");
    expect(slugs).toContain("bfj");
    expect(slugs).toContain("life");
    expect(slugs).toContain("bride-story");
  });

  it("should return exactly 11 project slugs", () => {
    const slugs = getAllProjectSlugs();
    expect(slugs.length).toBe(11);
  });

  it("should not contain old gallery slugs", () => {
    const slugs = getAllProjectSlugs();
    expect(slugs).not.toContain("gallery-1");
    expect(slugs).not.toContain("gallery-2");
    expect(slugs).not.toContain("brand-identity");
    expect(slugs).not.toContain("motion-design");
  });

  it("should not contain duplicates", () => {
    const slugs = getAllProjectSlugs();
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });
});

describe("projects", () => {
  it("should be a non-empty array of 11 projects", () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBe(11);
  });

  it("should have valid slugs on all projects", () => {
    projects.forEach((project) => {
      expect(project.slug).toBeTruthy();
      expect(project.slug).not.toContain(" ");
    });
  });

  it("should have media arrays on all projects", () => {
    projects.forEach((project) => {
      expect(Array.isArray(project.media)).toBe(true);
      expect(project.media.length).toBeGreaterThan(0);
    });
  });

  it("should reference .webp or .mp4 assets only", () => {
    projects.forEach((project) => {
      project.media.forEach((item) => {
        const ext = item.desktop.split(".").pop();
        expect(["webp", "mp4", "jpg"]).toContain(ext);
      });
    });
  });

  describe("carousel config", () => {
    it("every project has a carousel config", () => {
      projects.forEach((project) => {
        expect(project.carousel).toBeDefined();
        expect(project.carousel!.animation).toBeDefined();
      });
    });

    it("video-only projects have no autoAdvanceTime", () => {
      const videoProjects = projects.filter(
        (p) => p.slug === "wao-cosmo" || p.slug === "bucherer-summer"
      );
      expect(videoProjects).toHaveLength(2);
      videoProjects.forEach((p) => {
        expect(p.carousel!.autoAdvanceTime).toBeUndefined();
      });
    });

    it("SK uses slide animation for treadmill effect", () => {
      const sk = projects.find((p) => p.slug === "sk");
      expect(sk!.carousel!.animation).toBe("slide");
      expect(sk!.carousel!.autoAdvanceTime).toBe(2500);
    });

    it("YSL uses fast none animation (800ms)", () => {
      const ysl = projects.find((p) => p.slug === "ysl");
      expect(ysl!.carousel!.animation).toBe("none");
      expect(ysl!.carousel!.autoAdvanceTime).toBe(800);
    });

    it("Life uses slow fade animation (3000ms)", () => {
      const life = projects.find((p) => p.slug === "life");
      expect(life!.carousel!.animation).toBe("fade");
      expect(life!.carousel!.autoAdvanceTime).toBe(3000);
    });
  });
});
