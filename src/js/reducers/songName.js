import sanitize from 'sanitize-filename';
const defaultState = ''

export default function songName (state = defaultState, action) {
    switch (action.type) {
        case 'SET_SONG_NAME': return sanitize(action.songName)

        default: return state
    }
}