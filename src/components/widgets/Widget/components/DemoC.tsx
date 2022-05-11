import React from 'react'
// import './DemoC.less'

interface DemoCProps {
  className?: string;
}

const DemoC: React.FC<DemoCProps> = (props) => {
  const { className } = props

  return <div className={className}>DemoC</div>
}

export { DemoC }
