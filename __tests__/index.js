import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import {
  createSelector,
  createStateSelector,
  createStructuredSelector,
} from '../src'

const render = element => {
  const renderer = TestRenderer.create(element)
  return {
    rerender(element) {
      renderer.update(element)
    },
    snapshot() {
      expect(renderer.toJSON()).toMatchSnapshot()
    },
  }
}

test('createSelector', () => {
  const selector = jest.fn((a, b) => a + b)
  const useSelector = createSelector(selector)

  function Test({ a, b }) {
    const result = useSelector(a, b)
    return <span>{result}</span>
  }

  const { rerender, snapshot } = render(<Test a={2} b={3} />)
  expect(selector).toBeCalledTimes(1)
  expect(selector).toHaveBeenCalledWith(2, 3)
  expect(selector).toHaveReturnedWith(5)
  snapshot()

  rerender(<Test a={2} b={3} />)
  expect(selector).toBeCalledTimes(1)
  snapshot()

  rerender(<Test a={4} b={3} />)
  expect(selector).toBeCalledTimes(2)
  expect(selector).toHaveReturnedWith(7)
  snapshot()
})

test('createStateSelector', () => {
  const selector = jest.fn((a, b) => a + b)
  const useSelector = createStateSelector(
    [(state, path) => state[path], state => state.b],
    selector,
  )

  function Test({ state, path }) {
    const result = useSelector(state, path)
    return <span>{result}</span>
  }

  const obj = { a: 2, b: 3, c: 10 }
  const { rerender, snapshot } = render(<Test path="a" state={obj} />)
  expect(selector).toBeCalledTimes(1)
  expect(selector).toHaveBeenCalledWith(2, 3)
  expect(selector).toHaveReturnedWith(5)
  snapshot()

  rerender(<Test path="a" state={obj} />)
  expect(selector).toBeCalledTimes(1)
  snapshot()

  rerender(<Test path="c" state={obj} />)
  expect(selector).toBeCalledTimes(2)
  expect(selector).toHaveBeenCalledWith(10, 3)
  expect(selector).toHaveReturnedWith(13)
  snapshot()

  const obj2 = { ...obj }
  rerender(<Test path="c" state={obj2} />)
  expect(selector).toBeCalledTimes(2)
  snapshot()

  const obj3 = { ...obj2, b: 6 }
  rerender(<Test path="c" state={obj3} />)
  expect(selector).toBeCalledTimes(3)
  expect(selector).toHaveBeenCalledWith(10, 6)
  expect(selector).toHaveReturnedWith(16)
  snapshot()
})

test('createStructuredSelector', () => {
  const selector = jest.fn(({ x, y }) => x + y)
  const useSelector = createStructuredSelector(
    {
      x: (state, path) => state[path],
      y: state => state.b,
    },
    selector,
  )

  function Test({ state, path }) {
    const result = useSelector(state, path)
    return <span>{result}</span>
  }

  const obj = { a: 2, b: 3, c: 10 }
  const { rerender, snapshot } = render(<Test path="a" state={obj} />)
  expect(selector).toBeCalledTimes(1)
  expect(selector.mock.calls[0][0]).toEqual({ x: 2, y: 3 })
  expect(selector).toHaveReturnedWith(5)
  snapshot()

  rerender(<Test path="a" state={obj} />)
  expect(selector).toBeCalledTimes(1)
  snapshot()

  rerender(<Test path="c" state={obj} />)
  expect(selector).toBeCalledTimes(2)
  expect(selector.mock.calls[1][0]).toEqual({ x: 10, y: 3 })
  expect(selector).toHaveReturnedWith(13)
  snapshot()

  const obj2 = { ...obj }
  rerender(<Test path="c" state={obj2} />)
  expect(selector).toBeCalledTimes(2)
  snapshot()

  const obj3 = { ...obj2, b: 6 }
  rerender(<Test path="c" state={obj3} />)
  expect(selector).toBeCalledTimes(3)
  expect(selector.mock.calls[2][0]).toEqual({ x: 10, y: 6 })
  expect(selector).toHaveReturnedWith(16)
  snapshot()
})
