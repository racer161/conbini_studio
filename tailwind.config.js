module.exports = {
  content: [    
    "./index.html",    
    "./src/**/*.{vue,js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: {
      colors: {
        tokyo: {
          red: "#8c4351",
          orange: "#965027",
          yellow: "#8f5e15",
          lgreen: "#485e30",
          green: "#33635c",
          cyan: "#166775",
          lblue: "#0f4b6e",
          blue: "#34548a",
          magenta: "#5a4a78",
          foreground: "#343b58",
          markdown: "#565a6e",
          parameters: "#634f30",
          black: "#0f0f14",
          comments: "#9699a3",
          background: "#d5d6db"
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide')
  ],
}
