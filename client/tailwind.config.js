/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1D76DB', // Blue from logo
        secondary: '#228B22', // Green from logo
        background: '#F9FAFB', // Neutral background
        foreground: '#1F2937', // Dark text
        accent: '#E2E8F0', // Light gray for borders or cards
      },
    },
  },
  plugins: [],
}
