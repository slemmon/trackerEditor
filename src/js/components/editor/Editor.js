import React, { Component } from 'react'
import TrackList from './trackList/TrackList'
import TrackEditor from './trackEditor/TrackEditor'
import DrumEditor from './drumEditor/DrumEditor'

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
            songString: ''
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
        this.playSong()

        this.createNewTrack = this.createNewTrack.bind(this)
        this.deleteTrack = this.deleteTrack.bind(this)
        this.setActiveTrack = this.setActiveTrack.bind(this)
        this.toggleNote = this.toggleNote.bind(this)
        this.updateTrack = this.updateTrack.bind(this)
        this.updateDrumTrack = this.updateDrumTrack.bind(this)
        this.createTheSongArray = this.createTheSongArray.bind(this)
        this.playSong = this.playSong.bind(this)
        this.listenForSongEnd = this.listenForSongEnd.bind(this)
        this.togglePauseSong = this.togglePauseSong.bind(this)
        this.toggleMuteSong = this.toggleMuteSong.bind(this)
        this.createSong = this.createSong.bind(this)
    }

    getNewTrackColor (id) {
        switch (( parseInt(id)||0 ) % 5) {
            case 0: return '#ff7e00'
            case 1: return '#ff69a8'
            case 2: return '#00a8cc'
            case 3: return '#00d2ae'
            case 4: return '#584d4d'
            default: return '#ff7e00'
        }
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
            notes: [],
            channel: type === 'tune' ? 1 : 4
        }
        if ( type === 'tune' )
            for ( let x = 0; x < ticks; x++ ) {
                newTrackData.notes.push({active: -1})
            }
        const tracks = this.state.tracks.concat(newTrackData)

        this.setState({
            tracks,
            activeTrack: newTrackData
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
        this.setState({activeTrack})
    }

    toggleNote (id, note, row) {
        const tracks = this.state.tracks
        let track,
            trackIndex
        for ( let x = 0, l = tracks.length; x < l; x++ ) {
            track = tracks[x]
            if ( track.id === id ) {
                trackIndex = x
                track = Object.assign({}, track)
                track.notes = track.notes.slice()
                break
            }
        }

        track.notes[row] = { active: note }
        const newTracks = this.state.tracks.slice()
        newTracks[trackIndex] = track

        let activeTrack = this.state.activeTrack
        if ( this.state.activeTrack.id === id )
            activeTrack = track

        const newPlayable = this.createTheSongArray(activeTrack)
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
        this.playSong(newPlayable)

        this.setState({
            tracks: newTracks,
            activeTrack,
            activeTrackPlayable: newPlayable
        })
    }

    updateDrumTrack (id, newTrack) {
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

        this.setState({
            tracks: newTracks,
            activeTrack
        })
    }

    createNoteSequence (notes) {
        const noteSequence = []

        let thisNote,
            lastNote = -1

        for ( const note of notes ) {
            thisNote = (note||{}).active
            if ( thisNote === lastNote ) {
                if ( !noteSequence.length ) {
                    noteSequence[0] = ~thisNote ? thisNote : 0
                    noteSequence[1] = 159 + 1
                } else
                    noteSequence[noteSequence.length - 1]++
            } else {
                noteSequence.push(~thisNote ? thisNote : 0) // note to play
                noteSequence.push(159 + 1)  // play for 1 tick
            }
            lastNote = thisNote
        }

        return noteSequence
    }

    createTheSongArray (track) {
        const notes = track.notes

        const noteSequence = this.createNoteSequence(notes)

        const templateSong = [

            2,              // number of tracks
            0,              // address of track 0
            0,              // address of track 0
            3,              // address of track 1
            0,              // address of track 1

            1,              // Channel 0 entry track (PULSE)
            0,              // Channel 1 entry track (SQUARE)
            0,              // Channel 2 entry track (TRIANGLE)
            0,              // Channel 3 entry track (NOISE)


            "Track 0",      // ticks = 0 / bytes = 3
            64,             // FX: SET VOLUME: volume = 0
            0,              // FX: SET VOLUME: volume = 0
            159,            // FX: STOP CURRENT CHANNEL


            "Track 1",
            157, 50,        // SET song tempo: value = 50
            64, 63          // FX: SET VOLUME: volume = 63

        ]

        if ( track.channel !== 1 ) {
            templateSong[5] = 0
            templateSong[track.channel + 4] = 1
        }

        const completeSong = templateSong.concat(noteSequence, [159])

        return completeSong

    }

    createSong () {
        const tracks = this.state.tracks
        const tracksLength = tracks.length

        let song = [
            tracksLength
        ]
        let nextTrackAddress = 0

        song = song.concat(new Array(tracksLength * 2))
        song = song.concat([tracksLength, tracksLength, tracksLength, tracksLength])

        tracks.forEach((track, i) => {
            song[(i*2)+1] = nextTrackAddress                            // Address of this track
            song[(i*2)+2] = 0                                           // Address of this track pt2
            const converted = this.convertTrack(track)                  // get array from track notes

            converted.noteSequence.unshift(63)                          // volume value
            converted.noteSequence.unshift(64)                          // set volume
            converted.trackBytes += 2

            if ( i === 0 ) {                                            // add tempo if this is the first track
                converted.noteSequence.unshift(50)                      // tempo value
                converted.noteSequence.unshift(157)                     // set tempo
                converted.trackBytes += 2
            }

            song = song.concat("Track", converted.noteSequence)         // add array to song
            nextTrackAddress = nextTrackAddress + converted.trackBytes  // calculate what the address of the next track will be

            song[ 1 + (tracksLength * 2) + ( track.channel - 1 ) ] = i  // set starting track for the channel this track should be played on
        })

        if ( tracksLength < 4 ) {                                       // add silent track for all remaining unused channels
            song[0] = tracksLength + 1
            song = song.concat([
                "Track",
                64,
                0,
                159
            ])

            const slicePos = tracksLength * 2 + 1 || 1
            song = [].concat(song.slice(0, slicePos), [nextTrackAddress, 0], song.slice(slicePos))
        }

        // console.log(song)
        let songString = JSON.stringify(song, null, 4)
        songString = songString.replace('[\n', '#ifndef SONG_H\n#define SONG_H\n\n#define Song const uint8_t PROGMEM\n\nSong music[] = {\n')
        songString = songString.replace(/"Track"/ig, '//"Track"')
        songString = songString.replace('159\n]', '159,\n};\n\n\n\n#endif\n')

        this.setState({
            songString
        })
    }

    convertTrack (track) {
        const notes = track.notes
        const noteSequence = this.createNoteSequence(notes)
        noteSequence.push(159)                                          // stop channel
        const trackBytes = noteSequence.length
        return {
            noteSequence,
            trackBytes
        }
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

        this.listenForSongEnd()
    }

    listenForSongEnd () {
        if ( this.listenForSongEndInterval )
            clearInterval(this.listenForSongEndInterval)
        this.listenForSongEndInterval = setInterval(
            () => {
                if ( this.player.getChannelActiveMute() === 0 ) {
                    this.output.pause(true)
                }
            }, 100)
    }

    togglePauseSong () {
        const currentState = this.state.autoplay
        const newState = !currentState
        this.output.pause(newState)
        this.setState({autoplay: newState})
    }

    toggleMuteSong () {
        const currentState = this.state.songIsMuted
        const newState = !currentState
        this.output.setVolume(newState ? 0 : 1)
        this.setState({songIsMuted: newState})
    }

    render () {
        const activeTrack = this.state.activeTrack
        return (
            <div>
                <h4>editor</h4>
                <button onClick={this.createSong}>create song</button>
                <TrackList
                    tracks = { this.state.tracks }
                    setActiveTrack = { this.setActiveTrack }
                    createNewTrack = { this.createNewTrack }
                    deleteTrack = { this.deleteTrack }
                />
                <hr />
                { activeTrack.type === 'tune' ?
                    <TrackEditor
                        activeTrack = { this.state.activeTrack }
                        toggleNote = { this.toggleNote }
                        updateTrack = { this.updateTrack }
                        playSong = { () => this.playSong(undefined, true) }
                        togglePauseSong = {this.togglePauseSong }
                        toggleMuteSong = {this.toggleMuteSong }
                    />
                :
                    <DrumEditor
                        activeTrack = { this.state.activeTrack }
                        updateDrumTrack = { this.updateDrumTrack }
                    />
                }
                <pre>
                    {this.state.songString}
                </pre>
            </div>
        )
    }
}

export default Editor
