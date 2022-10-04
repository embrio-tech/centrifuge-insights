import React, { PropsWithChildren } from 'react'
import { ApolloClient, ApolloProvider as GraphQLProvider, NormalizedCacheObject, InMemoryCache } from '@apollo/client'
import { useState } from 'react'
import { useEffect } from 'react'
import { useTenant } from './TenantContext'

// // TODO: https://www.apollographql.com/docs/react/pagination/core-api/#merging-paginated-results
// const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         trancheSnapshots: {
//           // Don't cache separate results based on
//           // any of this field's arguments.
//           keyArgs: false,

//           // Concatenate the incoming list items with
//           // the existing list items.
//           merge(
//             existing: Nodes<TrancheSnapshot> = { totalCount: 0, nodes: [] },
//             incoming: Nodes<TrancheSnapshot>
//           ): Nodes<TrancheSnapshot> {
//             return {
//               totalCount: incoming.totalCount,
//               nodes:
//                 incoming.nodes.length !== incoming.totalCount
//                  ? [...existing.nodes, ...incoming.nodes] : existing.nodes,
//             }
//           },
//         },
//       },
//     },
//   },
// })

export const GraphQLContextProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  const {
    tenantConfig: { graphQLServerUrl },
  } = useTenant()
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>(undefined)

  useEffect(() => {
    setClient(
      new ApolloClient({
        uri: graphQLServerUrl,
        cache: new InMemoryCache(),
      })
    )
    return () => {
      setClient(undefined)
    }
  }, [graphQLServerUrl])

  return client ? <GraphQLProvider client={client}>{children}</GraphQLProvider> : null
}
