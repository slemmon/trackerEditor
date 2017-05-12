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
        }
    }
}

const TrackEditor = connect(
    null,
    mapDispatchToProps
)(TrackEditorView)

export default TrackEditor
