import { connect } from 'react-redux'
import EditorView from './EditorView'

const mapStateToProps = (state) => {
    return {
        activePattern: state.activePattern
    }
}

const Editor = connect(
    mapStateToProps
)(EditorView)

export default Editor
