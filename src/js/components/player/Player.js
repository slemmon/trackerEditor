import { connect } from 'react-redux'
import PlayerView from './PlayerView'

const mapStateToProps = (state) => {
    const { activePattern, activePatternType, channels, fx,
          patternRepeat, patterns, songName, songRepeat } = state
    return {
        activePattern,
        activePatternType,
        channels,
        fx,
        patternRepeat,
        patterns,
        songName,
        songRepeat
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
        },
        setTick (tick) {
            dispatch({
                type: 'SET_TICK',
                tick
            })
        }
    }
}

const Player = connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerView)

export default Player
