interface MenuIconProps {
  /** Whether the menu is open (determines X vs hamburger) */
  isOpen: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Animated hamburger/close icon for mobile menu
 *
 * Transforms between a hamburger menu (≡) and an X (close)
 * with smooth animations
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
      {/* Top line */}
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`transition-all duration-300 origin-center ${
          isOpen ? "rotate-45 translate-y-[5px]" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      {/* Middle line */}
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`transition-opacity duration-300 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Bottom line */}
      <path
        d="M4 17h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`transition-all duration-300 origin-center ${
          isOpen ? "-rotate-45 -translate-y-[5px]" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
