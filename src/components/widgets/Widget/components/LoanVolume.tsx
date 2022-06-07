import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { abbreviatedNumber, wad } from '../../../../util'
import { FigureLayout } from '../layouts'
import { useFetch } from '../../../../hooks'

// import './LoanVolume.less'

interface LoanVolumeProps {
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

export const LoanVolume: React.FC<LoanVolumeProps> = (props) => {
  const { className } = props

  // TODO: set these variables from filters
  const poolId = '3075481758'
  const to: Date = new Date('2022-05-14')

  const query = gql`
    query getPoolLoanVolume($poolId: String!, $to: Datetime!) {
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

  const { loading, data } = useFetch<ApiData>(query, {
    variables: { poolId, to },
  })

  const value = useMemo<string>(() => {
    const poolSnapshots = data?.poolSnapshots?.nodes || []

    if (poolSnapshots.length !== 1) return '-'

    return abbreviatedNumber(wad(poolSnapshots[0].totalEverBorrowed))
  }, [data])

  return (
    <FigureLayout
      className={className}
      value={value}
      name='Loan Volume'
      loading={loading}
      color={'#fcbb59'}
    />
  )
}
