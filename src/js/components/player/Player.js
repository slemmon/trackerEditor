import { connect } from 'react-redux'
import PlayerView from './PlayerView'

const mapStateToProps = (state) => {
    return {
        channels: state.channels,
        tracks: state.tracks,
        fx: state.fx
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveSongCode (code) {
            dispatch({
                type: 'SONG_SAVE',
                code
            })
        }
    }
}

const Player = connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerView)

export default Player
