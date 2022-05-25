import React from 'react'
import './App.less'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Pool } from './routes'
import { ApolloProvider as GraphQLProvider } from '@apollo/client'
import { graphQL } from '../services'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// set loading icon globally. TODO: refactor to separate config file
Spin.setDefaultIndicator(<LoadingOutlined className='text-gray-600' style={{ fontSize: '1.5rem' }} />)

function App() {
  return (
    <GraphQLProvider client={graphQL}>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to={'/pool'} />} />
          <Route path='/pool' element={<Pool />} />
          <Route path='*' element={<Navigate to={'/'} />} />
        </Routes>
      </Router>
    </GraphQLProvider>
  )
}

export { App }
