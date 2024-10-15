export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.items-center-custom': {
          'align-items': 'center',
        },
        '.transform-translate-x-10': {
          'transform': 'translateX(10px)'
        },
        '.transform-translate-x--10': {
          'transform': 'translateX(-10px)'
        },
      };
      addUtilities(newUtilities);
    },
  ],
}
