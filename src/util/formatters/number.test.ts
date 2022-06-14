import { abbreviatedNumber } from './number'

describe('abbreviatedNumber should', () => {
  test('should abbreviate tousands', () => {
    expect(abbreviatedNumber(12345)).toBe('12.3K')
  })

  test('should abbreviate millions', () => {
    expect(abbreviatedNumber(123456789)).toBe('123M')
  })

  test('should abbreviate billions', () => {
    expect(abbreviatedNumber(1234567890)).toBe('1.23B')
  })

  test('should abbreviate trillions', () => {
    expect(abbreviatedNumber(123456789123456)).toBe('123T')
  })

  test('should not abbreviate small numbers', () => {
    expect(abbreviatedNumber(12.3)).toBe('12.3')
  })

  test('should not abbreviate 0', () => {
    expect(abbreviatedNumber(0)).toBe('0')
  })

  test('should abbreviate very small numbers with scientific notation', () => {
    expect(abbreviatedNumber(0.000123)).toBe('0.123e-3')
  })

  test('should abbreviate very large numbers with scientific notation', () => {
    expect(abbreviatedNumber(12345678912345678)).toBe('12.3e15')
  })

  test('should abbreviate string numbers', () => {
    expect(abbreviatedNumber('12345')).toBe('12.3K')
  })

  test('should abbreviate bigint numbers', () => {
    expect(abbreviatedNumber(BigInt(12345678))).toBe('12.3M')
  })

  test('should allow config of precision', () => {
    expect(abbreviatedNumber(12345678, { precision: 5 })).toBe('12.346M')
  })

  test('should format rounded values correctly', () => {
    expect(abbreviatedNumber(999.9999999)).toBe('1.00K')
  })
})

export default null
