import React, { useMemo } from 'react'
import { gql } from '@apollo/client'
import { WidgetLayout } from '../util'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { useFiles, useGraphQL, usePoolsMetadata } from '../../../../hooks'
import type { FileMetaInterface } from '../../../../hooks'
import { Nodes } from '../../../../types'
import { abbreviatedNumber, wad } from '../../../../util'

// import './PoolsList.less'

interface PoolsListProps {
  className?: string
}

interface Pool {
  id: string
  metadata: string
  state: {
    totalReserve: string
    netAssetValue: string
  }
}

interface ApiData {
  pools: Nodes<Pool>
}

interface PoolData {
  name: string
  id: string
  icon?: string
  assetClass?: string
  poolValue?: number
}

const columns: ColumnsType<PoolData> = [
  {
    title: 'Pool Name',
    dataIndex: 'name',
    key: 'name',
    render: (value, { icon, id }) => (
      <div className='flex items-center'>
        <div className='grow-0 shrink-0 w-6'>
          <img src={icon} alt={`icon ${value}`} />
        </div>
        <div className='grow pl-2'>
          <Link to={`/pool?pool=${id}`}>{value}</Link>
        </div>
      </div>
    ),
  },
  {
    title: 'Asset Class',
    dataIndex: 'assetClass',
    responsive: ['sm'],
    key: 'assetClass',
  },
  {
    title: 'Pool Value',
    dataIndex: 'poolValue',
    key: 'poolValue',
    align: 'right',
    render: (value) => abbreviatedNumber(value),
  },
]

export const PoolsList: React.FC<PoolsListProps> = (props) => {
  const { className } = props

  const query = gql`
    query getPools {
      pools(first: 100) {
        nodes {
          id
          metadata
          state {
            totalReserve
            netAssetValue
          }
        }
      }
    }
  `

  const { loading: apiLoading, data } = useGraphQL<ApiData>(query)

  // fetch metadata
  const metadataPaths = useMemo(
    () => (data?.pools?.nodes ? data.pools.nodes.map(({ metadata }) => metadata) : []),
    [data]
  )
  const { poolsMetadata, loading: metadataLoading } = usePoolsMetadata(metadataPaths)

  // fetch icons
  const iconsFiles = useMemo<FileMetaInterface[]>(
    () => Object.values(poolsMetadata).map(({ pool: { icon } }) => ({ path: icon, mime: 'image/svg+xml' })),
    [poolsMetadata]
  )
  const { filesUrls: iconsUrls, loading: iconsLoading } = useFiles(iconsFiles)

  const poolsData = useMemo<PoolData[]>(
    () =>
      (data?.pools?.nodes || []).map(({ id, metadata, state: { netAssetValue, totalReserve } }) => ({
        id,
        name: poolsMetadata[metadata]?.pool.name || '',
        icon: poolsMetadata[metadata]?.pool.icon ? iconsUrls[poolsMetadata[metadata].pool.icon] : undefined,
        assetClass: poolsMetadata[metadata]?.pool.asset.class,
        poolValue: wad(netAssetValue) + wad(totalReserve),
      })),
    [data, poolsMetadata, iconsUrls]
  )

  const loading = useMemo(
    () => apiLoading || metadataLoading || iconsLoading,
    [apiLoading, metadataLoading, iconsLoading]
  )

  return (
    <div className={className}>
      <WidgetLayout className='h-full' loading={loading}>
        <Table columns={columns} dataSource={poolsData} rowKey={({ id }) => id} />
      </WidgetLayout>
    </div>
  )
}
