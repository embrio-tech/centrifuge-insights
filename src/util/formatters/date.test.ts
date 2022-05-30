import { textDate } from './date'

describe('textDate should', () => {
  test('format a date string', () => {
    expect(textDate('2022-05-23')).toBe('May 23, 2022')
  })

  test('format a date string with locale', () => {
    expect(textDate('2022-05-23', { locale: 'de-CH' })).toBe('23. Mai 2022')
  })

  test('format a date', () => {
    expect(textDate(new Date('2022-05-23'))).toBe('May 23, 2022')
  })
})

export default null
