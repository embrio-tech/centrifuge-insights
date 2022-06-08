import React, { useMemo } from 'react'
import { FilterOptions } from '../../../types'
import * as components from './components'
import './Filter.less'

interface FilterProps {
  is: keyof typeof components
  name: string
  options: FilterOptions
}

export const Filter: React.FC<FilterProps> = (props) => {
  const { is, name, options } = props

  const FilterComponent = useMemo(() => components[is], [is])

  return <FilterComponent name={name} options={options} className='dashboard-filter' />
}
