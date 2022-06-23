import React from 'react'
import { Navigate, Route, Routes as RouterRoutes, useSearchParams } from 'react-router-dom'
import { Pool } from './Pool'

// import './Routes.less'

// interface RoutesProps {
//   className?: string
// }

export const Routes: React.FC = () => {
  const [searchParams] = useSearchParams()

  return (
    <RouterRoutes>
      <Route path='/app'>
        <Route
          path=''
          element={
            <Navigate
              to={`pool${searchParams.toString().length ? `?${searchParams.toString()}` : ''}`}
              replace={true}
            />
          }
        />
        <Route path='pool' element={<Pool />} />
        <Route
          path='*'
          element={
            <Navigate to={`${searchParams.toString().length ? `?${searchParams.toString()}` : ''}`} replace={true} />
          }
        />
      </Route>
      <Route
        path='*'
        element={
          <Navigate to={`/app${searchParams.toString().length ? `?${searchParams.toString()}` : ''}`} replace={true} />
        }
      />
    </RouterRoutes>
  )
}
