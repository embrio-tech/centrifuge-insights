import React, { useMemo } from 'react'
import './Widget.less'
import * as components from './components'

interface WidgetProps {
  is: keyof typeof components
}

const Widget: React.FC<WidgetProps> = (props) => {
  const { is } = props

  const WidgetComponent = useMemo(() => components[is], [is])

  return <WidgetComponent className='widget' />
}

export { Widget }
