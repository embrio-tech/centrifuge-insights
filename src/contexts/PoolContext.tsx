import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { gql } from '@apollo/client'
import { useGraphQL, usePoolsMetadata } from '../hooks'
import type { Currency, PoolMetadata } from '../models'
import { useFilters } from './FiltersContext'

interface PoolContextInterface {
  poolId?: string
  poolMetadata?: PoolMetadata
  poolState?: PoolState
  loading: boolean
  decimals?: number
}

interface PoolState {
  value: string
  totalEverBorrowed: string
}

interface ApiData {
  pool: {
    id: string
    metadata: string
    currency: Currency
  }
  poolState: PoolState
}

const PoolContext = createContext<PoolContextInterface | undefined>(undefined)

const PoolContextProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  const { selection, filterReady } = useFilters('pool')

  const query = gql`
    query GetPool($poolId: String!) {
      pool(id: $poolId) {
        id
        metadata
        currency {
          id
          decimals
        }
      }
      poolState(id: $poolId) {
        value
        totalEverBorrowed
      }
    }
  `

  const poolId = useMemo(() => selection?.[0], [selection])

  const variables = useMemo(
    () => ({
      poolId,
    }),
    [poolId]
  )

  const skip = useMemo(
    () => Object.values(variables).every((variable) => !variable) || !filterReady,
    [variables, filterReady]
  )

  const { loading: poolLoading, data } = useGraphQL<ApiData>(query, {
    variables,
    skip,
  })

  const poolState = useMemo(() => data?.poolState, [data])

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
      poolState,
      loading,
      decimals,
    }),
    [poolId, poolMetadata, poolState, loading, decimals]
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
