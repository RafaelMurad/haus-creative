/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        times: ['var(--font-times)', 'Times New Roman', 'serif'],
        diatype: ['var(--font-diatype)', 'sans-serif'],
        'monument-grotesk-mono': ['var(--font-monument-grotesk-mono)', 'monospace'],
      },
      colors: {
        // Luxury monochromatic palette
        luxury: {
          black: '#000000',
          charcoal: '#1a1a1a',
          gray: '#666666',
          lightgray: '#e5e5e5',
          cream: '#f8f8f6',
          white: '#ffffff',
          gold: '#c9a55a',
        },
        // Legacy colors
        cream: '#f5f5f0',
        charcoal: '#2c363f',
        dark: {
          50: '#18181b',
          100: '#0d0d0f',
          200: '#050507',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          orange: '#f97316',
          blue: '#3b82f6',
        },
      },
      letterSpacing: {
        'luxury': '0.15em',
        'wide': '0.05em',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out forwards',
        'slide-up': 'slideUp 0.7s ease-in-out forwards',
        'scale-in': 'scaleIn 0.7s ease-in-out forwards',
        'fade-in-slow': 'fadeIn 1.2s ease-out forwards',
        'slide-up-slow': 'slideUp 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}