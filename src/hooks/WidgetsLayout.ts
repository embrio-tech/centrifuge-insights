import { useMemo } from 'react'
import { Layout, Layouts } from 'react-grid-layout'
import { WidgetAppearance } from '../types'
import { gridBreakpointNames } from '../config'

/**
 * @function
 * react hook that maps a list of widgets to a responsive grid layout
 *
 * @argument {Array} widgets – a list of widgets with responsive coordinates
 *
 * @returns {Object} responsive layouts for react-grid-layout
 */
export const useWidgetsLayout = (widgets: WidgetAppearance[]): Layouts => {
  const layouts = useMemo<Layouts>(() => {
    const layouts = Object.fromEntries(
      gridBreakpointNames.map((gridBreakpoint) => [gridBreakpoint, new Array<Layout>()])
    )

    widgets.forEach((widget) => {
      const { name, coordinates } = widget
      gridBreakpointNames.forEach((gridBreakpoint) => {
        const breakpointCoordinates = coordinates.find(({ breakpoint }) => breakpoint === gridBreakpoint)
        if (!breakpointCoordinates) {
          throw new Error(`Widget ${name}: breakpointCoordinates missing for breakpoint ${gridBreakpoint}`)
        }
        const { x, y, w, h } = breakpointCoordinates
        layouts[gridBreakpoint].push({ i: name, x, y, w, h })
      })
    })

    return layouts
  }, [widgets])

  return layouts
}
