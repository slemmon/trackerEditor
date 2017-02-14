import React, { Component } from 'react'
import DrumTable from './DrumTable'

class DrumEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            currentTicks: this.props.activeTrack.ticks,
            selectedEffect: 'snare'
        }

        this.changeTrackName = this.changeTrackName.bind(this)
        this.trackTicksAmount = this.trackTicksAmount.bind(this)
        this.changeTicksAmount = this.changeTicksAmount.bind(this)
        this.selectEffect = this.selectEffect.bind(this)
        this.addEffectAtPosition = this.addEffectAtPosition.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentTicks: nextProps.activeTrack.ticks
        })
    }

    changeTrackName (e) {
        const track = Object.assign({}, this.props.activeTrack)
        const newName = e.target.value

        track.name = newName

        this.props.updateDrumTrack(track.id, track)
    }

    trackTicksAmount (e) {
        const newValue = parseInt(e.target.value)

        this.setState({
            currentTicks: newValue
        })
    }

    changeTicksAmount (e) {
        const track = Object.assign({}, this.props.activeTrack)
        const currentTicks = this.state.currentTicks
        const newValue = currentTicks > 0 && currentTicks < 65 ? currentTicks : currentTicks > 64 ? 64 : 1

        track.ticks = newValue

        const newNotes = this.trimNotes(track.notes, newValue)
        track.notes = newNotes

        this.props.updateDrumTrack(track.id, track)
    }

    trimNotes (notes, ticks) {
        const newNotes = notes.map((note={}, i) => {
            if ( i + (note.type === 'crash' ? 3 : note.type === 'snake' ? 1 : 0) >= ticks )
                return undefined
            else
                return note
        })
        return newNotes
    }

    selectEffect (value) {
        this.setState({
            selectedEffect: value
        })
    }

    addEffectAtPosition (position) {

        const track = Object.assign({}, this.props.activeTrack)
        const ticks = track.ticks
        let effects = track.notes.slice()

        if ( effects[position] !== undefined )
            effects[position] = undefined
        else
            effects = this.updateEffectsList(effects, position)

        track.notes = effects

        this.props.updateDrumTrack(track.id, track)
    }

    updateEffectsList (effects, position) {
        const selectedEffect = this.state.selectedEffect
        const track = this.props.activeTrack

        const effectLength = selectedEffect === 'snare' ? 2 : selectedEffect === 'snake' ? 4 : 16
        if ( position + effectLength > track.ticks )
            return effects

        effects[position] = selectedEffect

        if ( selectedEffect === 'snare' )
            // remove next
            effects[position+1] = undefined
        else if ( selectedEffect === 'snake' )
            for ( let x = 1; x < 4; x++ )
                effects[position+x] = undefined
            // remove next 4
        else if ( selectedEffect === 'crash' )
            for ( let x = 1; x < 16; x++ )
                effects[position+x] = undefined
            // remove next 16

        // remove previous if previous is long enough
        const indexToStartSlicingFrom = position - 15 < 0 ? 0 : position - 15
        const previousEffects = effects.slice(indexToStartSlicingFrom, position)
        const selectLength = previousEffects.length

        let thisEffect
        for ( let x = 0; x < selectLength; x++ ) {
            thisEffect = previousEffects[x]
            if ( thisEffect === 'crash' ) {
                effects[x+indexToStartSlicingFrom] = undefined
                break
            } else if ( thisEffect === 'snake' && selectLength - x <= 3 ) {
                effects[x+indexToStartSlicingFrom] = undefined
                break
            } else if ( thisEffect === 'snare' && selectLength - x === 1 ) {
                effects[x+indexToStartSlicingFrom] = undefined
                break
            }
        }

        return effects
    }

    render () {
        const activeTrack = this.props.activeTrack

        return (
            <div className={ activeTrack.id === undefined ? 'hidden' : '' }>
                <h5>DrumEditor</h5>
                <div>
                    <label htmlFor="track-name">Name: </label>
                    <input id="track-name" onChange={this.changeTrackName} type="text" value={activeTrack.name || ""} />
                </div>
                <div>
                    <label htmlFor="track-ticks">Ticks: </label>
                    <input id="track-ticks" onChange={this.trackTicksAmount} type="number" min="1" max="64" value={this.state.currentTicks || 0} />
                    <button onClick={ this.changeTicksAmount }>ok</button>
                </div>
                <DrumTable notes={activeTrack.notes} ticks={activeTrack.ticks} addEffectAtPosition={this.addEffectAtPosition} />

                <div className="drum-selector-container">
                    <span className="drum-selector" onClick={ e => this.selectEffect('snare') }>
                        <span className="effect-text">snare</span>
                        <span className="effect-preview snare"></span>
                    </span>
                    <span className="drum-selector" onClick={ e => this.selectEffect('snake') }>
                        <span className="effect-text">snake</span>
                        <span className="effect-preview snake"></span>
                    </span>
                    <span className="drum-selector" onClick={ e => this.selectEffect('crash') }>
                        <span className="effect-text">crash</span>
                        <span className="effect-preview crash"></span>
                    </span>
                </div>

            </div>
        )
    }
}

export default DrumEditor
