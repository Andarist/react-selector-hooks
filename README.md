# react-selector-hooks

Collection of hook-based memoized selector factories for declarations outside of render.

## Motivation

Reusing existing functions. It also might often be desirable to declare selector functions outside of render to keep render functions less bloated.

Instead of this:

```jsx
function Component({ a, b }) {
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
  return <span>{memoizedValue}</span>
}
```

You can write this:

```jsx
const useSelector = createSelector(computeExpensiveValue)

function Component({ a, b }) {
  const memoizedValue = useSelector(a, b)
  return <span>{memoizedValue}</span>
}
```

## API

### createSelector(resultFunc)

```jsx
import * as React from 'react'
import { createSelector } from 'react-selector-hooks'

const useSelector = createSelector(computeExpensiveValue)

export default function Component({ a, b }) {
  const memoizedValue = useSelector(a, b)
  return <span>{memoizedValue}</span>
}
```

### createStateSelector([inputSelectors], resultFunc)

This is really similar to [`reselect's createSelector`](https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc).

```jsx
import * as React from 'react'
import { createStateSelector } from 'react-selector-hooks'

const useSelector = createStateSelector(
  [
    state => state.values.value1,
    (state, a) => state.values.value2 + a,
    (state, a) => state.values.value3 * a,
  ],
  (value1, value2, value3) => value1 + value2,
)

export default function Component({ a }) {
  const state = React.useContext(StoreContext)
  const memoizedValue = useSelector(state, a)
  return <span>{memoizedValue}</span>
}
```

### createStructuredSelector({...inputSelectors}, resultFunc)

This is really similar to [`reselect's createStructuredSelector`](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector).

```jsx
import * as React from 'react'
import { createStructuredSelector } from 'react-selector-hooks'

const useSelector = createStructuredSelector(
  {
    value1: state => state.values.value1,
    value2: (state, a) => state.values.value2 + a,
  },
  ({ value1, value2 }) => value1 + value2,
)

export default function Component({ a }) {
  const state = React.useContext(StoreContext)
  const memoizedValue = useSelector(state, a)
  return <span>{memoizedValue}</span>
}
```
