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

        this.props.updateTrack(track.id, track)
    }

    trackTicksAmount (e) {
        const newValue = parseInt(e.target.value)

        this.setState({
            currentTicks: newValue
        })
    }

    changeTicksAmount (e) {
        e.preventDefault()

        const track = Object.assign({}, this.props.activeTrack)
        const currentTicks = this.state.currentTicks
        const newValue = currentTicks > 0 && currentTicks < 65 ? currentTicks : currentTicks > 64 ? 64 : 1

        track.ticks = newValue

        const newNotes = this.trimNotes(track.notes, newValue)
        track.notes = newNotes

        this.props.updateTrack(track.id, track)
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

        const track = Object.assign({}, this.props.activeTrack)
        const ticks = track.ticks
        let effects = track.notes.slice()

        if ( effects[position] !== undefined )
            effects[position] = undefined
        else
            effects = this.updateEffectsList(effects, position)

        track.notes = effects

        this.props.updateTrack(track.id, track)
    }

    updateEffectsList (effects, position) {
        const selectedEffect = this.state.selectedEffect
        const track = this.props.activeTrack

        const effectLength = this.getEffectLength(selectedEffect)
        // const effectLength = selectedEffect === 'snare' ? 2 : selectedEffect === 'shake' ? 4 : 16
        if ( position + effectLength > track.ticks )
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
        const indexToStartSlicingFrom = position - 15 < 0 ? 0 : position - 15
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

    render () {
        const activeTrack = this.props.activeTrack
        const selectedEffect = this.state.selectedEffect

        return (
            <div id="drum-editor-container" className={ activeTrack.id === undefined ? 'hidden' : '' }>

                <h5>Drum track editor</h5>

                <div className="editor-info">
                    <div className="editor-info-row">
                        <label htmlFor="track-name">Name: </label>
                        <input id="track-name" onChange={this.changeTrackName} type="text" value={activeTrack.name || ""} />
                    </div>
                    <form onSubmit={this.changeTicksAmount} className="editor-info-row">
                        <label htmlFor="track-ticks">Ticks: </label>
                        <input id="track-ticks" onChange={this.trackTicksAmount} type="number" min="1" max="64" value={this.state.currentTicks || 0} />
                        <input type="submit" value="ok" />
                    </form>
                </div>

                <div className="editor-play-buttons">
                    <button onClick={this.props.playSong}>play once</button>
                    <button onClick={this.props.playSongAndRepeat}>play repeat</button>
                    <button onClick={this.props.togglePauseSong}>autoplay</button>
                    <button onClick={this.props.toggleMuteSong}>mute</button>
                </div>

                <DrumTable notes={activeTrack.notes} ticks={activeTrack.ticks} addEffectAtPosition={this.addEffectAtPosition} repeatIsOn={this.props.repeatIsOn} />

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

class DrumEffectSelector extends Component {
    render () {
        const effectName = this.props.name
        return (
            <span className="drum-selector" onClick={ e => this.props.selectEffect(effectName) }>
                <span className="effect-text">{effectName}</span>
                <span className={`effect-preview ${effectName}`}></span>
                { this.props.selected ?
                    <span>
                        <span>&nbsp;</span>
                        <ArrowIcon />
                    </span>
                    :null
                }
            </span>
        )
    }
}

const ArrowIcon = () => <i className="fa fa-arrow-left" aria-hidden="true"></i>

