/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F5F5F7',
          card: '#FFFFFF',
          dark: '#1D1D1F',
          slate: '#424245',
          subtle: '#86868B',
          border: '#E5E7EB',
          blue: '#2563EB',      // Electric Sapphire (Google / Apple AI)
          'blue-light': '#60A5FA',
          'blue-tint': '#EFF6FF',
          emerald: '#10B981',   // Vivid Emerald Green
          'emerald-tint': '#ECFDF5',
          amber: '#D97706',     // Anthropic Warm Amber
          terracotta: '#EE6C4D',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'apple': '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 30px 60px -20px rgba(37, 99, 235, 0.12), 0 0 1px 1px rgba(37, 99, 235, 0.2)',
        'pill': '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'blue-glow': '0 0 25px -5px rgba(37, 99, 235, 0.3)',
      },
    },
  },
  plugins: [],
}
