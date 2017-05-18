const defaultState = {
    code: ''
}

export default function song (state = defaultState, action) {
    switch (action.type) {

        case 'SONG_SAVE':
        return {code: action.code}

        default: return state
    }
}
