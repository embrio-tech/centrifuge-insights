import React from 'react'
import './WidgetTitle.less'

interface WidgetTitleProps {
  title: string
}

export const WidgetTitle: React.FC<WidgetTitleProps> = (props) => {
  const { title } = props

  return <h3 className='widget-title'>{title}</h3>
}
