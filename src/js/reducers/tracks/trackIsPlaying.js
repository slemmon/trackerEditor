const defaultState = false

export default function trackIsPlaying (state = defaultState, action) {
    switch (action.type) {

        case 'TRACK_IS_PLAYING': return action.playing

        default: return state
    }
}
