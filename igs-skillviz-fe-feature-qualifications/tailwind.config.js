/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
    "node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#29295F",
        secondary: "#F16729",
      },
      fontFamily: {
        sans: ["Lexend", "sans-serif"],
      },
      height: {
        inherit: "inherit",
      },
    },
  },
  plugins: [require("preline/plugin"), require("@tailwindcss/forms")],
};
