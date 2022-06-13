import { useEffect } from 'react'
import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client'
import { useError } from '../contexts/ErrorContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGraphQL = <Data = any, Variables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<Data, Variables>,
  options?: QueryHookOptions<Data, Variables>
): Omit<QueryResult<Data, Variables>, 'error'> => {
  const { error, ...rest } = useQuery<Data, Variables>(query, options)
  const { setError } = useError()

  useEffect(() => {
    if (error) setError(error)
  }, [error, setError])

  return rest
}
