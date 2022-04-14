import React from 'react'
import { BasicLayout } from '../layouts'
import { DemoWidget } from '../widgets'
// import './Root.less'

const Root: React.FC = () => {
  return (
    <BasicLayout>
      <DemoWidget />
    </BasicLayout>
  )
}

export { Root }
