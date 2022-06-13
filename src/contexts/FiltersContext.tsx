import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parse, ParsedQs, stringify } from 'qs'
import type { Filter, Selection } from '../types'

interface FiltersContextInterface {
  // stores selections of all filters
  selections: { [id: string]: Selection }
  // selection of one filter (if id is provided to useFilter hook)
  selection?: Selection
  // set entire selections object
  setSelections: React.Dispatch<React.SetStateAction<{ [id: string]: Selection }>>
  // set selection of one filter
  setSelection: (id: string, selection: Selection) => void
  // set readyness status of one filter
  setFilterStatus: (id: string, ready: boolean) => void
  // list of status of all filters
  filtersStatus: { id: string; ready: boolean }[]
  // flag indicates if all filters are ready
  filtersReady: boolean
  // flag indicates if one filter is ready (if id is provided to useFilter hook)
  filterReady?: boolean
}

interface FiltersContextProviderProps {
  filters: Filter[]
}

const FiltersContext = createContext<FiltersContextInterface | undefined>(undefined)

const FiltersContextProvider: React.FC<FiltersContextProviderProps> = (props) => {
  const { children, filters } = props

  // STATE
  // ---------------------------------------

  // stores selections of filters
  const [selections, setSelections] = useState<{ [id: string]: Selection }>({})

  // stores status of filters (ready when options are loaded)
  const [filtersStatus, setFiltersStatus] = useState<{ id: string; ready: boolean }[]>(
    filters.map(({ id }) => ({ id, ready: false }))
  )

  // reading and writing of URLSearchParams with qs notation
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => parse(searchParams.toString()) || {}, [searchParams])

  // SETTERS
  // ---------------------------------------

  /**
   * set query params in qs notation
   *
   * @prop {type} name - description
   */
  const setParams = useCallback(
    (params: ParsedQs) => {
      const newSearchParams = new URLSearchParams(stringify(params))
      setSearchParams(newSearchParams, { replace: true })
    },
    [setSearchParams]
  )

  /**
   * set the selections of one filter
   *
   * @prop {string}     id          - id of filter (e.g. pool)
   * @prop {string[]}   selection   - selected values of filter
   */
  const setSelection = useCallback(
    (id: string, selection: Selection) => {
      const newParams = { ...params, [id]: selection.length === 1 ? selection[0] : selection }
      setParams(newParams)
      setSelections((oldSelections) => ({ ...oldSelections, [id]: selection }))
    },
    [params, setParams]
  )

  /**
   * set the status of one filter
   *
   * @prop {string}   id        - id of filter (e.g. pool)
   * @prop {boolean}  ready     - flag to indicate readyness of filter
   */
  const setFilterStatus = useCallback((id: string, ready: boolean) => {
    setFiltersStatus((oldFiltersStatus) => {
      const newFiltersStatus = [...oldFiltersStatus]
      const index = oldFiltersStatus.findIndex(({ id: listId }) => listId === id)
      if (index === -1) throw new Error(`No status entry found for filter "${id}"!`)
      newFiltersStatus.splice(index, 1, { id, ready })
      return newFiltersStatus
    })
  }, [])

  // EFFECTS
  // ---------------------------------------

  // effect to initialize filter status of all filters if filters list change
  useEffect(() => {
    setFiltersStatus(filters.map(({ id }) => ({ id, ready: false })))
  }, [filters])

  // flag that indicates if all filters are ready
  const filtersReady = useMemo(
    () => filtersStatus.reduce((allReady, { ready }) => allReady && ready, true),
    [filtersStatus]
  )

  // effect sets selections from URLSearchParams
  useEffect(() => {
    Object.entries(params).forEach(([key, param]) => {
      if (filters.map(({ id }) => id).includes(key)) {
        if (typeof param === 'string' && param !== selections[key]?.[0]) setSelection(key, [param])

        if (
          Array.isArray(param) &&
          (param as unknown[]).every((item: unknown) => typeof item === 'string') &&
          !(param as string[]).every((item) => selections[key]?.includes(item))
        ) {
          setSelection(key, param as string[])
        }
      }
    })
  }, [setSelection, filters, params, selections])

  // CONTEXT
  // ---------------------------------------

  // context value
  const value = useMemo<FiltersContextInterface>(
    () => ({
      selections,
      setSelections,
      setSelection,
      filtersReady,
      filtersStatus,
      setFilterStatus,
    }),
    [selections, setSelection, filtersReady, setFilterStatus, filtersStatus]
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

/**
 * useFilter hook to read and manipulate FiltersContext
 *
 * @prop {string?}    id    - specifiy id when hook is used by one particular filter (optional)
 *
 * @returns {object}        - context defined by FiltersContextInterface
 */
const useFilters = (id?: string): FiltersContextInterface => {
  const context = useContext(FiltersContext)
  if (!context) {
    throw new Error('useFilters must be inside a Provider with a value')
  }
  if (id)
    return {
      ...context,
      selection: context.selections[id],
      filterReady: context.filtersStatus.find(({ id: listId }) => listId === id)?.ready,
    }
  return context
}

export { FiltersContextProvider, useFilters }
