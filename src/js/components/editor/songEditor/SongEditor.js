import { connect } from 'react-redux'
import SongEditorView from './SongEditorView'

const mapStateToProps = ({ fx, songIsPlaying, songName, songState }) => {
    return {
        fxStatus: fx.status,
        songIsPlaying,
        songName,
        songState
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFxEditor (channel) {
            dispatch({
                type: "FX_SET_VIEW",
                fxType: 'channel',
                id: channel
            })
        },
        hideFxEditor () {
            dispatch({
                type: "FX_HIDE_VIEW"
            })
        },
        toggleSongRepeat (repeat) {
            dispatch({
                type: "TOGGLE_SONG_REPEAT",
                repeat
            })
        },
        onSongNameChange (e) {
            dispatch({
                type: "SET_SONG_NAME",
                songName: e.target.value
            })
        }
    }
}

const SongEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(SongEditorView)

export default SongEditor
