const defaultState = false

export default function trackRepeat (state = defaultState, action) {
    switch (action.type) {

        case 'TOGGLE_TRACK_REPEAT': return action.repeat

        default: return state
    }
}