import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury': {
          cream: '#FAF8F5',
          dark: '#1A1A1A',
          gold: '#C4A265',
          muted: '#8A8578',
          border: '#E8E4DE',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Libre Baskerville', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gold-extend': {
          '0%': { width: '0', opacity: '0' },
          '100%': { width: '100%', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'gold-extend': 'gold-extend 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
