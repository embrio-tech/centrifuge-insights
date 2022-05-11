import { WidgetAppearance } from './widget'

export interface Dashboard {
  name: string
  sections: {
    name: string
    widgets: WidgetAppearance[]
  }[]
}
