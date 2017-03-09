import React, { Component } from 'react'

import NoteSheet from './NoteSheet'
import NewNotesTable from './NewNotesTable'

class TrackEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            currentTicks: this.props.activeTrack.ticks
        }

        this.toggleNote = this.toggleNote.bind(this)
        this.changeTrackName = this.changeTrackName.bind(this)
        this.changeTrackChannel = this.changeTrackChannel.bind(this)
        this.trackTicksAmount = this.trackTicksAmount.bind(this)
        this.changeTicksAmount = this.changeTicksAmount.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentTicks: nextProps.activeTrack.ticks
        })
    }

    toggleNote (note, row) {
        this.props.toggleNote(this.props.activeTrack.id, note, row)
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
        this.props.changeChannel(parseInt(e.target.value))
    }

    render () {
        const activeTrack = this.props.activeTrack

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
                        <input id="track-channel" onChange={this.changeTrackChannel} type="number" min="0" max="3" value={this.props.channel || 0} />
                    </div>
                    <form className="editor-info-row" onSubmit={ this.changeTicksAmount }>
                        <label htmlFor="track-ticks">Ticks: </label>
                        <input id="track-ticks" onChange={this.trackTicksAmount} type="number" min="1" max="64" value={this.state.currentTicks || 0} />
                        <input type="submit" value="apply" />
                    </form>
                </div>

                <div className="editor-play-buttons">
                    <button onClick={this.props.playSong}>play once</button>
                    <button onClick={this.props.togglePauseSong}>autoplay</button>
                    <button onClick={this.props.toggleMuteSong}>mute</button>
                </div>

                <NewNotesTable notes={activeTrack.notes} toggleNote={this.toggleNote} />

                <NoteSheet />

            </div>
        )
    }
}

export default TrackEditor
