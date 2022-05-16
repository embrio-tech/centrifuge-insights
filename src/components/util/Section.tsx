import React from 'react'
import './Section.less'

interface SectionProps {
  className?: string
  title: string
}

const Section: React.FC<SectionProps> = (props) => {
  const { className, children, title } = props

  return (
    <section className={className}>
      <h2 className='section-title'>{title}</h2>
      {children}
    </section>
  )
}

export { Section }
