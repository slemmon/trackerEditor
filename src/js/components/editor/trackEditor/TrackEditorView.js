import React, { Component } from 'react'
import emitCustomEvent from '../../../customEventEmitter'

import NoteSheet from './NoteSheet'
import NewNotesTable from './NewNotesTable'

class TrackEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            currentTicks: this.props.track.ticks,
            bufferedNotes: this.props.track.notes,
            autoplayIsOn: false,
            repeatIsOn: false,
            isMuted: false,
            channel: 0
        }

        this.toggleNote = this.toggleNote.bind(this)
        this.changeTrackName = this.changeTrackName.bind(this)
        this.changeTrackChannel = this.changeTrackChannel.bind(this)
        this.trackTicksAmount = this.trackTicksAmount.bind(this)
        this.changeTicksAmount = this.changeTicksAmount.bind(this)
        this.playOnce = this.playOnce.bind(this)
        this.sendUpdate = this.sendUpdate.bind(this)
        this.playSongAndRepeat = this.playSongAndRepeat.bind(this)
        this.toggleAutoplay = this.toggleAutoplay.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if ( this.state.currentTicks !== nextProps.track.ticks )
            this.setState({
                currentTicks: nextProps.track.ticks
            })
        if ( this.state.bufferedNotes.length !== nextProps.track.notes.length || this.props.track.id !== nextProps.track.id )
            this.setState({
                bufferedNotes: nextProps.track.notes
            })
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.status === 0
    }

    toggleNote (note, row) {

        const track = Object.assign({}, this.props.track)
        const notes = this.state.bufferedNotes.slice()

        notes[track.ticks - 1 - row] = { active: note }

        this.setState({
            bufferedNotes: notes
        })

        track.notes = notes

        // throttle dispatch, if redux has to process too many at once the app will freeze/stutter
        if ( this.throttle ) clearTimeout(this.throttle)
        this.throttle = setTimeout(() => {
            this.sendUpdate(track)
            if ( this.state.autoplayIsOn ) this.playOnce()
        }, 250)

    }

    sendUpdate (track) {
        this.props.updateTrack(track.id, track)
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

        let notes = track.notes.slice()
        while ( notes.length !== newValue ) {
            if ( notes.length > newValue )
                notes = track.notes.slice(0, newValue)
            else
                notes.push({active: -1})
        }

        track.ticks = newValue
        track.notes = notes

        this.props.updateTrack(track.id, track)
    }

    changeTrackChannel (e) {
        const newValue = parseInt(e.target.value)
        emitCustomEvent('changeChannel', {
            channel: newValue
        })
        this.setState({
            channel: newValue
        })
    }

    playOnce () {
        this.setState({
            repeatIsOn: false
        })
        emitCustomEvent('playOnce', {
            song: this.props.track
        })
    }

    toggleMute () {
        // const newState = !this.state.isMuted
        // this.setState({
        //     isMuted: newState
        // })
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

        return (
            <div id="editor-container" className={ activeTrack.id === undefined ? 'hidden' : '' }>

                <h5>Tune track editor</h5>

                <div className="editor-info">
                    <div className="editor-info-row">
                        <label htmlFor="track-name">Name: </label>
                        <input id="track-name" onChange={this.changeTrackName} type="text" value={activeTrack.name || ""} />
                    </div>
                    <div className="editor-info-row">
                        <label htmlFor="track-channel">Channel: </label>
                        <input id="track-channel" onChange={this.changeTrackChannel} type="number" min="0" max="3" value={state.channel || 0} />
                    </div>
                    <form className="editor-info-row" onSubmit={ this.changeTicksAmount }>
                        <label htmlFor="track-ticks">Ticks: </label>
                        <input id="track-ticks" onChange={this.trackTicksAmount} type="number" min="1" max="64" value={state.currentTicks || 0} />
                        <input type="submit" value="apply" />
                    </form>
                </div>

                <div className="editor-play-buttons">
                    <button onClick={this.playOnce}>play once</button>
                    <button onClick={this.playSongAndRepeat}>{ `${state.repeatIsOn ? 'stop' : 'play'} repeat` }</button>
                    <button onClick={this.toggleAutoplay}>{ `autoplay ${state.autoplayIsOn ? 'off' : 'on'}` }</button>
                    <button onClick={this.toggleMute}>{ `${state.isMuted ? 'un' : ''}mute` }</button>
                </div>

                <NewNotesTable notes={this.state.bufferedNotes} toggleNote={this.toggleNote} repeatIsOn={state.repeatIsOn} />

                <NoteSheet />

            </div>
        )
    }
}

export default TrackEditor
