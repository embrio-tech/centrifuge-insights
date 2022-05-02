import { Button, Layout } from 'antd'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { HeaderNavigation } from '../navigation'
import './BasicLayout.less'

const { Header, Content, Footer, Sider } = Layout

const BasicLayout: React.FC = (props) => {
  const { children } = props
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false)
  const isSM = useMediaQuery({ maxWidth: 767 })

  const SIDER_COLLAPSED_WIDTH = 60
  const SIDER_WIDTH = 250
  const FOOTER_HEIGTH = 70

  useEffect(() => {
    if (!isSM && siderCollapsed) setSiderCollapsed(false)
  }, [isSM, siderCollapsed])

  return (
    <Layout>
      <Header className='basic-layout-header'>
        <HeaderNavigation />
      </Header>
      <Layout hasSider className='mt-16'>
        <Layout style={{ marginRight: isSM ? 0 : SIDER_WIDTH }}>
          <Content className='p-6' style={{ minHeight: `calc(100vh - 64px - ${FOOTER_HEIGTH}px)` }}>
            {children}
          </Content>
          <Footer className='text-center' style={{ maxHeight: FOOTER_HEIGTH }}>
            Powered by{' '}
            <a href='https://embrio.tech/en' target='_blank' rel='noreferrer' title='EMBRIO.tech | Digitale Lösungsbauer | Zürich'>
              <img className='h-6 inline' src='https://embrio.tech/img/logo-dark.svg' alt='EMBRIO.tech logo' />
            </a>
          </Footer>
        </Layout>

        <Sider
          className='basic-layout-sider'
          collapsible
          collapsed={siderCollapsed}
          theme='light'
          collapsedWidth={isSM ? 0 : SIDER_COLLAPSED_WIDTH}
          width={isSM ? '90vw' : SIDER_WIDTH}
          trigger={null}
        >
          <div className='p-4'>Sider contents here...</div>
        </Sider>
      </Layout>
      {isSM && (
        <Button className='basic-layout-sider-collapse-btn' shape='circle' size='large' onClick={() => setSiderCollapsed(!siderCollapsed)}>
          {siderCollapsed ? <MenuOutlined /> : <CloseOutlined />}
        </Button>
      )}
    </Layout>
  )
}

export { BasicLayout }
