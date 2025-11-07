// admin-frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // This tells Tailwind to look in all files in src/ that end in React/TS extensions
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}