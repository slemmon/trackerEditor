import React, { Component } from 'react'
import DrumTable from './DrumTable'
import DrumEffectSelector from './DrumEffectSelector'
import emitCustomEvent from '../../../customEventEmitter'

class DrumEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            currentTicks: props.track.ticks,
            selectedEffect: 'snare',
            repeatIsOn: false,
            autoplayIsOn: false,
            isMuted: false
        }

        this.changeTrackName = this.changeTrackName.bind(this)
        this.trackTicksAmount = this.trackTicksAmount.bind(this)
        this.changeTicksAmount = this.changeTicksAmount.bind(this)
        this.selectEffect = this.selectEffect.bind(this)
        this.addEffectAtPosition = this.addEffectAtPosition.bind(this)
        this.playOnce = this.playOnce.bind(this)
        this.playSongAndRepeat = this.playSongAndRepeat.bind(this)
        this.toggleAutoplay = this.toggleAutoplay.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if ( nextProps.status === 0 )
            this.setState({
                currentTicks: nextProps.track.ticks
            })
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.status === 0
    }

    changeTrackName (e) {
        const track = Object.assign({}, this.props.track)
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

        const track = Object.assign({}, this.props.track)
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

        const track = Object.assign({}, this.props.track)
        const ticks = track.ticks
        let effects = track.notes.slice()

        if ( effects[position] !== undefined )
            effects[position] = undefined
        else
            effects = this.updateEffectsList(effects, position)

        track.notes = effects

        this.props.updateTrack(track.id, track)
        if ( this.state.autoplayIsOn ) this.playOnce(null, null, track)
    }

    updateEffectsList (effects, position) {
        const selectedEffect = this.state.selectedEffect
        const track = this.props.track

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

    playOnce (p, e, track = this.props.track) {
        this.setState({
            repeatIsOn: false
        })
        emitCustomEvent('playOnce', {
            song: track
        })
    }

    toggleMute () {
        emitCustomEvent('toggleMute')
    }

    playSongAndRepeat () {
        this.setState({
            repeatIsOn: !this.state.repeatIsOn
        })
        emitCustomEvent('toggleRepeat', {
            song: this.props.track
        })
    }

    toggleAutoplay () {
        this.setState({
            autoplayIsOn: !this.state.autoplayIsOn
        })
    }

    render () {
        const activeTrack = this.props.track
        const state = this.state
        const selectedEffect = state.selectedEffect

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
                    <button onClick={this.playOnce}>play once</button>
                    <button onClick={this.playSongAndRepeat}>{ `${state.repeatIsOn ? 'stop' : 'play'} repeat` }</button>
                    <button onClick={this.toggleAutoplay}>{ `autoplay ${state.autoplayIsOn ? 'off' : 'on'}` }</button>
                    <button onClick={this.toggleMute}>{ `${state.isMuted ? 'un' : ''}mute` }</button>
                </div>

                <DrumTable notes={activeTrack.notes} ticks={activeTrack.ticks} addEffectAtPosition={this.addEffectAtPosition} repeatIsOn={state.repeatIsOn} />

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
