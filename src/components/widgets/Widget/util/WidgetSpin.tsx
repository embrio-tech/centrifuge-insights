import React from 'react'
import { Spin } from 'antd'

import './WidgetSpin.less'

interface WidgetSpinProps {
  spinning?: boolean
}

export const WidgetSpin: React.FC<WidgetSpinProps> = (props) => {
  const { spinning, children } = props

  return (
    <Spin spinning={spinning} wrapperClassName='widget-spin'>
      {children}
    </Spin>
  )
}
