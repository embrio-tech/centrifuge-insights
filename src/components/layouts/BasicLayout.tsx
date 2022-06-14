import { Button, Layout } from 'antd'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import React, { useState, useEffect, ReactNode } from 'react'
import { useBreakpoints } from '../../hooks'
import { HeaderNavigation } from '../navigation'
import './BasicLayout.less'

const { Header, Content, Footer, Sider } = Layout

interface BasicLayoutProps {
  sider?: ReactNode
}

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { children, sider } = props
  const { gtSM, ltMD } = useBreakpoints()
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(ltMD)

  const SIDER_COLLAPSED_WIDTH = 60
  const SIDER_WIDTH = 250
  const FOOTER_HEIGTH = 70

  useEffect(() => {
    if (gtSM && siderCollapsed) setSiderCollapsed(false)
  }, [gtSM, siderCollapsed])

  return (
    <Layout>
      <Header className='basic-layout-header'>
        <HeaderNavigation />
      </Header>
      <Layout hasSider className='mt-16'>
        <Layout
          style={{ marginRight: gtSM ? SIDER_WIDTH : 0 }}
          className={ltMD && !siderCollapsed ? 'blur-sm' : undefined}
          onClick={
            ltMD && !siderCollapsed
              ? () => {
                  setSiderCollapsed(true)
                }
              : undefined
          }
        >
          <Content className='' style={{ minHeight: `calc(100vh - 64px - ${FOOTER_HEIGTH}px)` }}>
            {children}
          </Content>
          <Footer className='text-center' style={{ maxHeight: FOOTER_HEIGTH }}>
            Powered by{' '}
            <a
              href='https://embrio.tech/en'
              target='_blank'
              rel='noreferrer'
              title='EMBRIO.tech | Digitale Lösungsbauer | Zürich'
            >
              <img className='h-6 inline' src='https://embrio.tech/img/logo-dark.svg' alt='EMBRIO.tech logo' />
            </a>
          </Footer>
        </Layout>

        <Sider
          className='basic-layout-sider'
          collapsible
          collapsed={siderCollapsed}
          theme='light'
          collapsedWidth={gtSM ? SIDER_COLLAPSED_WIDTH : 0}
          width={gtSM ? SIDER_WIDTH : '80vw'}
          trigger={null}
        >
          <div className='sider-container'>
            <div id='sider-content'>{sider}</div>
            <div id='navigation'>
              <div className='p-6'>
                <p>TODO: Navigation here...</p>
              </div>
            </div>
          </div>
        </Sider>
      </Layout>
      {ltMD && (
        <Button
          className='basic-layout-sider-collapse-btn'
          shape='circle'
          size='large'
          onClick={() => setSiderCollapsed(!siderCollapsed)}
        >
          {siderCollapsed ? <MenuOutlined /> : <CloseOutlined />}
        </Button>
      )}
    </Layout>
  )
}

export { BasicLayout }
