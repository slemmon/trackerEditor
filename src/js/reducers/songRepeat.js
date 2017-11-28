const defaultState = false

export default function songRepeat (state = defaultState, action) {
    switch (action.type) {

        case 'TOGGLE_SONG_REPEAT': return action.repeat

        default: return state
    }
}
