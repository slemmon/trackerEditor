const defaultState = false

export default function patternIsPlaying (state = defaultState, action) {
    switch (action.type) {

        case 'PATTERN_IS_PLAYING': return action.playing

        default: return state
    }
}
