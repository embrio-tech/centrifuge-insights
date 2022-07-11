import logos from '../svg'

export interface TenantConfig {
  logo: keyof typeof logos
  name: string
  infoUrl: string
  graphQLServerUrl: string
}
