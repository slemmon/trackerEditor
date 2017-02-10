import React, { Component } from 'react'
import isEqual from 'lodash.isEqual'

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
        const notesPrepared = this.prepareNotes(ticks, notes)

        const row = []
        for ( let x = 0; x < ticks; x++ )
            row.push(
                <span key={x} className="editor-drum-block" onClick={ () => this.props.addEffectAtPosition(x) }>
                    { notesPrepared[x] ?
                        <span className={`editor-drum-block-note editor-drum-block-note-${notesPrepared[x]}`}></span>
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

    prepareNotes (ticks, notes) {
        const notesPrepared = new Array(ticks)
        let noteType,
            note
        for ( let x = 0, l = notes.length; x < l; x++ ) {
            note = notes[x]
            if ( note ) {
                noteType = note.type
                if ( noteType === 'snare' )
                    notesPrepared[x] = 'snare'
                else if ( noteType === 'snake' ) {
                    notesPrepared[x] = 'start'
                    notesPrepared[x + 1] = 'end'
                }
                else if ( noteType === 'crash' ) {
                    notesPrepared[x] = 'start'
                    notesPrepared[x + 1] = 'middle'
                    notesPrepared[x + 2] = 'middle'
                    notesPrepared[x + 3] = 'end'
                }
            }
        }
        return notesPrepared
    }

    render () {
        const row = this.state.row

        return (
            <div className="editor-drum-container">
                <div className="editor-drum-row">
                    {row}
                </div>
            </div>
        )
    }
}

export default DrumTable

