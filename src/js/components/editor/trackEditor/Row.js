import React, { Component } from 'react'

class Row extends Component {
    constructor (props) {
        super(props)

        this.toggleNote = this.toggleNote.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
    }

    toggleNote (note) {
        this.props.toggleNote((this.props.note.active === note ? -1 : note), this.props.row)
    }

    handleMouseEnter (note) {
        this.props.toggleNoteIfMouseIsHeld(note, this.props.row)
    }

    render () {

        const toggleNote = this.props.toggleNote,
              last = this.props.last,
              modifier = this.props.nextIsSame && this.props.previousIsSame ? 'editor-table-block-note-middle' : this.props.nextIsSame ? 'editor-table-block-note-first' : this.props.previousIsSame ? 'editor-table-block-note-last' : '',
              activeNote = this.props.note.active,
              rowNumber = this.props.totalRows - this.props.row,
              isHighlightedRow = rowNumber % 4 === 0

        return (
            <div
                className = { `editor-table-row ${ last ? 'editor-table-row-last' : '' } ${ isHighlightedRow ? 'editor-table-row-highlighted' : '' }` }
            >
                {isHighlightedRow?
                    <RowNumber number={rowNumber} />
                    :null
                }
                <Block number={1} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={2} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={3} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={4} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={5} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={6} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={7} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={8} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={9} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={10} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={11} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={12} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={13} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={14} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={15} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={16} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={17} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={18} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={19} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={20} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={21} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={22} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={23} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={24} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={25} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={26} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={27} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={28} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={29} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={30} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={31} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={32} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={33} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={34} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={35} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={36} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={37} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={38} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={39} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={40} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={41} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={42} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={43} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={44} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={45} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={46} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={47} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={48} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={49} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={50} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={51} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={52} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={53} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={54} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={55} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={56} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={57} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={58} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={59} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={60} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={61} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={62} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
                <Block number={63} activeNote={activeNote} modifier={modifier} toggleNote={this.toggleNote} handleMouseEnter={this.handleMouseEnter} />
            </div>
        )
    }
}

export default Row

const RowNumber = ({number}) =>
    <span>
        <span className="editor-table-row-numbers left">{number}</span>
        <span className="editor-table-row-numbers right">{number}</span>
    </span>

const Block = ({number, activeNote, modifier, toggleNote, handleMouseEnter}) =>
    <span
        onMouseDown = { () => toggleNote(number) }
        className = "editor-table-block"
        onMouseEnter = { () => handleMouseEnter(number) }
    >
        <span className={`${ activeNote === number ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
        </span>
    </span>

