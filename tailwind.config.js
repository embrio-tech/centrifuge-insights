/* eslint-disable @typescript-eslint/no-var-requires */

const { breakpoints } = require('./src/config/breakpoints.config')
const { SM, MD, LG, XL, XXL } = breakpoints
const { colors } = require('./src/config/colors.config')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors,
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
    },
    // unify tailwind breakpoints with ant design breakpoints
    screens: {
      sm: `${SM}px`,
      // => @media (min-width: 576px) { ... }
      md: `${MD}px`,
      // => @media (min-width: 768px) { ... }
      lg: `${LG}px`,
      // => @media (min-width: 992px) { ... }
      xl: `${XL}px`,
      // => @media (min-width: 1200px) { ... }
      xxl: `${XXL}px`,
      // => @media (min-width: 1600px) { ... }
    },
  },
  plugins: [],
}
