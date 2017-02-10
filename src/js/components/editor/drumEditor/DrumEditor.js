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

    getActiveEffectAtPosition (position) {
        const effects = this.props.activeTrack.notes
        const effectsToRemove = []
        const fourInterestingPositions = [effects[position-3] || {}, effects[position-2] || {}, effects[position-1] || {}, effects[position] || {}]
        if ( fourInterestingPositions[0].type === 'crash' )
            effectsToRemove.push(position-3)
        if ( fourInterestingPositions[1].type === 'crash' )
            effectsToRemove.push(position-2)
        if ( fourInterestingPositions[2].type === 'crash' || fourInterestingPositions[2].type === 'snake' )
            effectsToRemove.push(position-1)
        if ( fourInterestingPositions[3].type )
            effectsToRemove.push(position)
        return effectsToRemove
    }

    getActiveEffectAfterPosition (position, length) {
        const effects = this.props.activeTrack.notes
        const effectsToRemove = []
        for ( let x = 0; x < length; x++ )
            if ( (effects[position + x + 1] || {}).type )
                effectsToRemove.push(position + x + 1)
        return effectsToRemove
    }

    addEffectAtPosition (position) {
        const isPositionTaken = this.getActiveEffectAtPosition(position)

        const track = Object.assign({}, this.props.activeTrack)
        const effects = track.notes.slice()

        if ( isPositionTaken.length )
            for ( const pos of isPositionTaken )
                effects[pos] = undefined
        else {
            const selectedEffect = this.state.selectedEffect

            if ( position + (selectedEffect === 'crash' ? 3 : selectedEffect === 'snake' ? 1 : 0) >= this.props.activeTrack.ticks )
                return

            effects[position] = {type: selectedEffect}
            let isNextPositionTaken = []
            if ( selectedEffect === 'crash' ) {
                isNextPositionTaken = this.getActiveEffectAfterPosition(position, 3)
            } else if ( selectedEffect === 'snake' ) {
                isNextPositionTaken = this.getActiveEffectAfterPosition(position, 1)
            }
            for ( const pos of isNextPositionTaken ) {
                effects[pos] = undefined
            }
        }

        track.notes = effects

        this.props.updateDrumTrack(track.id, track)
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
                </div>
                <div onClick={ this.changeTicksAmount }>ok</div>
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
