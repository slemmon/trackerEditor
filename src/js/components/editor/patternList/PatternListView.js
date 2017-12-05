import React, { Component } from 'react'
import PatternRow from './PatternRow'

class PatternList extends Component {
    state = {
        activePattern: null
    }

    setActivePattern = (pattern) => {
        this.setState({
            activePattern: pattern.id
        });
        this.props.setActivePattern(pattern, pattern.type);
    }

    render () {
        const { createNewPattern, deletePattern, patterns,
              setDragSource, setPatternColor } = this.props
        const { activePattern } = this.state

        return (
            <div id="pattern-list-container">
                <h5>Pattern list</h5>
                <button
                    className="button"
                    onClick = { () => createNewPattern('tune') }
                >
                    New tune pattern
                </button>
                <button
                    className="button"
                    onClick = { () => createNewPattern('drum') }
                >
                    New drum pattern
                </button>
                <ul className = "pattern-list">
                {patterns.map( (pattern, i) =>
                    <PatternRow
                        activePattern = {activePattern}
                        key = {pattern.id}
                        index = {i}
                        isLast = {i === patterns.length - 1}
                        pattern = {pattern}
                        deletePattern = {deletePattern}
                        setActivePattern = {this.setActivePattern}
                        setDragSource = {setDragSource}
                        setPatternColor = {setPatternColor}
                    />
                )}
                </ul>
            </div>
        )
    }
}

export default PatternList
