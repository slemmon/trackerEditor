import { connect } from 'react-redux'
import TrackEditorView from './TrackEditorView'

const mapDispatchToProps = (dispatch) => {
    return {
        updateTrack (trackId, track) {
            dispatch({
                type: 'UPDATE_TRACK',
                trackId,
                track
            })
            dispatch({
                type: 'SET_ACTIVE_TRACK',
                track
            })
        },
        setPlayableSong (array) {
            dispatch({
                type: 'PLAYER_SET_SONG',
                array
            })
        },
        playOnce () {
            dispatch({
                type: 'PLAYER_PLAY_ONCE'
            })
        },
        toggleMute () {
            dispatch({
                type: 'PLAYER_TOGGLE_MUTE'
            })
        },
        togglePause () {
            dispatch({
                type: 'PLAYER_TOGGLE_AUTOPLAY'
            })
        }
    }
}

// const mapStateToProps = (state) => {
//     return {
//         track: state.activeTrack
//     }
// }

const TrackEditor = connect(
    // mapStateToProps,
    null,
    mapDispatchToProps
)(TrackEditorView)

export default TrackEditor
