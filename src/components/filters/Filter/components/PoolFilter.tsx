import React, { useEffect, useMemo } from 'react'
import { gql } from '@apollo/client'
import { useGraphQL, usePoolsMetadata } from '../../../../hooks'
import { Pool } from '../../../../models'
import { FilterLabel } from '../util'
import { useFilters } from '../../../../contexts'
import { Select } from 'antd'

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
  const { className, id } = props
  const { setSelection, selection } = useFilters(id)

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

  const { data, loading } = useGraphQL<ApiData>(query)

  const pools = useMemo<Pool[]>(() => {
    const { pools } = data || {}
    const { nodes = [], totalCount = 0 } = pools || {}
    if (nodes.length !== totalCount) throw new Error('Not all pools fetched because of pagination (first: 100).')
    return nodes
  }, [data])

  const metadataPaths = useMemo<string[]>(() => pools.map(({ metadata }) => metadata), [pools])

  const poolsMetadata = usePoolsMetadata(metadataPaths)

  const options = useMemo<{ label: string; value: string }[]>(
    () =>
      pools.map(({ id, metadata }) => ({
        label: poolsMetadata[metadata]?.pool.name || id,
        value: id,
      })),
    [pools, poolsMetadata]
  )

  const onChange = (value: string) => {
    if (value) setSelection(id, [value])
  }

  const selected = useMemo(() => (selection?.length === 1 ? selection[0] : undefined), [selection])

  useEffect(() => {
    if (options.length && id && !selected) {
      setSelection(id, [options[0].value])
    }
  }, [options, id, setSelection, selected])

  return (
    <FilterLabel className={className} label='Pool'>
      <Select value={selected} options={options} className='w-full' loading={loading} onChange={onChange} />
    </FilterLabel>
  )
}
