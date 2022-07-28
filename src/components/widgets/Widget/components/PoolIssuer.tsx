import React, { useMemo, useRef } from 'react'
import { usePool } from '../../../../contexts'
import { useDebounce, useFiles, useSize } from '../../../../hooks'
import { getIpfsHash } from '../../../../util'
import { WidgetLayout, WidgetTitle } from '../util'
import { MailOutlined } from '@ant-design/icons'
import './PoolIssuer.less'
import { Tooltip } from 'antd'

interface PoolIssuerProps {
  className?: string
}

export const PoolIssuer: React.FC<PoolIssuerProps> = (props) => {
  const { className } = props

  const { poolMetadata, loading: metadataLoading } = usePool()

  const issuer = useMemo(() => poolMetadata?.pool.issuer, [poolMetadata])

  const iconHash = useMemo<string | undefined>(() => getIpfsHash(issuer?.logo), [issuer])

  const iconHashes = useMemo<string[]>(() => (iconHash ? [iconHash] : []), [iconHash])
  const { filesUrls: iconUrls, loading: iconLoading } = useFiles(iconHashes)

  const ref = useRef(null)
  const { ratio } = useSize(ref)
  const debouncedRatio = useDebounce(ratio)
  const stack = useMemo<boolean>(() => debouncedRatio < 1.2, [debouncedRatio])

  const descriptionRef = useRef(null)
  const { height: descriptionHeight } = useSize(descriptionRef)
  const debouncedDescriptionHeight = useDebounce(descriptionHeight)
  const descriptionLineClamp = useMemo<number>(
    () => Math.floor(debouncedDescriptionHeight / 16),
    [debouncedDescriptionHeight]
  )

  const nameRef = useRef(null)
  const { height: nameHeight } = useSize(nameRef)
  const debouncedNameHeight = useDebounce(nameHeight)
  const nameLineClamp = useMemo<number>(() => Math.floor(debouncedNameHeight / 20), [debouncedNameHeight])

  const loading = useMemo<boolean>(() => metadataLoading || iconLoading, [metadataLoading, iconLoading])

  return (
    <div className={className}>
      <WidgetLayout className='h-full' header={<WidgetTitle title='Issuer' />} loading={loading}>
        <div ref={ref} className='pool-issuer' style={{ flexDirection: stack ? 'column' : 'row' }}>
          <div
            style={{
              width: stack ? undefined : '38.2%',
              height: stack ? '38.2%' : undefined,
              padding: stack ? '0 0 0.5rem 0' : '0 0.5rem 0 0',
            }}
          >
            <div className='name' style={{ flexDirection: stack ? 'row' : 'column' }}>
              {issuer?.logo && <div
                className='logo-container'
                style={{
                  width: stack ? '38.2%' : undefined,
                  height: stack ? undefined : '61.8%',
                  padding: stack ? '0.5rem 0.5rem 0.5rem 0' : '0.25rem 0 0.25rem 0',
                }}
              >
                <img className='logo' src={iconHash && iconUrls[iconHash]} alt={`logo ${issuer?.logo}`} />
              </div>}
              <div
                ref={nameRef}
                className='text-container'
                style={{
                  width: stack ? 0 : undefined,
                  height: stack ? undefined : 0,
                  justifyContent: stack ? 'center' : 'start',
                }}
              >
                <Tooltip title={issuer?.name}>
                  <div
                    className='text'
                    style={{ WebkitLineClamp: nameLineClamp, textAlign: stack ? 'left' : 'center' }}
                  >
                    {issuer?.name}
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div
            className='grow'
            style={{
              width: stack ? undefined : 0,
              height: stack ? 0 : undefined,
              padding: stack ? '0.5rem 0 0 0' : '0 0 0 0.5rem',
            }}
          >
            <div className='description'>
              <div ref={descriptionRef} className='text-container'>
                <Tooltip title={issuer?.description}>
                  <div className='text' style={{ WebkitLineClamp: descriptionLineClamp }}>
                    {issuer?.description}
                  </div>
                </Tooltip>
              </div>
              {issuer?.email && (
                <div className='contact'>
                  <a href={`mailto:${issuer.email}`}>
                    <MailOutlined /> Contact
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </WidgetLayout>
    </div>
  )
}
