import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Logo } from "@/components/ui/Logo";

describe("Logo", () => {
  it("should render an SVG element", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have an accessible label", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute(
      "aria-label",
      "STUDIO HAUS CREATIVE DIRECTION DESIGN"
    );
  });

  it("should apply custom className", () => {
    const { container } = render(<Logo className="test-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("test-class");
  });

  it("should use default empty className when none provided", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("class", "");
  });
});
