/** @type {import('tailwindcss').Config} */
import d from "daisyui"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["dracula"],
  },
  plugins: [d],
}
