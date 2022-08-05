import React from 'react'
import { ChartLayout } from '../layouts'
// import './TokenPriceDevelopment.less'

interface TokenPriceDevelopmentProps {
  className?: string
}

export const TokenPriceDevelopment: React.FC<TokenPriceDevelopmentProps> = (props) => {
  const { className } = props

  return <ChartLayout
  className={className}
  chart={'chart...'}
  // info={<WidgetKPIs kpis={kpis} />}
  loading={false}
  title='Token Price Development'
/>
}
