const defaultState = {
    notes: []
}

export default function activePattern (state = defaultState, action) {
    switch (action.type) {
        case 'SET_ACTIVE_PATTERN': return action.pattern

        default: return state
    }
}
