import { renderHook, act } from "@testing-library/react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

describe("useBodyScrollLock", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("should lock body scroll when isLocked is true", () => {
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should unlock body scroll when isLocked is false", () => {
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).toBe("");
  });

  it("should reset body scroll on unmount", () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("should toggle scroll lock when isLocked changes", () => {
    const { rerender } = renderHook(
      ({ isLocked }) => useBodyScrollLock(isLocked),
      { initialProps: { isLocked: false } }
    );

    expect(document.body.style.overflow).toBe("");

    rerender({ isLocked: true });
    expect(document.body.style.overflow).toBe("hidden");

    rerender({ isLocked: false });
    expect(document.body.style.overflow).toBe("");
  });
});
