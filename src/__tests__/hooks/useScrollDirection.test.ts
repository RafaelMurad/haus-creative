import { renderHook, act } from "@testing-library/react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

describe("useScrollDirection", () => {
  let scrollY: number;

  beforeEach(() => {
    scrollY = 0;
    Object.defineProperty(window, "scrollY", {
      get: () => scrollY,
      configurable: true,
    });
  });

  it("should initialise with isVisible true and direction null", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.isVisible).toBe(true);
    expect(result.current.direction).toBeNull();
  });

  it("should hide header when scrolling down past threshold", () => {
    const { result } = renderHook(() =>
      useScrollDirection({ hideThreshold: 100, topThreshold: 50 })
    );

    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.direction).toBe("down");
    expect(result.current.isVisible).toBe(false);
  });

  it("should show header when scrolling up", () => {
    const { result } = renderHook(() =>
      useScrollDirection({ hideThreshold: 100, topThreshold: 50 })
    );

    // Scroll down first
    act(() => {
      scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isVisible).toBe(false);

    // Scroll up
    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.direction).toBe("up");
    expect(result.current.isVisible).toBe(true);
  });

  it("should show header when near top of page", () => {
    const { result } = renderHook(() =>
      useScrollDirection({ topThreshold: 50 })
    );

    // Scroll down
    act(() => {
      scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });

    // Scroll back to top
    act(() => {
      scrollY = 30;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isVisible).toBe(true);
  });

  it("should use default thresholds when no options provided", () => {
    const { result } = renderHook(() => useScrollDirection());

    // Scroll down past default hideThreshold (100)
    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isVisible).toBe(false);
  });

  it("should remove scroll listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrollDirection());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
