const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      black: colors.black,
      white: colors.white,

      amber: colors.amber,
      blue: { ...colors.blue, DEFAULT: "#3fd2f6" },
      cyan: colors.cyan,
      emerald: colors.emerald,
      fuchsia: colors.fuchsia,
      gray: { ...colors.coolGray, DEFAULT: "#7f8488", dark: "#777777" },
      green: { ...colors.green, DEFAULT: "#2efe4c" },
      indigo: colors.indigo,
      "light-blue": colors.sky,
      lime: colors.lime,
      orange: {
        ...colors.orange,
        1000: "#4a2008",
      },
      // pink: {
      //   ...colors.pink,
      //   1000: '#460d25',
      // },
      purple: colors.purple,
      red: colors.red,
      rose: colors.rose,
      teal: colors.teal,
      violet: colors.violet,
      yellow: colors.yellow,

      // code: {
      //   punctuation: '#A1E8FF',
      //   tag: '#D58FFF',
      //   'attr-name': '#4BD0FB',
      //   'attr-value': '#A2F679',
      //   string: '#A2F679',
      //   highlight: 'rgba(134, 239, 172, 0.25)',
      // },
      pink: {
        light: "#faa1ac",
        dark: "#fc8aa5",
        normal: "#f37c88",
        DEFAULT: "#f3808f",
      },
    },
    extend: {
      flex: {
        3: "3 3 0%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
