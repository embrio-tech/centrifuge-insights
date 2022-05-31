/* eslint-disable @typescript-eslint/no-var-requires */
const CracoLessPlugin = require('craco-less')

const { breakpoints } = require('./src/config/breakpoints.config')
const { SM, MD, LG, XL, XXL } = breakpoints
const { colors } = require('./src/config/colors.config')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': colors.primary.DEFAULT,
              '@border-radius-base': '6px',
              '@screen-sm': `${SM}px`,
              '@screen-md': `${MD}px`,
              '@screen-lg': `${LG}px`,
              '@screen-xl': `${XL}px`,
              '@screen-xxl': `${XXL}px`,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}
