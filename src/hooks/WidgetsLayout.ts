import { useCallback, useEffect, useMemo, useState } from 'react'
import { WidgetAppearance } from '../types'
import { gridBreakpointNames } from '../config'
import { Layout, Layouts } from 'react-grid-layout'

interface WidgetsLayoutInterface {
  widgets: WidgetAppearance[]
  layouts: Layouts
  handleLayoutsChange: (layouts: Layouts) => void
}

/**
 * @function
 * react hook that manages the state of a widget layout
 *
 * @argument {Array} widgets – a list of widgets with responsive coordinates
 *
 * @returns {Object} hook states and update methods
 *
 * ```typescript
 * {
 *   widgets: WidgetAppearance[],
 *   layouts: Layouts,
 *   handleLayoutsChange: (layouts: Layouts) => void,
 * }
 * ```
 */
export const useWidgetsLayout = (initialWidgets: WidgetAppearance[]): WidgetsLayoutInterface => {
  const [widgets, setWidgets] = useState<WidgetAppearance[]>(initialWidgets)

  /**
   * memorized getter which computes a `react-grid-layout` layout from `widgets: WidgetAppearance[]`
   *
   * @returns {Object} a `layouts: Layouts` object
   */
  const layouts = useMemo<Layouts>(() => {
    const layouts = Object.fromEntries(
      gridBreakpointNames.map((gridBreakpoint) => [gridBreakpoint, new Array<Layout>()])
    )

    // test if ids are unique
    const widgetIds = [...new Set(widgets.map(({ _id }) => _id))]
    if (widgetIds.length !== widgets.length) throw new Error('Widget IDs are not uniquie (_id)!')

    widgets.forEach((widget) => {
      const { _id, coordinates } = widget
      gridBreakpointNames.forEach((gridBreakpoint) => {
        const breakpointCoordinates = coordinates.find(({ breakpoint }) => breakpoint === gridBreakpoint)
        if (!breakpointCoordinates) {
          throw new Error(`Widget ${_id}: breakpointCoordinates missing for breakpoint ${gridBreakpoint}`)
        }
        const { x, y, w, h } = breakpointCoordinates
        layouts[gridBreakpoint].push({ i: _id, x, y, w, h })
      })
    })

    return layouts
  }, [widgets])

  /**
   * handles change of `react-grid-layout` layout and updates `widgets` on hook state
   *
   * @prop {Layouts} layouts - a object with a responsive `react-grid-layout` layout
   */
  const handleLayoutsChange = useCallback((layouts: Layouts) => {
    setWidgets((widgets) => {
      return widgets.map(({ _id, name, coordinates }) => ({
        _id,
        name,
        coordinates: coordinates.map(({ breakpoint }) => {
          const newCoordinates = layouts[breakpoint]?.find(({ i }) => i === _id)
          if (!newCoordinates) {
            throw new Error(`Can not find coordinates for widget ${_id} and breakpoint ${breakpoint}!`)
          }
          const { w, h, x, y } = newCoordinates
          return { breakpoint, w, h, x, y }
        }),
      }))
    })
  }, [])

  useEffect(() => {
    // TODO: uncomment to log widgets layout to console after update
    // console.log('updated widgets: ', JSON.stringify(widgets))
  }, [widgets])

  return { widgets, layouts, handleLayoutsChange }
}
