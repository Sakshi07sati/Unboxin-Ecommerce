/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        colors: {
         primary: "#E80071",       // Nykaa Pink
        primaryHover: "#C6005C",
        background: "#F5F5F5",
        surface: "#FFFFFF",
        textPrimary: "#111111",
        textSecondary: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily:{
        poppins: ['Poppins', 'sans-serif'],
        Playfair : ['Playfair Display', 'serif'],
        Inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

