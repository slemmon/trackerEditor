import React, { Component } from 'react'

class Player extends Component {
    constructor () {
        super()

        this.tempo = 25
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
        // this.playSong()

    }

    // componentWillReceiveProps (nextProps) {
    //     console.log(nextProps)
    //     if ( this.props.)
    // }

    componentDidUpdate (prevProps, prevState) {
        // use events instead
        // listen for songdata to play
        // document.addevetnlistener( 'playonce')
        // document.addevetnlistener( 'repeat')

        // if ( !prevProps.playerStatus.playSong && this.props.playerStatus )
        //     this.playSong()
    }

    playSong (song = this.props.playerStatus.song, forcePlay, keepRepeatOn) {
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

    render () {
        return (
            <div>
                player container
            </div>
        )
    }
}

export default Player
