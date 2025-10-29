/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F4C5C",   // deep teal-blue
        secondary: "#E36414", // warm orange
      },
    },
  },
  plugins: [],
};
