import React from 'react'
import { Alert } from 'antd'
import { Filter } from './Filter'
import { Filter as FilterType } from '../../types'
import './Filters.less'

const { ErrorBoundary } = Alert

interface FiltersProps {
  className?: string
  filters: FilterType[]
}

export const Filters: React.FC<FiltersProps> = (props) => {
  const { className, filters } = props

  return (
    <div className={className}>
      <div className='dashboard-filters'>
        <ErrorBoundary>
          {filters.map(({ type, ...props }, index) => (
            <Filter key={`${index}_${type}`} is={type} {...props} />
          ))}
        </ErrorBoundary>
      </div>
    </div>
  )
}
