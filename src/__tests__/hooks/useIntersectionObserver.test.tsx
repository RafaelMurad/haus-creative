import React from "react";
import { render, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

// Capture observer instances for manual triggering
let observerInstances: {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observeMock: jest.Mock;
  disconnectMock: jest.Mock;
}[] = [];

beforeEach(() => {
  observerInstances = [];

  global.IntersectionObserver = jest.fn((callback, options) => {
    const instance = {
      callback,
      options,
      observeMock: jest.fn(),
      disconnectMock: jest.fn(),
    };
    observerInstances.push(instance);
    return {
      observe: instance.observeMock,
      unobserve: jest.fn(),
      disconnect: instance.disconnectMock,
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: jest.fn(),
    };
  }) as unknown as typeof IntersectionObserver;
});

/** Helper component that attaches the ref to a real DOM element */
function TestComponent({
  options = {},
  onResult,
}: {
  options?: Parameters<typeof useIntersectionObserver>[0];
  onResult: (result: ReturnType<typeof useIntersectionObserver>) => void;
}) {
  const result = useIntersectionObserver(options);
  onResult(result);
  return <div ref={result.elementRef} data-testid="observed" />;
}

/** Simulate an intersection entry on the latest observer */
function simulateIntersection(isIntersecting: boolean, index = -1) {
  const obs =
    index >= 0
      ? observerInstances[index]
      : observerInstances[observerInstances.length - 1];
  if (!obs) throw new Error("No observer instance found");

  const entry = {
    isIntersecting,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    target: document.createElement("div"),
    time: Date.now(),
  } as IntersectionObserverEntry;

  act(() => {
    obs.callback([entry], {} as IntersectionObserver);
  });
}

describe("useIntersectionObserver", () => {
  it("returns initial state as not visible", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.isCurrentlyVisible).toBe(false);
  });

  it("returns a ref for the element", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.elementRef).toBeDefined();
    expect(result.current.elementRef.current).toBe(null);
  });

  it("creates an IntersectionObserver with custom threshold", () => {
    let hookResult: ReturnType<typeof useIntersectionObserver> | undefined;
    render(
      <TestComponent
        options={{ threshold: 0.5 }}
        onResult={(r) => {
          hookResult = r;
        }}
      />,
    );

    expect(observerInstances).toHaveLength(1);
    expect(observerInstances[0].options?.threshold).toBe(0.5);
    expect(hookResult).toBeDefined();
  });

  it("creates an IntersectionObserver with custom rootMargin", () => {
    render(
      <TestComponent
        options={{ rootMargin: "50px" }}
        onResult={() => {}}
      />,
    );

    expect(observerInstances[0].options?.rootMargin).toBe("50px");
  });

  it("uses default threshold of 0.1 and rootMargin of 100px", () => {
    render(<TestComponent onResult={() => {}} />);

    expect(observerInstances[0].options?.threshold).toBe(0.1);
    expect(observerInstances[0].options?.rootMargin).toBe("100px");
  });

  it("calls observe on the target element", () => {
    render(<TestComponent onResult={() => {}} />);

    expect(observerInstances[0].observeMock).toHaveBeenCalledTimes(1);
  });

  it("returns all expected properties", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current).toHaveProperty("elementRef");
    expect(result.current).toHaveProperty("isVisible");
    expect(result.current).toHaveProperty("isCurrentlyVisible");
  });

  it("sets isVisible to true when element enters viewport (triggerOnce default)", () => {
    let hookResult: ReturnType<typeof useIntersectionObserver> | undefined;
    render(
      <TestComponent
        onResult={(r) => {
          hookResult = r;
        }}
      />,
    );

    simulateIntersection(true);

    expect(hookResult!.isVisible).toBe(true);
    expect(hookResult!.isCurrentlyVisible).toBe(true);
  });

  it("stays visible after leaving viewport when triggerOnce is true (default)", () => {
    let hookResult: ReturnType<typeof useIntersectionObserver> | undefined;
    render(
      <TestComponent
        options={{ triggerOnce: true }}
        onResult={(r) => {
          hookResult = r;
        }}
      />,
    );

    simulateIntersection(true);
    expect(hookResult!.isVisible).toBe(true);

    simulateIntersection(false);
    // isVisible latches (hasIntersected remains true)
    expect(hookResult!.isVisible).toBe(true);
    // isCurrentlyVisible reflects live state
    expect(hookResult!.isCurrentlyVisible).toBe(false);
  });

  it("toggles visibility when triggerOnce is false", () => {
    let hookResult: ReturnType<typeof useIntersectionObserver> | undefined;
    render(
      <TestComponent
        options={{ triggerOnce: false }}
        onResult={(r) => {
          hookResult = r;
        }}
      />,
    );

    simulateIntersection(true);
    expect(hookResult!.isVisible).toBe(true);
    expect(hookResult!.isCurrentlyVisible).toBe(true);

    simulateIntersection(false);
    expect(hookResult!.isVisible).toBe(false);
    expect(hookResult!.isCurrentlyVisible).toBe(false);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<TestComponent onResult={() => {}} />);

    expect(observerInstances).toHaveLength(1);

    unmount();

    expect(observerInstances[0].disconnectMock).toHaveBeenCalled();
  });

  it("re-renders with different options", () => {
    const { result, rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0.1 } },
    );

    expect(result.current.isVisible).toBe(false);

    rerender({ threshold: 0.5 });

    expect(result.current.isVisible).toBe(false);
  });
});
