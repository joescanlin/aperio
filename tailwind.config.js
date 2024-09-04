module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#f8f9fa',
        'text-color': '#333',
        'border-color': '#A5D6A7',
        'green': {
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
        },
        'blue': {
          500: '#2196F3',
        },
        'yellow': {
          500: '#FFC107',
        },
        'gray': {
          200: '#EEEEEE',
          300: '#E0E0E0',
        },
      },
    },
  },
  plugins: [],
}