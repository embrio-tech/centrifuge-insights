import React from 'react'
import { FiltersContextProvider, PoolContextProvider } from '../../contexts'
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
            _id: '01',
            name: 'PoolName',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'sm', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'lg', w: 4, h: 1, x: 0, y: 0 },
              { breakpoint: 'xl', w: 4, h: 1, x: 0, y: 0 },
            ],
          },
          {
            _id: '02',
            name: 'PoolInfos',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 2, x: 0, y: 1 },
              { breakpoint: 'sm', w: 2, h: 2, x: 2, y: 0 },
              { breakpoint: 'md', w: 2, h: 2, x: 2, y: 0 },
              { breakpoint: 'lg', w: 4, h: 2, x: 4, y: 0 },
              { breakpoint: 'xl', w: 4, h: 2, x: 4, y: 0 },
            ],
          },
          {
            _id: '03',
            name: 'PoolValue',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 0, y: 3 },
              { breakpoint: 'sm', w: 2, h: 1, x: 0, y: 1 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 1 },
              { breakpoint: 'lg', w: 2, h: 1, x: 8, y: 0 },
              { breakpoint: 'xl', w: 2, h: 1, x: 0, y: 1 },
            ],
          },
          {
            _id: '04',
            name: 'AssetVolume',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 1, y: 3 },
              { breakpoint: 'sm', w: 2, h: 1, x: 0, y: 2 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 2 },
              { breakpoint: 'lg', w: 2, h: 1, x: 8, y: 1 },
              { breakpoint: 'xl', w: 2, h: 1, x: 2, y: 1 },
            ],
          },
          {
            _id: '05',
            name: 'PoolIssuer',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 1, x: 0, y: 4 },
              { breakpoint: 'sm', w: 2, h: 2, x: 2, y: 2 },
              { breakpoint: 'md', w: 2, h: 2, x: 4, y: 0 },
              { breakpoint: 'lg', w: 4, h: 1, x: 0, y: 1 },
              { breakpoint: 'xl', w: 4, h: 2, x: 8, y: 0 },
            ],
          },
        ],
      },
      {
        name: 'Pool History',
        widgets: [
          {
            _id: '11',
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
            _id: '12',
            name: 'FundingDevelopment',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 3, x: 0, y: 3 },
              { breakpoint: 'sm', w: 4, h: 2, x: 0, y: 2 },
              { breakpoint: 'md', w: 6, h: 2, x: 0, y: 2 },
              { breakpoint: 'lg', w: 5, h: 3, x: 5, y: 0 },
              { breakpoint: 'xl', w: 6, h: 3, x: 6, y: 0 },
            ],
          },
          {
            _id: '13',
            name: 'Returns',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 3, x: 0, y: 6 },
              { breakpoint: 'sm', w: 4, h: 2, x: 0, y: 4 },
              { breakpoint: 'md', w: 6, h: 2, x: 0, y: 4 },
              { breakpoint: 'lg', w: 5, h: 3, x: 0, y: 3 },
              { breakpoint: 'xl', w: 6, h: 3, x: 0, y: 3 },
            ],
          },
          {
            _id: '14',
            name: 'TokenPriceDevelopment',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 3, x: 0, y: 9 },
              { breakpoint: 'sm', w: 4, h: 2, x: 0, y: 6 },
              { breakpoint: 'md', w: 6, h: 2, x: 0, y: 6 },
              { breakpoint: 'lg', w: 5, h: 3, x: 5, y: 3 },
              { breakpoint: 'xl', w: 6, h: 3, x: 6, y: 3 },
            ],
          },
          {
            _id: '15',
            name: 'InvestmentVolume',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 3, x: 0, y: 12 },
              { breakpoint: 'sm', w: 4, h: 2, x: 0, y: 8 },
              { breakpoint: 'md', w: 6, h: 2, x: 0, y: 8 },
              { breakpoint: 'lg', w: 5, h: 3, x: 0, y: 6 },
              { breakpoint: 'xl', w: 6, h: 3, x: 0, y: 6 },
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
    {
      id: 'tranches',
      type: 'TranchesFilter',
    },
  ]

  return (
    <FiltersContextProvider filters={filters}>
      <PoolContextProvider>
        <BasicLayout sider={<Filters filters={filters} />}>
          <Dashboard dashboard={dashboard} />
        </BasicLayout>
      </PoolContextProvider>
    </FiltersContextProvider>
  )
}

export { Pool }
