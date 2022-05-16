import { GridBreakpoint } from './grid-layout'
import * as components from '../components/widgets/Widget/components'

export interface Coordinates {
  breakpoint: GridBreakpoint
  x: number
  y: number
  w: number
  h: number
}

export interface WidgetAppearance {
  name: keyof typeof components
  coordinates: Coordinates[]
}
