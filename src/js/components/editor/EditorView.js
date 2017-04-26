import React, { Component } from 'react'
import SongEditor from './songEditor/SongEditor'
import TrackList from './trackList/TrackList'
import TrackEditor from './trackEditor/TrackEditor'
import DrumEditor from './drumEditor/DrumEditor'
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

        this.tempo = 25
        this.nextId = 0
        this.synth = new SquawkSynth()
        try {
            this.output = new WebAudioStream()
        }
        catch (error) {
            console.log('WebAudioStream not supported')
        }
        this.emulateSampleRate = 16000.0    // Emulation sample rate
        this.converter = new SampleRateConverter(this.emulateSampleRate, this.output.getSampleRate())
        // this.playSong()

        this.toggleNote = this.toggleNote.bind(this)
        this.updateTrack = this.updateTrack.bind(this)
        this.createTheSongArray = this.createTheSongArray.bind(this)
        this.playSong = this.playSong.bind(this)
        this.listenForSongEnd = this.listenForSongEnd.bind(this)
        this.togglePauseSong = this.togglePauseSong.bind(this)
        this.toggleMuteSong = this.toggleMuteSong.bind(this)
        this.stopSong = this.stopSong.bind(this)
        this.changeChannel = this.changeChannel.bind(this)
        this.playSongAndRepeat = this.playSongAndRepeat.bind(this)
        this.setTempo = this.setTempo.bind(this)
        this.save = this.save.bind(this)
        this.load = this.load.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.clearForcedData = this.clearForcedData.bind(this)
    }

    toggleNote (trackId, note, row) {
        const tracks = this.state.tracks
        let track,
            trackIndex
        for ( let x = 0, l = tracks.length; x < l; x++ ) {
            track = tracks[x]
            if ( track.id === trackId ) {
                trackIndex = x
                track = Object.assign({}, track)
                track.notes = track.notes.slice()
                break
            }
        }

        track.notes[track.ticks - 1 - row] = { active: note }
        const newTracks = this.state.tracks.slice()
        newTracks[trackIndex] = track

        let activeTrack = this.state.activeTrack
        if ( this.state.activeTrack.id === trackId )
            activeTrack = track

        const newPlayable = this.createTheSongArray(activeTrack)
        if ( this.state.autoplay )
            this.playSong(newPlayable)

        this.setState({
            tracks: newTracks,
            activeTrack,
            activeTrackPlayable: newPlayable
        })
    }

    updateTrack (id, newTrack) {
        const tracks = this.state.tracks
        let track,
            trackIndex
        for ( let x = 0, l = tracks.length; x < l; x++ ) {
            track = tracks[x]
            if ( track.id === id ) {
                trackIndex = x
                break
            }
        }
        const newTracks = tracks.slice()
        newTracks[trackIndex] = newTrack

        let activeTrack = this.state.activeTrack
        if ( this.state.activeTrack.id === id )
            activeTrack = newTrack

        const newPlayable = this.createTheSongArray(activeTrack)
        if ( this.state.autoplay )
            this.playSong(newPlayable)

        this.setState({
            tracks: newTracks,
            activeTrack,
            activeTrackPlayable: newPlayable
        })
    }

    createTheSongArray (track = this.state.activeTrack, channel = this.state.channel) {
        const notes = track.notes
        const drum = track.type === 'drum'

        const noteSequence = createNoteSequence(track)

        const templateSong = [

            2,              // number of tracks
            0,              // address of track 0
            0,              // address of track 0
            3,              // address of track 1
            0,              // address of track 1

            drum?0:1,              // Channel 0 entry track (PULSE)
            0,              // Channel 1 entry track (SQUARE)
            0,              // Channel 2 entry track (TRIANGLE)
            drum?1:0,              // Channel 3 entry track (NOISE)


            "Track 0",      // ticks = 0 / bytes = 3
            64,             // FX: SET VOLUME: volume = 0
            0,              // FX: SET VOLUME: volume = 0
            159,            // FX: STOP CURRENT CHANNEL


            "Track 1",
            157, this.tempo,        // SET song tempo: value = 50
            64, 48          // FX: SET VOLUME: volume = 48

        ]

        if ( channel !== 0 ) {
            templateSong[5] = 0
            templateSong[channel + 5] = 1
        }

        const completeSong = templateSong.concat(noteSequence, [159])

        return completeSong

    }

    playSong (song=this.state.activeTrackPlayable, forcePlay, keepRepeatOn) {
        // Initialize player
        this.player = new SquawkStream(this.emulateSampleRate)
        this.player.setSource(song)
        // Build graph [this.player]=>[synth]=>[converter]=>[output]
        // Output is the sink, and drives/times the entire graph.
        this.synth.connect(this.player)
        this.converter.connect(this.synth)
        this.output.connect(this.converter)
        // Begin playback (?)
        this.output.play(forcePlay || this.state.autoplay)

        this.trackPlayPosition()
        this.listenForSongEnd()

        if ( !keepRepeatOn ) this.setState({repeatIsOn: false})
        // if ( !keepRepeatOn ) this.repeatIsOn = false
    }

    playSongAndRepeat () {
        const repeatIsOn = this.state.repeatIsOn

        if ( repeatIsOn ) {
            clearInterval(this.listenForSongEndInterval)
            clearInterval(this.trackPlayPositionInterval)
            this.output.pause(true)
            this.setState({repeatIsOn: false})
            return
        }

        this.setState({repeatIsOn: true})

        let song = this.state.activeTrackPlayable.slice()
        song.pop()
        song.push(254)
        song[0]++

        const asd = [
            "Track 2",
            253,
            255,
            1,
            159
        ]

        song = song.concat(asd)

        const d = song.join(',')
        const a = d.slice(d.indexOf('Track 1') + 8, d.indexOf('Track 2') - 1)
        const q = a.split(',')

        song = [].concat(song.slice(0, 5), [q.length + song[3], 0], song.slice(5))

        song[10] = 2

        this.playSong(song, true, true)
    }

    listenForSongEnd () {
        if ( this.listenForSongEndInterval )
            clearInterval(this.listenForSongEndInterval)
        this.listenForSongEndInterval = setInterval(
            () => {
                if ( this.player.getChannelActiveMute() === 0 ) {
                    this.output.pause(true)

                    clearInterval(this.listenForSongEndInterval)
                    clearInterval(this.trackPlayPositionInterval)

                }
            }, 100)
    }

    trackPlayPosition () {
        if ( this.trackPlayPositionInterval )
            clearInterval(this.trackPlayPositionInterval)
        this.trackPlayPositionInterval = setInterval(
            () => {
                document.dispatchEvent(
                    new CustomEvent(
                        'playPosition',
                        {
                            detail: {
                                ticks: this.player.getTickCount()
                            }
                        }
                    )
                )
            },
            5
        )
    }

    togglePauseSong () {
        this.state.repeatIsOn = false
        const currentState = this.state.autoplay
        const newState = !currentState
        this.output.pause(true)
        // this.output.pause(newState)
        this.setState({autoplay: newState})
    }

    toggleMuteSong () {
        const currentState = this.state.songIsMuted
        const newState = !currentState
        this.output.setVolume(newState ? 0 : 1)
        this.setState({songIsMuted: newState})
    }

    stopSong () {
        this.output.pause(true)
    }

    changeChannel (channel) {
        this.setState({
            channel,
            activeTrackPlayable: this.createTheSongArray(undefined, channel)
        })
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
        // const activeTrack = state.activeTrack
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
                    <TrackEditor
                        track = { activeTrack }
                    />
                    /*<TrackEditor
                        activeTrack = { activeTrack }
                        toggleNote = { this.toggleNote }
                        updateTrack = { this.updateTrack }
                        playSong = { () => this.playSong(undefined, true) }
                        togglePauseSong = { this.togglePauseSong }
                        toggleMuteSong = { this.toggleMuteSong }
                        channel = { state.channel }
                        changeChannel = { this.changeChannel }
                        autoplayIsOn = { state.autoplay }
                        isMuted = { state.songIsMuted }
                    />*/
                : activeTrack.type === 'drum' ?
                    <DrumEditor
                        activeTrack = { activeTrack }
                        updateTrack = { this.updateTrack }
                        playSong = { () => this.playSong(undefined, true) }
                        playSongAndRepeat = { this.playSongAndRepeat }
                        togglePauseSong = { this.togglePauseSong }
                        toggleMuteSong = { this.toggleMuteSong }
                        autoplayIsOn = { state.autoplay }
                        isMuted = { state.songIsMuted }
                        repeatIsOn = { state.repeatIsOn }
                    />
                    :null
                }
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
