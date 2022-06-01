import React from 'react'
import { FigureLayout } from '../layouts'
// import './DemoA.less'

interface DemoAProps {
  className?: string
}

const DemoA: React.FC<DemoAProps> = (props) => {
  const { className } = props

  return <FigureLayout className={className} value={'94.6'} suffix='cm' name='DemoA' loading />
}

export { DemoA }
