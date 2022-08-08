import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import './SiderNavigation.less'

type MenuItem = Required<MenuProps>['items'][number]

interface SiderNavigationProps {
  className?: string
}

export const SiderNavigation: React.FC<SiderNavigationProps> = (props) => {
  const { className } = props
  const location = useLocation()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [locationKey, setLoactionKey] = useState<string>('')

  useEffect(() => {
    const key = location.pathname.slice(1).split('/')[0]
    if (key && key !== locationKey) {
      setLoactionKey(key)
    }
  }, [location.pathname, locationKey])

  useEffect(() => {
    if (locationKey && (selectedKeys.length !== 1 || selectedKeys[0] !== locationKey)) {
      setSelectedKeys([locationKey])
    }
  }, [locationKey, selectedKeys])

  const items: MenuItem[] = [
    {
      key: 'pools',
      label: <Link to='/pools'>Pools List</Link>,
    },
    {
      key: 'pool',
      label: <Link to='/pool'>Pool Details</Link>,
    },
  ]

  return (
    <div className={className}>
      <Menu className='sider-navigation' items={items} mode='inline' selectedKeys={selectedKeys} />
    </div>
  )
}
