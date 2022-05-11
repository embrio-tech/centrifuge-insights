import React from 'react'
import { WidgetAppearance } from '../../types'
import { WidgetLayout } from '../util'
import { Widget } from './Widget'
// import './Widgets.less'

interface WidgetsProps {
  className?: string
  widgets: WidgetAppearance[] // TODO: type widgets
}

const Widgets: React.FC<WidgetsProps> = (props) => {
  const { className, widgets } = props

  return (
    <div className={className}>
      <WidgetLayout widgets={widgets}>
        {widgets.map(({ name }) => (
          <div key={name}>
            <Widget is={name} />
          </div>
        ))}
      </WidgetLayout>
    </div>
  )
}

export { Widgets }
