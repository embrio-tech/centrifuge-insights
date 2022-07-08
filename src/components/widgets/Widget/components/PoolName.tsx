import { Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { usePool } from '../../../../contexts'
import { useFiles } from '../../../../hooks'
import { WidgetLayout } from '../util'
import './PoolName.less'

interface PoolNameProps {
  className?: string
}

export const PoolName: React.FC<PoolNameProps> = (props) => {
  const { className } = props
  const { poolMetadata, loading: poolLoading } = usePool()

  const iconFiles = useMemo(
    () => (poolMetadata?.pool.icon ? [{ path: poolMetadata.pool.icon, mime: 'image/svg+xml' }] : []),
    [poolMetadata]
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
