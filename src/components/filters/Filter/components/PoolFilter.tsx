import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { useFetch, usePoolsMetadata } from '../../../../hooks'
import { Pool } from '../../../../models'
import { SelectFilter, SelectFilterOption } from '../util'
// import './PoolFilter.less'

interface PoolFilterProps {
  className?: string
  id: string
}

interface ApiData {
  pools: {
    nodes: Pool[]
    totalCount: number
  }
}

export const PoolFilter: React.FC<PoolFilterProps> = (props) => {
  const { className } = props

  const query = gql`
    query GetPools {
      pools(first: 100) {
        nodes {
          id
          metadata
        }
        totalCount
      }
    }
  `

  const { data, loading } = useFetch<ApiData>(query)

  const pools = useMemo<Pool[]>(() => {
    const { pools } = data || {}
    const { nodes = [], totalCount = 0 } = pools || {}
    if (nodes.length !== totalCount) throw new Error('Not all pools fetched because of pagination (first: 100).')
    return nodes
  }, [data])

  const metadataPaths = useMemo<string[]>(() => pools.map(({ metadata }) => metadata), [pools])

  const poolsMetadata = usePoolsMetadata(metadataPaths)

  const options = useMemo<SelectFilterOption[]>(
    () =>
      pools.map(({ id, metadata }) => ({
        label: poolsMetadata[metadata]?.pool.name || id,
        value: id,
      })),
    [pools, poolsMetadata]
  )

  return <SelectFilter className={className} label='Pool' options={options} loading={loading} />
}
