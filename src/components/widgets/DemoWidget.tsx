import React, { useMemo } from 'react'
import { Column, ColumnConfig } from '@ant-design/plots'
import { gql, useQuery } from '@apollo/client'
import { Card, Spin } from 'antd'
// import './DemoWidget.less'

interface DemoWidgetProps {
  className?: string
}

interface ApiData {
  __typename: string
  pools: {
    nodes: {
      __typename: string
      id: string
      currency: 'native' | 'usd' | string
      minEpochTime: number
    }[]
  }
}

interface ChartData {
  id: string
  currency: 'native' | 'usd' | string
  minEpochTime: number
}

const DemoWidget: React.FC<DemoWidgetProps> = () => {
  const query = gql`
    query GetPools {
      pools {
        nodes {
          id
          currency
          minEpochTime
        }
        totalCount
      }
    }
  `

  const { loading, data } = useQuery<ApiData>(query)

  const chartData = useMemo<ChartData[]>(() => {
    return (
      data?.pools?.nodes?.map(
        ({ id, currency, minEpochTime }): ChartData => ({
          id,
          currency,
          minEpochTime,
        })
      ) || []
    )
  }, [data])

  const config = useMemo<ColumnConfig>(() => {
    return {
      data: chartData,
      xField: 'id',
      yField: 'minEpochTime',
      seriesField: 'currency',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: ({ currency }: any) => {
        switch (currency) {
          case 'native':
            return '#2762ff'
          case 'usd':
            return '#fcbb59'
          default:
            return '#ccc'
        }
      },
      label: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: ({ id }: any) => id,
        offset: 10,
      },
      legend: {
        layout: 'horizontal',
        position: 'bottom',
        title: {
          text: 'Currency',
          spacing: 10,
          style: {
            fontSize: 14
          }
        }
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: true,
        },
        title: {
          text: 'Pool ID',
        },
      },
      meta: {
        minEpochTime: {
          type: 'log',
        },
      },
      yAxis: {
        title: {
          text: 'Min Epoch Time',
        },
      },
    }
  }, [chartData])

  return (
    <Card title='Min Epoch Time of Pools by Currency' className='w-full max-w-2xl'>
      <div className='p-4 pt-8'>{loading ? <Spin /> : <Column {...config} />}</div>
    </Card>
  )
}

export { DemoWidget }
