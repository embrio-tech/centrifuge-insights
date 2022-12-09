import { gql } from '@apollo/client'
import React, { useMemo } from 'react'
import { useFilters, usePool } from '../../../../contexts'
import { useGraphQL } from '../../../../hooks'
import type { Nodes } from '../../../../types'
import { abbreviatedNumber, syncAxes, textDate, decimal, roundedNumber } from '../../../../util'
import { ChartLayout } from '../layouts'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { Meta } from '@antv/g2plot'
import { WidgetKPI, WidgetKPIs } from '../util'

// import './InvestmentVolume.less'

interface InvestmentVolumeProps {
  className?: string
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

interface PoolSnapshot {
  id: string
  timestamp: string
  portfolioValuation: string
}

interface ApiData {
  trancheSnapshots: Nodes<TrancheSnapshot>
  poolSnapshots: Nodes<PoolSnapshot>
}

interface InvestmentData {
  timestamp: Date
  value: number
  volume: string
}

interface RelativeInvestmentData {
  timestamp: Date
  percentage: number
  delta: string
}

export const InvestmentVolume: React.FC<InvestmentVolumeProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()
  const { poolMetadata, loading: poolLoading, decimals, currency } = usePool()

  const query = gql`
    query GetInvestmentVolume($poolId: String!, $from: Datetime!, $to: Datetime!, $tranches: [TrancheSnapshotFilter!]) {
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
          timestamp
          trancheId
          sumDebt
          tranche {
            trancheId
          }
        }
      }
      poolSnapshots(
        first: 100
        orderBy: TIMESTAMP_ASC
        filter: { id: { startsWith: $poolId }, timestamp: { greaterThanOrEqualTo: $from, lessThanOrEqualTo: $to } }
      ) {
        totalCount
        nodes {
          id
          timestamp
          portfolioValuation
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

  const tranchesIds = useMemo<string[]>(() => {
    if (data) {
      const {
        trancheSnapshots: { nodes: trancheSnapshots },
      } = data
      return [...new Set(trancheSnapshots.map(({ tranche: { trancheId } }) => trancheId))]
    }
    return []
  }, [data])

  const investmentData = useMemo<InvestmentData[]>(() => {
    if (data && poolMetadata && tranchesIds.length) {
      const {
        trancheSnapshots: { nodes: trancheSnapshots },
      } = data

      return (
        trancheSnapshots
          // remove trancheSnapshots of first timestamp (t_0)
          .slice(tranchesIds.length)
          .map(
            ({ timestamp, sumDebt, tranche: { trancheId } }, index): InvestmentData => ({
              timestamp: new Date(timestamp),
              // debt_t(i) - debt_t(i-1)
              value: decimal(sumDebt, decimals) - decimal(trancheSnapshots[index].sumDebt, decimals),
              volume: poolMetadata?.tranches[trancheId]
                ? `${poolMetadata.tranches[trancheId].name} (${poolMetadata.tranches[trancheId].symbol})`
                : trancheId,
            })
          )
      )
    }
    return []
  }, [data, poolMetadata, tranchesIds, decimals])

  const poolInvestmentData = useMemo<InvestmentData[]>(() => {
    if (investmentData.length && tranchesIds.length) {
      return investmentData.reduce((poolInvestmentData: InvestmentData[], item, index) => {
        if (index % tranchesIds.length === 0) {
          // new pool investment entry for new set of tranche investments
          poolInvestmentData.push({ ...item, volume: 'Pool Investment' })
        } else {
          // check if tranche investment has same date
          if (poolInvestmentData[poolInvestmentData.length - 1].timestamp.valueOf() !== item.timestamp.valueOf()) {
            throw new Error('poolInvestmentData: Timestamp does not match!')
          }
          // sum tranche investment to pool investment of same date
          poolInvestmentData[poolInvestmentData.length - 1].value += item.value
        }
        return poolInvestmentData
      }, [])
    }
    return []
  }, [investmentData, tranchesIds])

  const relativePoolInvestmentData = useMemo<RelativeInvestmentData[]>(() => {
    if (data && poolInvestmentData.length) {
      const {
        poolSnapshots: { nodes: poolSnapshots },
      } = data
      return poolInvestmentData.map(({ value, timestamp }, index): RelativeInvestmentData => {
        return {
          timestamp,
          percentage: value / decimal(poolSnapshots.slice(1)[index].portfolioValuation, decimals),
          delta: 'Investment volume in % of NAV',
        }
      })
    }
    return []
  }, [data, poolInvestmentData, decimals])

  const chartConfig = useMemo<MixConfig>(() => {
    // sync axes
    const { primaryAxisMax, secondaryAxisMin, secondaryAxisMax } = syncAxes(
      poolInvestmentData.map(({ value }) => value),
      relativePoolInvestmentData.map(({ percentage }) => {
        if (percentage === Infinity) return 1
        if (!percentage) return 0
        return percentage
      })
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
        min: 0,
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
        volume: {
          layout: 'horizontal',
          position: 'bottom',
          padding: [0, 0, 0, 0],
        },
        delta: {
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
            data: investmentData,
            xField: 'timestamp',
            yField: 'value',
            isStack: true,
            seriesField: 'volume',
            xAxis: {
              line: null,
              label: null,
            },
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
            color: ['#2762ff', '#fcbb59', '#ccc'],
          },
        },
        {
          type: 'line',
          options: {
            data: relativePoolInvestmentData,
            xField: 'timestamp',
            yField: 'percentage',
            yAxis: {
              grid: null,
              position: 'right',
            },
            seriesField: 'delta',
            meta,
            color: ['#e6017a'],
          },
        },
      ],
    }
  }, [investmentData, poolInvestmentData, relativePoolInvestmentData, currency])

  const kpis = useMemo<WidgetKPI[]>(() => {
    if (tranchesIds.length && relativePoolInvestmentData.length && investmentData.length) {
      const tranchesNames = [...new Set(investmentData.map(({ volume }) => volume))]
      const totalInvestments = investmentData.reduce((acc, { value }) => acc + value, 0)

      return [
        {
          label: 'Avg. investment volume in % of NAV',
          value: roundedNumber(
            (relativePoolInvestmentData.map(({ percentage }) => percentage).reduce((acc, val) => acc + val, 0) /
              relativePoolInvestmentData.length) *
              100,
            { decimals: 1 }
          ),
          suffix: '%',
        },
        {
          label: '',
        },
        {
          label: 'Investment volume % by tranche',
        },
        ...tranchesNames.map((trancheName) => ({
          label: <span className='ml-2'>• {trancheName}</span>,
          value: roundedNumber(
            (investmentData.filter(({ volume }) => volume === trancheName).reduce((acc, { value }) => acc + value, 0) /
              totalInvestments) *
              100,
            { decimals: 1 }
          ),
          suffix: '%',
        })),
      ]
    }

    return []
  }, [tranchesIds, relativePoolInvestmentData, investmentData])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      info={<WidgetKPIs kpis={kpis} />}
      loading={dataLoading || poolLoading}
      title='Investment Volume'
    />
  )
}
