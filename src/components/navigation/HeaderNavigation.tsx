import React from 'react'
import './HeaderNavigation.less'
import logos from '../../svg'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { useTenant } from '../../contexts'

const HeaderNavigation: React.FC = () => {
  const {
    tenantConfig: { name, logo, infoUrl },
  } = useTenant()

  return (
    <div className='header-navigation'>
      <div className='logo'>
        <Link to='/'>
          <img src={logos[logo]} alt='logo' className='h-full' />
        </Link>
      </div>

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
