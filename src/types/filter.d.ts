import * as components from '../components/filters/Filter/components'

interface FilterBase {
  type: keyof typeof components
}

export interface SelectFilterOption {
  value: string
  label: string
}

interface SelectFilter extends FilterBase {
  name: string
  options: SelectFilterOption[]
  type: 'SelectFilter'
}

export type Filter = SelectFilter

export type FilterOptions = SelectFilterOption[]
