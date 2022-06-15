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
  const { setSelection, selection, setFilterStatus, filterReady } = useFilters(id)

  // fetch list of pools with metadata paths
  const query = gql`
    query GetPoolsMetadata {
      pools(first: 100, orderBy: CREATED_AT_ASC) {
        nodes {
          id
          metadata
        }
        totalCount
      }
    }
  `
  const { data, loading: optionsLoading } = useGraphQL<ApiData>(query)
  const pools = useMemo<Pool[]>(() => {
    const { pools } = data || {}
    const { nodes = [], totalCount = 0 } = pools || {}
    if (nodes.length !== totalCount) throw new Error('Not all pools fetched because of pagination (first: 100).')
    return nodes
  }, [data])

  // fetch metadata
  const metadataPaths = useMemo<string[]>(() => pools.map(({ metadata }) => metadata), [pools])
  const { poolsMetadata, loading: metadataLoading } = usePoolsMetadata(metadataPaths)

  // derive filters selection options from pools and poolsMetadata
  const options = useMemo<{ label: string; value: string }[]>(
    () =>
      pools.map(({ id, metadata }) => ({
        label: poolsMetadata[metadata]?.pool.name || id,
        value: id,
      })),
    [pools, poolsMetadata]
  )

  // onChange: store new selection to FiltersContext
  const onChange = (value: string) => {
    if (value) setSelection(id, [value])
  }

  // read selected option from FiltersContext
  const selected = useMemo(() => (selection?.length === 1 ? selection[0] : undefined), [selection])

  // effect to make sure an existing option is always selected
  useEffect(() => {
    if (id && options.length) {
      if (!selected || options.findIndex((option) => option.value === selected) === -1) {
        setFilterStatus(id, false)
        setSelection(id, [options[0].value])
      }
      if (!filterReady) setFilterStatus(id, true)
    }
  }, [options, id, setSelection, selected, setFilterStatus, filterReady])

  return (
    <FilterLabel className={className} label='Pool'>
      <Select
        value={selected}
        options={options}
        className='w-full'
        loading={optionsLoading || metadataLoading}
        onChange={onChange}
      />
    </FilterLabel>
  )
}
