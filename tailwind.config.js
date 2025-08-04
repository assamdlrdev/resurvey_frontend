
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",              // Scan index.html for classes
    "./src/**/*.{js,ts,jsx,tsx}" // Scan all files in src/ with these extensions
  ],
  theme: {
    extend: {},                   // You can extend Tailwind's default theme here
  },
  plugins: [],                    // You can add Tailwind plugins here (like daisyUI later)
};