import type { IpfsFile } from '../types/ipfs'

export interface Pool {
  id: string
  metadata: string
}

interface TranchesMetadata {
  [key: string]: {
    name: string
    symbol: string
    minInitialInvestment: string
  }
}

interface RiskGroupMetadata {
  name: string
  advanceRate: string
  interestRatePerSec: string
  probabilityOfDefault: string
  lossGivenDefault: string
  discountRate: string
}

export interface PoolMetadata {
  pool: {
    name: string
    icon: string | IpfsFile
    asset: { class: string }
    issuer: {
      name: string
      description: string
      email: string
      logo: string | IpfsFile
    }
    links: {
      executiveSummary?: string | IpfsFile
      forum?: string
      website?: string
    }
    status: 'open' | 'closed' // TODO: complete list of possible status
  }
  tranches: TranchesMetadata
  riskGroups: RiskGroupMetadata[]
}
