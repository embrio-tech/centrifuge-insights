import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { abbreviatedNumber, syncAxes, textDate, decimal, roundedNumber } from '../../../../util'
import { Meta } from '@antv/g2plot'
import { Nodes } from '../../../../types'
import { useFilters, usePool } from '../../../../contexts'
import { useGraphQL } from '../../../../hooks'
import { WidgetKPI, WidgetKPIs } from '../util'

// import './FundingDevelopment.less'

interface FundingDevelopmentProps {
  className?: string
}

interface TrancheSnapshot {
  id: string
  timestamp: string
  trancheId: string
  fulfilledInvestOrders_: string
  fulfilledRedeemOrders_: string
}

interface PoolSnapshot {
  id: string
  timestamp: string
  totalReserve: string
  value: string
}

interface ApiData {
  trancheSnapshots: Nodes<TrancheSnapshot>
  poolSnapshots: Nodes<PoolSnapshot>
}

interface FlowData {
  timestamp: Date
  value: number
  flow: string
}

interface NetFlowData {
  timestamp: Date
  value: number
  netFlow: string
}

interface RelativeLiquidityReserve {
  timestamp: Date
  percentage: number
  share: string
}

export const FundingDevelopment: React.FC<FundingDevelopmentProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()
  const { decimals } = usePool()

  const query = gql`
    query GetFundingDevelopment($poolId: String!, $from: Datetime!, $to: Datetime!) {
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
          fulfilledInvestOrders_
          fulfilledRedeemOrders_
        }
      }
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
          value
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

  const flowsData = useMemo<FlowData[]>(() => {
    const inflows: FlowData[] =
      data?.trancheSnapshots?.nodes?.reduce((flowsData: FlowData[], { fulfilledInvestOrders_, timestamp }) => {
        const lastIndex = flowsData.length - 1
        const snapshotTimestamp = new Date(timestamp)
        if (flowsData[lastIndex]?.timestamp.valueOf() === snapshotTimestamp.valueOf()) {
          flowsData.splice(lastIndex, 1, {
            ...flowsData[lastIndex],
            value: flowsData[lastIndex].value + decimal(fulfilledInvestOrders_, decimals),
          })
        } else {
          flowsData.push({
            timestamp: snapshotTimestamp,
            value: decimal(fulfilledInvestOrders_, decimals),
            flow: 'Inflow',
          })
        }
        return flowsData
      }, []) || []

    const outflows: FlowData[] =
      data?.trancheSnapshots?.nodes?.reduce((flowsData: FlowData[], { fulfilledRedeemOrders_, timestamp }) => {
        const lastIndex = flowsData.length - 1
        const snapshotTimestamp = new Date(timestamp)
        if (flowsData[lastIndex]?.timestamp.valueOf() === snapshotTimestamp.valueOf()) {
          flowsData.splice(lastIndex, 1, {
            ...flowsData[lastIndex],
            value: flowsData[lastIndex].value - decimal(fulfilledRedeemOrders_, decimals),
          })
        } else {
          flowsData.push({
            timestamp: snapshotTimestamp,
            value: -decimal(fulfilledRedeemOrders_, decimals),
            flow: 'Outflow',
          })
        }
        return flowsData
      }, []) || []

    return [...inflows, ...outflows]
  }, [data, decimals])

  const netFlowsData = useMemo<NetFlowData[]>(
    () =>
      data?.trancheSnapshots?.nodes?.reduce(
        (flowsData: NetFlowData[], { fulfilledRedeemOrders_, fulfilledInvestOrders_, timestamp }) => {
          const lastIndex = flowsData.length - 1
          const snapshotTimestamp = new Date(timestamp)
          if (flowsData[lastIndex]?.timestamp.valueOf() === snapshotTimestamp.valueOf()) {
            flowsData.splice(lastIndex, 1, {
              ...flowsData[lastIndex],
              value:
                flowsData[lastIndex].value +
                decimal(fulfilledInvestOrders_, decimals) -
                decimal(fulfilledRedeemOrders_, decimals),
            })
          } else {
            flowsData.push({
              timestamp: snapshotTimestamp,
              value: decimal(fulfilledInvestOrders_, decimals) - decimal(fulfilledRedeemOrders_, decimals),
              netFlow: 'Net in-/outflow',
            })
          }
          return flowsData
        },
        []
      ) || [],
    [data, decimals]
  )

  const relativeLiquidityReserves = useMemo<RelativeLiquidityReserve[]>(
    () =>
      data?.poolSnapshots?.nodes?.map(({ timestamp, totalReserve, value }) => ({
        timestamp: new Date(timestamp),
        percentage: decimal(totalReserve, decimals) / decimal(value, decimals),
        share: 'Liquidity reserve as % of pool value',
      })) || [],
    [data, decimals]
  )

  const chartConfig = useMemo<MixConfig>(() => {
    // sync axes
    const { primaryAxisMin, primaryAxisMax, secondaryAxisMin, secondaryAxisMax } = syncAxes(
      flowsData.map(({ value }) => value),
      relativeLiquidityReserves.map(({ percentage }) => percentage || 0)
    )

    // shared meta object for all subcharts
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
        formatter: (v: number) => roundedNumber(v * 100, { decimals: 1 }) + '%',
        max: secondaryAxisMax,
        min: secondaryAxisMin,
        tickCount: 6,
        maxTickCount: 6,
      },
    }

    // return chart config
    return {
      tooltip: {
        shared: true,
      },
      legend: {
        flow: {
          layout: 'horizontal',
          position: 'bottom',
          padding: [0, 0, 0, 0],
        },
        netFlow: {
          layout: 'horizontal',
          position: 'bottom',
          padding: [0, 0, 0, 0],
        },
        share: {
          layout: 'horizontal',
          position: 'bottom',
          padding: [10, 0, 0, 0],
        },
      },
      syncViewPadding: true,
      plots: [
        {
          type: 'column',
          options: {
            data: flowsData,
            xField: 'timestamp',
            yField: 'value',
            isStack: true,
            seriesField: 'flow',
            xAxis: {
              line: null,
              label: null,
            },
            yAxis: {
              label: null,
              grid: null,
            },
            meta,
            color: ['#2762ff', '#ccc'],
          },
        },
        {
          type: 'line',
          options: {
            data: netFlowsData,
            xField: 'timestamp',
            yField: 'value',
            seriesField: 'netFlow',
            xAxis: {
              line: null,
              label: null,
            },
            yAxis: {
              title: {
                text: 'DAI',
                spacing: 5,
                style: {
                  fill: '#8d8d8d',
                },
              },
            },
            stepType: 'hvh',
            meta,
            color: ['#fcbb59'],
          },
        },
        {
          type: 'line',
          options: {
            data: relativeLiquidityReserves,
            xField: 'timestamp',
            yField: 'percentage',
            yAxis: {
              grid: null,
              position: 'right',
            },
            seriesField: 'share',
            meta,
            color: ['#e6017a'],
          },
        },
      ],
    }
  }, [flowsData, netFlowsData, relativeLiquidityReserves])

  const kpis = useMemo<WidgetKPI[]>(() => {
    const poolSnapshots = data?.poolSnapshots?.nodes || []
    const outflows = flowsData.filter(({ flow }) => flow === 'Outflow').map(({ value }) => value)

    if (!poolSnapshots.length || !outflows.length) return []

    const last = poolSnapshots[poolSnapshots.length - 1]

    return [
      {
        label: 'Liquidity reserve as % of pool value',
        value: roundedNumber((100 * decimal(last.totalReserve, decimals)) / decimal(last.value, decimals), {
          decimals: 1,
        }),
        suffix: '%',
      },
      {
        label: 'Avg. net funding (net in-/outflows)',
        value: abbreviatedNumber(
          netFlowsData.map(({ value }) => value).reduce((acc, current) => acc + current, 0) / netFlowsData.length
        ),
        prefix: 'DAI',
      },
      {
        label: 'Avg. outflows as % of pool value',
        value: roundedNumber(
          poolSnapshots
            .map(({ value }, index) => (100 * outflows[index]) / decimal(value, decimals))
            .reduce((acc, current) => acc + current || 0, 0) / poolSnapshots.length,
          { decimals: 1 }
        ),
        suffix: '%',
      },
    ]
  }, [data, netFlowsData, flowsData, decimals])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      info={<WidgetKPIs kpis={kpis} />}
      loading={loading}
      title='Funding Development'
    />
  )
}
