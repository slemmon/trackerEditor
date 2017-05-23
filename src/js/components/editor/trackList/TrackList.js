import { connect } from 'react-redux'
import TrackListView from './TrackListView'

const mapDispatchToProps = (dispatch) => {
    return {
        createNewTrack (trackType) {
            dispatch({
                type: 'ADD_TRACK',
                trackType
            })
        },
        deleteTrack (trackId) {
            dispatch({
                type: 'DELETE_TRACK',
                trackId
            })
            dispatch({
                type: 'CHANNEL_REMOVE_TRACKS_BY_ID',
                trackId
            })
            dispatch({
                type: 'SET_ACTIVE_TRACK',
                track:{
                    notes: []
                }
            })
        },
        setTrackColor (trackId, color) {
            dispatch({
                type: 'SET_TRACK_COLOR',
                trackId,
                color
            })
        },
        setActiveTrack (track) {
            dispatch({
                type: 'SET_ACTIVE_TRACK',
                track
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        tracks: state.tracks
    }
}

const TrackList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TrackListView)

export default TrackList
