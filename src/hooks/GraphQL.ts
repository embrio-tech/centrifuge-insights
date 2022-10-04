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
  options: QueryHookOptions<Data, Variables> = {}
): Omit<QueryResult<Data, Variables>, 'error'> => {
  const { error, data, ...rest } = useQuery<Data, Variables>(query, options)
  const { setError } = useError()

  useEffect(() => {
    if (error) setError(error)
  }, [error, setError])

  // raise error if not all documents are fetched with one request (workaround). TODO: find better solution.
  useEffect(() => {
    const { variables } = options
    if (data && variables && !('offset' in variables) ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values<any>(data)
        .filter((value) => typeof value === 'object')
        .forEach(({ totalCount, nodes, __typename }) => {
          if (totalCount && nodes?.length && totalCount > nodes.length) {
            setError(
              new Error(`Could not fetch all ${__typename} documents because of hardcoded subql pagination limit=100!`)
            )
          }
        })
    }
  }, [data, setError, options])

  return { data, ...rest }
}
