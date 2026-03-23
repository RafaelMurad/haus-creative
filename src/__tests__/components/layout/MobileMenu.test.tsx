import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { siteConfig } from "@/config/site";

describe("MobileMenu", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it("renders all main menu navigation links", () => {
    render(<MobileMenu isOpen={true} onClose={onClose} />);

    siteConfig.mainMenu.forEach((link) => {
      const el = screen.getByText(link.title);
      expect(el).toBeInTheDocument();
      expect(el.closest("a")).toHaveAttribute("href", link.href);
    });
  });

  it("renders the contact email from siteConfig", () => {
    render(<MobileMenu isOpen={true} onClose={onClose} />);

    const emailLink = screen.getByText(siteConfig.email);
    expect(emailLink).toHaveAttribute("href", `mailto:${siteConfig.email}`);
  });

  it("renders all social links from siteConfig", () => {
    render(<MobileMenu isOpen={true} onClose={onClose} />);

    siteConfig.socialLinks.forEach((social) => {
      const el = screen.getByText(social.title);
      expect(el).toHaveAttribute("href", social.href);
      expect(el).toHaveAttribute("target", "_blank");
      expect(el).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("is visually hidden when isOpen is false", () => {
    const { container } = render(
      <MobileMenu isOpen={false} onClose={onClose} />
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay.className).toContain("opacity-0");
    expect(overlay.className).toContain("pointer-events-none");
  });

  it("is visible when isOpen is true", () => {
    const { container } = render(
      <MobileMenu isOpen={true} onClose={onClose} />
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute("aria-hidden", "false");
    expect(overlay.className).toContain("opacity-100");
    expect(overlay.className).toContain("pointer-events-auto");
  });

  it("calls onClose when a nav link is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileMenu isOpen={true} onClose={onClose} />);

    const firstLink = screen.getByText(siteConfig.mainMenu[0].title);
    await user.click(firstLink);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
