/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8e05c2",
        darkbg: "#0f0f0f",
        graybg: "rgba(255, 255, 255, 0.03)",
        bordercolor: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        ibm: ["var(--font-ibm-plex-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
