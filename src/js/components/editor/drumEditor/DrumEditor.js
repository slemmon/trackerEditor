import { connect } from 'react-redux'
import DrumEditorView from './DrumEditorView'

const mapStateToProps = (state) => {
    const activeTrackId = state.activeTrack.id
    const { status, tracks, trackIsPlaying, trackRepeat } = state
    return {
        status,
        track: tracks.find( t => t.id === activeTrackId ),
        trackIsPlaying,
        trackRepeat
    }
}

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
            dispatch({
                type: 'SET_ACTIVE_TRACK_TYPE',
                trackType: 'drum'
            })
        },
        toggleTrackRepeat (repeat) {
            dispatch({
                type: "TOGGLE_TRACK_REPEAT",
                repeat
            })
        }
    }
}

const DrumEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(DrumEditorView)

export default DrumEditor
