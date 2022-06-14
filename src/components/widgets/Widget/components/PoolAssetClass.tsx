import { gql } from '@apollo/client'
import React, { useMemo } from 'react'
import { useFilters } from '../../../../contexts'
import { useGraphQL, usePoolsMetadata } from '../../../../hooks'
import { FigureLayout } from '../layouts'

// import './PoolAssetClass.less'

interface PoolAssetClassProps {
  className?: string
}

interface ApiData {
  pool: {
    id: string
    metadata: string
  }
}

export const PoolAssetClass: React.FC<PoolAssetClassProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()

  const query = gql`
    query getPoolMetadata($poolId: String!) {
      pool(id: $poolId) {
        id
        metadata
      }
    }
  `

  const variables = useMemo(
    () => ({
      poolId: selections.pool?.[0],
    }),
    [selections]
  )

  const skip = useMemo(
    () =>
      Object.values(variables).reduce((variableMissing, variable) => variableMissing || !variable, false) ||
      !filtersReady,
    [variables, filtersReady]
  )

  const { loading: poolLoading, data } = useGraphQL<ApiData>(query, {
    variables,
    skip,
  })

  // fetch metadata
  const metadataPaths = useMemo(() => (data?.pool.metadata ? [data.pool.metadata] : []), [data])
  const { poolsMetadata, loading: metadataLoading } = usePoolsMetadata(metadataPaths)

  const poolMetadata = useMemo(
    () => (data?.pool.metadata ? poolsMetadata?.[data.pool.metadata] : undefined),
    [poolsMetadata, data]
  )

  return (
    <FigureLayout
      className={className}
      value={poolMetadata?.pool?.asset?.class || '–'}
      name='Asset Type'
      color={'#2762ff'}
      loading={poolLoading || metadataLoading}
    />
  )
}
