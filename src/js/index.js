import { Provider } from 'react-redux'
import { createStore } from 'redux'
import React from 'react'
import { render } from 'react-dom'
import reducer from './reducers/reducer'
import App from './components/App'

const store = createStore(reducer,
    window.devToolsExtension ? window.devToolsExtension() : undefined
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)

let previousPatternsLength = 0
const unsubscribe = store.subscribe(() => {
    const state = store.getState()

    const newLength = state.patterns.length
    const previousLength = previousPatternsLength
    if ( previousLength !== newLength )
        previousPatternsLength = newLength
    if ( (newLength > previousLength) || (newLength && !previousLength) ) {
        store.dispatch({
            type: 'SET_ACTIVE_PATTERN',
            pattern: state.patterns.slice(-1)[0]
        })
    }
})
