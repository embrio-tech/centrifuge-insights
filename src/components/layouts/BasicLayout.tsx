import React from 'react'
// import './BasicLayout.less'

const BasicLayout: React.FC = (props) => {
  const { children } = props

  return(
    <div className='p-4'>{ children }</div>
  )
}

export { BasicLayout }
