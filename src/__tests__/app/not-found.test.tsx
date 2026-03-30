import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound page", () => {
  it("renders the 'Page not found' heading", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  it("displays a descriptive message", () => {
    render(<NotFound />);

    expect(
      screen.getByText(/does not exist or has been moved/i),
    ).toBeInTheDocument();
  });

  it("renders a link back to home", () => {
    render(<NotFound />);

    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
