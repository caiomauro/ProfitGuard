module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-background': '#9cffce',
        'accent': '#42fcd4',
        'accent2': '#f4fcc5',
        'accent3': '#ea42fc',
        'surface': '#242323',
      },
    },
  },
  plugins: [
  ],
}