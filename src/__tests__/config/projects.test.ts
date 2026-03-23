import { getProjectBySlug, getAllProjectSlugs, projects } from "@/config/projects";

describe("getProjectBySlug", () => {
  it("should return a project that exists in the projects array", () => {
    const project = getProjectBySlug("ouronyx");
    expect(project).toBeDefined();
    expect(project?.id).toBe("ouronyx");
    expect(project?.title).toBe("Ouronyx Digital Experience");
  });

  it("should return undefined for a non-existent slug", () => {
    const project = getProjectBySlug("does-not-exist");
    expect(project).toBeUndefined();
  });

  it("should return a derived project from featured projects", () => {
    // gallery-1 is in featuredProjects but not in the explicit projects array
    const project = getProjectBySlug("gallery-1");
    expect(project).toBeDefined();
    expect(project?.title).toBe("Gallery One");
  });

  it("should prefer explicit projects over derived featured projects", () => {
    // ouronyx exists in both projects array and featuredProjects
    const project = getProjectBySlug("ouronyx");
    expect(project).toBeDefined();
    expect(project?.description).toBe(
      "A premium digital experience showcasing fine jewelry through immersive visuals and seamless interactions."
    );
  });

  it("should return project with correct structure", () => {
    const project = getProjectBySlug("brand-identity");
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

  it("should include slugs from explicit projects", () => {
    const slugs = getAllProjectSlugs();
    expect(slugs).toContain("ouronyx");
    expect(slugs).toContain("brand-identity");
    expect(slugs).toContain("motion-design");
  });

  it("should include slugs derived from featured projects", () => {
    const slugs = getAllProjectSlugs();
    expect(slugs).toContain("gallery-1");
    expect(slugs).toContain("gallery-2");
  });

  it("should not contain duplicates", () => {
    const slugs = getAllProjectSlugs();
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });
});

describe("projects", () => {
  it("should be a non-empty array", () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
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
});
