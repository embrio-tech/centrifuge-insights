import React from 'react'
// import './HeaderNavigation.less'
import logo from '../../svg/centrifuge-marquee-light.svg'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

const HeaderNavigation: React.FC = () => {
  return (
    <div className='flex justify-between h-full'>
      <div className='py-4 pr-2'>
        <Link to='/'>
          <img src={logo} alt='logo' className='h-full' />
        </Link>
      </div>
      <div className='grow text-center'>
        <h1 className='text-xl sm:text-2xl text-white m-0' style={{ lineHeight: 'inherit' }}>
          Centrifuge Insights
        </h1>
      </div>
      <div className='hidden sm:block'>
        <Button type='primary' shape='round' href='https://centrifuge.io/' target='_blank'>
          Learn more!
        </Button>
      </div>
    </div>
  )
}

export { HeaderNavigation }
