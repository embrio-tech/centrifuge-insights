import React, { useMemo } from 'react'
import { abbreviatedNumber, decimal } from '../../../../util'
import { FigureLayout } from '../layouts'
import { usePool } from '../../../../contexts'
// import './PoolValue.less'

interface PoolValueProps {
  className?: string
}

export const PoolValue: React.FC<PoolValueProps> = (props) => {
  const { className } = props
  const { decimals, poolValue, loading } = usePool()

  const value = useMemo<string>(() => {
    if (!poolValue) return '-'

    return abbreviatedNumber(decimal(poolValue, decimals))
  }, [poolValue, decimals])

  return <FigureLayout className={className} value={value} name='Pool Value (TVL)' loading={loading} color='#2762ff' />
}
