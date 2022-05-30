import React from 'react'
import renderer from 'react-test-renderer'
import { WidgetLayout } from './WidgetLayout'

describe('WidgetLayout should', () => {
  test('match snapshot!', () => {
    const tree = renderer
      .create(
        <WidgetLayout className='foo-class' header='This is the header!' footer='This is the footer!'>
          This is the body!
        </WidgetLayout>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

export default null
