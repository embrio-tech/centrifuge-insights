import React, { useMemo } from 'react'
import { PoolStatus } from '../../../util'
import { WidgetKPIs, WidgetLayout, WidgetTitle } from '../util'
import { FilePdfTwoTone, MessageTwoTone } from '@ant-design/icons'
import { usePool } from '../../../../contexts'
import { environment } from '../../../../config'

const { IPFS_PROXY_URL } = environment

// import './PoolInfos.less'

interface PoolInfosProps {
  className?: string
}

export const PoolInfos: React.FC<PoolInfosProps> = (props) => {
  const { className } = props
  const { poolMetadata, loading } = usePool()

  const kpis = useMemo(() => {
    if (!poolMetadata) return []
    const {
      pool: { asset, links, status },
    } = poolMetadata

    const executiveSummaryParts = links.executiveSummary?.split('/') || []
    const executiveSummaryUri = executiveSummaryParts.length
      ? `${IPFS_PROXY_URL}${executiveSummaryParts[executiveSummaryParts.length - 1]}`
      : undefined

    return [
      {
        label: 'Asset Class',
        value: <span className='font-medium'>{asset.class}</span>,
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
      {
        label: links.website ? 'Website' : '',
        value: links.website && (
          <a className='font-medium truncate' href={links.website} target='_blank' rel='noreferrer'>
            {links.website.replace('https://', '').replace('http://', '').split('/')[0]}
          </a>
        ),
      },
      {
        label: '',
      },
      {
        label: executiveSummaryUri ? 'Executive Summary' : '',
        value: executiveSummaryUri && (
          <a href={executiveSummaryUri} target='_blank' rel='noreferrer'>
            <FilePdfTwoTone className='text-xl leading-0' />
          </a>
        ),
      },
      {
        label: '',
      },
      {
        label: links.forum ? 'Forum' : '',
        value: links.forum && (
          <a href={links.forum} target='_blank' rel='noreferrer'>
            <MessageTwoTone className='text-xl leading-0' />
          </a>
        ),
      },
    ]
  }, [poolMetadata])

  return (
    <div className={className}>
      <WidgetLayout className='h-full' header={<WidgetTitle title='Infos' />} loading={loading}>
        <WidgetKPIs kpis={kpis} title={null} />
      </WidgetLayout>
    </div>
  )
}
