import { useSearchParams } from 'react-router-dom'
import { parse, ParsedQs, stringify } from 'qs'
import { useCallback, useMemo } from 'react'

type Query = [params: ParsedQs, setQueryParams: (params: ParsedQs | ((oldParams: ParsedQs) => ParsedQs)) => void]

interface NavigateOptions {
  replace?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any
}

/**
 * react hook to read and write query parameters following the qs notation
 * More on qs: https://www.npmjs.com/package/qs
 *
 * @returns a tupple of type `Query` containing `[params, setParams]`
 */
export const useQuery = (): Query => {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(() => parse(searchParams.toString()) || {}, [searchParams])

   /**
   * set query params in qs notation
   *
   * @prop {type} name - description
   */
  const setParams = useCallback(
    (newParams: ParsedQs | ((oldParams: ParsedQs) => ParsedQs), navigateOptions?: NavigateOptions) => {
      const { replace = true, state } = navigateOptions || {}
      if (typeof newParams === 'function') {
        const newSearchParams = new URLSearchParams(stringify(newParams(params)))
        setSearchParams(newSearchParams, { replace, state })
      } else {
        const newSearchParams = new URLSearchParams(stringify(newParams))
        setSearchParams(newSearchParams, { replace, state })
      }
    },
    [setSearchParams, params]
  )

  return [params, setParams]
}
