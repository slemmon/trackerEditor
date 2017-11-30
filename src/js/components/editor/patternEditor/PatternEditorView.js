import React, { Component } from 'react'
import emitCustomEvent from '../../../customEventEmitter'

import NoteSheet from './NoteSheet'
import NewNotesTable from './NewNotesTable'

class PatternEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            currentTicks: this.props.pattern.ticks,
            bufferedNotes: this.props.pattern.notes,
            autoplayIsOn: false,
            repeatIsOn: false,
            isMuted: false,
            channel: 0
        }

        this.toggleNote = this.toggleNote.bind(this)
        this.changePatternName = this.changePatternName.bind(this)
        this.changePatternChannel = this.changePatternChannel.bind(this)
        this.patternTicksAmount = this.patternTicksAmount.bind(this)
        this.changeTicksAmount = this.changeTicksAmount.bind(this)
        this.playPatternOnce = this.playPattern.bind(this)
        this.sendUpdate = this.sendUpdate.bind(this)
        this.toggleAutoplay = this.toggleAutoplay.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if ( this.state.currentTicks !== nextProps.pattern.ticks )
            this.setState({
                currentTicks: nextProps.pattern.ticks
            })
        if ( this.state.bufferedNotes.length !== nextProps.pattern.notes.length || this.props.pattern.id !== nextProps.pattern.id )
            this.setState({
                bufferedNotes: nextProps.pattern.notes
            })
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.status === 0
    }

    toggleNote (note, row) {

        const pattern = Object.assign({}, this.props.pattern)
        const notes = this.state.bufferedNotes.slice()

        notes[pattern.ticks - 1 - row] = { active: note }

        this.setState({
            bufferedNotes: notes
        })

        pattern.notes = notes

        // throttle dispatch, if redux has to process too many at once the app will freeze/stutter
        if ( this.throttle ) clearTimeout(this.throttle)
        this.throttle = setTimeout(() => {
            this.sendUpdate(pattern)
            if ( this.state.autoplayIsOn ) this.playPattern()
        }, 250)

    }

    sendUpdate (pattern) {
        this.props.updatePattern(pattern.id, pattern)
    }

    changePatternName (e) {
        const pattern = Object.assign({}, this.props.pattern)
        const newName = e.target.value

        pattern.name = newName

        this.props.updatePattern(pattern.id, pattern)
    }

    patternTicksAmount (e) {
        const newValue = parseInt(e.target.value)

        this.setState({
            currentTicks: newValue
        })
    }

    changeTicksAmount (e) {
        e.preventDefault()

        const pattern = Object.assign({}, this.props.pattern)
        const currentTicks = this.state.currentTicks
        const newValue = currentTicks > 0 && currentTicks < 65 ? currentTicks : currentTicks > 64 ? 64 : 1

        let notes = pattern.notes.slice()
        while ( notes.length !== newValue ) {
            if ( notes.length > newValue )
                notes = pattern.notes.slice(0, newValue)
            else
                notes.push({active: -1})
        }

        pattern.ticks = newValue
        pattern.notes = notes

        this.props.updatePattern(pattern.id, pattern)
    }

    changePatternChannel (e) {
        const newValue = parseInt(e.target.value)
        emitCustomEvent('changeChannel', {
            channel: newValue
        })
        this.setState({
            channel: newValue
        })
    }

    playPattern = () => {
        emitCustomEvent('playOnce', {
            song: this.props.pattern
        })
    }

    /**
     * Stops playing the currently loaded pattern
     */
    stopPattern = () => {
        emitCustomEvent('stopPlaying')
    }

    toggleMute = () => {
        const newState = !this.state.isMuted
        this.setState({
            isMuted: newState
        })
        emitCustomEvent('toggleMute')
    }

    toggleAutoplay () {
        this.setState({
            autoplayIsOn: !this.state.autoplayIsOn
        })
    }

    render () {
        const { pattern: activePattern, togglePatternRepeat, patternRepeat } = this.props
        const state = this.state
        const { patternIsPlaying } = this.props
        const playOrStop = patternIsPlaying ? 'stopPattern' : 'playPattern'
        const playOrStopText = patternIsPlaying ? 'Stop' : 'Play'

        return (
            <div id="editor-container" className={ activePattern.id === undefined ? 'hidden' : '' }>

                <h5>Tune pattern editor</h5>

                <div className="editor-info">
                    <div className="editor-info-row">
                        <label htmlFor="pattern-name">Name: </label>
                        <input id="pattern-name" onChange={this.changePatternName} type="text" value={activePattern.name || ""} />
                    </div>
                    <div className="editor-info-row">
                        <label htmlFor="pattern-channel">Channel: </label>
                        <input id="pattern-channel" onChange={this.changePatternChannel} type="number" min="0" max="3" value={state.channel || 0} />
                    </div>
                    <form className="editor-info-row" onSubmit={ this.changeTicksAmount }>
                        <label htmlFor="pattern-ticks">Ticks: </label>
                        <input id="pattern-ticks" onChange={this.patternTicksAmount} type="number" min="1" max="64" value={state.currentTicks || 0} />
                        <input type="submit" value="ok" />
                    </form>
                </div>

                <div className="editor-play-buttons">
                    <button onClick={ this[playOrStop] }>{`${playOrStopText}`}</button>
                    <label>
                        Repeat
                        <input
                            type="checkbox"
                            onChange={ e => togglePatternRepeat(e.target.checked) }
                            value={patternRepeat}
                        />
                    </label>
                    <div style={{flex: 1}}></div>
                    <button onClick={this.toggleAutoplay}>{ `autoplay ${state.autoplayIsOn ? 'off' : 'on'}` }</button>
                    <button onClick={this.toggleMute}>{ `${state.isMuted ? 'un' : ''}mute` }</button>
                </div>

                <NewNotesTable notes={this.state.bufferedNotes} toggleNote={this.toggleNote} repeatIsOn={state.repeatIsOn} />

                <NoteSheet />

            </div>
        )
    }
}

export default PatternEditor
