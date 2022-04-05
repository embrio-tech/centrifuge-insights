import { Layout } from 'antd'
import React from 'react'
import { HeaderNavigation } from '../navigation'
import './BasicLayout.less'

const { Header, Content, Footer } = Layout

const BasicLayout: React.FC = (props) => {
  const { children } = props

  return (
    <Layout>
      <Header className='basic-layout-header'>
        <HeaderNavigation />
      </Header>
      <Content className='p-6 mt-16' style={{ minHeight: 'calc(100vh - 64px - 70px)' }}>
        {children}
      </Content>
      <Footer className='text-center'>
        Powered by{' '}
        <a href='https://embrio.tech/en' target='_blank' rel='noreferrer' title='EMBRIO.tech | Digitale Lösungsbauer | Zürich'>
          <img className='h-6 inline' src='https://embrio.tech/img/logo-dark.svg' alt='EMBRIO.tech logo' />
        </a>
      </Footer>
    </Layout>
  )
}

export { BasicLayout }
