import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { WidgetKPI, WidgetKPIs } from '../util'
import { abbreviatedNumber, syncAxes, textDate } from '../../../../util'
import { Meta } from '@antv/g2plot'
import { useGraphQL } from '../../../../hooks'
import { useFilters } from '../../../../contexts'
import { Nodes } from '../../../../types'

// import './Returns.less'

interface ReturnsProps {
  className?: string
}

interface ApiData {
  __typename: string
  poolSnapshots: Nodes
}

export const Returns: React.FC<ReturnsProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()

  // const from = new Date('2022-01-01')
  // const to = new Date('2022-05-31')

  const query = gql`
    query getPoolDevelopment($poolId: String!, $from: Datetime!, $to: Datetime!) {
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

  const { loading } = useGraphQL<ApiData>(query, {
    variables,
    skip,
  })

  const chartConfig = useMemo<MixConfig>(() => {
    const { primaryAxisMin, primaryAxisMax, secondaryAxisMin, secondaryAxisMax } = syncAxes([], [])

    const meta: Record<string, Meta> = {
      timestamp: {
        type: 'timeCat',
        formatter: (v: Date) => textDate(v),
      },
      value: {
        type: 'linear',
        formatter: (v: number) => abbreviatedNumber(v),
        max: primaryAxisMax,
        min: primaryAxisMin,
        tickCount: 6,
        maxTickCount: 6,
      },
      percentage: {
        type: 'linear',
        formatter: (v: number) => abbreviatedNumber(v * 100) + '%',
        max: secondaryAxisMax,
        min: secondaryAxisMin,
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
        yield: {
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
          type: 'column',
          options: {
            data: [],
            xField: 'timestamp',
            yField: 'value',
            isStack: true,
            seriesField: 'flow',
            xAxis: {
              line: null,
              label: null,
            },
            yAxis: {
              grid: null,
              position: 'right',
              title: {
                text: 'DAI',
                spacing: 5,
                style: {
                  fill: '#8d8d8d',
                },
              },
            },
            meta,
            color: ['#2762ff', '#ccc'],
          },
        },
        {
          type: 'line',
          options: {
            data: [],
            xField: 'timestamp',
            yField: 'percentage',
            seriesField: 'yield',
            meta,
            color: ['#e6017a'],
          },
        },
      ],
    }
  }, [])

  const kpis = useMemo<WidgetKPI[]>(() => {
    return [
      {
        label: 'Pool value growth',
        value: abbreviatedNumber(3709475943725),
        suffix: '%',
      },
    ]
  }, [])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      info={<WidgetKPIs kpis={kpis} />}
      loading={loading}
      title='Returns'
    />
  )
}
