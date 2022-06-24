import React from 'react'
import './App.less'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Pool } from './routes'
import { ApolloProvider as GraphQLProvider } from '@apollo/client'
import { graphQL } from '../clients'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ErrorContextProvider } from '../contexts'

// set loading icon globally. TODO: refactor to separate config file
Spin.setDefaultIndicator(<LoadingOutlined className='text-gray-600' style={{ fontSize: '1.5rem' }} />)

function App() {
  return (
    <ErrorContextProvider>
      <GraphQLProvider client={graphQL}>
        <Router>
          <Routes>
            <Route path='/app'>
              <Route path='' element={<Navigate to={'pool'} replace={true} />} />
              <Route path='pool' element={<Pool />} />
              <Route path='*' element={<Navigate to={''} replace={true} />} />
            </Route>
            <Route path='*' element={<Navigate to={'/app'} replace={true} />} />
          </Routes>
        </Router>
      </GraphQLProvider>
    </ErrorContextProvider>
  )
}

export { App }
