import { message } from 'antd'
import React, { createContext, useState, useMemo, useContext, useEffect, PropsWithChildren } from 'react'
import { AppError } from '../types'

interface ErrorContextInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: AppError | undefined
  setError: React.Dispatch<React.SetStateAction<AppError | undefined>>
}

const ErrorContext = createContext<ErrorContextInterface | undefined>(undefined)

const ErrorContextProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  const [error, setError] = useState<AppError | undefined>(undefined)

  const value = useMemo<ErrorContextInterface>(
    () => ({
      error,
      setError,
    }),
    [error, setError]
  )

  useEffect(() => {
    // TODO: improve error messaging for different errors (e.g. ApolloError)
    if (error && error.name !== 'CanceledError' ) {
      message.error(error.message, 10)
      console.error(error)
    }
  }, [error])

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

const useError = (): ErrorContextInterface => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be inside a Provider with a value')
  }
  return context
}

export { ErrorContextProvider, useError }
