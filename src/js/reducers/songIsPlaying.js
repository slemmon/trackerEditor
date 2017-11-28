const defaultState = false

export default function songIsPlaying (state = defaultState, action) {
    switch (action.type) {

        case 'SONG_IS_PLAYING': return action.playing

        default: return state
    }
}
