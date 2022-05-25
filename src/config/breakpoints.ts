// eslint-disable-next-line @typescript-eslint/no-var-requires
const { breakpoints } = require('./breakpoints.config') as {
  breakpoints: { SM: number; MD: number; LG: number; XL: number; XXL: number }
}

export { breakpoints }
