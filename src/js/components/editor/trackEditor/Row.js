import React, { Component } from 'react'

class Row extends Component {
    constructor (props) {
        super(props)

        this.toggleNote = this.toggleNote.bind(this)
    }

    toggleNote (note) {
        this.props.toggleNote((this.props.note.active === note ? -1 : note), this.props.row)
    }

    render () {
        const toggleNote = this.props.toggleNote
        const last = this.props.last
        const modifier = this.props.nextIsSame && this.props.previousIsSame ? 'editor-table-block-note-middle' : this.props.nextIsSame ? 'editor-table-block-note-first' : this.props.previousIsSame ? 'editor-table-block-note-last' : ''
        const activeNote = this.props.note.active
        return (
            <div
                className = { `editor-table-row ${ last ? 'editor-table-row-last' : '' }` }
            >
                <span
                    onClick = { () => this.toggleNote(1) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 1 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(2) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 2 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(3) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 3 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(4) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 4 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(5) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 5 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(6) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 6 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(7) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 7 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(8) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 8 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(9) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 9 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(10) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 10 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(11) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 11 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(12) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 12 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(13) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 13 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(14) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 14 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(15) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 15 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(16) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 16 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(17) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 17 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(18) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 18 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(19) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 19 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(20) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 20 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(21) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 21 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(22) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 22 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(23) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 23 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(24) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 24 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(25) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 25 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(26) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 26 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(27) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 27 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(28) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 28 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(29) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 29 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(30) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 30 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(31) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 31 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(32) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 32 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(33) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 33 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(34) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 34 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(35) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 35 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(36) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 36 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(37) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 37 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(38) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 38 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(39) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 39 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(40) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 40 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(41) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 41 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(42) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 42 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(43) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 43 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(44) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 44 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(45) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 45 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(46) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 46 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(47) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 47 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(48) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 48 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(49) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 49 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(50) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 50 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(51) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 51 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(52) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 52 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(53) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 53 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(54) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 54 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(55) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 55 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(56) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 56 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(57) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 57 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(58) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 58 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(59) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 59 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(60) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 60 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(61) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 61 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(62) }
                    className = "editor-table-block"
                >
                    <span className={`${ activeNote === 62 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
                <span
                    onClick = { () => this.toggleNote(63) }
                    className = "editor-table-block editor-table-block-last"
                >
                    <span className={`${ activeNote === 63 ? '' : 'hidden' } editor-table-block-note ${modifier}`}>
                    </span>
                </span>
            </div>
        )
    }
}

export default Row
