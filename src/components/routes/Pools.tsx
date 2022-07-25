import React from 'react'
import { FiltersContextProvider } from '../../contexts'
import { Dashboard as DashboardInterface, Filter } from '../../types'
import { Filters } from '../filters'
import { BasicLayout } from '../layouts'
import { Dashboard } from '../util'
// import './Pools.less'

const Pools: React.FC = () => {
  const dashboard: DashboardInterface = {
    name: 'Pools',
    sections: [
      {
        name: 'Available Pools',
        widgets: [
          {
            name: 'DemoB',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'sm', w: 2, h: 2, x: 0, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'lg', w: 4, h: 2, x: 0, y: 0 },
              { breakpoint: 'xl', w: 3, h: 1, x: 0, y: 0 },
            ],
          },
        ],
      },
    ],
  }

  const filters: Filter[] = []

  return (
    <FiltersContextProvider filters={filters}>
      <BasicLayout sider={<Filters filters={filters} />}>
        <Dashboard dashboard={dashboard} />
      </BasicLayout>
    </FiltersContextProvider>
  )
}

export { Pools }
