import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/config/site";

// Mock child components to isolate Header behaviour
jest.mock("@/components/layout/MobileMenu", () => ({
  MobileMenu: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="mobile-menu" data-open={isOpen}>
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

jest.mock("@/components/ui", () => ({
  Logo: ({ className }: { className?: string }) => (
    <svg data-testid="logo" className={className} />
  ),
  MenuIcon: ({ isOpen, className }: { isOpen: boolean; className?: string }) => (
    <span data-testid="menu-icon" data-open={isOpen} className={className} />
  ),
}));

jest.mock("@/hooks/useScrollDirection", () => ({
  useScrollDirection: () => ({ isVisible: true }),
}));

jest.mock("@/hooks/useBodyScrollLock", () => ({
  useBodyScrollLock: jest.fn(),
}));

describe("Header", () => {
  it("renders the logo linking to home", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: "" });
    expect(logoLink).toHaveAttribute("href", "/");
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders desktop navigation with all main menu items", () => {
    render(<Header />);
    siteConfig.mainMenu.forEach((link) => {
      expect(screen.getByText(link.title)).toBeInTheDocument();
    });
  });

  it("renders the mobile menu button with correct aria-label", () => {
    render(<Header />);
    const menuButton = screen.getByRole("button", { name: "Open menu" });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles mobile menu when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    await user.click(menuButton);

    // After click, menu should be open
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toHaveAttribute("data-open", "true");
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("closes menu when MobileMenu onClose fires", async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Open the menu
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByTestId("mobile-menu")).toHaveAttribute("data-open", "true");

    // Click the mock close button inside MobileMenu
    await user.click(screen.getByText("close"));
    expect(screen.getByTestId("mobile-menu")).toHaveAttribute("data-open", "false");
  });
});
