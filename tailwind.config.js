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
        cream: '#f5f5f0',
        charcoal: '#2c363f',
        accent: '#e63946',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out forwards',
        'slide-up': 'slideUp 0.7s ease-in-out forwards',
        'scale-in': 'scaleIn 0.7s ease-in-out forwards',
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