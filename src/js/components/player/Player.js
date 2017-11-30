import { connect } from 'react-redux'
import PlayerView from './PlayerView'

const mapStateToProps = (state) => {
    const { channels, patterns, fx, activePattern, songName,
          activePatternType, songRepeat, patternRepeat } = state
    return {
        channels,
        patterns,
        fx,
        activePattern,
        activePatternType,
        songName,
        songRepeat,
        patternRepeat
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
        setPatternIsPlaying (playing) {
            dispatch({
                type: 'PATTERN_IS_PLAYING',
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
