import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CTALinks } from "@/components/home/CTALinks";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

const mockLinks = [
  { title: "View all works", href: "/work", variant: "default" as const },
  { title: "Work with us", href: "/contact", variant: "highlight" as const },
];

describe("CTALinks", () => {
  it("should render all provided links", () => {
    render(<CTALinks links={mockLinks} />);
    expect(screen.getByText("View all works")).toBeInTheDocument();
    expect(screen.getByText("Work with us")).toBeInTheDocument();
  });

  it("should link to the correct hrefs", () => {
    render(<CTALinks links={mockLinks} />);
    const workLink = screen.getByText("View all works").closest("a");
    const contactLink = screen.getByText("Work with us").closest("a");

    expect(workLink).toHaveAttribute("href", "/work");
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("should apply highlight background to highlight variant", () => {
    const { container } = render(<CTALinks links={mockLinks} />);
    const links = container.querySelectorAll("a");

    // Default link should have grey background class
    expect(links[0].className).toContain("bg-[#F3F3F3]");
    // Highlight link should have yellow background class
    expect(links[1].className).toContain("bg-[#FFF056]");
  });

  it("should render within a section element", () => {
    const { container } = render(<CTALinks links={mockLinks} />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});
