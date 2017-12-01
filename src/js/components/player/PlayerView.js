// TODO change tempo
import React, { Component } from 'react'
import { createSongFromChannels, createNoteSequence } from './createSong'
import { createSongFileFromChannels } from './createSongFile'
import once from 'lodash.once'

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
        this.stopSong = this.stopSong.bind(this)

    }

    componentWillMount () {
        document.addEventListener('playOnce', this.playOnce)
        document.addEventListener('toggleRepeat', this.toggleRepeat)
        document.addEventListener('toggleMute', this.toggleMute)
        document.addEventListener('changeChannel', this.changeChannel)

        document.addEventListener('exportSong', this.exportSong)
        document.addEventListener('createSongCode', this.createSongCode)

        document.addEventListener('playCompleteSong', this.createAndPlaySong)
        document.addEventListener('stopPlaying', this.stopSong)
    }

    componentWillUnmount() {
        document.removeEventListener('playOnce', this.playOnce)
        document.removeEventListener('toggleRepeat', this.toggleRepeat)
        document.removeEventListener('toggleMute', this.toggleMute)
        document.removeEventListener('changeChannel', this.changeChannel)

        document.removeEventListener('exportSong', this.exportSong)
        document.removeEventListener('createSongCode', this.createSongCode)

        document.removeEventListener('playCompleteSong', this.createAndPlaySong)
        document.removeEventListener('stopPlaying', this.stopSong)
    }

    playOnce (e) {
        const pattern = this.createTheSongArray(this.props.activePattern)

        this.playSong(pattern, () => {
            const { patternRepeat } = this.props

            if (patternRepeat) {
                this.playOnce()
                this.setState({
                    autoplay: false
                })
            } else {
                this.stopSong();
            }
        })
        this.props.setPatternIsPlaying(true);
    }

    toggleRepeat (e) {
        const newState = !this.state.autoplay
        this.setState({
            autoplay: newState
        })

        if ( newState )
            this.playActivePattern(true)
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

    createTheSongArray (pattern) {
        const notes = pattern.notes
        const drum = pattern.type === 'drum'
        const channel = this.state.channel

        const noteSequence = createNoteSequence(pattern)
        const tempoFx = this.props.fx.channel[channel].fx['1048576']
        const tempo = tempoFx ? tempoFx.val_0 : this.tempo

        const templateSong = [

            2,              // number of patterns
            0,              // address of pattern 0
            0,              // address of pattern 0
            3,              // address of pattern 1
            0,              // address of pattern 1

            drum?0:1,       // Channel 0 entry pattern (PULSE)
            0,              // Channel 1 entry pattern (SQUARE)
            0,              // Channel 2 entry pattern (TRIANGLE)
            drum?1:0,       // Channel 3 entry pattern (NOISE)


            "Pattern 0",      // ticks = 0 / bytes = 3
            64,             // FX: SET VOLUME: volume = 0
            0,              // FX: SET VOLUME: volume = 0
            159,            // FX: STOP CURRENT CHANNEL


            "Pattern 1",
            157, tempo,     // SET song tempo: value = 50
            64, 48          // FX: SET VOLUME: volume = 48

        ]

        if ( channel !== 0 ) {
            templateSong[5] = 0
            templateSong[channel + 5] = 1
        }

        const completeSong = templateSong.concat(noteSequence, [159])

        return completeSong

    }

    playSong (song, callback) {
        // Initialize player
        this.player = new SquawkStream(this.emulateSampleRate)
        this.player.onTick = (tick) => {
            this.props.setTick(tick)
        }
        this.player.onPlayEnd = () => {
            if (callback) {
                callback()
            } else {
                this.stopSong()
            }
        }
        this.player.setSource(song)
        // Build graph [this.player]=>[synth]=>[converter]=>[output]
        // Output is the sink, and drives/times the entire graph.
        this.synth.connect(this.player)
        this.converter.connect(this.synth)
        this.output.connect(this.converter)
        // Begin playback
        this.output.play()

        this.patternPlayPosition()
    }

    // DEV NOTE: Kept for reference in case we want a method to add a repeat
    // to a song programmatically
    playSongAndRepeat = (song, type, repeatCount = 255) => {
        song.pop()     // remove last fx
        song.push(254) // add RETURN fx to end of array
        song[0]++      // increase pattern number

        const repeater = [
            "Pattern 2",
            253,         // repeat
            repeatCount, // 255x
            1,           // pattern 1
            159          // stop channel
        ]

        song = song.concat(repeater)

        const d = song.join(',')
        const a = d.slice(d.indexOf('Pattern 1') + 8, d.indexOf('Pattern 2') - 1)
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

    /**
     * Stops playing the currently loaded song and deletes the player instance
     * as it's recreated on each play() call
     */
    stopSong () {
        clearInterval(this.listenForSongEndInterval)
        clearInterval(this.patternPlayPositionInterval)
        this.output.pause(true)
        
        delete this.player

        this.props.setSongIsPlaying(false);
        this.props.setPatternIsPlaying(false);
    }

    /**
     * Stops the currently playing song and toggles off the repeating indicator
     */
    stopRepeat () {
        this.stopSong()
        this.setState({repeatIsOn: false})
    }

    patternPlayPosition () {
        if ( this.patternPlayPositionInterval )
            clearInterval(this.patternPlayPositionInterval)
        this.patternPlayPositionInterval = setInterval(
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
        const { saveSongCode, songName = 'song_export' } = this.props
        const songString = this.getSongFileCode()

        saveSongCode(songString)

        // make the browser download the file
        const download = document.createElement('a')
        download.href = `data:text/plain;charset=utf-8;base64,${btoa(songString)}`
        download.download = `${songName}.h`

        document.body.appendChild(download)
        download.click()
        document.body.removeChild(download)
    }

    createAndPlaySong () {
        const { patterns, channels, fx, songRepeat } = this.props

        let music = createSongFromChannels(patterns, channels, fx)

        music = music.replace(/\/\/"Pattern.*"/g, 'Pattern,')
        music = music.replace(/, /g, ',\n')
        music = music.replace(/,\t*.*\n/g, ',')
        music = music.slice(84, -15)

        music = music.split(',')

        let number
        let patternCounter = 0
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
                music[i] = isNaN(number) ? `${item} ${patternCounter++}` : number
            }
        }

        this.props.setSongIsPlaying(true)
        this.playSong(music, () => {
            const { songRepeat } = this.props
            this[songRepeat ? 'createAndPlaySong' : 'stopSong']()
        })
    }

    createSongCode () {
        const { saveSongCode } = this.props

        saveSongCode(this.getSongFileCode())
    }

    getSongFileCode = () => {
        const { channels, fx, songName, songRepeat, patterns } = this.props

        return createSongFileFromChannels(
            Object.assign(
                {},
                { channels, fx, songName, songRepeat, patterns }
            )
        )
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
