/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [typography()],
};
