import { gql } from '@apollo/client'
import React, { useMemo } from 'react'
import { useFilters, usePool } from '../../../../contexts'
import { useGraphQL } from '../../../../hooks'
import { Nodes } from '../../../../types'
import { abbreviatedNumber, textDate, ray, fitAxis } from '../../../../util'
import { ChartLayout } from '../layouts'
import { WidgetKPI, WidgetKPIs } from '../util'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import type { Meta } from '@antv/g2plot'
// import './TokenPriceDevelopment.less'

interface TokenPriceDevelopmentProps {
  className?: string
}

interface TrancheSnapshot {
  id: string
  timestamp: string
  trancheId: string
  price: string | null
  tranche: {
    trancheId: string
  }
}

interface ApiData {
  trancheSnapshots: Nodes<TrancheSnapshot>
}

export const TokenPriceDevelopment: React.FC<TokenPriceDevelopmentProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()
  const { poolMetadata, loading: poolLoading } = usePool()

  const query = gql`
    query getTokenPrices($poolId: String!, $from: Datetime!, $to: Datetime!) {
      trancheSnapshots(
        first: 1000
        orderBy: TIMESTAMP_ASC
        filter: { id: { startsWith: $poolId }, timestamp: { greaterThanOrEqualTo: $from, lessThanOrEqualTo: $to } }
      ) {
        totalCount
        nodes {
          id
          trancheId
          timestamp
          price
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

  const priceData = useMemo(
    () =>
      data?.trancheSnapshots?.nodes?.map(({ price, timestamp, tranche: { trancheId } }) => ({
        value: ray(price),
        price: poolMetadata?.tranches[trancheId]
          ? `${poolMetadata.tranches[trancheId].name} (${poolMetadata.tranches[trancheId].symbol})`
          : trancheId,
        timestamp: new Date(timestamp),
      })) || [],
    [data, poolMetadata]
  )

  const chartConfig = useMemo<MixConfig>(() => {
    // TODO: uncomment for secondary axis
    // const { primaryAxisMin, primaryAxisMax } = syncAxes(
    //   priceData.map(({ value }) => value),
    //   [0, 1] // TODO: replace with real vals
    // )

    const { axisMin, axisMax } = fitAxis(priceData.map(({ value }) => value))

    const meta: Record<string, Meta> = {
      timestamp: {
        type: 'timeCat',
        formatter: (v: Date) => textDate(v),
      },
      value: {
        type: 'linear',
        formatter: (v: number) => abbreviatedNumber(v),
        max: axisMax,
        min: axisMin,
        tickCount: 6,
        maxTickCount: 6,
      },
      // TODO: uncomment for secondary axis
      // percentage: {
      //   type: 'linear',
      //   formatter: (v: number) => abbreviatedNumber(v * 100) + '%',
      //   max: secondaryAxisMax,
      //   min: secondaryAxisMin,
      //   tickCount: 6,
      //   maxTickCount: 6,
      // },
    }

    return {
      tooltip: {
        shared: true,
        reversed: false,
      },
      legend: {
        price: {
          layout: 'horizontal',
          position: 'bottom',
          reversed: true,
          padding: [10, 0, 0, 0],
        },
        // TODO: uncomment for secondary axis
        // tbd: {
        //   layout: 'horizontal',
        //   position: 'bottom',
        //   reversed: false,
        //   padding: [10, 0, 0, 0],
        // },
      },
      syncViewPadding: true,
      plots: [
        // TODO: uncomment for secondary axis
        // {
        //   type: 'column',
        //   options: {
        //     data: [],
        //     xField: 'timestamp',
        //     yField: 'percentage',
        //     isStack: true,
        //     seriesField: 'tbd',
        //     xAxis: {
        //       line: null,
        //       label: null,
        //     },
        //     yAxis: {
        //       grid: null,
        //       position: 'right',
        //     },
        //     meta,
        //     color: ['#2762ff', '#fcbb59', '#e6017a', '#ccc'],
        //   },
        // },
        {
          type: 'line',
          options: {
            data: priceData,
            xField: 'timestamp',
            yField: 'value',
            seriesField: 'price',
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
            color: ['#2762ff', '#fcbb59', '#e6017a', '#ccc'],
          },
        },
      ],
    }
  }, [priceData])

  const kpis = useMemo<WidgetKPI[]>(() => {
    const trancheSnapshots = data?.trancheSnapshots?.nodes || []

    if (!trancheSnapshots.length || !poolMetadata) return []

    const tranchesIds = [...new Set(trancheSnapshots.map(({ tranche: { trancheId } }) => trancheId))]

    const lastTrancheSnapshots = trancheSnapshots.slice(-tranchesIds.length)

    return [
      ...lastTrancheSnapshots.map(({ price, tranche: { trancheId } }) => ({
        label: `Price ${
          poolMetadata.tranches[trancheId]
            ? `${poolMetadata.tranches[trancheId].name} (${poolMetadata.tranches[trancheId].symbol})`
            : trancheId
        }`,
        value: abbreviatedNumber(ray(price)),
        prefix: 'DAI',
      })),
    ]
  }, [data, poolMetadata])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      info={<WidgetKPIs kpis={kpis} />}
      loading={poolLoading || dataLoading}
      title='Token Price Development'
    />
  )
}
