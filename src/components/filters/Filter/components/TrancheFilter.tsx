import React from 'react'
import { FilterLabel } from '../util'
// import './TrancheFilter.less'

interface TrancheFilterProps {
  className?: string
  id: string
}

export const TrancheFilter: React.FC<TrancheFilterProps> = (props) => {
  const { className } = props

  return (
    <FilterLabel className={className} label='Tranche'>
      ...implement
    </FilterLabel>
  )
}
