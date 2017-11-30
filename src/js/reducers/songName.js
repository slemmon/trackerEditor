const defaultState = ''

export default function songName (state = defaultState, action) {
    switch (action.type) {
        case 'SET_SONG_NAME': {
            let { songName } = action
            
            songName = songName.replace(/[^a-z0-9 _-]/gi, '')

            return songName
        }

        default: return state
    }
}