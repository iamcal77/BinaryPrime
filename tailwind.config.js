/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}", // your screens folder
    "./components/**/*.{js,jsx,ts,tsx}", // your components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [require("nativewind/tailwind/plugin")], // 👈 use plugin, not presets
};
