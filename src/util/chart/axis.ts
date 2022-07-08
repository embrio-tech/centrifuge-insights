interface AxisBoundaries {
  axisMin: number
  axisMax: number
}

export interface AxesBoundaries {
  primaryAxisMin: number
  primaryAxisMax: number
  secondaryAxisMin: number
  secondaryAxisMax: number
}

export const fitAxis = (
  values: number[],
  options: { extra?: number; axisDefaultMin?: number; axisDefaultMax?: number } = {}
): AxisBoundaries => {
  const { extra = 0.2, axisDefaultMax = 1000, axisDefaultMin = 0 } = options

  if (!values.length) return { axisMin: axisDefaultMin, axisMax: axisDefaultMax }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const extraValue = ((Math.abs(min) + Math.abs(max)) / 2) * extra

  return {
    axisMin: min - extraValue,
    axisMax: max + extraValue,
  }
}

export const syncAxes = (
  primaryAxisValues: number[],
  secondaryAxisValues: number[],
  options: {
    extra?: number
    primaryAxisDefaultMin?: number
    primaryAxisDefaultMax?: number
    secondaryAxisDefaultMin?: number
    secondaryAxisDefaultMax?: number
  } = {}
): AxesBoundaries => {
  const {
    extra = 0.2,
    primaryAxisDefaultMin = -1000,
    primaryAxisDefaultMax = 1000,
    secondaryAxisDefaultMin = 0,
    secondaryAxisDefaultMax = 1,
  } = options

  // setup boundary object with defaults
  const boundaries: AxesBoundaries = {
    primaryAxisMin: primaryAxisDefaultMin,
    primaryAxisMax: primaryAxisDefaultMax,
    secondaryAxisMin: secondaryAxisDefaultMin,
    secondaryAxisMax: secondaryAxisDefaultMax,
  }

  // if primary values are all positive or all negative but secondary values are positive and negative
  const switchRefAxis =
    Math.min(...primaryAxisValues) * Math.max(...primaryAxisValues) >= 0 &&
    !(Math.min(...secondaryAxisValues) * Math.max(...secondaryAxisValues) >= 0)

  // setup value arrays
  const primaryValues: number[] = []
  const secondaryValues: number[] = []

  if (switchRefAxis) {
    primaryValues.push(...secondaryAxisValues)
    secondaryValues.push(...primaryAxisValues)
  } else {
    primaryValues.push(...primaryAxisValues)
    secondaryValues.push(...secondaryAxisValues)
  }

  const { axisMin: primaryAxisMin, axisMax: primaryAxisMax } = fitAxis(primaryValues, {
    extra,
    axisDefaultMin: primaryAxisDefaultMin,
    axisDefaultMax: primaryAxisDefaultMax,
  })

  // store primary min and max
  if (switchRefAxis) {
    boundaries.secondaryAxisMin = primaryAxisMin
    boundaries.secondaryAxisMax = primaryAxisMax
  } else {
    boundaries.primaryAxisMin = primaryAxisMin
    boundaries.primaryAxisMax = primaryAxisMax
  }

  // if secondary values are missing
  if (!secondaryValues.length) {
    // done
    return boundaries
  }

  const secondaryMin = Math.min(...secondaryValues)
  const secondaryMax = Math.max(...secondaryValues)

  // if positive section of secondary values is larger
  if (Math.abs(secondaryMin) <= Math.abs(secondaryMax)) {
    const secondaryAxisMax = (1 + extra) * secondaryMax
    const secondaryAxisMin = (secondaryAxisMax * primaryAxisMin) / primaryAxisMax

    // store primary min and max
    if (switchRefAxis) {
      boundaries.primaryAxisMin = secondaryAxisMin
      boundaries.primaryAxisMax = secondaryAxisMax
    } else {
      boundaries.secondaryAxisMin = secondaryAxisMin
      boundaries.secondaryAxisMax = secondaryAxisMax
    }

    // done
    return boundaries
  }

  // if negative section of secondary values is larger
  const secondaryAxisMin = (1 + extra) * secondaryMin
  const secondaryAxisMax = (secondaryAxisMin * primaryAxisMax) / primaryAxisMin
  // store primary min and max
  if (switchRefAxis) {
    boundaries.primaryAxisMin = secondaryAxisMin
    boundaries.primaryAxisMax = secondaryAxisMax
  } else {
    boundaries.secondaryAxisMin = secondaryAxisMin
    boundaries.secondaryAxisMax = secondaryAxisMax
  }

  // done
  return boundaries
}
