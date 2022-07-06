import React, { useMemo } from 'react'
import { Mix as MixChart, MixConfig } from '@ant-design/plots'
import { ChartLayout } from '../layouts'
import { abbreviatedNumber, textDate } from '../../../../util'
import { Meta } from '@antv/g2plot'

// import './FundingDevelopment.less'

interface FundingDevelopmentProps {
  className?: string
}

const mockFlows = [
  {
    timestamp: new Date('2022-05-15'),
    value: 3000,
    flow: 'Inflow',
  },
  {
    timestamp: new Date('2022-05-16'),
    value: 8000,
    flow: 'Inflow',
  },
  {
    timestamp: new Date('2022-05-17'),
    value: 4000,
    flow: 'Inflow',
  },
  {
    timestamp: new Date('2022-05-18'),
    value: 6500,
    flow: 'Inflow',
  },
  {
    timestamp: new Date('2022-05-15'),
    value: -500,
    flow: 'Outflow',
  },
  {
    timestamp: new Date('2022-05-16'),
    value: -1500,
    flow: 'Outflow',
  },
  {
    timestamp: new Date('2022-05-17'),
    value: -750,
    flow: 'Outflow',
  },
  {
    timestamp: new Date('2022-05-18'),
    value: -300,
    flow: 'Outflow',
  },
]

const mockNetFlow = [
  {
    timestamp: new Date('2022-05-15'),
    value: 2500,
    netFlow: 'Net in-/outflow',
  },
  {
    timestamp: new Date('2022-05-16'),
    value: 6500,
    netFlow: 'Net in-/outflow',
  },
  {
    timestamp: new Date('2022-05-17'),
    value: 3250,
    netFlow: 'Net in-/outflow',
  },
  {
    timestamp: new Date('2022-05-18'),
    value: 6200,
    netFlow: 'Net in-/outflow',
  },
]

const mockShares = [
  {
    timestamp: new Date('2022-05-15'),
    percentage: 0.69,
    share: 'Liquidity reserve as % of pool value',
  },
  {
    timestamp: new Date('2022-05-16'),
    percentage: 0.546,
    share: 'Liquidity reserve as % of pool value',
  },
  {
    timestamp: new Date('2022-05-17'),
    percentage: 0.447,
    share: 'Liquidity reserve as % of pool value',
  },
  {
    timestamp: new Date('2022-05-18'),
    percentage: 0.19,
    share: 'Liquidity reserve as % of pool value',
  },
]

export const FundingDevelopment: React.FC<FundingDevelopmentProps> = (props) => {
  const { className } = props

  const chartConfig = useMemo<MixConfig>(() => {
    // axis min and max
    //
    const flowValues = mockFlows.map(({ value }) => value)
    const maxValue = Math.round(Math.max(...flowValues))
    const minValue = Math.round(Math.min(...flowValues))
    //
    const extra = 0.2
    //
    const minValueAbs = Math.min(Math.abs(maxValue), Math.abs(minValue))
    const extraValue = extra * minValueAbs
    //
    const maxValueAxis = maxValue + extraValue
    const minValueAxis = minValue - extraValue
    //
    const maxPercentage = Math.max(...mockShares.map(({ percentage }) => percentage))
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
            data: mockFlows,
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
            data: mockNetFlow,
            xField: 'timestamp',
            yField: 'value',
            seriesField: 'netFlow',
            xAxis: {
              line: null,
              label: null,
            },
            stepType: 'hvh',
            meta,
            color: ['#fcbb59'],
          },
        },
        {
          type: 'line',
          options: {
            data: mockShares,
            xField: 'timestamp',
            yField: 'percentage',
            yAxis: {
              // grid: null,
              position: 'right',
            },
            seriesField: 'share',
            meta,
            color: ['#e6017a'],
          },
        },
      ],
    }
  }, [])

  return (
    <ChartLayout
      className={className}
      chart={<MixChart {...chartConfig} />}
      // info={<WidgetKPIs kpis={kpis} />}
      // loading={loading}
      title='Funding Development'
    />
  )
}
