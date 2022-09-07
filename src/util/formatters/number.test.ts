import { abbreviatedNumber, roundedNumber } from './number'

describe('abbreviatedNumber should', () => {
  test('abbreviate tousands', () => {
    expect(abbreviatedNumber(12345)).toBe('12.3K')
  })

  test('abbreviate millions', () => {
    expect(abbreviatedNumber(123456789)).toBe('123M')
  })

  test('abbreviate billions', () => {
    expect(abbreviatedNumber(1234567890)).toBe('1.23B')
  })

  test('abbreviate trillions', () => {
    expect(abbreviatedNumber(123456789123456)).toBe('123T')
  })

  test('not abbreviate small numbers', () => {
    expect(abbreviatedNumber(12.3)).toBe('12.3')
  })

  test('not abbreviate 0', () => {
    expect(abbreviatedNumber(0)).toBe('0')
  })

  test('abbreviate very small numbers with scientific notation', () => {
    expect(abbreviatedNumber(0.000123)).toBe('0.123e-3')
  })

  test('abbreviate very large numbers with scientific notation', () => {
    expect(abbreviatedNumber(12345678912345678)).toBe('12.3e15')
  })

  test('abbreviate string numbers', () => {
    expect(abbreviatedNumber('12345')).toBe('12.3K')
  })

  test('abbreviate bigint numbers', () => {
    expect(abbreviatedNumber(BigInt(12345678))).toBe('12.3M')
  })

  test('allow config of precision', () => {
    expect(abbreviatedNumber(12345678, { precision: 5 })).toBe('12.346M')
  })

  test('remove trailing zeros', () => {
    expect(abbreviatedNumber(1000)).toBe('1K')
  })

  test('format rounded values correctly', () => {
    expect(abbreviatedNumber(999.9999999)).toBe('1K')
  })

  test('return infinity symbol if value is Infinity', () => {
    expect(abbreviatedNumber(Infinity)).toBe('\u221e\u00a0')
  })

  test('format negativ values correctly', () => {
    expect(abbreviatedNumber(-35.71093761964324)).toBe('-35.7')
  })

  test('return dash if value is NaN', () => {
    expect(abbreviatedNumber(NaN)).toBe('–\u00a0')
  })
})

describe('roundedNumber should', () => {
  test('format a number to 0 decimals by default', () => {
    expect(roundedNumber(235.5623467)).toBe('236')
  })

  test('format a number to the decimals specified', () => {
    expect(roundedNumber(235.5623467, { decimals: 3 })).toBe('235.562')
  })

  test('format a number to the decimals specified', () => {
    expect(roundedNumber(235.5623467, { decimals: 1 })).toBe('235.6')
  })

  test('format a number to the negative decimals specified', () => {
    expect(roundedNumber(235.5623467, { decimals: -2 })).toBe('200')
  })
})

export default null
