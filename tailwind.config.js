module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},

    // unify tailwind breakpoints with ant design breakpoints
    screens: {
      sm: '576px',
      // => @media (min-width: 576px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '992px',
      // => @media (min-width: 992px) { ... }
      xl: '1200px',
      // => @media (min-width: 1200px) { ... }
      'xxl': '1600px',
      // => @media (min-width: 1600px) { ... }
    },
  },
  plugins: [],
}
