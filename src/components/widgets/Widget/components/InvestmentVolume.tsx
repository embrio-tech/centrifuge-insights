import React from 'react'
import { ChartLayout } from '../layouts'
// import './InvestmentVolume.less'

interface InvestmentVolumeProps {
  className?: string
}

export const InvestmentVolume: React.FC<InvestmentVolumeProps> = (props) => {
  const { className } = props

  return (
    <ChartLayout className={className} chart={'chart...'} info={'kpis...'} loading={false} title='Investment Volume' />
  )
}
