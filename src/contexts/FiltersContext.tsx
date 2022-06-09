import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Selection } from '../types'

interface FiltersContextInterface {
  selections: { [id: string]: Selection }
  selection?: Selection
  setSelections: React.Dispatch<React.SetStateAction<{ [id: string]: Selection }>>
  setSelection: (id: string, selection: Selection) => void
}

const FiltersContext = createContext<FiltersContextInterface | undefined>(undefined)

const FiltersContextProvider: React.FC = (props) => {
  const { children } = props
  const [selections, setSelections] = useState<{ [id: string]: Selection }>({})

  const setSelection = useCallback((id: string, selection: Selection) => {
    setSelections((oldSelections) => ({ ...oldSelections, [id]: selection }))
  }, [])

  const value = useMemo(
    () => ({
      selections,
      setSelections,
      setSelection,
    }),
    [selections, setSelection]
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

const useFilters = (id?: string): FiltersContextInterface => {
  const context = useContext(FiltersContext)
  if (!context) {
    throw new Error('useFilters must be inside a Provider with a value')
  }
  if (id) return { ...context, selection: context.selections[id] }
  return context
}

export { FiltersContextProvider, useFilters }
