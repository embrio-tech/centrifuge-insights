import { gridBreakpoints } from '../config'

export type GridBreakpoint = keyof typeof gridBreakpoints

export interface GridCols {
  [breakpoint: GridBreakpoint]: number
}

export interface GridLayout {
  [breakpoint: GridBreakpoint]: { i: string; x: number; y: number; w: number; h: number }[]
}
