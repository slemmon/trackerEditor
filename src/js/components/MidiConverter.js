import MidiFile from '../midifile'
import React, { Component } from 'react'

class MidiConverter extends Component {

    constructor (props) {
        super(props)

        this.state = {
            song: {
                header: {},
                tracks: []
            },
            selectedTrack: 0,
            convertedstuff: []
        }

        this.fileUploadHandler = this.fileUploadHandler.bind(this)
        this.midiConvertHandler = this.midiConvertHandler.bind(this)
        this.handleTrackChange = this.handleTrackChange.bind(this)
    }

    fileUploadHandler (e) {
        const files = e.target.files

        if ( !files.length )
            return

        const reader = new FileReader()
        reader.readAsBinaryString(files[0])
        reader.onload = (e) => {
            this.midiConvertHandler( MidiFile( e.target.result ) )
        }
    }

    midiConvertHandler (result) {
        const convertedstuff = this.ihavenoidea(result)
        this.setState({
            song: result,
            convertedstuff
        })
    }

    handleTrackChange (e) {
        this.setState({
            selectedTrack: e.target.value
        })
    }

    ihavenoidea (song) {
        const tracks = song.tracks

        const thisthing = []
        for ( const track of tracks ) {
            thisthing.push(this.somethinguseful(track))
        }

        return thisthing
    }

    somethinguseful (track) {
        const result = []
const allnotes = []
        let currentOffset = 0

        let eventData
        for ( const event of track ) {
            currentOffset += event.deltaTime
            eventData = {
                time: currentOffset
            }
            if ( event.type === 'channel' )
                allnotes.push(event.noteNumber)
                Object.assign(eventData, {
                    note: event.noteNumber,
                    velocity: event.velocity,
                    type: event.subtype,
                    channel: event.channel
                })
            result.push(eventData)
        }
window.allnotes = allnotes
        return result
    }

    render () {
        const state = this.state
        const song = state.song
        const header = song.header

        return (
            <div>
                <label htmlFor = 'fileInput'>
                    Upload midi file
                </label>
                <br />
                <input
                    id = "fileInput"
                    type = 'file'
                    onChange = { this.fileUploadHandler }
                />
                <hr />
                <div style = { {display: 'flex', flexFlow: 'column', alignItems: 'flex-start'} }>
                    <span>formatType {header.formatType}</span>
                    <span>ticksPerBeat {header.ticksPerBeat}</span>
                    <span>trackCount {header.trackCount}</span>
                    <select
                        onChange = { this.handleTrackChange }
                        value = {state.selectedTrack}
                    >
                    {song.tracks.map( (t, i) =>
                        <option
                            key = {`track-${t[0].text}-${Math.round(Math.random()*10000)}`}
                            value = {i}
                        >
                            {t[0].text}
                        </option>
                    )}
                    </select>
                </div>
                <hr />
                <pre>
                    { JSON.stringify(song.tracks[state.selectedTrack], null, 4) }
                </pre>
            </div>
        )
    }
}

export default MidiConverter
