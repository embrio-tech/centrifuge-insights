import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { gql } from '@apollo/client'
import { useGraphQL, usePoolsMetadata } from '../hooks'
import type { Currency, PoolMetadata } from '../models'
import { useFilters } from './FiltersContext'

interface PoolContextInterface {
  poolId?: string
  poolMetadata?: PoolMetadata
  loading: boolean
  decimals?: number
}

interface ApiData {
  pool: {
    id: string
    metadata: string
    currency: Currency
  }
}

const PoolContext = createContext<PoolContextInterface | undefined>(undefined)

const PoolContextProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  const { selections, filtersReady } = useFilters()

  const query = gql`
    query GetPoolMetadata($poolId: String!) {
      pool(id: $poolId) {
        id
        metadata
        currency {
          id
          decimals
        }
      }
    }
  `

  const poolId = useMemo(() => selections.pool?.[0], [selections])

  const variables = useMemo(
    () => ({
      poolId,
    }),
    [poolId]
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

  const decimals = useMemo(() => data?.pool?.currency.decimals, [data])

  const loading = useMemo(() => poolLoading || metadataLoading, [poolLoading, metadataLoading])

  const value = useMemo<PoolContextInterface>(
    () => ({
      poolId,
      poolMetadata,
      loading,
      decimals,
    }),
    [poolId, poolMetadata, loading, decimals]
  )

  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>
}

const usePool = (): PoolContextInterface => {
  const context = useContext(PoolContext)
  if (!context) {
    throw new Error('usePool must be inside a Provider with a value')
  }
  return context
}

export { PoolContextProvider, usePool }
