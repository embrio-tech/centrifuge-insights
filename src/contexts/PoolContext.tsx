import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { gql } from '@apollo/client'
import { useGraphQL, usePoolsMetadata } from '../hooks'
import type { Currency, PoolMetadata } from '../models'
import { useFilters } from './FiltersContext'

interface PoolContextInterface {
  poolId?: string
  poolMetadata?: PoolMetadata
  poolValue?: string
  sumBorrowedAmount?: string
  loading: boolean
  decimals?: number
  currency?: string
}

interface ApiData {
  pool: {
    id: string
    metadata: string
    currency: Currency
    value: string
    sumBorrowedAmount: string
  }
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
        value
        sumBorrowedAmount
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

  const poolValue = useMemo(() => data?.pool?.value, [data])

  const sumBorrowedAmount = useMemo(() => data?.pool?.sumBorrowedAmount, [data])

  // fetch metadata
  const metadataPaths = useMemo(() => (data?.pool.metadata ? [data.pool.metadata] : []), [data])
  const { poolsMetadata, loading: metadataLoading } = usePoolsMetadata(metadataPaths)

  const poolMetadata = useMemo(
    () => (data?.pool.metadata ? poolsMetadata?.[data.pool.metadata] : undefined),
    [poolsMetadata, data]
  )

  const decimals = useMemo(() => data?.pool?.currency.decimals, [data])

  const currency = useMemo(() => data?.pool?.currency.id, [data])

  const loading = useMemo(() => poolLoading || metadataLoading, [poolLoading, metadataLoading])

  const value = useMemo<PoolContextInterface>(
    () => ({
      poolId,
      poolMetadata,
      poolValue,
      sumBorrowedAmount,
      loading,
      decimals,
      currency,
    }),
    [poolId, poolMetadata, poolValue, sumBorrowedAmount, loading, decimals, currency]
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
