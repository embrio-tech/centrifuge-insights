import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
// import './SelectFilter.less'

export interface SelectFilterOption {
  label: string
  value: string
}

interface SelectFilterProps {
  className?: string
  options: SelectFilterOption[]
  label: string
  loading?: boolean
}

export const SelectFilter: React.FC<SelectFilterProps> = (props) => {
  const { className, options, label, loading = false } = props

  const [selected, setSelected] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (options.length) setSelected(options[0].value)
  }, [options])

  return (
    <div className={className}>
      <div className='mb-1 font-medium text-base'>
        <label htmlFor={label}>{label}</label>
      </div>
      <div id={label}>
        <Select
          options={options}
          className='w-full'
          value={selected}
          loading={loading}
          onSelect={(key: string) => {
            setSelected(key)
          }}
        />
      </div>
    </div>
  )
}
