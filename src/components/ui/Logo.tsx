interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 80 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="HAUS"
    >
      <path
        d="M0 0.5H2.5V8.5H10V0.5H12.5V19.5H10V10.5H2.5V19.5H0V0.5Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M20 0.5H22.8L29.5 19.5H26.8L25.3 15H17.5L16 19.5H13.3L20 0.5ZM24.5 13L21.4 4L18.3 13H24.5Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M32 0.5H34.5V12C34.5 15.5 36 17.5 39.5 17.5C43 17.5 44.5 15.5 44.5 12V0.5H47V12C47 17 44 19.8 39.5 19.8C35 19.8 32 17 32 12V0.5Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M51 15.5L52.5 13.8C54 15.5 56 16.5 58.5 16.5C61.5 16.5 63 15 63 13C63 11 61.5 10 58.5 9C54.5 7.8 52 6 52 3C52 0.5 54.5 0 57.5 0C60 0 62.5 0.8 64.5 2.5L63 4.2C61.5 2.8 59.5 2 57.5 2C55 2 54 3 54 4.5C54 6.5 55.5 7.5 58.5 8.5C62.5 9.7 65 11 65 14.5C65 17.5 62.5 19.8 58.5 19.8C55.5 19.8 53 18.5 51 15.5Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
    </svg>
  );
}
