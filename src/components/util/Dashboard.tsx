import { Alert } from 'antd'
import React from 'react'
import { Dashboard as DashboardInterface } from '../../types'
import { Widgets } from '../widgets'
import { Section } from './Section'

const { ErrorBoundary } = Alert

// import './Dashboard.less'

interface DashboardProps {
  dashboard: DashboardInterface
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { dashboard } = props

  return (
    <>
      {dashboard.sections.map(({ name, widgets }) => (
        <Section title={name} key={name} className='p-4 mt-6'>
          <ErrorBoundary>
            <Widgets widgets={widgets} className='-m-4' />
          </ErrorBoundary>
        </Section>
      ))}
    </>
  )
}
