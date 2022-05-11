import { breakpoints } from './breakpoints'

const { SM, MD, LG, XL } = breakpoints

export const gridBreakpoints = {
  xs: 0,
  sm: SM,
  md: MD,
  lg: LG,
  xl: XL,
}

export const gridBreakpointNames = Object.keys(gridBreakpoints)

export const gridCols: { [breakpoint in keyof typeof gridBreakpoints]: number } = {
  xl: 12,
  lg: 10,
  md: 6,
  sm: 4,
  xs: 2,
}

export const gridMargin: [number, number] = [16, 16] // corresponds to 1rem (tailwind m-4)

export const girdRowHeight = 150
