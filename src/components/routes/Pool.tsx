import React from 'react'
import { Dashboard } from '../../types'
import { BasicLayout } from '../layouts'
import { Section } from '../util'
import { Widgets } from '../widgets'
// import './Pool.less'

const Pool: React.FC = () => {
  const dashboard: Dashboard = {
    name: 'Pool Details',
    sections: [
      {
        name: 'Key figures',
        widgets: [
          {
            name: 'DemoA',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 0, y: 0 },
              { breakpoint: 'sm', w: 1, h: 1, x: 0, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 0, y: 0 },
              { breakpoint: 'lg', w: 4, h: 1, x: 0, y: 0 },
              { breakpoint: 'xl', w: 3, h: 1, x: 0, y: 0 },
            ],
          },
          {
            name: 'DemoB',
            coordinates: [
              { breakpoint: 'xs', w: 1, h: 1, x: 1, y: 0 },
              { breakpoint: 'sm', w: 1, h: 1, x: 1, y: 0 },
              { breakpoint: 'md', w: 2, h: 1, x: 2, y: 0 },
              { breakpoint: 'lg', w: 2, h: 1, x: 4, y: 1 },
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
        ],
      },
      {
        name: 'Pool development',
        widgets: [
          {
            name: 'DemoWidget',
            coordinates: [
              { breakpoint: 'xs', w: 2, h: 2, x: 0, y: 0 },
              { breakpoint: 'sm', w: 3, h: 2, x: 0, y: 0 },
              { breakpoint: 'md', w: 5, h: 2, x: 0, y: 0 },
              { breakpoint: 'lg', w: 6, h: 3, x: 0, y: 0 },
              { breakpoint: 'xl', w: 8, h: 4, x: 0, y: 0 },
            ],
          },
        ],
      },
    ],
  }

  return (
    <BasicLayout>
      {dashboard.sections.map(({ name, widgets }) => (
        <Section title={name} key={name} className='p-4 mt-6'>
          <Widgets widgets={widgets} className='-m-4' />
        </Section>
      ))}
    </BasicLayout>
  )
}

export { Pool }
