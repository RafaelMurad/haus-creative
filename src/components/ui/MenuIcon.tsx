interface MenuIconProps {
  /** Whether the menu is open (determines X vs hamburger) */
  isOpen: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Animated hamburger/close icon for mobile menu
 *
 * Transforms between three horizontal lines (hamburger) and an X (close)
 * with smooth CSS transitions
 */
export function MenuIcon({ isOpen, className = "" }: MenuIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Top line - rotates to form top of X */}
      <path
        d="M0 4h24"
        stroke="currentColor"
        strokeWidth="1"
        className={`transition-all duration-300 origin-center ${
          isOpen ? "rotate-45 translate-y-[8px]" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      {/* Middle line - fades out when open */}
      <path
        d="M0 12h24"
        stroke="currentColor"
        strokeWidth="1"
        className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}
      />

      {/* Bottom line - rotates to form bottom of X */}
      <path
        d="M0 20h24"
        stroke="currentColor"
        strokeWidth="1"
        className={`transition-all duration-300 origin-center ${
          isOpen ? "-rotate-45 -translate-y-[8px]" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
