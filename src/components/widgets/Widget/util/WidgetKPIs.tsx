import { Tooltip } from 'antd'
import React from 'react'
// import './WidgetKPIs.less'

export interface WidgetKPI {
  label: string
  value?: number | string
  unit?: string
}

interface WidgetKPIsProps {
  kpis: WidgetKPI[]
  title?: string
  className?: string
}

export const WidgetKPIs: React.FC<WidgetKPIsProps> = (props) => {
  const { className, kpis, title } = props

  return (
    <div className={className}>
      <h4 className='text-sm'>{title || 'KPIs'}</h4>
      <ul className='text-xs mb-0'>
        {kpis.map(({ label, value, unit }, index) => (
          <li key={index} className='flex h-5'>
            <div className='grow shrink truncate font-light'>{label}</div>
            {value !== undefined && (
              <div className='pl-2'>
                <Tooltip placement='left' title={label}>
                  {value}
                </Tooltip>
              </div>
            )}
            {unit !== undefined && <div>{unit}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
