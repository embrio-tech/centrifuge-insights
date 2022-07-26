import React, { useMemo, useRef, useState } from 'react'
import { gql } from '@apollo/client'
import { WidgetLayout, WidgetTable } from '../util'
import type { ColumnsType, TableData } from '../util'
import type { PaginationProps } from 'antd'
// import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { useDebounce, useFiles, useGraphQL, usePoolsMetadata, useSize } from '../../../../hooks'
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

interface PoolData extends TableData {
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
        <div className='grow pl-2 shrink truncate'>
          <Link to={`/pool?pool=${id}`}>{value}</Link>
        </div>
      </div>
    ),
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
    render: (value) => abbreviatedNumber(value),
  },
]

export const PoolsList: React.FC<PoolsListProps> = (props) => {
  const { className } = props
  const ref = useRef(null)
  const { height } = useSize(ref)
  const debouncedHeight = useDebounce(height)
  const [current, setCurrent] = useState<number>(1)
  const pageSize = useMemo(() => Math.floor(Math.max(debouncedHeight - 40 - 48, 0) / 48), [debouncedHeight])

  // fetch api data
  const query = gql`
    query getPools($first: Int!, $offset: Int!) {
      pools(first: $first, offset: $offset) {
        totalCount
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

  const variables = useMemo(
    () => ({
      first: pageSize,
      offset: (current - 1) * pageSize,
    }),
    [pageSize, current]
  )

  const skip = useMemo<boolean>(() => !pageSize, [pageSize])

  const { loading: apiLoading, data } = useGraphQL<ApiData>(query, { skip, variables })

  // pagination
  const pagination = useMemo<PaginationProps>(
    () => ({
      hideOnSinglePage: true,
      current,
      pageSize,
      total: data?.pools?.totalCount,
      size: 'small',
      onChange: (page: number) => {
        setCurrent(page || 1)
      },
    }),
    [pageSize, data, current]
  )

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

  // global loading
  const loading = useMemo(
    () => apiLoading || metadataLoading || iconsLoading,
    [apiLoading, metadataLoading, iconsLoading]
  )

  return (
    <div className={className}>
      <WidgetLayout className='h-full' loading={loading}>
        <div ref={ref} className='h-full'>
          <WidgetTable dataSource={poolsData} columns={columns} rowKey={({ id }) => id} pagination={pagination} />
        </div>
      </WidgetLayout>
    </div>
  )
}
