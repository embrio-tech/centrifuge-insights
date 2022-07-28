import { Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { usePool } from '../../../../contexts'
import { useFiles } from '../../../../hooks'
import { WidgetLayout } from '../util'
import './PoolName.less'
import { getIpfsHash } from '../../../../util'

interface PoolNameProps {
  className?: string
}

export const PoolName: React.FC<PoolNameProps> = (props) => {
  const { className } = props
  const { poolMetadata, loading: poolLoading } = usePool()

  const iconHash = useMemo<string | undefined>(() => getIpfsHash(poolMetadata?.pool.icon), [poolMetadata])

  const iconHashes = useMemo<string[]>(
    () => (iconHash ? [iconHash] : []),
    [iconHash]
  )
  const { filesUrls: iconUrls, loading: iconLoading } = useFiles(iconHashes)

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
          <img className='h-full mx-auto' src={iconHash && iconUrls[iconHash]} alt={`icon ${poolMetadata.pool.name}`} />
        </div>
      ) : null}
    </WidgetLayout>
  )
}
