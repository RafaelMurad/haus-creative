import { useEffect, useRef } from "react";

/**
 * Custom hook to lock/unlock body scroll.
 *
 * Uses position:fixed technique for iOS Safari compatibility.
 * Preserves scroll position when locking/unlocking so the page
 * doesn't jump to top when the overlay closes.
 *
 * @param isLocked - Whether body scroll should be locked
 */
export function useBodyScrollLock(isLocked: boolean): void {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;

      // Apply fixed positioning to prevent scroll on iOS
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      // Remove fixed positioning
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";

      // Restore scroll position
      window.scrollTo(0, scrollYRef.current);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [isLocked]);
}
