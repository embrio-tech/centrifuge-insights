import React, { useMemo } from 'react'
import * as components from './components'
import './Filter.less'

interface FilterProps {
  is: keyof typeof components
  id: string
}

export const Filter: React.FC<FilterProps> = (props) => {
  const { is, id } = props

  const FilterComponent = useMemo(() => components[is], [is])

  return <FilterComponent id={id}  className='dashboard-filter' />
}
