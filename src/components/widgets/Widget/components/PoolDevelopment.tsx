import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { WidgetKPI, WidgetKPIs } from '../util'
import { abbreviatedNumber, textDate, decimal, roundedNumber } from '../../../../util'
import { Meta } from '@antv/g2plot'
import { useGraphQL } from '../../../../hooks'
import { useFilters, usePool } from '../../../../contexts'
import { Nodes } from '../../../../types'

// import './PoolDevelopment.less'

interface PoolDevelopmentProps {
  className?: string
}

interface PoolSnapshot {
  id: string
  portfolioValuation: string
  timestamp: string
  sumNumberOfLoans: string
  totalReserve: string
  __typename: string
}

interface TrancheSnapshot {
  id: string
  timestamp: string
  trancheId: string
  sumDebt: string
  tranche: {
    trancheId: string
  }
}

interface ApiData {
  __typename: string
  poolSnapshots: Nodes<PoolSnapshot>
  trancheSnapshots: Nodes<TrancheSnapshot>
}

interface SharesData {
  timestamp: Date
  value: number
  share: string
}

interface SumsData {
  timestamp: Date
  value: number
  sum: string
}

export const PoolDevelopment: React.FC<PoolDevelopmentProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()
  const { decimals, poolMetadata, loading: poolLoading, currency } = usePool()

  const query = gql`
    query GetPoolDevelopment($poolId: String!, $from: Datetime!, $to: Datetime!, $tranches: [TrancheSnapshotFilter!]) {
      poolSnapshots(
        first: 100
        orderBy: TIMESTAMP_ASC
        filter: { id: { startsWith: $poolId }, timestamp: { greaterThanOrEqualTo: $from, lessThanOrEqualTo: $to } }
      ) {
        totalCount
        nodes {
          id
          timestamp
          totalReserve
          portfolioValuation
          sumNumberOfLoans
        }
      }
      trancheSnapshots(
        first: 100
        orderBy: TIMESTAMP_ASC
        filter: {
          id: { startsWith: $poolId }
          timestamp: { greaterThanOrEqualTo: $from, lessThanOrEqualTo: $to }
          or: $tranches
        }
      ) {
        totalCount
        nodes {
          id
          trancheId
          timestamp
          sumDebt
          tranche {
            trancheId
          }
        }
      }
    }
  `

  const variables = useMemo(() => {
    const to = new Date()
    const days = Math.floor(100 / (selections.tranches?.length || 1))
    const from = new Date()
    from.setDate(from.getDate() - days)

    return {
      poolId: selections.pool?.[0],
      to,
      from,
      tranches: selections.tranches?.map((trancheId) => ({ trancheId: { endsWith: trancheId } })),
    }
  }, [selections])

  const skip = useMemo(
    () => Object.values(variables).every((variable) => !variable) || !filtersReady,
    [variables, filtersReady]
  )

  const { loading: dataLoading, data } = useGraphQL<ApiData>(query, {
    variables,
    skip,
  })

  const sharesData = useMemo<SharesData[]>(() => {
    const totalReserves =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, totalReserve }): SharesData => ({
          share: 'Liquidity Reserve',
          value: decimal(totalReserve, decimals),
          timestamp: new Date(timestamp),
        })
      ) || []

    const trancheDebtValues =
      data?.trancheSnapshots?.nodes?.map(
        ({ timestamp, sumDebt, tranche: { trancheId } }): SharesData => ({
          share: poolMetadata?.tranches[trancheId]
            ? `${poolMetadata.tranches[trancheId].name} (${poolMetadata.tranches[trancheId].symbol})`
            : trancheId,
          value: decimal(sumDebt, decimals),
          timestamp: new Date(timestamp),
        })
      ) || []

    return [...totalReserves, ...trancheDebtValues]
  }, [data, decimals, poolMetadata])

  const sumsData = useMemo<SumsData[]>(() => {
    const poolValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, totalReserve, portfolioValuation }): SumsData => ({
          sum: 'Pool Value',
          value: decimal(totalReserve, decimals) + decimal(portfolioValuation, decimals),
          timestamp: new Date(timestamp),
        })
      ) || []
    const netAssetValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, portfolioValuation }): SumsData => ({
          sum: 'Pool NAV',
          value: decimal(portfolioValuation, decimals),
          timestamp: new Date(timestamp),
        })
      ) || []

    return [...poolValues, ...netAssetValues]
  }, [data, decimals])

  const chartConfig = useMemo<MixConfig>(() => {
    const maxValue = sumsData.length
      ? Math.max(...sumsData.filter(({ sum }) => sum === 'Pool Value').map(({ value }) => value))
      : 1000

    const meta: Record<string, Meta> = {
      timestamp: {
        type: 'timeCat',
        formatter: (v: Date) => textDate(v),
      },
      value: {
        formatter: (v: number) => abbreviatedNumber(v),
        max: Math.round((maxValue * 1.2) / 100) * 100,
        tickCount: 6,
        maxTickCount: 6,
      },
    }

    return {
      tooltip: {
        shared: true,
        reversed: false,
      },
      legend: {
        share: {
          layout: 'horizontal',
          position: 'bottom',
          reversed: true,
          padding: [0, 0, 0, 0],
        },
        sum: {
          layout: 'horizontal',
          position: 'bottom',
          reversed: false,
          padding: [10, 0, 0, 0],
        },
      },
      syncViewPadding: true,
      plots: [
        {
          type: 'area',
          options: {
            data: sharesData,
            xField: 'timestamp',
            yField: 'value',
            seriesField: 'share',
            xAxis: {
              line: null,
              label: null,
            },
            yAxis: {
              label: null,
              grid: null,
            },
            line: false,
            meta,
            color: ['#2762ff', '#fcbb59', '#e6017a', '#ccc', '#20B880'],
          },
        },
        {
          type: 'line',
          options: {
            data: sumsData,
            xField: 'timestamp',
            yField: 'value',
            seriesField: 'sum',
            yAxis: {
              title: {
                text: currency,
                spacing: 5,
                style: {
                  fill: '#8d8d8d',
                },
              },
            },
            meta,
            color: ['#2762ff', '#fcbb59', '#e6017a', '#ccc', '#20B880'],
          },
        },
      ],
    }
  }, [sumsData, sharesData, currency])

  const kpis = useMemo<WidgetKPI[]>(() => {
    const poolSnapshots = data?.poolSnapshots?.nodes || []

    if (!poolSnapshots.length) return []

    const first = poolSnapshots[0]
    const last = poolSnapshots[poolSnapshots.length - 1]

    return [
      {
        label: 'Pool value growth',
        value: roundedNumber(
          (100 * (decimal(last.portfolioValuation, decimals) - decimal(first.portfolioValuation, decimals))) /
            decimal(first.portfolioValuation, decimals),
          { decimals: 1 }
        ),
        suffix: '%',
      },
      {
        label: 'Liquidity reserve as % of pool value',
        value: roundedNumber(
          (100 * decimal(last.totalReserve, decimals)) /
            (decimal(last.totalReserve, decimals) + decimal(last.portfolioValuation, decimals)),
          { decimals: 1 }
        ),
        suffix: '%',
      },
      {
        label: '',
      },
      {
        label: '# of loans',
        value: last.sumNumberOfLoans,
      },
      {
        label: '# of loans growth',
        value: roundedNumber(
          (100 * (Number(last.sumNumberOfLoans) - Number(first.sumNumberOfLoans))) /
            Number(first.sumNumberOfLoans),
          { decimals: 1 }
        ),
        suffix: '%',
      },
      {
        label: '',
      },
      {
        label: 'Avg. loan size',
        value: abbreviatedNumber(decimal(last.portfolioValuation, decimals) / Number(last.sumNumberOfLoans)),
        prefix: currency,
      },
    ]
  }, [data, decimals, currency])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      info={<WidgetKPIs kpis={kpis} />}
      loading={dataLoading || poolLoading}
      title='Pool Development'
    />
  )
}
