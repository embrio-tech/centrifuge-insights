import React from 'react'
import { WidgetLayout } from '../util'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
// import './PoolsList.less'

interface PoolsListProps {
  className?: string
}

interface PoolData {
  name: string
  id: string
  icon?: string
  assetClass?: string
  poolValue?: number
}

const mockPoolData: PoolData[] = [
  {
    name: 'Blue Lagoon',
    id: '1540118755',
    assetClass: 'Art NFTs',
    poolValue: 56789988989,
  },
  {
    name: 'Jays Properties',
    id: '1205392795',
    assetClass: 'Commercial Real Estate',
    poolValue: 56000000,
  },
  {
    name: 'Test Pool',
    id: '2368765279',
    assetClass: 'Art NFTs',
    poolValue: 0,
  },
  {
    name: 'Pool Time',
    id: '970966763',
    assetClass: 'Corporate Credit',
    poolValue: 12000000,
  },
  {
    name: 'Test',
    id: '4185558569',
    assetClass: 'Consumer Credit',
  },
]

const columns: ColumnsType<PoolData> = [
  {
    title: 'Pool Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/pool?pool=${record.id}`}>{text}</Link>,
  },
  {
    title: 'Asset Class',
    dataIndex: 'assetClass',
    key: 'assetClass',
  },
  {
    title: 'Pool Value',
    dataIndex: 'poolValue',
    key: 'poolValue',
    align: 'right',
  },
]

export const PoolsList: React.FC<PoolsListProps> = (props) => {
  const { className } = props

  return (
    <div className={className}>
      <WidgetLayout className='h-full'>
        <Table columns={columns} dataSource={mockPoolData} rowKey={({ id }) => id} />
      </WidgetLayout>
    </div>
  )
}
