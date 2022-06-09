export interface Pool {
  id: string
  metadata: string
}

interface TranchesMeta {
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
    icon: string
    asset: { class: string }
    issuer: {
      name: string
      description: string
      email: string
      logo: string
    }
    links: {
      executiveSummary: string
      forum: string
      website: string
    }
    status: 'open' | 'close' // TODO: complete list of possible status
  }
  tranches: TranchesMetadata
  riskGroups: RiskGroupMetadata[]
}
