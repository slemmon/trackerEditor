const defaultState = null

export default function activePatternType (state = defaultState, action) {
    switch (action.type) {
        case 'SET_ACTIVE_PATTERN_TYPE': return action.patternType

        default: return state
    }
}