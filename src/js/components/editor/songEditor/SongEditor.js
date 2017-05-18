import { connect } from 'react-redux'
import SongEditorView from './SongEditorView'

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
        }
    }
}

const SongEditor = connect(
    null,
    mapDispatchToProps
)(SongEditorView)

export default SongEditor
