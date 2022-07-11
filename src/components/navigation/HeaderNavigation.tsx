import React from 'react'
import './HeaderNavigation.less'
import logo from '../../svg/centrifuge-marquee-light.svg'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

const HeaderNavigation: React.FC = () => {
  return (
    <div className='header-navigation'>
      <div className='logo'>
        <Link to='/'>
          <img src={logo} alt='logo' className='h-full' />
        </Link>
      </div>

      <h1
        className='title'
        style={{ lineHeight: 'inherit' }}
      >
        Centrifuge Insights
      </h1>

      <div className='cta'>
        <Button type='primary' shape='round' href='https://centrifuge.io/' target='_blank'>
          Learn more!
        </Button>
      </div>
    </div>
  )
}

export { HeaderNavigation }
