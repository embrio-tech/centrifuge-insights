import React from 'react'
// import './DemoA.less'

interface DemoAProps {
  className?: string
}

const DemoA: React.FC<DemoAProps> = (props) => {
  const { className } = props

  return <div className={className}>DemoA</div>
}

export { DemoA }
