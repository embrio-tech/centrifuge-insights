import React from 'react'
import { Filter } from './Filter'
import { Filter as FilterType } from '../../types'
import './Filters.less'

interface FiltersProps {
  className?: string
  filters: FilterType[]
}

export const Filters: React.FC<FiltersProps> = (props) => {
  const { className, filters } = props

  return (
    <div className={className}>
      <div className='dashboard-filters'>
        {filters.map(({ type, ...props }, index) => (
          <Filter key={`${index}_${type}`} is={type} {...props} />
        ))}
      </div>
    </div>
  )
}
