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
  netAssetValue: string
  timestamp: string
  totalEverNumberOfLoans: string
  totalReserve: string
  __typename: string
}

interface ApiData {
  __typename: string
  poolSnapshots: Nodes<PoolSnapshot>
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
  const { decimals } = usePool()

  const query = gql`
    query GetPoolDevelopment($poolId: String!, $from: Datetime!, $to: Datetime!) {
      poolSnapshots(
        first: 1000
        orderBy: TIMESTAMP_ASC
        filter: { id: { startsWith: $poolId }, timestamp: { greaterThanOrEqualTo: $from, lessThanOrEqualTo: $to } }
      ) {
        totalCount
        nodes {
          id
          timestamp
          totalReserve
          netAssetValue
          totalEverNumberOfLoans
        }
      }
    }
  `

  const variables = useMemo(
    () => ({
      poolId: selections.pool?.[0],
      from: new Date('2022-06-04'),
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

  const sharesData = useMemo<SharesData[]>(() => {
    const totalReserves =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, totalReserve }): SharesData => ({
          share: 'Liquidity Reserve',
          value: decimal(totalReserve, decimals),
          timestamp: new Date(timestamp),
        })
      ) || []
    const netAssetValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, netAssetValue }): SharesData => ({
          share: 'Pool NAV',
          value: decimal(netAssetValue, decimals),
          timestamp: new Date(timestamp),
        })
      ) || []

    // TODO: replace ...netAssetValues by ...trancheAValues, ...trancheBValues, etc.
    return [...totalReserves, ...netAssetValues]
  }, [data, decimals])

  const sumsData = useMemo<SumsData[]>(() => {
    const poolValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, totalReserve, netAssetValue }): SumsData => ({
          sum: 'Pool Value',
          value: decimal(totalReserve, decimals) + decimal(netAssetValue, decimals),
          timestamp: new Date(timestamp),
        })
      ) || []
    const netAssetValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, netAssetValue }): SumsData => ({
          sum: 'Pool NAV',
          value: decimal(netAssetValue, decimals),
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
            color: ['#2762ff', '#fcbb59', '#ccc'],
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
                text: 'DAI',
                spacing: 5,
                style: {
                  fill: '#8d8d8d',
                },
              },
            },
            meta,
            color: ['#2762ff', '#fcbb59', '#ccc'],
          },
        },
      ],
    }
  }, [sumsData, sharesData])

  const kpis = useMemo<WidgetKPI[]>(() => {
    const poolSnapshots = data?.poolSnapshots?.nodes || []

    if (!poolSnapshots.length) return []

    const first = poolSnapshots[0]
    const last = poolSnapshots[poolSnapshots.length - 1]

    return [
      {
        label: 'Pool value growth',
        value: roundedNumber(
          (100 * (decimal(last.netAssetValue, decimals) - decimal(first.netAssetValue, decimals))) /
            decimal(first.netAssetValue, decimals),
          { decimals: 1 }
        ),
        suffix: '%',
      },
      {
        label: 'Liquidity reserve as % of pool value',
        value: roundedNumber(
          (100 * decimal(last.totalReserve, decimals)) /
            (decimal(last.totalReserve, decimals) + decimal(last.netAssetValue, decimals)),
          { decimals: 1 }
        ),
        suffix: '%',
      },
      {
        label: '',
      },
      {
        label: '# of loans',
        value: last.totalEverNumberOfLoans,
      },
      {
        label: '# of loans growth',
        value: roundedNumber(
          (100 * (Number(last.totalEverNumberOfLoans) - Number(first.totalEverNumberOfLoans))) /
            Number(first.totalEverNumberOfLoans),
          { decimals: 1 }
        ),
        suffix: '%',
      },
      {
        label: '',
      },
      {
        label: 'Avg. loan size',
        value: abbreviatedNumber(decimal(last.netAssetValue, decimals) / Number(last.totalEverNumberOfLoans)),
        prefix: 'DAI',
      },
    ]
  }, [data, decimals])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      info={<WidgetKPIs kpis={kpis} />}
      loading={loading}
      title='Pool Development'
    />
  )
}
