const defaultState = null

export default function activeTrackType (state = defaultState, action) {
    switch (action.type) {
        case 'SET_ACTIVE_TRACK_TYPE': return action.trackType

        default: return state
    }
}