import React from 'react'
import { Dashboard } from '../../types'
import { BasicLayout } from '../layouts'
import { Section } from '../util'
import { Widgets } from '../widgets/Widgets'
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
              { breakpoint: 'xs', x: 0, y: 0, w: 1, h: 1 },
              { breakpoint: 'sm', x: 0, y: 0, w: 2, h: 2 },
              { breakpoint: 'md', x: 0, y: 0, w: 2, h: 3 },
              { breakpoint: 'lg', x: 0, y: 0, w: 2, h: 4 },
              { breakpoint: 'xl', x: 0, y: 0, w: 2, h: 5 },
            ],
          },
          {
            name: 'DemoC',
            coordinates: [
              { breakpoint: 'xs', x: 1, y: 0, w: 1, h: 1 },
              { breakpoint: 'sm', x: 2, y: 1, w: 2, h: 2 },
              { breakpoint: 'md', x: 2, y: 2, w: 2, h: 3 },
              { breakpoint: 'lg', x: 2, y: 3, w: 2, h: 4 },
              { breakpoint: 'xl', x: 2, y: 3, w: 2, h: 5 },
            ],
          },
        ],
      },
      {
        name: 'Pool development',
        widgets: [
          {
            name: 'DemoB',
            coordinates: [
              { breakpoint: 'xs', x: 0, y: 0, w: 1, h: 1 },
              { breakpoint: 'sm', x: 0, y: 0, w: 2, h: 2 },
              { breakpoint: 'md', x: 0, y: 0, w: 2, h: 3 },
              { breakpoint: 'lg', x: 0, y: 0, w: 2, h: 4 },
              { breakpoint: 'xl', x: 0, y: 0, w: 2, h: 5 },
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
