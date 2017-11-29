import { connect } from 'react-redux'
import PlayerView from './PlayerView'

const mapStateToProps = (state) => {
    const { channels, tracks, fx, activeTrack, songName,
          activeTrackType, songRepeat, trackRepeat } = state
    return {
        channels,
        tracks,
        fx,
        activeTrack,
        activeTrackType,
        songName,
        songRepeat,
        trackRepeat
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveSongCode (code) {
            dispatch({
                type: 'SONG_SAVE',
                code
            })
        },
        setSongIsPlaying (playing) {
            dispatch({
                type: 'SONG_IS_PLAYING',
                playing
            })
        },
        setTrackIsPlaying (playing) {
            dispatch({
                type: 'TRACK_IS_PLAYING',
                playing
            })
        }
    }
}

const Player = connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerView)

export default Player
