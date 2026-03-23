import React from "react";
import { render, act } from "@testing-library/react";
import { useSlideInOnView } from "@/hooks/useSlideInOnView";

// Capture observer callbacks so we can trigger intersections manually
let observerCallback: IntersectionObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  observerCallback = undefined as unknown as IntersectionObserverCallback;
  observerOptions = undefined;

  global.IntersectionObserver = jest.fn((callback, options) => {
    observerCallback = callback;
    observerOptions = options;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: jest.fn(),
    };
  }) as unknown as typeof IntersectionObserver;
});

// Helper component that actually attaches the ref to a DOM element
function TestComponent(props: Parameters<typeof useSlideInOnView>[0]) {
  const { ref, isVisible } = useSlideInOnView(props);
  return (
    <div ref={ref} data-testid="target" data-visible={String(isVisible)} />
  );
}

function triggerIntersection(isIntersecting: boolean) {
  const entry = {
    isIntersecting,
    target: document.createElement("div"),
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: Date.now(),
  } as IntersectionObserverEntry;

  act(() => {
    observerCallback([entry], {} as IntersectionObserver);
  });
}

describe("useSlideInOnView", () => {
  it("starts with isVisible=false", () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("target")).toHaveAttribute("data-visible", "false");
  });

  it("creates an IntersectionObserver with default options", () => {
    render(<TestComponent />);
    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(observerOptions).toEqual(
      expect.objectContaining({ threshold: 0.5, rootMargin: "0px" })
    );
  });

  it("observes the ref element", () => {
    const { getByTestId } = render(<TestComponent />);
    expect(mockObserve).toHaveBeenCalledWith(getByTestId("target"));
  });

  it("sets isVisible to true when element intersects", () => {
    const { getByTestId } = render(<TestComponent />);
    triggerIntersection(true);
    expect(getByTestId("target")).toHaveAttribute("data-visible", "true");
  });

  it("unobserves element after intersection when triggerOnce is true (default)", () => {
    render(<TestComponent />);
    triggerIntersection(true);
    expect(mockUnobserve).toHaveBeenCalled();
  });

  it("does not unobserve when triggerOnce is false", () => {
    render(<TestComponent triggerOnce={false} />);
    triggerIntersection(true);
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it("resets isVisible when element leaves viewport with triggerOnce=false", () => {
    const { getByTestId } = render(<TestComponent triggerOnce={false} />);

    triggerIntersection(true);
    expect(getByTestId("target")).toHaveAttribute("data-visible", "true");

    triggerIntersection(false);
    expect(getByTestId("target")).toHaveAttribute("data-visible", "false");
  });

  it("accepts custom threshold and rootMargin", () => {
    render(<TestComponent threshold={0.3} rootMargin="10px" />);
    expect(observerOptions).toEqual(
      expect.objectContaining({ threshold: 0.3, rootMargin: "10px" })
    );
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<TestComponent />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
