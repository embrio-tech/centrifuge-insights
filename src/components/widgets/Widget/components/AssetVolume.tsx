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
  const { decimals, sumBorrowedAmount, loading } = usePool()

  const value = useMemo<string>(() => {
    if (!sumBorrowedAmount) return '-'

    return abbreviatedNumber(decimal(sumBorrowedAmount, decimals))
  }, [sumBorrowedAmount, decimals])

  return (
    <FigureLayout
      className={className}
      value={value}
      name='Asset Volume (cumulated)'
      loading={loading}
      color={'#fcbb59'}
    />
  )
}
