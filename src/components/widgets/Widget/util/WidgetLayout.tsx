import React, { ReactNode } from 'react'
import './WidgetLayout.less'
import { WidgetSpin } from './WidgetSpin'

interface WidgetLayoutProps {
  className?: string
  loading?: boolean
  header?: ReactNode
  footer?: ReactNode
}

/**
 * generic widget layout component with header, body, footer, and laoding spinner
 *
 * @prop {ReactNode} children - body component(s)
 * @prop {ReactNode?} header - header component (optional)
 * @prop {ReactNode?} footer - footer component (optional)
 * @prop {boolean?} loading - flag to show loading spinner (optional, default: false)
 * @prop {string?} className - class names applied to wrapping <div> (optional)
 */
export const WidgetLayout: React.FC<WidgetLayoutProps> = (props) => {
  const { className, children, loading = false, header, footer } = props

  return (
    <div className={className}>
      <WidgetSpin spinning={loading}>
        <div className='h-full flex flex-col overflow-hidden'>
          {header && <div className='grow-0'>{header}</div>}
          <div className='grow h-px'>
              <div className='h-full'>{children}</div>
          </div>
          {footer && <div className='grow-0'>{footer}</div>}
        </div>
      </WidgetSpin>
    </div>
  )
}
