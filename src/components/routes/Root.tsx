import { gql, useQuery } from '@apollo/client'
import { Card, Spin } from 'antd'
import React from 'react'
import { BasicLayout } from '../layouts'
// import './Root.less'

const Root: React.FC = () => {
  const query = gql`
    query GetPools {
      pools {
        nodes {
          id
          currency, 
          minEpochTime
        }
        totalCount
      }
    }
  `

  const { loading, data } = useQuery(query)

  return (
    <BasicLayout>
      <Card title='Some Widget' className='w-full max-w-xs'>
        {loading ? <Spin /> : <pre>{JSON.stringify(data, null, 2)}</pre>}
      </Card>
    </BasicLayout>
  )
}

export { Root }
