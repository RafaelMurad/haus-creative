import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "@/app/error";

describe("ErrorPage", () => {
  const mockError = new Error("Test error") as Error & { digest?: string };
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockReset.mockClear();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders 'Something went wrong' heading", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(
      screen.getByRole("heading", { name: /something went wrong/i }),
    ).toBeInTheDocument();
  });

  it("displays an error message to the user", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(
      screen.getByText(/an unexpected error occurred/i),
    ).toBeInTheDocument();
  });

  it("renders a 'Try again' button that calls reset", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    const button = screen.getByRole("button", { name: /try again/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("logs the error to console on mount", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(console.error).toHaveBeenCalledWith("Unhandled error:", mockError);
  });
});
