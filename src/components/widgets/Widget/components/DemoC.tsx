import React from 'react'
import { FigureLayout } from '../layouts'
// import './DemoC.less'

interface DemoCProps {
  className?: string
}

const DemoC: React.FC<DemoCProps> = (props) => {
  const { className } = props

  return <FigureLayout className={className} value={'98.7M'} prefix='DAI' name='DemoC' />
}

export { DemoC }
