import React from 'react'
import { usePool } from '../../../../contexts'
import { FigureLayout } from '../layouts'

// import './PoolAssetClass.less'

interface PoolAssetClassProps {
  className?: string
}

export const PoolAssetClass: React.FC<PoolAssetClassProps> = (props) => {
  const { className } = props
  const { poolMetadata, loading: poolLoading } = usePool()

  return (
    <FigureLayout
      className={className}
      value={poolMetadata?.pool?.asset?.class || '–'}
      name='Asset Type'
      color={'#2762ff'}
      loading={poolLoading}
    />
  )
}
