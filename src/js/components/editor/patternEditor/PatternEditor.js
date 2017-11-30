import { connect } from 'react-redux'
import PatternEditorView from './PatternEditorView'

const mapStateToProps = (state) => {
    const activePatternId = state.activePattern.id
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
                patternType: 'tune'
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

const PatternEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(PatternEditorView)

export default PatternEditor
