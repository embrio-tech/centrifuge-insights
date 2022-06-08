import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { useFetch } from '../../../../hooks'
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

  const options = useMemo<SelectFilterOption[]>(() => {
    const { pools } = data || {}
    const { nodes = [], totalCount = 0 } = pools || {}
    if (nodes.length !== totalCount) throw new Error('Not all pools fetched because of pagination (first: 100).')
    return nodes.map(({ id }) => ({
      label: id, // TODO: fetch poolname from IPFS
      value: id,
    }))
  }, [data])

  return <SelectFilter className={className} label='Pool' options={options} loading={loading} />
}
