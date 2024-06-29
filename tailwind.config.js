/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./**/*.{ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      colors: {
        "plasmo-blue-light": "#DBEAFE",
        "plasmo-gray-light": "#DFE1E7",
        "plasmo-blue-dark": "#3B82F6",
        "plasmo-gray-dark": "#666D80",
        "plasmo-border-gray": "#C1C7D0",
        "plasmo-cadet-gray": "#A4ACB9",
        "plasmo-white": "#FFFFFF",
        "plasmo-black": "#000000"
      }
    }
  }
}
