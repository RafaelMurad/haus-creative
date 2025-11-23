interface MenuIconProps {
  /** Whether the menu is open (determines X vs hamburger) */
  isOpen: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Animated plus/close icon for mobile menu
 *
 * Transforms between a plus sign (+) and an X (close)
 * with a smooth 45-degree rotation
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
      {/* Horizontal line */}
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`transition-transform duration-300 origin-center ${
          isOpen ? "rotate-45" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      {/* Vertical line */}
      <path
        d="M12 4v16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`transition-transform duration-300 origin-center ${
          isOpen ? "rotate-45" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
