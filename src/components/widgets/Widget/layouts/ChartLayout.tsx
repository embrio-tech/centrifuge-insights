import React from 'react'
import { Spin } from 'antd'
// import './ChartLayout.less'

interface ChartLayoutProps {
  className?: string
  loading?: boolean
  title?: string
}

export const ChartLayout: React.FC<ChartLayoutProps> = (props) => {
  const { className, children, loading = false, title } = props

  return (
    <div className={className}>
      <div className='h-full flex flex-col'>
        {title && (
          <div className='grow-0'>
            <h3 className='text-base'>{title}</h3>
          </div>
        )}
        <div className='grow h-0'>
          <div className='h-full'>{loading ? <Spin /> : children}</div>
        </div>
      </div>
    </div>
  )
}
