import React from 'react'
import { Dashboard as DashboardInterface } from '../../types'
import { BasicLayout } from '../layouts'
import { Dashboard } from '../util'
// import './Pool.less'

const Pool: React.FC = () => {
  const dashboard: DashboardInterface = {
    name: 'Pool Details',
    sections: [
      {
        name: 'Key figures',
        widgets: [
          {
            name: 'LoanVolume',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 0, y: 0 },
              { breakpoint: 'sm', w: 1, h: 1, x: 0, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'lg', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'xl', w: 3, h: 1, x: 0, y: 0 },
            ],
          },
          {
            name: 'DemoA',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 1, y: 0 },
              { breakpoint: 'sm', w: 1, h: 1, x: 1, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 2, y: 0 },
              { breakpoint: 'lg', w: 2, h: 1, x: 2, y: 1 },
              { breakpoint: 'xl', w: 4, h: 1, x: 2, y: 1 },
            ],
          },
          {
            name: 'DemoC',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 0, y: 1 },
              { breakpoint: 'sm', w: 1, h: 1, x: 2, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 4, y: 0 },
              { breakpoint: 'lg', w: 2, h: 1, x: 4, y: 0 },
              { breakpoint: 'xl', w: 4, h: 2, x: 6, y: 0 },
            ],
          },
          {
            name: 'DemoB',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 1, y: 1 },
              { breakpoint: 'sm', w: 1, h: 1, x: 3, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 1 },
              { breakpoint: 'lg', w: 2, h: 1, x: 6, y: 0 },
              { breakpoint: 'xl', w: 3, h: 1, x: 3, y: 0 },
            ],
          },
        ],
      },
      {
        name: 'Pool History',
        widgets: [
          {
            name: 'PoolDevelopment',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 3, x: 0, y: 0 },
              { breakpoint: 'sm', w: 4, h: 2, x: 0, y: 0 },
              { breakpoint: 'md', w: 6, h: 2, x: 0, y: 0 },
              { breakpoint: 'lg', w: 5, h: 3, x: 0, y: 0 },
              { breakpoint: 'xl', w: 6, h: 3, x: 0, y: 0 },
            ],
          },
          {
            name: 'DemoWidget',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 2, x: 0, y: 3 },
              { breakpoint: 'sm', w: 3, h: 2, x: 0, y: 2 },
              { breakpoint: 'md', w: 3, h: 2, x: 0, y: 2 },
              { breakpoint: 'lg', w: 5, h: 3, x: 5, y: 0 },
              { breakpoint: 'xl', w: 6, h: 3, x: 6, y: 0 },
            ],
          },
        ],
      },
    ],
  }

  const filters = (
    <div className='p-6'>
      <p>Filters here...</p>
      <p>For pool dashboard currently hardcoded to</p>
      <p>
        Period:
        <br />
        from: 2022-05-07,
        <br />
        to: 2022-05-14
      </p>
      <p>
        Pool:
        <br />
        poolId: 3075481758
      </p>
    </div>
  )

  return (
    <BasicLayout filters={filters}>
      <Dashboard dashboard={dashboard} />
    </BasicLayout>
  )
}

export { Pool }
