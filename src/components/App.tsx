import React from 'react'
import './App.less'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Root } from './routes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </Router>
  )
}

export default App
