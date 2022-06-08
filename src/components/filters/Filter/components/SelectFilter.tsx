import { Select } from 'antd'
import React, { useState } from 'react'
import { SelectFilterOption } from '../../../../types'
// import './SelectFilter.less'

interface SelectFilterProps {
  className?: string
  options: SelectFilterOption[]
  name: string
}

export const SelectFilter: React.FC<SelectFilterProps> = (props) => {
  const { className, options, name } = props

  const [selected, setSelected] = useState<string | undefined>(options[0]?.value)

  return (
    <div className={className}>
      <div className='mb-1 font-medium text-base'>
        <label htmlFor={name}>{name}</label>
      </div>
      <div id={name}>
        <Select
          options={options}
          className='w-full'
          value={selected}
          onSelect={(key: string) => {
            setSelected(key)
          }}
        />
      </div>
    </div>
  )
}
