import React, { Component } from 'react'
import DrumEffectSelector from './DrumEffectSelector'
import DrumTable from './DrumTable'
import emitCustomEvent from '../../../customEventEmitter'

class DrumEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            currentTicks: props.pattern.ticks,
            selectedEffect: 'snare',
            repeatIsOn: false,
            autoplayIsOn: false,
            isMuted: false
        }

        this.changePatternName = this.changePatternName.bind(this)
        this.patternTicksAmount = this.patternTicksAmount.bind(this)
        this.changeTicksAmount = this.changeTicksAmount.bind(this)
        this.selectEffect = this.selectEffect.bind(this)
        this.addEffectAtPosition = this.addEffectAtPosition.bind(this)
        this.toggleAutoplay = this.toggleAutoplay.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if ( nextProps.status === 0 )
            this.setState({
                currentTicks: nextProps.pattern.ticks
            })
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.status === 0
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
        const { currentTicks } = this.state
        const newValue = (currentTicks > 0 && currentTicks < 65)
                         ? currentTicks
                         : ((currentTicks > 64) ? 64 : 1)

        pattern.ticks = newValue

        const newNotes = this.trimNotes(pattern.notes, newValue)
        pattern.notes = newNotes

        this.props.updatePattern(pattern.id, pattern)
    }

    trimNotes (notes, ticks) {
        const newNotes = notes.map((note, i) => {
            const noteTicks = this.getEffectLength(note) - 1

            if ( i + noteTicks >= ticks )
                return undefined
            else
                return note
        })
        return newNotes
    }

    getEffectLength (effect) {
        switch (effect) {
            case 'snare': return 2
            case 'shake': return 4
            case 'crash': return 16
            case 'tick': return 1
            case 'short_crash': return 8
        }
    }

    selectEffect (value) {
        this.setState({
            selectedEffect: value
        })
    }

    addEffectAtPosition (position) {
        const pattern = Object.assign({}, this.props.pattern)
        const { notes, ticks } = pattern
        let effects = notes.slice()

        if ( effects[position] !== undefined )
            effects[position] = undefined
        else
            effects = this.updateEffectsList(effects, position)

        pattern.notes = effects

        this.props.updatePattern(pattern.id, pattern)
        if ( this.state.autoplayIsOn ) this.playOnce(null, null, pattern)
    }

    updateEffectsList (effects, position) {
        const { selectedEffect } = this.state
        const { pattern } = this.props

        const effectLength = this.getEffectLength(selectedEffect)
        if ( (position + effectLength) > pattern.ticks )
            return effects

        effects[position] = selectedEffect

        if ( selectedEffect === 'snare' )
            // remove next 1
            effects[position+1] = undefined
        else if ( selectedEffect === 'shake' )
            for ( let x = 1; x < 4; x++ )
                effects[position+x] = undefined
            // remove next 4
        else if ( selectedEffect === 'crash' )
            for ( let x = 1; x < 16; x++ )
                effects[position+x] = undefined
            // remove next 16
        // else if ( selectedEffect === 'crash' )
        //     for ( let x = 1; x < 16; x++ )
        //         effects[position+x] = undefined
        //     // remove next 0
        else if ( selectedEffect === 'short_crash' )
            for ( let x = 1; x < 8; x++ )
                effects[position+x] = undefined
            // remove next 8

        // remove previous if previous is long enough
        const indexToStartSlicingFrom = (position - 15) < 0 ? 0 : position - 15
        const previousEffects = effects.slice(indexToStartSlicingFrom, position)
        const selectLength = previousEffects.length

        let thisEffect
        for ( let x = 0; x < selectLength; x++ ) {
            thisEffect = previousEffects[x]
            if ( thisEffect === 'crash' ) {
                effects[x+indexToStartSlicingFrom] = undefined
                break
            } else if ( thisEffect === 'shake' && selectLength - x <= 3 ) {
                effects[x+indexToStartSlicingFrom] = undefined
                break
            } else if ( thisEffect === 'snare' && selectLength - x === 1 ) {
                effects[x+indexToStartSlicingFrom] = undefined
                break
            } else if ( thisEffect === 'short_crash' && selectLength - x <= 7 ) {
                effects[x+indexToStartSlicingFrom] = undefined
                break
            }
        }

        return effects
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
        const { pattern: activePattern, togglePatternRepeat, 
              patternIsPlaying, patternRepeat } = this.props
        const state = this.state
        const selectedEffect = state.selectedEffect
        const playOrStop = patternIsPlaying ? 'stopPattern' : 'playPattern'
        const playOrStopText = patternIsPlaying ? 'Stop' : 'Play'

        return (
            <div id="drum-editor-container" className={ activePattern.id === undefined ? 'hidden' : '' }>

                <h5>Drum pattern editor</h5>

                <div className="editor-info">
                    <div className="editor-info-row">
                        <label htmlFor="pattern-name">Name: </label>
                        <input id="pattern-name" onChange={this.changePatternName} type="text" value={activePattern.name || ""} />
                    </div>
                    <form onSubmit={this.changeTicksAmount} className="editor-info-row">
                        <label htmlFor="pattern-ticks">Ticks: </label>
                        <input id="pattern-ticks" onChange={this.patternTicksAmount} type="number" min="1" max="64" value={this.state.currentTicks || 0} />
                        <input type="submit" value="ok" />
                    </form>
                </div>

                <div className="editor-play-buttons">
                    <button onClick={ this[playOrStop] }>
                        {`${playOrStopText}`}
                    </button>
                    <label>
                        Repeat
                        <input
                            type="checkbox"
                            onChange={e => togglePatternRepeat(e.target.checked)}
                            checked={patternRepeat}
                        />
                    </label>
                    <div style={{flex: 1}}></div>
                    <button onClick={this.toggleAutoplay}>{ `autoplay ${state.autoplayIsOn ? 'off' : 'on'}` }</button>
                    <button onClick={this.toggleMute}>{ `${state.isMuted ? 'un' : ''}mute` }</button>
                </div>

                <DrumTable notes={activePattern.notes} ticks={activePattern.ticks} addEffectAtPosition={this.addEffectAtPosition} repeatIsOn={state.repeatIsOn} />

                <div className="drum-selector-container">
                    <DrumEffectSelector
                        name = "tick"
                        selectEffect = {this.selectEffect}
                        selected = {'tick' === selectedEffect}
                    />
                    <DrumEffectSelector
                        name = "snare"
                        selectEffect = {this.selectEffect}
                        selected = {'snare' === selectedEffect}
                    />
                    <DrumEffectSelector
                        name = "shake"
                        selectEffect = {this.selectEffect}
                        selected = {'shake' === selectedEffect}
                    />
                    <DrumEffectSelector
                        name = "short_crash"
                        selectEffect = {this.selectEffect}
                        selected = {'short_crash' === selectedEffect}
                    />
                    <DrumEffectSelector
                        name = "crash"
                        selectEffect = {this.selectEffect}
                        selected = {'crash' === selectedEffect}
                    />
                </div>

            </div>
        )
    }
}

export default DrumEditor
