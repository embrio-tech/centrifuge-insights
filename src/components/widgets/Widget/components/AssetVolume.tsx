import React, { useMemo } from 'react'
import { abbreviatedNumber, decimal } from '../../../../util'
import { FigureLayout } from '../layouts'
import { usePool } from '../../../../contexts'
// import './AssetVolume.less'

interface AssetVolumeProps {
  className?: string
}

export const AssetVolume: React.FC<AssetVolumeProps> = (props) => {
  const { className } = props
  const { decimals, poolState, loading } = usePool()

  const value = useMemo<string>(() => {
    const totalEverBorrowed = poolState?.totalEverBorrowed

    if (!totalEverBorrowed) return '-'

    return abbreviatedNumber(decimal(totalEverBorrowed, decimals))
  }, [poolState, decimals])

  return (
    <FigureLayout className={className} value={value} name='Asset Volume (NAV)' loading={loading} color={'#fcbb59'} />
  )
}
