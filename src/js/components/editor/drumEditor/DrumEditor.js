import { connect } from 'react-redux'
import DrumEditorView from './DrumEditorView'

const mapStateToProps = (state) => {
    const { id: activePatternId } = state.activePattern
    const { status, patterns, patternIsPlaying, patternRepeat } = state
    return {
        status,
        pattern: patterns.find( t => t.id === activePatternId ),
        patternIsPlaying,
        patternRepeat
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePattern (patternId, pattern) {
            dispatch({
                type: 'UPDATE_PATTERN',
                patternId,
                pattern
            })
            dispatch({
                type: 'SET_ACTIVE_PATTERN',
                pattern
            })
            dispatch({
                type: 'SET_ACTIVE_PATTERN_TYPE',
                patternType: 'drum'
            })
        },
        togglePatternRepeat (repeat) {
            dispatch({
                type: "TOGGLE_PATTERN_REPEAT",
                repeat
            })
        }
    }
}

const DrumEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(DrumEditorView)

export default DrumEditor
