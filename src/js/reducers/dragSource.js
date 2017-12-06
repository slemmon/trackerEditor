const defaultState = {}

export default function dragSource (state = defaultState, action) {
    switch (action.type) {
        case 'SET_PATTERN_DRAG_SOURCE': return action.dragSource

        default: return state
    }
}