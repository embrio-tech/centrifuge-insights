import React from 'react'
import './App.less'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Pool } from './routes'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ErrorContextProvider, TenantContextProvider, GraphQLContextProvider } from '../contexts'

// set loading icon globally. TODO: refactor to separate config file
Spin.setDefaultIndicator(<LoadingOutlined className='text-gray-600' style={{ fontSize: '1.5rem' }} />)

function App() {
  return (
    <ErrorContextProvider>
      <Router>
        <TenantContextProvider>
          <GraphQLContextProvider>
            <Routes>
              <Route path='/' element={<Navigate to={'/pool'} />} />
              <Route path='/pool' element={<Pool />} />
              <Route path='*' element={<Navigate to={'/'} />} />
            </Routes>
          </GraphQLContextProvider>
        </TenantContextProvider>
      </Router>
    </ErrorContextProvider>
  )
}

export { App }
