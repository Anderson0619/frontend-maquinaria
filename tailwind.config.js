module.exports = {
  purge: ["./src/**/*.tsx", "./src/**/*.scss", "./src/**/*.less"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        screen: ["-webkit-fill-available", "100vh"],
      },
      container: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px",
      },
      maxHeight: {
        0: "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
      },
      flex: {
        "1/4": "0.25",
        "1/2": "0.5",
        "3/4": "0.75",
        1: "1",
      },
      colors: {
        current: {
          100: "var(--primary-color-100)",
          200: "var(--primary-color-200)",
          300: "var(--primary-color-300)",
          400: "var(--primary-color-400)",
          500: "var(--primary-color)",
          600: "var(--primary-color-600)",
          700: "var(--primary-color-700)",
          800: "var(--primary-color-800)",
          900: "var(--primary-color-900)",
        },
        black: "var(--rs-black)",
        gray: {
          50: "var(--rs-gray-50)",
          100: "var(--rs-gray-100)",
          200: "var(--rs-gray-200)",
          300: "var(--rs-gray-300)",
          400: "var(--rs-gray-400)",
          500: "var(--rs-gray-500)",
          600: "var(--rs-gray-600)",
          700: "var(--rs-gray-700)",
          800: "var(--rs-gray-800)",
          900: "var(--rs-gray-900)",
        },
      },
    },
  },
  variants: {
    extend: { display: ["dark"] },
  },
  plugins: [],
};
