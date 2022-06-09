import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { WidgetKPI, WidgetKPIs } from '../util'
import { abbreviatedNumber, textDate, wad } from '../../../../util'
import { Meta } from '@antv/g2plot'
import { useGraphQL } from '../../../../hooks'

// import './PoolDevelopment.less'

interface PoolDevelopmentProps {
  className?: string
}

interface ApiData {
  __typename: string
  poolSnapshots: {
    nodes: {
      id: string
      netAssetValue: string
      timestamp: string
      totalEverNumberOfLoans: string
      totalReserve: string
      __typename: string
    }[]
  }
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

  // TODO: set these variables from filters
  const poolId = '815196858113'
  const from: Date = new Date('2022-05-07')
  const to: Date = new Date('2022-05-14')

  // const from = new Date('2022-01-01')
  // const to = new Date('2022-05-31')

  const query = gql`
    query getPoolDevelopment($poolId: String!, $from: Datetime!, $to: Datetime!) {
      poolSnapshots(
        first: 1000
        orderBy: TIMESTAMP_ASC
        filter: { id: { startsWith: $poolId }, timestamp: { greaterThanOrEqualTo: $from, lessThanOrEqualTo: $to } }
      ) {
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

  const { loading, data } = useGraphQL<ApiData>(query, {
    variables: { poolId, from, to },
  })

  const sharesData = useMemo<SharesData[]>(() => {
    const totalReserves =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, totalReserve }): SharesData => ({
          share: 'Liquidity Reserve',
          value: Number(wad(totalReserve)),
          timestamp: new Date(timestamp),
        })
      ) || []
    const netAssetValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, netAssetValue }): SharesData => ({
          share: 'Pool NAV',
          value: Number(wad(netAssetValue)),
          timestamp: new Date(timestamp),
        })
      ) || []

    // TODO: replace ...netAssetValues by ...trancheAValues, ...trancheBValues, etc.
    return [...totalReserves, ...netAssetValues]
  }, [data])

  const sumsData = useMemo<SumsData[]>(() => {
    const poolValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, totalReserve, netAssetValue }): SumsData => ({
          sum: 'Pool Value',
          value: Number(wad(totalReserve)) + Number(wad(netAssetValue)),
          timestamp: new Date(timestamp),
        })
      ) || []
    const netAssetValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, netAssetValue }): SumsData => ({
          sum: 'Pool NAV',
          value: Number(wad(netAssetValue)),
          timestamp: new Date(timestamp),
        })
      ) || []

    return [...poolValues, ...netAssetValues]
  }, [data])

  const chartConfig = useMemo<MixConfig>(() => {
    const maxValue = Math.max(...sumsData.filter(({ sum }) => sum === 'Pool Value').map(({ value }) => value))

    const meta: Record<string, Meta> = {
      timestamp: {
        type: 'timeCat',
        formatter: (v: Date) => textDate(v),
      },
      value: {
        formatter: (v: number) => abbreviatedNumber(v),
        max: Math.round(maxValue * 1.3),
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
        value: ((100 * (wad(last.netAssetValue) - wad(first.netAssetValue))) / wad(first.netAssetValue)).toPrecision(3),
        unit: '%',
      },
      {
        label: 'Liquidity reserve as % of pool value',
        value: ((100 * wad(last.totalReserve)) / wad(last.netAssetValue)).toPrecision(3),
        unit: '%',
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
        value: (
          (100 * (Number(last.totalEverNumberOfLoans) - Number(first.totalEverNumberOfLoans))) /
          Number(first.totalEverNumberOfLoans)
        ).toPrecision(3),
        unit: '%',
      },
      {
        label: '',
      },
      {
        label: 'Avg. loan size',
        value: abbreviatedNumber(wad(last.netAssetValue) / Number(last.totalEverNumberOfLoans)),
      },
    ]
  }, [data])

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
