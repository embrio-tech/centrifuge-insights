import React, { PropsWithChildren, useRef } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { girdRowHeight, gridBreakpoints, gridCols, gridMargin } from '../../config'
// import './WidgetsLayout.less'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useSize, useWidgetsLayout } from '../../hooks'
import { WidgetAppearance } from '../../types'

interface WidgetsLayoutProps {
  className?: string
  widgets: WidgetAppearance[]
  edit?: boolean
}

const WidgetsLayout: React.FC<PropsWithChildren<WidgetsLayoutProps>> = (props) => {
  const { className, children, widgets, edit = false } = props
  const ref = useRef(null)
  const { width } = useSize(ref)

  const layouts = useWidgetsLayout(widgets)

  return (
    <div ref={ref} className={className}>
      <ResponsiveGridLayout
        width={width}
        className='layout'
        layouts={layouts}
        breakpoints={gridBreakpoints}
        cols={gridCols}
        margin={gridMargin}
        rowHeight={girdRowHeight}
        isDraggable={edit}
        isResizable={edit}
        // onBreakpointChange={(breakpoint: string, cols: number) => {
        //   // TODO: handle breakpoint change
        //   console.log('breakpoint: ', breakpoint, cols)
        // }}
        // onLayoutChange={(layout, allLayouts) => {
        //   // TODO: handle layout change
        //   console.log('layout: ', layout)
        //   // console.log('allLayouts: ', allLayouts)
        // }}
      >
        {children}
      </ResponsiveGridLayout>
    </div>
  )
}

export { WidgetsLayout }
