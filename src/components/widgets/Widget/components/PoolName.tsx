import { gql } from '@apollo/client'
import { Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { useFilters } from '../../../../contexts'
import { useFiles, useGraphQL, usePoolsMetadata } from '../../../../hooks'
import { WidgetLayout } from '../util'
import './PoolName.less'

interface PoolNameProps {
  className?: string
}

interface ApiData {
  pool: {
    id: string
    metadata: string
  }
}

export const PoolName: React.FC<PoolNameProps> = (props) => {
  const { className } = props
  const { selections, filtersReady } = useFilters()

  const query = gql`
    query getPoolMetadata($poolId: String!) {
      pool(id: $poolId) {
        id
        metadata
      }
    }
  `

  const variables = useMemo(
    () => ({
      poolId: selections.pool?.[0],
    }),
    [selections]
  )

  const skip = useMemo(
    () =>
      Object.values(variables).reduce((variableMissing, variable) => variableMissing || !variable, false) ||
      !filtersReady,
    [variables, filtersReady]
  )

  const { loading: poolLoading, data } = useGraphQL<ApiData>(query, {
    variables,
    skip,
  })

  // fetch metadata
  const metadataPaths = useMemo(() => (data?.pool.metadata ? [data.pool.metadata] : []), [data])
  const { poolsMetadata, loading: metadataLoading } = usePoolsMetadata(metadataPaths)

  const poolMetadata = useMemo(
    () => (data?.pool.metadata ? poolsMetadata?.[data.pool.metadata] : undefined),
    [poolsMetadata, data]
  )

  const iconFiles = useMemo(
    () => (poolMetadata?.pool.icon ? [{ path: poolMetadata.pool.icon, mime: 'image/svg+xml' }] : []),
    [poolMetadata]
  )
  const { filesUrls: iconUrls, loading: iconLoading } = useFiles(iconFiles)

  return (
    <WidgetLayout
      className={className}
      loading={poolLoading || metadataLoading || iconLoading}
      footer={
        poolMetadata && (
          <Tooltip title={poolMetadata.pool.name}>
            <h3 className='pool-name-text'>
              {poolMetadata.pool.name}
            </h3>
          </Tooltip>
        )
      }
    >
      {poolMetadata?.pool.icon ? (
        <div className='pool-name-icon'>
          <img
            className='h-full mx-auto'
            src={iconUrls[poolMetadata.pool.icon]}
            alt={`icon ${poolMetadata.pool.name}`}
          />
        </div>
      ) : null}
    </WidgetLayout>
  )
}
