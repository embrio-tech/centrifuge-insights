import React from 'react'
import { Dashboard as DashboardInterface, Filter } from '../../types'
import { Filters } from '../filters'
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

  const filters: Filter[] = [
    {
      id: 'pool',
      type: 'PoolFilter',
    },
  ]

  return (
    <BasicLayout sider={<Filters filters={filters} />}>
      <Dashboard dashboard={dashboard} />
    </BasicLayout>
  )
}

export { Pool }
