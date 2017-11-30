import React, { Component } from 'react'
import uniq from 'lodash.uniq'

import Row from './Row'
import PlayPositionPointer from './PlayPositionPointer'

class NewNotesTable extends Component {
    constructor (props) {
        super(props)

        this.state = {
            rows: this.createRows(props.notes.slice().reverse(), true)
        }

        this.last = Date.now()

        this.setMouseDown = this.setMouseDown.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        const notes = nextProps.notes.slice().reverse()
        if ( notes.length !== this.props.notes.length )
            this.createRows(notes)
        else
            this.updateRows(notes)
    }

    createRows (notes, returnResult) {
        const toggleNote = this.props.toggleNote
        const toggleNoteIfMouseIsHeld = this.toggleNoteIfMouseIsHeld
        const rows = []
        let note
        for ( let x = 0, notesLength = notes.length; x < notesLength; x++ ) {
            note = notes[x]
            rows.push(
                <Row
                    key = { x }
                    row = { x }
                    note = { note }
                    last = { x === notesLength - 1 }
                    totalRows = { notesLength }
                    toggleNote = { toggleNote }
                    previousIsSame = { note.active === (notes[x-1]||{}).active }
                    nextIsSame = { note.active === (notes[x+1]||{}).active }
                    toggleNoteIfMouseIsHeld = { toggleNoteIfMouseIsHeld.bind(this) }
                />
            )
        }

        if ( returnResult )
            return rows
        else
            this.setState({
                rows
            })
    }

    updateRows (notes) {
        const difference = this.findDifference(notes)

        let rowsToUpdate = []
        for ( const i of difference ) {
            rowsToUpdate.push(i)
            if ( i !== 0 )
                rowsToUpdate.push(i - 1)
            if ( i !== notes.length - 1 )
                rowsToUpdate.push(i + 1)
        }

        rowsToUpdate.sort()
        rowsToUpdate = uniq(rowsToUpdate)

        const notesLength = notes.length
        const toggleNote = this.props.toggleNote
        const toggleNoteIfMouseIsHeld = this.toggleNoteIfMouseIsHeld
        const rows = this.state.rows.slice()
        let note
        for ( const row of rowsToUpdate ) {
            note = notes[row]
            rows[row] = (
                <Row
                    key={ row }
                    row={ row }
                    note={ note }
                    last={ row === notesLength - 1 }
                    totalRows = { notesLength }
                    toggleNote={ toggleNote }
                    previousIsSame = { note.active === (notes[row-1]||{}).active }
                    nextIsSame = { note.active === (notes[row+1]||{}).active }
                    toggleNoteIfMouseIsHeld = { toggleNoteIfMouseIsHeld.bind(this) }
                />
            )
        }

        this.setState({rows})

    }

    findDifference (notes) {
        const oldNotes = this.props.notes.slice().reverse()
        let note
        const changedNoteIndexes = []
        for ( let x = 0, l = notes.length; x < l; x++ ) {
            note = notes[x]
            if ( oldNotes[x].active !== note.active )
                changedNoteIndexes.push(x)
        }
        return changedNoteIndexes
    }

    toggleNoteIfMouseIsHeld (note, row) {

        if ( Date.now() - this.last > 20 ) { // little bit of throttling, probably doesn't do much though

            if ( this.state.mouseDown )
                this.props.toggleNote(this.state.mouseDownNotesTurnOff ? -1 : note, row)

            this.last = Date.now()
        }

    }

    setMouseDown (e) {
        const target = e.target

        let newNotesTurnOff = true
        if ( target.hasChildNodes() && target.childNodes[0].classList.contains('hidden') )
            newNotesTurnOff = false

        this.setState({
            mouseDown: true,
            mouseDownNotesTurnOff: newNotesTurnOff
        })
    }

    render () {
        const rows = this.state.rows

        return (
            <div
                className="editor-table-container"
                onMouseDown={ this.setMouseDown }
                onMouseUp={ () => this.setState({mouseDown: false}) }
                onMouseLeave={ () => this.setState({mouseDown: false}) }
            >
                <div className="editor-table">
                    {rows}
                </div>

                <PlayPositionPointer ticks={rows.length} repeatIsOn={this.props.repeatIsOn} />
            </div>
        )
    }
}

export default NewNotesTable
