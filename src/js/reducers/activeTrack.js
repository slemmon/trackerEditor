const defaultState = {
    notes: []
}

export default function activeTrack (state = defaultState, action) {
    switch (action.type) {
        case 'SET_ACTIVE_TRACK': return action.track

        default: return state
    }
}
