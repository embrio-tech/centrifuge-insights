import { GridBreakpoint } from './grid-layout'
import * as components from '../components/widgets/Widget/components'

export interface Coordinates {
  breakpoint: GridBreakpoint
  x: number
  y: number
  w: number
  h: number
}

type WidgetName = keyof typeof components

interface WidgetMeta {
  _id: string
  name: WidgetName
}

export interface WidgetAppearance extends WidgetMeta {
  coordinates: Coordinates[]
}
