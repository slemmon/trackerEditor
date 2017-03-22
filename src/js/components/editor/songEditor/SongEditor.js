import React, { Component } from 'react'
import /*createSong, */{ createSongFromChannels } from './createSong'
import ChannelRow from './ChannelRow'

class SongEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            song: [],
            songString: '',
            showString: false,
            channels: [
                [],[],[],[]
            ],
            tempo: 25
        }

        this.playSong = this.playSong.bind(this)
        this.exportSong = this.exportSong.bind(this)
        this.addTrackAtIndex = this.addTrackAtIndex.bind(this)
        this.moveTrackToIndex = this.moveTrackToIndex.bind(this)
        this.removeTrackAtIndex = this.removeTrackAtIndex.bind(this)
        this.toggleShowCode = this.toggleShowCode.bind(this)
        this.validateTempo = this.validateTempo.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const l1 = nextProps.tracks.length,
              l2 = this.props.tracks.length
        if ( l1 < l2 )
            this.deleteRemovedTrackFromAllChannels(nextProps.tracks)
        else if ( l1 === l2 ) {
            const colors = this.props.tracks.map( t => t.color )
            const newColors = nextProps.tracks.map( t => t.color )

            const l = colors.length
            let changed
            for ( let i = 0; i < l; i++ )
                if ( colors[i].hex !== newColors[i].hex )
                    changed = i

            if ( changed !== undefined )
                return this.updateTrackInAllChannels(this.props.tracks[changed], newColors[changed], 'color')



            const ticks = this.props.tracks.map( t => t.ticks )
            const newTicks = nextProps.tracks.map( t => t.ticks )

            for ( let i = 0; i < l; i++ ) {
                if ( ticks[i] !== newTicks[i] )
                    changed = i
            }

            if ( changed !== undefined )
                return this.updateTrackInAllChannels(this.props.tracks[changed], newTicks[changed], 'ticks')

        }
    }

    deleteRemovedTrackFromAllChannels (newTracks) {
        const tracks = this.props.tracks
        let removedTrack
        for ( const track of tracks ) {
            let stillExists = false
            for ( const newTrack of newTracks ) {
                if ( track.id === newTrack.id ) {
                    stillExists = true
                    break
                }
            }
            if ( !stillExists ) {
                removedTrack = track
                break
            }
        }

        const channels = this.state.channels
        const newChannels = []
        for ( const channel of channels ) {
            const newChannel = channel.filter(t => t.id !== removedTrack.id)
            newChannels.push(newChannel)
        }

        this.setState({
            channels: newChannels
        })
    }

    updateTrackInAllChannels (trackToChange, changeValue, type) {
        const trackToChangeId = trackToChange.id
        const channels = this.state.channels
        const newChannels = channels.map( c => c.map( t => Object.assign(t) ) )
        let channel
        let track
        for ( let i = 0; i < 4; i++ ) {
            channel = channels[i]
            for ( let j = 0, l = channel.length; j < l; j++ ) {
                track = channel[j]
                if ( track.id === trackToChangeId )
                    newChannels[i][j][type] = changeValue
            }
        }
        this.setState({
            channels: newChannels
        })
    }

    playSong () {
        // const updatedSong = createSong(this.props.tracks)
        // this.setState(updatedSong)
        // if ( !updatedSong.song.length ) return
        // this.props.playSong(updatedSong.song, true)
    }

    exportSong () {
        const songString = createSongFromChannels(this.props.tracks, this.state.channels, this.state.tempo)
        this.setState({
            songString
        })

        // make the browser download the file
        const download = document.createElement('a')
        download.href = `data:text/plain;charset=utf-8;base64,${btoa(songString)}`
        download.download = 'song_export.h'

        document.body.appendChild(download)
        download.click()
        document.body.removeChild(download)

    }

    toggleShowCode () {

        this.setState({
            songString: createSongFromChannels(this.props.tracks, this.state.channels, this.state.tempo),
            showString: !this.state.showString
        })

    }

    addTrackAtIndex (channel, index, trackId) {
        const tracks = this.state.channels[channel]
        const pos = ~index ? index : tracks.length
        const newTracks = [].concat( tracks.slice(0, pos), this.props.tracks.find(t => t.id === trackId), tracks.slice(pos) )
        const newChannels = this.state.channels.slice()
        newChannels[channel] = newTracks
        this.setState({
            channels: newChannels
        })
    }

    moveTrackToIndex (channel, fromIndex, toIndex) {
        const tracks = this.state.channels[channel]
        const track = tracks[fromIndex]
        let newTracks = [].concat( tracks.slice(0, fromIndex), tracks.slice(fromIndex + 1) )
        newTracks = [].concat( newTracks.slice(0, toIndex), track, newTracks.slice(toIndex) )
        const newChannels = this.state.channels.slice()
        newChannels[channel] = newTracks
        this.setState({
            channels: newChannels
        })
    }

    removeTrackAtIndex (channel, index) {
        const tracks = this.state.channels[channel]
        const newTracks = [].concat( tracks.slice(0, index), tracks.slice(index + 1) )
        const newChannels = this.state.channels.slice()
        newChannels[channel] = newTracks
        this.setState({
            channels: newChannels
        })
    }

    validateTempo (e) {
        const tempo = parseInt(this.state.tempo, 10)
        let newTempo = tempo
        if ( tempo < 0 ) newTempo = 0
        if ( tempo > 127 ) newTempo = 127
        if ( tempo !== newTempo ) {
            this.setState({tempo: newTempo})
        }
        this.props.setTempo(newTempo)
    }

    render () {
        const state = this.state
        return (
            <div id="song-editor-container">
                <h5>Song editor</h5>
                {/*<button onClick={ this.playSong }>Play</button>*/}
                {/*<button>Pause</button>*/}
                {/*<button onClick={ this.props.stopSong }>Stop</button>*/}
                <button onClick={ this.exportSong }>Export song</button>
                <button onClick={ this.toggleShowCode }>{ `${state.showString ? 'Hide' : 'Show'} code` }</button>

                <label htmlFor="tempo">
                    Tempo&nbsp;
                </label>
                <input
                    id="tempo"
                    type="number"
                    min="0"
                    max="127"
                    value={state.tempo}
                    onChange={ e => this.setState({tempo: e.target.value}) }
                    onBlur={ this.validateTempo }
                />

                <ul className="song-editor-channels">
                    <ChannelRow
                        channel={0}
                        tracks={state.channels[0]}
                        addTrackAtIndex={this.addTrackAtIndex}
                        removeTrackAtIndex={this.removeTrackAtIndex}
                        moveTrackToIndex={this.moveTrackToIndex}
                    />
                    <ChannelRow
                        channel={1}
                        tracks={state.channels[1]}
                        addTrackAtIndex={this.addTrackAtIndex}
                        removeTrackAtIndex={this.removeTrackAtIndex}
                        moveTrackToIndex={this.moveTrackToIndex}
                    />
                    <ChannelRow
                        channel={2}
                        tracks={state.channels[2]}
                        addTrackAtIndex={this.addTrackAtIndex}
                        removeTrackAtIndex={this.removeTrackAtIndex}
                        moveTrackToIndex={this.moveTrackToIndex}
                    />
                    <ChannelRow
                        channel={3}
                        tracks={state.channels[3]}
                        addTrackAtIndex={this.addTrackAtIndex}
                        removeTrackAtIndex={this.removeTrackAtIndex}
                        moveTrackToIndex={this.moveTrackToIndex}
                    />
                </ul>

                { state.showString ?
                    <pre style={{
                        textTransform: 'initial',
                        borderStyle: 'inset',
                        padding: 2,
                        backgroundColor: '#f3f3f3'
                    }}>
                        {this.state.songString || "Nothing to show yet."}
                    </pre>
                    :null
                }
            </div>
        )
    }
}

export default SongEditor
