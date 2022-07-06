import React from 'react'
import { FiltersContextProvider } from '../../contexts'
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
        name: 'About Pool',
        widgets: [
          {
            name: 'PoolName',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'sm', w: 2, h: 2, x: 0, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'lg', w: 4, h: 2, x: 0, y: 0 },
              { breakpoint: 'xl', w: 3, h: 1, x: 0, y: 0 },
            ],
          },
          {
            name: 'PoolAssetClass',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 1, x: 0, y: 1 },
              { breakpoint: 'sm', w: 2, h: 1, x: 2, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 2, y: 0 },
              { breakpoint: 'lg', w: 3, h: 1, x: 4, y: 0 },
              { breakpoint: 'xl', w: 3, h: 1, x: 3, y: 0 },
            ],
          },
          {
            name: 'LoanVolume',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 0, y: 2 },
              { breakpoint: 'sm', w: 2, h: 1, x: 2, y: 1 },
              { breakpoint: 'md', w: 2, h: 1, x: 4, y: 0 },
              { breakpoint: 'lg', w: 2, h: 1, x: 4, y: 1 },
              { breakpoint: 'xl', w: 2, h: 1, x: 6, y: 0 },
            ],
          },
        ],
      },
      {
        name: 'Pool History',
        widgets: [
          {
            name: 'FundingDevelopment',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 3, x: 0, y: 0 },
              { breakpoint: 'sm', w: 4, h: 2, x: 0, y: 0 },
              { breakpoint: 'md', w: 6, h: 2, x: 0, y: 0 },
              { breakpoint: 'lg', w: 5, h: 3, x: 0, y: 0 },
              { breakpoint: 'xl', w: 6, h: 3, x: 0, y: 0 },
            ],
          },
          {
            name: 'PoolDevelopment',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 3, x: 0, y: 3 },
              { breakpoint: 'sm', w: 4, h: 2, x: 0, y: 2 },
              { breakpoint: 'md', w: 6, h: 2, x: 0, y: 2 },
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
    <FiltersContextProvider filters={filters}>
      <BasicLayout sider={<Filters filters={filters} />}>
        <Dashboard dashboard={dashboard} />
      </BasicLayout>
    </FiltersContextProvider>
  )
}

export { Pool }
