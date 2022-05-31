import { Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { WidgetLayout } from '../util'
import './FigureLayout.less'

interface FigureLayoutProps {
  className?: string
  color?: string
  loading?: boolean
  name: string
  value: string
  unit?: string
}

export const FigureLayout: React.FC<FigureLayoutProps> = (props) => {
  const { className, name, value, unit, loading, color } = props

  const label = useMemo(() => {
    if (name)
      return (
        <Tooltip title={name}>
          <div className='figure-label'>{name}</div>
        </Tooltip>
      )
    return undefined
  }, [name])

  return (
    <WidgetLayout className={className} footer={label} loading={loading}>
      <Tooltip title={`${value}${unit ? unit : ''}`}>
        <div className='figure-value' style={{ color }}>
          <span className='truncate'>{value}</span>
          <span className='truncate'>{unit}</span>
        </div>
      </Tooltip>
    </WidgetLayout>
  )
}
