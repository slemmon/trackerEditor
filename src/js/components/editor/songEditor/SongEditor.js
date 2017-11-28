import { connect } from 'react-redux'
import SongEditorView from './SongEditorView'

const mapStateToProps = (state) => {
    const { fx, songIsPlaying } = state

    return {
        fxStatus: fx.status,
        songIsPlaying
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
        }
    }
}

const SongEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(SongEditorView)

export default SongEditor
