import { connect } from 'react-redux'
import DrumEditorView from './DrumEditorView'

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

const DrumEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(DrumEditorView)

export default DrumEditor
