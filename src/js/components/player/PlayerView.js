// TODO change tempo
import React, { Component } from 'react'
import { createSongFromChannels, createNoteSequence } from './createSong'

class Player extends Component {
    constructor () {
        super()

        this.state = {
            autoplay: false,
            muted: false,
            channel: 0
        }

        this.tempo = 24
        this.synth = new SquawkSynth()
        try {
            this.output = new WebAudioStream()
        }
        catch (error) {
            console.log('WebAudioStream not supported')
        }
        const getSampleRate = this.output ? this.output.getSampleRate : () => {}
        this.emulateSampleRate = 16000.0    // Emulation sample rate
        this.converter = new SampleRateConverter(this.emulateSampleRate, getSampleRate())

        this.playSong = this.playSong.bind(this)
        this.playOnce = this.playOnce.bind(this)
        this.toggleMute = this.toggleMute.bind(this)
        this.toggleRepeat = this.toggleRepeat.bind(this)
        this.changeChannel = this.changeChannel.bind(this)
        this.exportSong = this.exportSong.bind(this)
        this.createSongCode = this.createSongCode.bind(this)
        this.createAndPlaySong = this.createAndPlaySong.bind(this)

    }

    componentWillMount () {
        document.addEventListener('playOnce', this.playOnce)
        document.addEventListener('toggleRepeat', this.toggleRepeat)
        document.addEventListener('toggleMute', this.toggleMute)
        document.addEventListener('changeChannel', this.changeChannel)

        document.addEventListener('exportSong', this.exportSong)
        document.addEventListener('createSongCode', this.createSongCode)

        document.addEventListener('playCompleteSong', this.createAndPlaySong)
    }

    componentWillUnmount() {
        document.removeEventListener('playOnce', this.playOnce)
        document.removeEventListener('toggleRepeat', this.toggleRepeat)
        document.removeEventListener('toggleMute', this.toggleMute)
        document.removeEventListener('changeChannel', this.changeChannel)

        document.addEventListener('exportSong', this.exportSong)
        document.addEventListener('createSongCode', this.createSongCode)

        document.removeEventListener('playCompleteSong', this.createAndPlaySong)
    }

    playOnce (e) {
        const songArray = this.createTheSongArray(e.detail.song)
        this.playSong(songArray)
        this.setState({
            autoplay: false
        })
    }

    toggleRepeat (e) {
        const newState = !this.state.autoplay
        this.setState({
            autoplay: newState
        })

        if ( newState )
            this.playSongAndRepeat(this.createTheSongArray(e.detail.song), e.detail.song.type)
        else
            this.stopRepeat()
    }

    toggleMute () {
        const newState = !this.state.muted
        this.setState({
            muted: newState
        })
        this.output.setVolume(newState ? 0 : 1)
    }

    createTheSongArray (track) {
        const notes = track.notes
        const drum = track.type === 'drum'
        const channel = this.state.channel

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

    playSong (song) {
        // Initialize player
        this.player = new SquawkStream(this.emulateSampleRate)
        this.player.setSource(song)
        // Build graph [this.player]=>[synth]=>[converter]=>[output]
        // Output is the sink, and drives/times the entire graph.
        this.synth.connect(this.player)
        this.converter.connect(this.synth)
        this.output.connect(this.converter)
        // Begin playback
        this.output.play()

        this.trackPlayPosition()
        this.listenForSongEnd()
    }

    playSongAndRepeat (song, type) {
        song.pop()     // remove last fx
        song.push(254) // add RETURN fx to end of array
        song[0]++      // increase track number

        const repeater = [
            "Track 2",
            253, // repeat
            255, // 255x
            1,   // track 1
            159  // stop channel
        ]

        song = song.concat(repeater)

        const d = song.join(',')
        const a = d.slice(d.indexOf('Track 1') + 8, d.indexOf('Track 2') - 1)
        const q = a.split(',')

        song = [].concat(song.slice(0, 5), [q.length + song[3], 0], song.slice(5))

        if ( type === 'drum' ) {
            song[8] = 0
            song[10] = 2
        } else {
            song[8] = 0
            song[7+this.state.channel] = 2
        }

        this.playSong(song)
    }

    stopRepeat () {
        clearInterval(this.listenForSongEndInterval)
        clearInterval(this.trackPlayPositionInterval)
        this.output.pause(true)
        this.setState({repeatIsOn: false})
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

    changeChannel (e) {
        this.setState({
            channel: e.detail.channel
        })
    }

    exportSong () {
        const props = this.props
        const songString = createSongFromChannels(props.tracks, props.channels, props.fx)

        this.props.saveSongCode(songString)

        // make the browser download the file
        const download = document.createElement('a')
        download.href = `data:text/plain;charset=utf-8;base64,${btoa(songString)}`
        download.download = 'song_export.h'

        document.body.appendChild(download)
        download.click()
        document.body.removeChild(download)


    }

    createAndPlaySong () {
        const props = this.props

        let music = createSongFromChannels(props.tracks, props.channels, props.fx)

        music = music.replace(/\/\/"Track.*"/g, 'Track,')
        music = music.replace(/, /g, ',\n')
        music = music.replace(/,\t*.*\n/g, ',')
        music = music.slice(84, -15)

        music = music.split(',')

        let number
        let trackCounter = 0
        let item
        let splitItem
        for ( let i = 0, l = music.length; i < l; i++ ) {
            item = music[i]
            if ( item.indexOf('0x') === 0 ) {
                splitItem = item.split('+')
                if ( splitItem.length >= 2 ) {
                    number = parseInt(splitItem[0], 16)
                    for ( let i = 1, l = splitItem.length; i < l; i++ )
                        number += parseInt(splitItem[i], ~splitItem[i].indexOf('0x') ? 16 : 10)
                }
                else
                    number = parseInt(splitItem[0], 16)
                music[i] = number
            } else {
                number = parseInt(item, 10)
                music[i] = isNaN(number) ? `${item} ${trackCounter++}` : number
            }
        }

        this.playSong(music)
    }

    createSongCode () {
        const props = this.props
        props.saveSongCode(createSongFromChannels(props.tracks, props.channels, props.fx))
    }

    render () {
        return (
            <div style={{display: 'none'}}>
                player container
            </div>
        )
    }
}

export default Player
