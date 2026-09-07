/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0F172A',
        'steel-gray': '#64748B',
        'sector-cyan': '#0284C7',
        brand: {
          bg: '#FFFFFF',
          card: '#FFFFFF',
          dark: '#0F172A',
          slate: '#64748B',
          subtle: '#94A3B8',
          border: '#E2E8F0',
          blue: '#0284C7',      // Primary Sector Seven Cyan/Blue
          'blue-light': '#0369A1',
          'blue-tint': '#F0F9FF',
          emerald: '#10B981',   // Vivid Emerald Green
          'emerald-tint': '#ECFDF5',
          amber: '#D97706',     // Warm Amber / Accent
          terracotta: '#EE6C4D',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'soft-card': '0 20px 40px -15px rgba(15, 23, 42, 0.06), 0 0 1px 1px rgba(226, 232, 240, 0.8)',
        'cyan-glow': '0 0 25px -5px rgba(2, 132, 199, 0.25)',
        'apple': '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 30px 60px -20px rgba(2, 132, 199, 0.15), 0 0 1px 1px rgba(2, 132, 199, 0.2)',
        'pill': '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
}


