import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/contact/page";
import { siteConfig } from "@/config/site";

describe("Contact page", () => {
  it("renders the Contact heading", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { name: /^contact$/i }),
    ).toBeInTheDocument();
  });

  it("renders the New Business heading", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { name: /new business/i }),
    ).toBeInTheDocument();
  });

  it("renders the For Talent heading", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { name: /for talent/i }),
    ).toBeInTheDocument();
  });

  it("displays the contact email from siteConfig", () => {
    render(<ContactPage />);

    const emailLinks = screen.getAllByText(siteConfig.email);
    expect(emailLinks.length).toBeGreaterThan(0);
  });

  it("includes mailto links for the email", () => {
    render(<ContactPage />);

    const links = screen.getAllByRole("link");
    const mailtoLinks = links.filter((link) =>
      link.getAttribute("href")?.startsWith("mailto:"),
    );
    expect(mailtoLinks.length).toBeGreaterThan(0);
    expect(mailtoLinks[0]).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}`,
    );
  });

  it("renders social links from siteConfig", () => {
    render(<ContactPage />);

    siteConfig.socialLinks.forEach((link) => {
      const socialLinks = screen.getAllByText(link.title);
      expect(socialLinks.length).toBeGreaterThan(0);
    });
  });

  it("describes global operations with London and São Paulo hubs", () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/operate globally with hubs in london/i),
    ).toBeInTheDocument();
  });
});
