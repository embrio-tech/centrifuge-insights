import React, { useMemo } from 'react'
import { PoolStatus } from '../../../util'
import { WidgetKPIs, WidgetLayout, WidgetTitle } from '../util'
import type { WidgetKPI } from '../util'
import { FilePdfTwoTone, MessageTwoTone } from '@ant-design/icons'
import { usePool } from '../../../../contexts'
import { getIpfsHash } from '../../../../util'
import { useFiles } from '../../../../hooks'

// import './PoolInfos.less'

interface PoolInfosProps {
  className?: string
}

export const PoolInfos: React.FC<PoolInfosProps> = (props) => {
  const { className } = props
  const { poolMetadata, loading: poolLoading } = usePool()

  const pdfHash = useMemo(() => getIpfsHash(poolMetadata?.pool.links.executiveSummary), [poolMetadata])
  const hashes = useMemo<string[]>(() => (pdfHash ? [pdfHash] : []), [pdfHash])
  const { filesUrls: pdfUrls, loading: pdfLoading } = useFiles(hashes)

  const kpis = useMemo<WidgetKPI[]>(() => {
    if (!poolMetadata) return []
    const {
      pool: { asset, links, status },
    } = poolMetadata

    return [
      {
        label: 'Asset Class',
        value: <span className='font-medium truncate'>{asset.class}</span>,
      },
      {
        label: '',
      },
      {
        label: 'Status',
        value: <PoolStatus className='mr-0' status={status} />,
      },
      {
        label: '',
      },
      links.website
        ? {
            label: links.website ? 'Website' : '',
            value: links.website && (
              <a className='font-medium truncate' href={links.website} target='_blank' rel='noreferrer'>
                {links.website.replace('https://', '').replace('http://', '').split('/')[0]}
              </a>
            ),
          }
        : undefined,
      links.website
        ? {
            label: '',
          }
        : undefined,
      pdfHash
        ? {
            label: pdfHash ? 'Executive Summary' : '',
            value: pdfHash && (
              <a href={pdfHash ? pdfUrls[pdfHash] : undefined} target='_blank' rel='noreferrer'>
                <FilePdfTwoTone className='text-xl leading-0' />
              </a>
            ),
          }
        : undefined,
      pdfHash
        ? {
            label: '',
          }
        : undefined,
      links.forum
        ? {
            label: links.forum ? 'Forum' : '',
            value: links.forum && (
              <a href={links.forum} target='_blank' rel='noreferrer'>
                <MessageTwoTone className='text-xl leading-0' />
              </a>
            ),
          }
        : undefined,
    ].filter((item) => !!item) as WidgetKPI[]
  }, [poolMetadata, pdfHash, pdfUrls])

  const loading = useMemo<boolean>(() => pdfLoading || poolLoading, [pdfLoading, poolLoading])

  return (
    <div className={className}>
      <WidgetLayout className='h-full' header={<WidgetTitle title='Infos' />} loading={loading}>
        <WidgetKPIs kpis={kpis} title={null} />
      </WidgetLayout>
    </div>
  )
}
