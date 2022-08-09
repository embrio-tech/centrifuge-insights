import { Tooltip } from 'antd'
import React, { ReactNode } from 'react'
// import './WidgetKPIs.less'

export interface WidgetKPI {
  label: ReactNode
  value?: ReactNode
  prefix?: string
  suffix?: string
}

interface WidgetKPIsProps {
  kpis: WidgetKPI[]
  title?: string | null
  className?: string
}

export const WidgetKPIs: React.FC<WidgetKPIsProps> = (props) => {
  const { className, kpis, title = 'KPIs' } = props

  return (
    <div className={className}>
      {title && <h4 className='text-sm'>{title}</h4>}
      <ul className='text-xs mb-0'>
        {kpis.map(({ label, value, prefix, suffix }, index) => (
          <li key={index} className='flex h-5 mb-1'>
            <div className='grow shrink truncate font-light'>{label}</div>
            {prefix !== undefined && <div className='pl-2'>{prefix}</div>}
            {value !== undefined && (
              <div className={prefix !== undefined ? 'pl-1' : 'pl-2'}>
                <Tooltip placement='left' title={label}>
                  {value}
                </Tooltip>
              </div>
            )}
            {suffix !== undefined && <div>{suffix}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
