import { renderHook } from "@testing-library/react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

describe("useBodyScrollLock", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    // Mock window.scrollY and window.scrollTo
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    window.scrollTo = jest.fn();
  });

  it("should lock body scroll when isLocked is true", () => {
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");
  });

  it("should unlock body scroll when isLocked is false", () => {
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
  });

  it("should reset body scroll on unmount", () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");

    unmount();
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
  });

  it("should toggle scroll lock when isLocked changes", () => {
    const { rerender } = renderHook(
      ({ isLocked }) => useBodyScrollLock(isLocked),
      { initialProps: { isLocked: false } }
    );

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");

    rerender({ isLocked: true });
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");

    rerender({ isLocked: false });
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
  });

  it("should preserve scroll position using fixed positioning with negative top", () => {
    // Simulate user having scrolled 500px down
    Object.defineProperty(window, "scrollY", { value: 500, writable: true });

    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.top).toBe("-500px");
    expect(document.body.style.left).toBe("0px");
    expect(document.body.style.right).toBe("0px");
  });

  it("should restore scroll position when unlocking", () => {
    Object.defineProperty(window, "scrollY", { value: 300, writable: true });

    const { rerender } = renderHook(
      ({ isLocked }) => useBodyScrollLock(isLocked),
      { initialProps: { isLocked: true } }
    );

    rerender({ isLocked: false });
    expect(window.scrollTo).toHaveBeenCalledWith(0, 300);
  });
});
