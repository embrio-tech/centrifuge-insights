import React, { useMemo, useRef, useState } from 'react'
import { gql } from '@apollo/client'
import { WidgetLayout, WidgetTable } from '../util'
import type { ColumnsType, TableData } from '../util'
import type { PaginationProps } from 'antd'
// import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { useDebounce, useFiles, useGraphQL, usePoolsMetadata, useSize } from '../../../../hooks'
import { Nodes } from '../../../../types'
import { abbreviatedNumber, decimal, getIpfsHash } from '../../../../util'
import type { Currency } from '../../../../models'

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
  currency: Currency
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
          <img src={icon} alt={`icon ${value || id}`} />
        </div>
        <div className='grow pl-2 shrink truncate'>{value && <Link to={`/pool?pool=${id}`}>{value}</Link>}</div>
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
    query GetPools($first: Int!, $offset: Int!) {
      pools(first: $first, offset: $offset) {
        totalCount
        nodes {
          id
          metadata
          state {
            totalReserve
            netAssetValue
          }
          currency {
            id
            decimals
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
  const iconsHashes = useMemo<string[]>(
    () =>
      // if all metadata objects are fetched, generate list of icon hashes
      metadataPaths.length && metadataPaths.length === Object.values(poolsMetadata).length
        ? Object.values(poolsMetadata).map(({ pool: { icon, name } }) => {
            const ipfsHash = getIpfsHash(icon)
            if (ipfsHash === undefined) throw new Error(`Icon ipfs hash is undefined for pool ${name}!`)
            return ipfsHash
          })
        : [],
    [poolsMetadata, metadataPaths]
  )
  const { filesUrls: iconsUrls, loading: iconsLoading } = useFiles(iconsHashes)

  const poolsData = useMemo<PoolData[]>(
    () =>
      (data?.pools?.nodes || []).map(
        ({ id, metadata, state: { netAssetValue, totalReserve }, currency: { decimals } }) => {
          const iconHash = getIpfsHash(poolsMetadata[metadata]?.pool.icon)
          return {
            id,
            name: poolsMetadata[metadata]?.pool.name || '',
            icon: iconHash ? iconsUrls[iconHash] : undefined,
            assetClass: poolsMetadata[metadata]?.pool.asset.class,
            poolValue: decimal(netAssetValue, decimals) + decimal(totalReserve, decimals),
          }
        }
      ),
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
