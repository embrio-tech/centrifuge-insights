import { Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { useError, usePool } from '../../../../contexts'
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
  const { setError } = useError()

  const iconHash = useMemo<string | undefined>(() => {
    if (poolMetadata && poolMetadata.pool.icon === undefined)
      setError(new Error(`Icon ipfs hash is undefined for pool ${poolMetadata?.pool.name}!`))
    return getIpfsHash(poolMetadata?.pool.icon)
  }, [poolMetadata, setError])

  const iconHashes = useMemo<string[]>(() => (iconHash !== undefined ? [iconHash] : []), [iconHash])
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
      {poolMetadata?.pool ? (
        <div className='pool-name-icon'>
          <img
            className='h-full mx-auto'
            src={iconHash ? iconUrls[iconHash] : undefined}
            alt={`icon ${poolMetadata.pool.name}`}
          />
        </div>
      ) : null}
    </WidgetLayout>
  )
}
