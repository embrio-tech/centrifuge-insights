import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { abbreviatedNumber, textDate, wad } from '../../../../util'
import { Meta } from '@antv/g2plot'
import { Nodes } from '../../../../types'
import { useFilters } from '../../../../contexts'
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
  outstandingInvestOrders_: string
  outstandingRedeemOrders_: string
}

interface PoolSnapshot {
  id: string
  timestamp: string
  totalReserve: string
  netAssetValue: string
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

  const query = gql`
    query getFundingDevelopment($poolId: String!, $from: Datetime!, $to: Datetime!) {
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
          outstandingInvestOrders_
          outstandingRedeemOrders_
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
          netAssetValue
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
      data?.trancheSnapshots?.nodes?.reduce((flowsData: FlowData[], { outstandingInvestOrders_, timestamp }) => {
        const lastIndex = flowsData.length - 1
        const snapshotTimestamp = new Date(timestamp)
        if (flowsData[lastIndex]?.timestamp.valueOf() === snapshotTimestamp.valueOf()) {
          flowsData.splice(lastIndex, 1, {
            ...flowsData[lastIndex],
            value: flowsData[lastIndex].value + wad(outstandingInvestOrders_),
          })
        } else {
          flowsData.push({
            timestamp: snapshotTimestamp,
            value: wad(outstandingInvestOrders_),
            flow: 'Inflow',
          })
        }
        return flowsData
      }, []) || []

    const outflows: FlowData[] =
      data?.trancheSnapshots?.nodes?.reduce((flowsData: FlowData[], { outstandingRedeemOrders_, timestamp }) => {
        const lastIndex = flowsData.length - 1
        const snapshotTimestamp = new Date(timestamp)
        if (flowsData[lastIndex]?.timestamp.valueOf() === snapshotTimestamp.valueOf()) {
          flowsData.splice(lastIndex, 1, {
            ...flowsData[lastIndex],
            value: flowsData[lastIndex].value - wad(outstandingRedeemOrders_),
          })
        } else {
          flowsData.push({
            timestamp: snapshotTimestamp,
            value: -wad(outstandingRedeemOrders_),
            flow: 'Outflow',
          })
        }
        return flowsData
      }, []) || []

    return [...inflows, ...outflows]
  }, [data])

  const netFlowsData = useMemo<NetFlowData[]>(
    () =>
      data?.trancheSnapshots?.nodes?.reduce(
        (flowsData: NetFlowData[], { outstandingRedeemOrders_, outstandingInvestOrders_, timestamp }) => {
          const lastIndex = flowsData.length - 1
          const snapshotTimestamp = new Date(timestamp)
          if (flowsData[lastIndex]?.timestamp.valueOf() === snapshotTimestamp.valueOf()) {
            flowsData.splice(lastIndex, 1, {
              ...flowsData[lastIndex],
              value: flowsData[lastIndex].value + wad(outstandingInvestOrders_) - wad(outstandingRedeemOrders_),
            })
          } else {
            flowsData.push({
              timestamp: snapshotTimestamp,
              value: wad(outstandingInvestOrders_) - wad(outstandingRedeemOrders_),
              netFlow: 'Net in-/outflow',
            })
          }
          return flowsData
        },
        []
      ) || [],
    [data]
  )

  const relativeLiquidityReserves = useMemo<RelativeLiquidityReserve[]>(
    () =>
      data?.poolSnapshots?.nodes?.map(({ timestamp, totalReserve, netAssetValue }) => ({
        timestamp: new Date(timestamp),
        percentage: wad(totalReserve) / (wad(totalReserve) + wad(netAssetValue)),
        share: 'Liquidity reserve as % of pool value',
      })) || [],
    [data]
  )

  const chartConfig = useMemo<MixConfig>(() => {
    // axis min and max
    //
    const flowValues = flowsData.map(({ value }) => value)
    const maxValue = flowValues.length ? Math.round(Math.max(...flowValues)) : 1000
    const minValue = flowValues.length ? Math.round(Math.min(...flowValues)) : -1000
    //
    const extra = 0.2
    //
    const minValueAbs = Math.min(Math.abs(maxValue), Math.abs(minValue))
    const extraValue = extra * minValueAbs
    //
    const maxValueAxis = maxValue + extraValue
    const minValueAxis = minValue - extraValue
    //
    const maxPercentage = relativeLiquidityReserves.length
      ? Math.max(...relativeLiquidityReserves.map(({ percentage }) => percentage || 0))
      : 1
    //
    const maxPercentageAxis = (1 + extra) * maxPercentage
    const minPercentageAxis = (maxPercentageAxis * minValueAxis) / maxValueAxis
    // shared meta object for all subcharts
    //
    const meta: Record<string, Meta> = {
      timestamp: {
        type: 'timeCat',
        formatter: (v: Date) => textDate(v),
      },
      value: {
        type: 'linear',
        formatter: (v: number) => abbreviatedNumber(v),
        max: maxValueAxis,
        min: minValueAxis,
        tickCount: 6,
        maxTickCount: 6,
      },
      percentage: {
        type: 'linear',
        formatter: (v: number) => abbreviatedNumber(v * 100) + '%',
        max: maxPercentageAxis,
        min: minPercentageAxis,
        tickCount: 6,
        maxTickCount: 6,
      },
    }

    // return chart config
    //
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
        value: abbreviatedNumber((100 * wad(last.totalReserve)) / (wad(last.totalReserve) + wad(last.netAssetValue))),
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
        value: abbreviatedNumber(
          poolSnapshots
            .map(
              ({ totalReserve, netAssetValue }, index) =>
                (100 * outflows[index]) / (wad(totalReserve) + wad(netAssetValue))
            )
            .reduce((acc, current) => acc + current || 0, 0) / poolSnapshots.length
        ),
        suffix: '%',
      },
    ]
  }, [data, netFlowsData, flowsData])

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
