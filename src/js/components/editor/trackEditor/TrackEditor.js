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
        // deleteTrack (trackId) {
        //     dispatch({
        //         type: 'DELETE_TRACK',
        //         trackId
        //     })
        // },
        // setTrackColor (trackId, color) {
        //     dispatch({
        //         type: 'SET_TRACK_COLOR',
        //         trackId,
        //         color
        //     })
        // },
        // setActiveTrack (track) {
        //     dispatch({
        //         type: 'SET_ACTIVE_TRACK',
        //         track
        //     })
        // }
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
