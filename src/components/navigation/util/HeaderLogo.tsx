import React, { RefObject, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSize } from '../../../hooks'
import logos from '../../../svg'
import { TenantConfig } from '../../../types'
// import './HeaderLogo.less'

interface HeaderLogoProps {
  className?: string
  logo: TenantConfig['logo']
}

export const HeaderLogo: React.FC<HeaderLogoProps> = (props) => {
  const { className, logo } = props

  const wrapperRef = useRef<HTMLDivElement>(null)

  const [logoRef, setLogoRef] = useState<RefObject<SVGSVGElement>>({ current: null })
  const logoCallbackRef = useRef((ref: SVGSVGElement) => {
    setLogoRef({ current: ref })
  })

  const { ratio } = useSize(logoRef)
  const { height } = useSize(wrapperRef)

  const width = useMemo(() => height * ratio || 0, [height, ratio])

  const Logo = useMemo(() => logos[logo], [logo])

  return (
    <div ref={wrapperRef} className={className}>
      <Link to='/'>
        <Logo ref={logoCallbackRef.current} className='h-full' style={{ width }} />
      </Link>
    </div>
  )
}
