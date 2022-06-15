import React, { PropsWithChildren } from 'react'
import { Spin } from 'antd'

import './WidgetSpin.less'

interface WidgetSpinProps {
  spinning?: boolean
}

export const WidgetSpin: React.FC<PropsWithChildren<WidgetSpinProps>> = (props) => {
  const { spinning, children } = props

  return (
    <Spin spinning={spinning} wrapperClassName='widget-spin'>
      {children}
    </Spin>
  )
}
