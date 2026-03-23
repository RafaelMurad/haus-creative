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

  it("should render the copyright text from siteConfig", () => {
    render(<Footer />);
    expect(screen.getByText(siteConfig.copyright)).toBeInTheDocument();
  });

  it("should render as a footer element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});
