import { ApolloClient, InMemoryCache } from '@apollo/client'
import { environment } from '../config'

const { GRAPHQL_SERVER_URL } = environment

export const graphQL = new ApolloClient({
  uri: GRAPHQL_SERVER_URL,
  cache: new InMemoryCache(),
})
