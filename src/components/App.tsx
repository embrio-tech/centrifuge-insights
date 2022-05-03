import React from 'react'
import './App.less'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Root } from './routes'
import { ApolloProvider as GraphQLProvider } from '@apollo/client'
import { graphQL } from '../services'

function App() {
  return (
    <GraphQLProvider client={graphQL}>
      <Router>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='*' element={<Navigate to={'/'} />} />
        </Routes>
      </Router>
    </GraphQLProvider>
  )
}

export { App }
