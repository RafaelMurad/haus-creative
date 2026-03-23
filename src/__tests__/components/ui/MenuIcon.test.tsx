import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MenuIcon } from "@/components/ui/MenuIcon";

describe("MenuIcon", () => {
  it("should render an SVG element", () => {
    const { container } = render(<MenuIcon isOpen={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should be hidden from screen readers", () => {
    const { container } = render(<MenuIcon isOpen={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("should apply rotation classes when open", () => {
    const { container } = render(<MenuIcon isOpen={true} />);
    const paths = container.querySelectorAll("path");

    // Top line should have rotate-45
    expect(paths[0].getAttribute("class")).toContain("rotate-45");
    // Middle line should be hidden (opacity-0)
    expect(paths[1].getAttribute("class")).toContain("opacity-0");
    // Bottom line should have -rotate-45
    expect(paths[2].getAttribute("class")).toContain("-rotate-45");
  });

  it("should not have rotation classes when closed", () => {
    const { container } = render(<MenuIcon isOpen={false} />);
    const paths = container.querySelectorAll("path");

    expect(paths[0].getAttribute("class")).not.toContain("rotate-45");
    expect(paths[1].getAttribute("class")).toContain("opacity-100");
    expect(paths[2].getAttribute("class")).not.toContain("-rotate-45");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <MenuIcon isOpen={false} className="custom-class" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("custom-class");
  });
});
