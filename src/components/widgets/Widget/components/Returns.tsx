import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { WidgetKPI, WidgetKPIs } from '../util'
import { abbreviatedNumber, ray, roundedNumber, syncAxes, textDate } from '../../../../util'
import { Meta } from '@antv/g2plot'
import { useGraphQL } from '../../../../hooks'
import { useFilters, usePool } from '../../../../contexts'
import { Nodes } from '../../../../types'

// import './Returns.less'

interface ReturnsProps {
  className?: string
}

interface TrancheSnapshot {
  id: string
  timestamp: string
  trancheId: string
  yieldSinceInception: string | null
  tranche: {
    trancheId: string
  }
}

interface ApiData {
  trancheSnapshots: Nodes<TrancheSnapshot>
}

interface YieldData {
  yield: string
  percentage: number
  timestamp: Date
}

export const Returns: React.FC<ReturnsProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()
  const { poolMetadata, loading: poolLoading } = usePool()

  const query = gql`
    query GetReturns($poolId: String!, $from: Datetime!, $to: Datetime!, $tranches: [TrancheSnapshotFilter!]) {
      trancheSnapshots(
        first: 1000
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
          yieldSinceInception
          tranche {
            trancheId
          }
        }
      }
    }
  `

  const variables = useMemo(
    () => ({
      poolId: selections.pool?.[0],
      from: new Date('2022-06-04'),
      to: new Date(),
      tranches: selections.tranches?.map((trancheId) => ({ trancheId: { endsWith: trancheId } })),
    }),
    [selections]
  )

  const skip = useMemo(
    () =>
      Object.values(variables).reduce((variableMissing, variable) => variableMissing || !variable, false) ||
      !filtersReady,
    [variables, filtersReady]
  )

  const { loading: dataLoading, data } = useGraphQL<ApiData>(query, {
    variables,
    skip,
  })

  const yieldData = useMemo<YieldData[]>(
    () =>
      data?.trancheSnapshots?.nodes?.map(({ yieldSinceInception, timestamp, tranche: { trancheId } }) => ({
        percentage: ray(yieldSinceInception),
        yield: poolMetadata?.tranches[trancheId]
          ? `${poolMetadata.tranches[trancheId].name} (${poolMetadata.tranches[trancheId].symbol})`
          : trancheId,
        timestamp: new Date(timestamp),
      })) || [],
    [data, poolMetadata]
  )

  const chartConfig = useMemo<MixConfig>(() => {
    const { primaryAxisMin, primaryAxisMax, secondaryAxisMin, secondaryAxisMax } = syncAxes(
      yieldData.map(({ percentage }) => percentage),
      [-1000, 5000] // TODO: replace with real vals
    )

    const meta: Record<string, Meta> = {
      timestamp: {
        type: 'timeCat',
        formatter: (v: Date) => textDate(v),
      },
      percentage: {
        type: 'linear',
        formatter: (v: number) => roundedNumber(v * 100, { decimals: 1 }) + '%',
        max: primaryAxisMax,
        min: primaryAxisMin,
        tickCount: 6,
        maxTickCount: 6,
      },
      value: {
        type: 'linear',
        formatter: (v: number) => abbreviatedNumber(v),
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
          padding: [10, 0, 0, 0],
        },
        default: {
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
            seriesField: 'default',
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
            color: ['#2762ff', '#fcbb59', '#e6017a', '#ccc'],
          },
        },
        {
          type: 'line',
          options: {
            data: yieldData,
            xField: 'timestamp',
            yField: 'percentage',
            seriesField: 'yield',
            meta,
            color: ['#2762ff', '#fcbb59', '#e6017a', '#ccc'],
          },
        },
      ],
    }
  }, [yieldData])

  const kpis = useMemo<WidgetKPI[]>(() => {
    const trancheSnapshots = data?.trancheSnapshots?.nodes || []

    if (!trancheSnapshots.length || !poolMetadata) return []

    const tranchesIds = [...new Set(trancheSnapshots.map(({ tranche: { trancheId } }) => trancheId))]

    const lastTrancheSnapshots = trancheSnapshots.slice(-tranchesIds.length)

    return [
      ...lastTrancheSnapshots.map(({ yieldSinceInception, tranche: { trancheId } }) => ({
        label: `APY ${
          poolMetadata.tranches[trancheId]
            ? `${poolMetadata.tranches[trancheId].name} (${poolMetadata.tranches[trancheId].symbol})`
            : trancheId
        }`,
        value: roundedNumber(ray(yieldSinceInception) * 100, { decimals: 1 }),
        suffix: '%',
      })),
    ]
  }, [data, poolMetadata])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      info={<WidgetKPIs kpis={kpis} />}
      loading={poolLoading || dataLoading}
      title='Returns'
    />
  )
}
