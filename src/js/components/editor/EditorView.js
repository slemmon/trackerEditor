import React, { Component } from 'react'
import SongEditor from './songEditor/SongEditor'
import TrackList from './trackList/TrackList'
import TrackEditor from './trackEditor/TrackEditor'
import DrumEditor from './drumEditor/DrumEditor'
import FxEditor from './fxEditor/FxEditor'
import { createNoteSequence } from './songEditor/createSong'

class Editor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            tracks: [],
            activeTrack: {
                notes: []
            },
            autoplay: false,
            songIsMuted: false,
            activeTrackPlayable: [1,0,0,0,0,0,0,"Track 0",64,0,159],
            channel: 0,
            forceChannels: null,
            forceFx: null
        }

        this.nextId = 0

        this.setTempo = this.setTempo.bind(this)
        this.save = this.save.bind(this)
        this.load = this.load.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.clearForcedData = this.clearForcedData.bind(this)
    }

    setTempo (tempo) {
        this.tempo = tempo
        this.setState({
            activeTrackPlayable: this.createTheSongArray()
        })
    }

    save (data) {
        // json stringify data + tracks
        // download json
        const songData = {
            tracks: this.state.tracks,
            fx: data.fx,
            channels: data.channels
        }

        // make the browser download the file
        const download = document.createElement('a')
        download.href = `data:text/plain;charset=utf-8;base64,${btoa(JSON.stringify(songData))}`
        download.download = 'song.atm'

        document.body.appendChild(download)
        download.click()
        document.body.removeChild(download)

    }

    load () {
        this.fileInput.click()
    }

    handleFileChange (e) {
        const file = e.target.files[0]

        const reader = new FileReader()

        let result
        reader.onloadend = () => {
            try {
                result = JSON.parse(reader.result)
            }
            catch (error) {
                return alert('invalid file (1)')
            }

            if ( this.validateFile(result) ) {
                const tracks = result.tracks
                this.setState({
                    tracks: tracks,
                    activeTrack: tracks[0],
                    activeTrackPlayable: this.createTheSongArray(tracks[0]),
                    forceChannels: result.channels,
                    forceFx: result.fx
                })
                this.nextId = result.tracks.slice(-1)[0].id + 1
            } else {
                return alert('invalid file (2)')
            }

        }

        reader.readAsText(file)

        e.target.value = ''

    }

    validateFile (file) {

        let truths = 0

        const names = Object.getOwnPropertyNames(file)

        if ( names.length === 3 ) truths++

        for ( const name of names ) {

            switch (name) {
                case 'channels':
                case 'fx':
                case 'tracks':
                truths++
                if ( Array.isArray(file[name]) ) truths++
            }

        }

        return truths === 7

    }

    clearForcedData () {
        this.setState({
            forceChannels: null,
            forceFx: null
        })
    }

    render () {
        const state = this.state
        const activeTrack = this.props.activeTrack
        return (
            <div>
                <SongEditor
                    tracks={ state.tracks }
                    playSong={ this.playSong }
                    stopSong={ this.stopSong }
                    setTempo={ this.setTempo }
                    save={ this.save }
                    load={ this.load }
                    forceChannels={ state.forceChannels }
                    forceFx={ state.forceFx }
                    clearForcedData={ this.clearForcedData }
                />
                <TrackList />
                { activeTrack.type === 'tune' ?
                    <TrackEditor />
                : activeTrack.type === 'drum' ?
                    <DrumEditor />
                    :null
                }
                <FxEditor />
                <input
                    className="hidden-file-input"
                    type="file"
                    ref={ el => this.fileInput = el }
                    onChange={ this.handleFileChange }
                />
            </div>
        )
    }
}

export default Editor
