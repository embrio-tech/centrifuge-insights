import * as components from '../components/filters/Filter/components'

export interface Filter {
  id: string
  type: keyof typeof components
}
