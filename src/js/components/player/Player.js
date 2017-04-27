import { connect } from 'react-redux'
import PlayerView from './PlayerView'

// const mapDispatchToProps = (dispatch) => {
//     return {
//         updateTrack (trackId, track) {
//             dispatch({
//                 type: 'UPDATE_TRACK',
//                 trackId,
//                 track
//             })
//             dispatch({
//                 type: 'SET_ACTIVE_TRACK',
//                 track
//             })
//         },
//         setPlayableTrack (array) {
//             dispatch({
//                 type: 'SET_PLAYABLE_TRACK',
//                 array
//             })
//         },
//         playOnce () {
//             dispatch({
//                 type: 'PLAY_ONCE'
//             })
//         },
//         toggleMute () {
//             dispatch({
//                 type: 'TOGGLE_MUTE'
//             })
//         },
//         togglePause () {
//             dispatch({
//                 type: 'TOGGLE_PAUSE'
//             })
//         }
//     }
// }

const mapStateToProps = (state) => {
    return {
        playerStatus: state.player
    }
}

const Player = connect(
    mapStateToProps
    // mapDispatchToProps
)(PlayerView)

export default Player
