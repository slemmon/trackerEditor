import sanitize from 'sanitize-filename';
const defaultState = ''

export default function songName (state = defaultState, action) {
    switch (action.type) {
        case 'SET_SONG_NAME': {
            let { songName } = action
            
            //songName = songName.replace(/[\*]/gi, '')
            songName = songName.replace(/[^a-z0-9 _-]/gi, '')

            // return sanitize(action.songName)
            return songName
        }

        default: return state
    }
}