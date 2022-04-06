import { Card } from 'antd'
import React from 'react'
import { BasicLayout } from '../layouts'
// import './Root.less'

const Root: React.FC = () => {
  return (
    <BasicLayout>
      <Card title='Default size card' className='w-full max-w-xs'>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </BasicLayout>
  )
}

export { Root }
