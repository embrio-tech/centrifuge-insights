import { AxesBoundaries, fitAxis, syncAxes } from './axis'

describe('fitAxis should', () => {
  test('return axisMin and axisMax', () => {
    expect(fitAxis([1, 4, 7, -0.5, -5, 14])).toEqual({ axisMin: -5 - 1.9, axisMax: 14 + 1.9 })
  })

  test('return default boundary if values are missing', () => {
    expect(fitAxis([])).toEqual({ axisMin: 0, axisMax: 1000 })
  })

  test('accept custom default values', () => {
    expect(fitAxis([], { axisDefaultMin: -1, axisDefaultMax: 1 })).toEqual({ axisMin: -1, axisMax: 1 })
  })

  test('accept custom extra', () => {
    expect(fitAxis([1, 4, 7, -0.5, -5, 14], { extra: 0.5 })).toEqual({ axisMin: -5 - 4.75, axisMax: 14 + 4.75 })
  })
})

const testRatio = ({ primaryAxisMax, primaryAxisMin, secondaryAxisMax, secondaryAxisMin }: AxesBoundaries): boolean =>
  (primaryAxisMin / primaryAxisMax).toPrecision(3) === (secondaryAxisMin / secondaryAxisMax).toPrecision(3)

const testCoverage = (
  { primaryAxisMax, primaryAxisMin, secondaryAxisMax, secondaryAxisMin }: AxesBoundaries,
  primaryValues: number[],
  secondaryValues: number[]
) => {
  return (
    primaryValues.every((value) => primaryAxisMin <= value && value <= primaryAxisMax) &&
    secondaryValues.every((value) => secondaryAxisMin <= value && value <= secondaryAxisMax)
  )
}

describe('syncAxes should', () => {
  test('sync axis of two sets of values', () => {
    const primaryValues = [-5, -3.7, 1, 8, 12.76]
    const secondaryValues = [0.254, 0.3456, 0.6574, 0.8996, 0.9211]
    // check ratio
    expect(testRatio(syncAxes(primaryValues, secondaryValues))).toBe(true)
    // check coverage
    expect(testCoverage(syncAxes(primaryValues, secondaryValues), primaryValues, secondaryValues)).toBe(true)
    // check values
    expect(syncAxes(primaryValues, secondaryValues)).toEqual({
      primaryAxisMax: 14.536,
      primaryAxisMin: -6.776,
      secondaryAxisMax: 1.10532,
      secondaryAxisMin: -0.5152482333516787,
    })
  })

  test('sync axis of two sets of values with negative secondary vals', () => {
    const primaryValues = [-5, -3.7, 1, 8, 12.76]
    const secondaryValues = [-0.254, -0.3456, -0.6574, -0.8996, -0.9211]
    // check ratio
    expect(testRatio(syncAxes(primaryValues, secondaryValues))).toBe(true)
    // check coverage
    expect(testCoverage(syncAxes(primaryValues, secondaryValues), primaryValues, secondaryValues)).toBe(true)
    // check values
    expect(syncAxes(primaryValues, secondaryValues)).toEqual({
      primaryAxisMax: 14.536,
      primaryAxisMin: -6.776,
      secondaryAxisMax: 2.371152821723731,
      secondaryAxisMin: -1.10532,
    })
  })

  test('sync axis of two sets of values with primaryMin = 0', () => {
    const primaryValues = [0, 3.7, 1, 8, 12.76]
    const secondaryValues = [0.254, 0.3456, 0.6574, 0.8996, 0.9211]
    // check ratio
    expect(testRatio(syncAxes(primaryValues, secondaryValues))).toBe(true)
    // check coverage
    expect(testCoverage(syncAxes(primaryValues, secondaryValues), primaryValues, secondaryValues)).toBe(true)
    // check values
    expect(syncAxes(primaryValues, secondaryValues)).toEqual({
      primaryAxisMax: 14.036,
      primaryAxisMin: -1.276,
      secondaryAxisMax: 1.10532,
      secondaryAxisMin: -0.10048363636363637,
    })
  })

  test('sync axis of two sets of values with all primary values in positive range', () => {
    const primaryValues = [2.54, 3.7, 7.32, 8, 12.76]
    const secondaryValues = [-0.254, 0.3456, -0.6574, 0.8996, 0.9211]
    // check ratio
    expect(testRatio(syncAxes(primaryValues, secondaryValues))).toBe(true)
    // check coverage
    expect(testCoverage(syncAxes(primaryValues, secondaryValues), primaryValues, secondaryValues)).toBe(true)
    // check values
    expect(syncAxes(primaryValues, secondaryValues)).toEqual({
      primaryAxisMax: 15.312,
      primaryAxisMin: -11.56968163492284,
      secondaryAxisMax: 1.07895,
      secondaryAxisMin: -0.81525,
    })
  })

  test('accept custom default min/max values', () => {
    const primaryValues: number[] = []
    const secondaryValues: number[] = []
    const options = {
      primaryAxisDefaultMin: -500,
      primaryAxisDefaultMax: 500,
      secondaryAxisDefaultMin: 2.5,
      secondaryAxisDefaultMax: 7.5,
    }
    // check values
    expect(syncAxes(primaryValues, secondaryValues, options)).toEqual({
      primaryAxisMin: -500,
      primaryAxisMax: 500,
      secondaryAxisMin: 2.5,
      secondaryAxisMax: 7.5,
    })
  })

  test('accept custom default extra', () => {
    const primaryValues: number[] = [-10, -5, 0, 5, 10]
    const secondaryValues: number[] = [-0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2]
    const options = {
      extra: 0.5,
    }
    // check values
    expect(syncAxes(primaryValues, secondaryValues, options)).toEqual({
      primaryAxisMin: -15,
      primaryAxisMax: 15,
      secondaryAxisMin: -0.30000000000000004,
      secondaryAxisMax: 0.30000000000000004,
    })
  })
})

export default null
