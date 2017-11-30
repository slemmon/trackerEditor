import updateColor from './updateColor'
import createNewPattern from './createNewPattern'
import updatePattern from './updatePattern'

const defaultState = []

export default function patterns (state = defaultState, action) {
    switch (action.type) {

        case 'ADD_PATTERN':
        return state.concat(createNewPattern(action.patternType, state))

        case 'DELETE_PATTERN':
        return state.filter(t => t.id !== action.patternId)

        case 'SET_PATTERN_COLOR':
        return updateColor(state, action)

        case 'UPDATE_PATTERN':
        return updatePattern(state, action)

        case 'PATTERN_SET_DATA':
        return action.patterns

        default:
        return state
    }
}
