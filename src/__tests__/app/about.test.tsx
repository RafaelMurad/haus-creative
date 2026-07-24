import { render, screen } from "@testing-library/react";
import About from "@/app/about/page";
import { siteConfig } from "@/config/site";

// next/image is auto-mocked by next/jest; next/link likewise
describe("About page", () => {
  it("renders the 'About Us' heading", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /about us/i }),
    ).toBeInTheDocument();
  });

  it("displays the studio introduction paragraph", () => {
    render(<About />);

    expect(
      screen.getByText(/independent creative consultancy/i),
    ).toBeInTheDocument();
  });

  it("renders a Contact section heading", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /contact/i }),
    ).toBeInTheDocument();
  });

  it("displays the contact email from siteConfig", () => {
    render(<About />);

    const emailLinks = screen.getAllByText(siteConfig.email);
    expect(emailLinks.length).toBeGreaterThan(0);

    // At least one should be a mailto link
    const mailtoLink = emailLinks.find(
      (el) => el.closest("a")?.getAttribute("href") === `mailto:${siteConfig.email}`,
    );
    expect(mailtoLink).toBeDefined();
  });

  it("renders social links from siteConfig", () => {
    render(<About />);

    siteConfig.socialLinks.forEach((link) => {
      const socialLinks = screen.getAllByText(link.title);
      expect(socialLinks.length).toBeGreaterThan(0);
    });
  });

  it("renders the about portrait image", () => {
    render(<About />);

    const images = screen.getAllByRole("img");
    const portraitImages = images.filter(
      (img) => img.getAttribute("alt") === "Studio Haus portrait",
    );
    // Mobile + desktop images
    expect(portraitImages.length).toBeGreaterThanOrEqual(1);
  });
});
