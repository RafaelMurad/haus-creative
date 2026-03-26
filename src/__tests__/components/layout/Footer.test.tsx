import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

describe("Footer", () => {
  it("should render the contact email from siteConfig", () => {
    render(<Footer />);
    const emailLink = screen.getByText(siteConfig.email);
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", `mailto:${siteConfig.email}`);
  });

  it("should render social links from siteConfig", () => {
    render(<Footer />);
    siteConfig.socialLinks.forEach((link) => {
      const socialLink = screen.getByText(link.title);
      expect(socialLink).toBeInTheDocument();
      expect(socialLink).toHaveAttribute("href", link.href);
      expect(socialLink).toHaveAttribute("target", "_blank");
      expect(socialLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("should render as a footer element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});
