import { connect } from 'react-redux'
import DrumEditorView from './DrumEditorView'

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

const DrumEditor = connect(
    null,
    mapDispatchToProps
)(DrumEditorView)

export default DrumEditor
