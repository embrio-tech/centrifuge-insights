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
  prefix?: string
  suffix?: string
}

export const FigureLayout: React.FC<FigureLayoutProps> = (props) => {
  const { className, name, value, prefix, suffix, loading, color } = props

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
      <Tooltip title={`${prefix ? `${prefix} ` : ''}${value}${suffix ? suffix : ''}`}>
        <div className='figure-value' style={{ color }}>
          {prefix && <span className='truncate px-2'>{prefix}</span>}
          <span className='truncate'>{value}</span>
          {suffix && <span className='truncate'>{suffix}</span>}
        </div>
      </Tooltip>
    </WidgetLayout>
  )
}
