import React from 'react'
import './HeaderNavigation.less'
import { Button } from 'antd'
import { useTenant } from '../../contexts'
import { HeaderLogo } from './util'

const HeaderNavigation: React.FC = () => {
  const {
    tenantConfig: { name, logo, infoUrl },
  } = useTenant()

  return (
    <div className='header-navigation'>
      <HeaderLogo logo={logo} className='logo' />

      <h1 className='title' style={{ lineHeight: 'inherit' }}>
        {`${name} Insights`}
      </h1>

      <div className='cta'>
        <Button type='primary' shape='round' href={infoUrl} target='_blank'>
          Learn more!
        </Button>
      </div>
    </div>
  )
}

export { HeaderNavigation }
