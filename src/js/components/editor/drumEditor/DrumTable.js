import React, { Component } from 'react'
import isEqual from 'lodash.isEqual'
import Pointer from './Pointer'

class DrumTable extends Component {
    constructor (props) {
        super(props)

        this.state = {
            row: this.createRow(props, true)
        }
    }

    componentWillReceiveProps (nextProps) {
        if ( !isEqual(nextProps.notes, this.props.notes) || nextProps.ticks !== this.props.ticks )
            this.createRow(nextProps)
    }

    createRow ({ticks, notes}, returnResult) {
        const row = []
        for ( let x = 0; x < ticks; x++ )
            row.push(
                <span key={x} className="editor-drum-block" onClick={ () => this.props.addEffectAtPosition(x) }>
                    { notes[x] ?
                        <span className={`editor-drum-block-note editor-drum-block-note-${notes[x]}`}></span>
                        : null
                    }
                </span>
            )

        if ( returnResult )
            return row
        else
            this.setState({
                row
            })
    }

    render () {
        const row = this.state.row

        return (
            <div className="editor-drum-container">
                <div className="editor-drum-row">
                    {row}
                </div>

                <Pointer ticks={this.props.ticks} repeatIsOn={this.props.repeatIsOn} />
            </div>
        )
    }
}

export default DrumTable
