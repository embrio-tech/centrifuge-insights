import React from 'react'
import renderer from 'react-test-renderer'
import { WidgetSpin } from './WidgetSpin'

describe('WidgetSpin should', () => {
  test('match snapshot!', () => {
    const tree = renderer
      .create(
        <div className='h-20'>
          <WidgetSpin spinning>Hello spinner!</WidgetSpin>
        </div>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})

export default null
