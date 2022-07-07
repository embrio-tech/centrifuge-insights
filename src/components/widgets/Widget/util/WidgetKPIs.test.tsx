import React from 'react'
import renderer from 'react-test-renderer'
import { WidgetKPIs, WidgetKPI } from './WidgetKPIs'

describe('WidgetKPIs should', () => {
  test('match snapshot!', () => {
    const kpis: WidgetKPI[] = [
      {
        label: 'Pool value growth',
        value: 58.43,
        suffix: '%',
      },
      {
        label: 'Liquidity reserve as % of pool value',
        value: 24.2,
        suffix: '%',
      },
      {
        label: '',
      },
      {
        label: '# of loans',
        value: 0,
      },
    ]

    const tree = renderer.create(<WidgetKPIs kpis={kpis} />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

export default null
