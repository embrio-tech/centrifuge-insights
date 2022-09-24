import React from 'react'
import { FigureLayout } from '../layouts'
// import './PoolValue.less'

interface PoolValueProps {
  className?: string
}

export const PoolValue: React.FC<PoolValueProps> = (props) => {
  const { className } = props

  return (
    <FigureLayout
      className={className}
      value={'5Mio'}
      name='Pool Value'
      loading={false}
      color='#2762ff'
    />
  )
}
