import { connect } from 'react-redux'
import EditorView from './EditorView'

const mapStateToProps = (state) => {
    return {
        activeTrack: state.activeTrack
    }
}

const Editor = connect(
    mapStateToProps
)(EditorView)

export default Editor
