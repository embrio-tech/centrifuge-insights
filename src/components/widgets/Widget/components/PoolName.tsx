import { Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { usePool } from '../../../../contexts'
import { useFiles } from '../../../../hooks'
import type { FileMetaInterface } from '../../../../hooks'
import { WidgetLayout } from '../util'
import './PoolName.less'

interface PoolNameProps {
  className?: string
}

export const PoolName: React.FC<PoolNameProps> = (props) => {
  const { className } = props
  const { poolMetadata, loading: poolLoading } = usePool()

  const iconUri = useMemo<string | undefined>(() => {
    if (!poolMetadata?.pool?.icon) return undefined
    if (typeof poolMetadata.pool.icon === 'string') return poolMetadata.pool.icon
    return poolMetadata.pool.icon.uri
  }, [poolMetadata])

  const iconFiles = useMemo<FileMetaInterface[]>(
    () => (iconUri ? [{ path: iconUri, mime: 'image/svg+xml' }] : []),
    [iconUri]
  )
  const { filesUrls: iconUrls, loading: iconLoading } = useFiles(iconFiles)

  return (
    <WidgetLayout
      className={className}
      loading={poolLoading || iconLoading}
      footer={
        poolMetadata && (
          <Tooltip title={poolMetadata.pool.name}>
            <h3 className='pool-name-text'>{poolMetadata.pool.name}</h3>
          </Tooltip>
        )
      }
    >
      {poolMetadata?.pool.icon ? (
        <div className='pool-name-icon'>
          <img className='h-full mx-auto' src={iconUri && iconUrls[iconUri]} alt={`icon ${poolMetadata.pool.name}`} />
        </div>
      ) : null}
    </WidgetLayout>
  )
}
