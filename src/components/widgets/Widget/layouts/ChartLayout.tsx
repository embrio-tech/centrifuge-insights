import React, { ReactNode, useMemo, useRef } from 'react'
import { useDebounce, useSize } from '../../../../hooks'
import { WidgetLayout, WidgetTitle } from '../util'
// import './ChartLayout.less'

interface ChartLayoutProps {
  className?: string
  loading?: boolean
  title?: string
  chart: ReactNode
  info?: ReactNode
}

/**
 * widget layout with title, chart, and info block
 *
 * @prop {ReactNode} chart - chart of widget
 * @prop {string?} title – title of widget (optional)
 * @prop {ReactNode?} info - additional info block, e.g. KPIs (optional)
 * @prop {boolean?} loading - flag to show loading spinner (optional)
 * @prop {string?} className - class names applied to wrapping <div> (optional)
 */
export const ChartLayout: React.FC<ChartLayoutProps> = (props) => {
  const { className, chart, title, loading, info } = props

  const ref = useRef(null)
  const { ratio } = useSize(ref)
  const debouncedRatio = useDebounce(ratio)

  // vertical indicates if info is next to chart or below
  const vertical = useMemo(() => debouncedRatio < 1.2, [debouncedRatio])

  return (
    <div ref={ref} className={className}>
      <WidgetLayout
        className='h-full'
        header={title && <WidgetTitle title={title} />}
        footer={vertical && <div className='pt-4'>{info}</div>}
        loading={loading}
      >
        <div className='h-full flex flex-row'>
          <div className='h-full grow w-px'>
            <div className='w-full h-full'>{chart}</div>
          </div>
          {!vertical && info && <div className='grow-0 w-1/3 pl-4'>{info}</div>}
        </div>
      </WidgetLayout>
    </div>
  )
}
