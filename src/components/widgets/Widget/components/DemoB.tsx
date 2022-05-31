import React from 'react'
import { FigureLayout } from '../layouts'
// import './DemoB.less'

interface DemoBProps {
  className?: string
}

const DemoB: React.FC<DemoBProps> = (props) => {
  const { className } = props

  return <FigureLayout className={className} value={'23.45'} unit='%' name='DemoB' color={'#2762ff'} />
}

export { DemoB }
