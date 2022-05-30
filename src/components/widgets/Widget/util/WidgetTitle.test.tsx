import React from 'react'
import renderer from 'react-test-renderer'
import { WidgetTitle } from './WidgetTitle'

describe('WidgetTitle should', () => {
  test('match snapshot!', () => {
    const tree = renderer.create(<WidgetTitle title='Testing is great!' />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

export default null
