import React, { PropsWithChildren } from 'react'
import { ApolloClient, ApolloProvider as GraphQLProvider, NormalizedCacheObject, InMemoryCache } from '@apollo/client'
import { useState } from 'react'
import { useEffect } from 'react'
import { useTenant } from './TenantContext'

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
