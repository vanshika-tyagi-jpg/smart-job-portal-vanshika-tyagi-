/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F7F5",
        ink: "#132019",
        teal: { DEFAULT: "#0F6B5C", dark: "#0B4F44", light: "#E4F2EE" },
        amber: { DEFAULT: "#E8A33D", dark: "#C6822A", light: "#FCF0DC" },
        slate: "#5B6B65",
        line: "#DCE4E0",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};