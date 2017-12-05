import { connect } from 'react-redux'
import PatternListView from './PatternListView'

const mapDispatchToProps = (dispatch) => {
    return {
        createNewPattern (patternType) {
            dispatch({
                type: 'ADD_PATTERN',
                patternType
            })
        },
        deletePattern (patternId) {
            dispatch({
                type: 'DELETE_PATTERN',
                patternId
            })
            dispatch({
                type: 'CHANNEL_REMOVE_PATTERNS_BY_ID',
                patternId
            })
            dispatch({
                type: 'SET_ACTIVE_PATTERN',
                pattern:{
                    notes: []
                }
            })
            dispatch({
                type: 'SET_ACTIVE_PATTERN_TYPE',
                patternType: null
            })
        },
        setPatternColor (patternId, color) {
            dispatch({
                type: 'SET_PATTERN_COLOR',
                patternId,
                color
            })
        },
        setActivePattern (pattern, type) {
            dispatch({
                type: 'SET_ACTIVE_PATTERN',
                pattern
            })
            dispatch({
                type: 'SET_ACTIVE_PATTERN_TYPE',
                patternType: type
            })
        },
        setDragSource (dragSource) {
            dispatch({
                type: 'SET_PATTERN_DRAG_SOURCE',
                dragSource
            })
        }
    }
}

const mapStateToProps = ({ patterns }) => {
    return {
        patterns
    }
}

const PatternList = connect(
    mapStateToProps,
    mapDispatchToProps
)(PatternListView)

export default PatternList
