import React from 'react'
// import './DemoB.less'

interface DemoBProps {
  className?: string;
}

const DemoB: React.FC<DemoBProps> = (props) => {
  const { className } = props

  return <div className={className}>DemoB</div>
}

export { DemoB }
