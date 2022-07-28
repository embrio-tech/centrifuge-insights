import React, { ReactNode } from 'react'
import type { PoolMetadata } from '../../models'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import type { TagProps } from 'antd'
// import './PoolStatus.less'

interface PoolStatusProps {
  className?: string
  status: PoolMetadata['pool']['status']
}

export const PoolStatus: React.FC<PoolStatusProps> = (props) => {
  const { className, status } = props

  const icon: { [key in PoolStatusProps['status']]: ReactNode } = {
    open: <CheckCircleOutlined />,
    closed: <CloseCircleOutlined />,
  }

  const color: { [key in PoolStatusProps['status']]: TagProps['color'] } = {
    open: 'success',
    closed: 'error',
  }

  return (
    <span className={className}>
      <Tag className='mr-0' icon={icon[status]} color={color[status]}>
        {status}
      </Tag>
    </span>
  )
}
