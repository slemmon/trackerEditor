import updateColor from './updateColor'
import createNewTrack from './createNewTrack'
import updateTrack from './updateTrack'

const defaultState = []

export default function tracks (state = defaultState, action) {
    switch (action.type) {

        case 'ADD_TRACK':
        return state.concat(createNewTrack(action.trackType, state))

        case 'DELETE_TRACK':
        return state.filter(t => t.id !== action.trackId)

        case 'SET_TRACK_COLOR':
        return updateColor(state, action)

        case 'UPDATE_TRACK':
        return updateTrack(state, action)

        case 'TRACK_SET_DATA':
        return action.tracks

        default:
        return state
    }
}
