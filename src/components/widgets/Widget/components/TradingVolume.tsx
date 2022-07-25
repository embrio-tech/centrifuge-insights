import React from 'react'
import { ChartLayout } from '../layouts'
// import './TradingVolume.less'

interface TradingVolumeProps {
  className?: string
}

export const TradingVolume: React.FC<TradingVolumeProps> = (props) => {
  const { className } = props

  return (
    <ChartLayout className={className} chart={'chart...'} info={'kpis...'} loading={false} title='Trading Volume' />
  )
}
