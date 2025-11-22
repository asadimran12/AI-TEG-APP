/** @type {import('tailwindcss').Config} */
module.exports = {
  // FIX: Scan ALL files inside the 'app' directory
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // <--- ADD THIS LINE
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}