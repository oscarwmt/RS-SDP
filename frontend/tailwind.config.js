/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 Esta línea es clave
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
