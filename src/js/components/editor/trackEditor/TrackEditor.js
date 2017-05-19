import { connect } from 'react-redux'
import TrackEditorView from './TrackEditorView'

const mapStateToProps = (state) => {
    const activeTrackId = state.activeTrack.id
    return {
        status: state.status,
        track: state.tracks.find( t => t.id === activeTrackId )
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
        }
    }
}

const TrackEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(TrackEditorView)

export default TrackEditor
