/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C7A64F",
        "background-light": "#0E0E0E",
        "background-dark": "#0E0E0E",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"], // ✅ usar font-sans en lugar de font-display
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [forms, containerQueries],
};
