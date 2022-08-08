const SI_SYMBOLS: { [k: number]: string } = {
  3: 'K',
  6: 'M',
  9: 'B',
  12: 'T',
}

export const abbreviatedNumber = (
  value: string | number | bigint | undefined,
  options: { precision?: number } = {}
): string => {
  if (value === undefined) return '\u00a0'
  const { precision = 3 } = options
  const _value = Number(value)
  if (isNaN(_value)) return '–\u00a0'
  if (_value === 0) return '0'
  if (_value === Infinity) return '\u221e\u00a0' // infinity symbol
  const log = Math.floor(Math.log10(Math.abs(Number(_value.toPrecision(precision)))))
  const magnitude = log - (log % 3)
  return `${(_value / 10 ** magnitude).toPrecision(precision)}${
    SI_SYMBOLS[magnitude] ? SI_SYMBOLS[magnitude] : magnitude !== 0 ? `e${magnitude}` : ''
  }`
}
