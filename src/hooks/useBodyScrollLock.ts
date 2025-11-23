import { useEffect } from "react";

/**
 * Custom hook to lock/unlock body scroll
 *
 * Useful for modals, overlays, and mobile menus to prevent
 * background scrolling when the overlay is open
 *
 * @param isLocked - Whether body scroll should be locked
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocked]);
}
