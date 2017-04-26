import updateColor from './updateColor'
import createNewTrack from './createNewTrack'
import updateTrack from './updateTrack'

const defaultState = []

export default function tracks (state = defaultState, action) {
    switch (action.type) {

        case 'ADD_TRACK':
        return state.concat(createNewTrack(action.trackType))

        case 'DELETE_TRACK':
        return state.filter(t => t.id !== action.trackId)

        case 'SET_TRACK_COLOR':
        return updateColor(state, action)

        case 'UPDATE_TRACK':
        return updateTrack(state, action)

        default:
        return state
    }
}
