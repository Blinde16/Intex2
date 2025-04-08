/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1E1822",
        foreground: "#ffffff",
        muted: "#2A2233",
        "muted-foreground": "#bbb",
        primary: "#e50914", // Netflix red
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 15px rgba(0, 0, 0, 0.5)",
      },
      backdropBlur: {
        md: "10px",
      },
    },
  },
  plugins: [],
};
