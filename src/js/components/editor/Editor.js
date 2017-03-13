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
            channel: 0
        }

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

        this.createNewTrack = this.createNewTrack.bind(this)
        this.deleteTrack = this.deleteTrack.bind(this)
        this.setActiveTrack = this.setActiveTrack.bind(this)
        this.toggleNote = this.toggleNote.bind(this)
        this.updateTrack = this.updateTrack.bind(this)
        this.createTheSongArray = this.createTheSongArray.bind(this)
        this.playSong = this.playSong.bind(this)
        this.listenForSongEnd = this.listenForSongEnd.bind(this)
        this.togglePauseSong = this.togglePauseSong.bind(this)
        this.toggleMuteSong = this.toggleMuteSong.bind(this)
        this.stopSong = this.stopSong.bind(this)
        this.changeChannel = this.changeChannel.bind(this)
        this.setNewTrackColor = this.setNewTrackColor.bind(this)
    }

    getNewTrackColor (id) {
        switch (( parseInt(id)||0 ) % 16) {
            case 0: return '#ff7e00'
            case 1: return '#ff69a8'
            case 2: return '#00a8cc'
            case 3: return '#00d2ae'
            case 4: return '#584d4d'
            case 5: return '#7171d8'
            case 6: return '#df2020'
            case 7: return '#24eb24'
            case 8: return '#ffcc99'
            case 9: return '#ffbdd8'
            case 10: return '#85e9ff'
            case 11: return '#75ffe8'
            case 12: return '#aea2a2'
            case 13: return '#b7b7eb'
            case 14: return '#ef8f8f'
            case 15: return '#98f598'
            default: return '#ff7e00'
        }
    }

    setNewTrackColor (id, color) {

        const tracks = this.state.tracks
        let track,
            trackIndex
        for ( let x = 0, l = tracks.length; x < l; x++ ) {
            track = tracks[x]
            if ( track.id === id ) {
                trackIndex = x
                track = Object.assign({}, track)
                break
            }
        }

        track.color = color.hex

        const newTracks = tracks.slice()
        newTracks[trackIndex] = track

        this.setState({
            tracks: newTracks
        })

    }

    createNewTrack (type) {
        const ticks = 8
        const myId = this.nextId
        this.nextId++
        const newTrackData = {
            ticks,
            color: this.getNewTrackColor(myId),
            id: myId,
            name: `Track ${myId + 1}`,
            type,
            notes: []
        }
        if ( type === 'tune' )
            for ( let x = 0; x < ticks; x++ ) {
                newTrackData.notes.push({active: -1})
            }
        const tracks = this.state.tracks.concat(newTrackData)

        this.setState({
            tracks,
            activeTrack: newTrackData,
            activeTrackPlayable: [1,0,0,0,0,0,0,"Track 0",64,0,159]
        })
    }

    deleteTrack (id) {
        const tracks = this.state.tracks.filter( t => t.id !== id )
        let activeTrack = this.state.activeTrack
        if ( activeTrack.id === id )
            activeTrack = tracks[0] || {notes: []}
        this.setState({
            tracks,
            activeTrack
        })
    }

    setActiveTrack (activeTrack) {
        this.setState({
            activeTrack,
            activeTrackPlayable: this.createTheSongArray(activeTrack)
        })
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
            157, 50,        // SET song tempo: value = 50
            64, 63          // FX: SET VOLUME: volume = 63

        ]

        if ( channel !== 0 ) {
            templateSong[5] = 0
            templateSong[channel + 5] = 1
        }

        const completeSong = templateSong.concat(noteSequence, [159])

        return completeSong

    }

    playSong (song=this.state.activeTrackPlayable, forcePlay) {
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

    render () {
        const state = this.state
        const activeTrack = state.activeTrack
        return (
            <div>
                <SongEditor
                    tracks={ state.tracks}
                    playSong={ this.playSong }
                    stopSong={ this.stopSong }
                />
                <TrackList
                    tracks = { state.tracks }
                    setActiveTrack = { this.setActiveTrack }
                    createNewTrack = { this.createNewTrack }
                    deleteTrack = { this.deleteTrack }
                    setTrackColor = { this.setNewTrackColor }
                />
                { activeTrack.type === 'tune' ?
                    <TrackEditor
                        activeTrack = { state.activeTrack }
                        toggleNote = { this.toggleNote }
                        updateTrack = { this.updateTrack }
                        playSong = { () => this.playSong(undefined, true) }
                        togglePauseSong = { this.togglePauseSong }
                        toggleMuteSong = { this.toggleMuteSong }
                        channel = { state.channel }
                        changeChannel = { this.changeChannel }
                    />
                : activeTrack.type === 'drum' ?
                    <DrumEditor
                        activeTrack = { state.activeTrack }
                        updateTrack = { this.updateTrack }
                        playSong = { () => this.playSong(undefined, true) }
                        togglePauseSong = { this.togglePauseSong }
                        toggleMuteSong = { this.toggleMuteSong }
                    />
                    :null
                }
            </div>
        )
    }
}

export default Editor
