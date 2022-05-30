export const textDate = (value: string | number | Date, options: { locale?: string } = {}): string => {
  const { locale = 'en-US' } = options
  return new Date(value).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
