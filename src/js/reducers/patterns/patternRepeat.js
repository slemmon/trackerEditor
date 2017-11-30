const defaultState = false

export default function patternRepeat (state = defaultState, action) {
    switch (action.type) {

        case 'TOGGLE_PATTERN_REPEAT': return action.repeat

        default: return state
    }
}