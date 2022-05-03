import { useMediaQuery } from 'react-responsive'

interface Breakpoints {
  // match
  isXS: boolean
  isSM: boolean
  isMD: boolean
  isLG: boolean
  isXL: boolean
  isXXL: boolean

  // greater than
  gtXS: boolean
  gtSM: boolean
  gtMD: boolean
  gtLG: boolean
  gtXL: boolean

  // less than
  ltSM: boolean
  ltMD: boolean
  ltLG: boolean
  ltXL: boolean
  ltXXL: boolean
}

export const useBreakpoints = (): Breakpoints => {
  const [SM, MD, LG, XL, XXL] = [576, 768, 992, 1200, 1600]

  // match
  const isXS = useMediaQuery({ maxWidth: SM - 1 })
  const isSM = useMediaQuery({ minWidth: SM, maxWidth: MD - 1 })
  const isMD = useMediaQuery({ minWidth: MD, maxWidth: LG - 1 })
  const isLG = useMediaQuery({ minWidth: LG, maxWidth: XL - 1 })
  const isXL = useMediaQuery({ minWidth: XL, maxWidth: XXL - 1 })
  const isXXL = useMediaQuery({ minWidth: XXL })

  // greater than
  const gtXS = useMediaQuery({ minWidth: SM })
  const gtSM = useMediaQuery({ minWidth: MD })
  const gtMD = useMediaQuery({ minWidth: LG })
  const gtLG = useMediaQuery({ minWidth: XL })
  const gtXL = useMediaQuery({ minWidth: XXL })

  // less than
  const ltSM = useMediaQuery({ maxWidth: SM - 1 })
  const ltMD = useMediaQuery({ maxWidth: MD - 1 })
  const ltLG = useMediaQuery({ maxWidth: LG - 1 })
  const ltXL = useMediaQuery({ maxWidth: XL - 1 })
  const ltXXL = useMediaQuery({ maxWidth: XXL - 1 })

  return { isXS, isSM, isMD, isLG, isXL, isXXL, gtXS, gtSM, gtMD, gtLG, gtXL, ltSM, ltMD, ltLG, ltXL, ltXXL }
}
