import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { abbreviatedNumber, wad } from '../../../../util'
import { FigureLayout } from '../layouts'
import { useGraphQL } from '../../../../hooks'
import { useFilters } from '../../../../contexts'

// import './AssetVolume.less'

interface AssetVolumeProps {
  className?: string
}

interface ApiData {
  __typename: string
  poolSnapshots: {
    nodes: {
      id: string
      timestamp: string
      totalEverBorrowed: string
      __typename: string
    }[]
  }
}

export const AssetVolume: React.FC<AssetVolumeProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()

  const query = gql`
    query GetPoolAssetVolume($poolId: String!, $to: Datetime!) {
      poolSnapshots(
        first: 1
        orderBy: TIMESTAMP_DESC
        filter: { id: { startsWith: $poolId }, timestamp: { lessThanOrEqualTo: $to } }
      ) {
        nodes {
          id
          timestamp
          totalEverBorrowed
        }
      }
    }
  `

  const variables = useMemo(
    () => ({
      poolId: selections.pool?.[0],
      to: new Date(),
    }),
    [selections]
  )

  const skip = useMemo(
    () =>
      Object.values(variables).reduce((variableMissing, variable) => variableMissing || !variable, false) ||
      !filtersReady,
    [variables, filtersReady]
  )

  const { loading, data } = useGraphQL<ApiData>(query, {
    variables,
    skip,
  })

  const value = useMemo<string>(() => {
    const poolSnapshots = data?.poolSnapshots?.nodes || []

    if (poolSnapshots.length !== 1) return '-'

    return abbreviatedNumber(wad(poolSnapshots[0].totalEverBorrowed))
  }, [data])

  return <FigureLayout className={className} value={value} name='Asset Volume' loading={loading} color={'#fcbb59'} />
}
