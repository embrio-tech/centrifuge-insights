import React, { useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Line as LineChart, LineConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { WidgetKPI, WidgetKPIs } from '../util'
import { abbreviatedNumber, textDate } from '../../../../util'

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

interface ChartData {
  timestamp: Date
  value: number
  series: string
}

export const PoolDevelopment: React.FC<PoolDevelopmentProps> = (props) => {
  const { className } = props

  // TODO: set these variables from filters
  const poolId = '3075481758'
  const from: Date = new Date('2022-05-07')
  const to: Date = new Date('2022-05-14')

  const query = gql`
    query getPoolDevelopment($poolId: String!, $from: Datetime, $to: Datetime) {
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

  const { loading, data } = useQuery<ApiData>(query, { variables: { poolId, from, to } })

  const chartData = useMemo<ChartData[]>(() => {
    const totalReserves =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, totalReserve }): ChartData => ({
          series: 'Liquidity Reserve',
          value: Number(totalReserve),
          timestamp: new Date(timestamp),
        })
      ) || []
    const netAssetValues =
      data?.poolSnapshots?.nodes?.map(
        ({ timestamp, netAssetValue }): ChartData => ({
          series: 'Pool NAV',
          value: Number(netAssetValue),
          timestamp: new Date(timestamp),
        })
      ) || []
    return [...totalReserves, ...netAssetValues]
  }, [data])

  const chartConfig = useMemo<LineConfig>(
    () => ({
      data: chartData,
      xField: 'timestamp',
      yField: 'value',
      legend: {
        layout: 'horizontal',
        position: 'bottom',
        offsetY: 12,
      },
      seriesField: 'series',
      stepType: 'hvh',
      yAxis: {
        title: {
          text: 'DAI / USD',
        },
      },
      meta: {
        timestamp: {
          type: 'timeCat',
          formatter: (v: Date) => textDate(v),
        },
        value: {
          type: 'linear',
          // TODO: check magnitude of values
          formatter: (v) => abbreviatedNumber(v / 10 ** 18),
        },
      },
    }),
    [chartData]
  )

  const kpis: WidgetKPI[] = [
    {
      label: 'Pool value growth',
      value: 64,
      unit: '%',
    },
    {
      label: 'Liquidity reserve as % of pool value',
      value: 4,
      unit: '%',
    },
    {
      label: '',
    },
    {
      label: '# of loans',
      value: '4150',
    },
  ]

  return (
    <ChartLayout
      className={className}
      chart={
        <LineChart {...chartConfig} />
      }
      info={<WidgetKPIs kpis={kpis} />}
      loading={loading}
      title='Pool Development'
    />
  )
}
