import React, { PropsWithChildren } from 'react'
// import './FilterLabel.less'

interface FilterLabelProps {
  className?: string
  label: string
}

export const FilterLabel: React.FC<PropsWithChildren<FilterLabelProps>> = (props) => {
  const { className, children, label } = props

  return (
    <div className={className}>
      <div className='mb-1 font-medium text-base'>
        <label htmlFor={label}>{label}</label>
      </div>
      <div id={label}>
        {children}
      </div>
    </div>
  )
}
