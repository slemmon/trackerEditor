import React, { Component } from 'react'
import /*createSong, */{ createSongFromChannels } from './createSong'
import ChannelRow from './ChannelRow'
import FxEditor from './fxEditor/FxEditor'

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
            channelsFx: [
                {
                    flags: 1048576,
                    fx: {
                        1048576: {val: 25}
                    }
                },
                {
                    flags: 0,
                    fx: {}
                },
                {
                    flags: 0,
                    fx: {}
                },
                {
                    flags: 0,
                    fx: {}
                }
            ],
            editFx: null
        }

        this.editorIdCounter = 0

        this.playSong = this.playSong.bind(this)
        this.exportSong = this.exportSong.bind(this)
        this.addTrackAtIndex = this.addTrackAtIndex.bind(this)
        this.moveTrackToIndex = this.moveTrackToIndex.bind(this)
        this.toggleShowCode = this.toggleShowCode.bind(this)
        this.openChannelFx = this.openChannelFx.bind(this)
        this.updateFlags = this.updateFlags.bind(this)
        this.updateFxValue = this.updateFxValue.bind(this)
        this.saveJSON = this.saveJSON.bind(this)
        this.loadJSON = this.loadJSON.bind(this)
        this.deleteTrackFromChannel = this.deleteTrackFromChannel.bind(this)
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

        const newState = {}
        let forceData = false
        if ( nextProps.forceChannels && !this.props.forceChannels ) {
            forceData = true
            newState.channels = nextProps.forceChannels
        }
        if ( nextProps.forceFx && !this.props.forceFx ) {
            forceData = true
            newState.channelsFx = nextProps.forceChannels
        }
        if ( forceData )
            this.setState(newState, this.props.clearForcedData )

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
        const state = this.state
        const songString = createSongFromChannels(this.props.tracks, state.channels, state.tempo, state.channelsFx)
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

        const state = this.state
        this.setState({
            songString: createSongFromChannels(this.props.tracks, state.channels, state.tempo, state.channelsFx),
            showString: !this.state.showString
        })

    }

    addDefaultVolumeFx (channel) {

        const channelsFx = this.state.channelsFx

        const fxList = Object.assign({}, channelsFx[channel])
        fxList.fx = Object.assign({}, fxList.fx)
        fxList.flags = fxList.flags | 1
        fxList.fx[1] = { val: 48 }

        channelsFx[channel] = fxList

        this.setState({
            channelsFx
        })

    }

    addTrackAtIndex (channel, trackId, position) {
        const channels = this.state.channels.slice()
        const tracks = channels[channel]
        const pos = ~position ? position : tracks.length
        const newTrack = Object.assign({}, this.props.tracks.find(t => t.id === trackId), {editorId: this.editorIdCounter++})
        const newTracks = [].concat( tracks.slice(0, pos), newTrack, tracks.slice(pos) )
        channels[channel] = newTracks

        // if this is the first track in the channel, add sound fx with value 48
        if ( tracks.length === 0 && newTracks.length === 1 ) {
            this.addDefaultVolumeFx(channel)
        }

        this.setState({
            channels
        })
    }

    moveTrackToIndex (channel, editorId, position) {

        const original = this.findTrackByEditorId(editorId)

        // remove from original channel
        const channels = this.state.channels.slice()
        channels[original.channel] = channels[original.channel].filter(t => t.editorId !== editorId)

        // add to new channel (even if channel ===)
        // track position in array changes
        const pos = ~position ? position : channels[channel].length
        let trackCountBefore = channels[channel].length
        channels[channel] = [].concat( channels[channel].slice(0, pos), original.track, channels[channel].slice(pos) )
        let trackCountAfter = channels[channel].length

        // if this is the first track in the channel, add sound fx with value 48
        if ( trackCountBefore === 0 && trackCountAfter === 1 ) {
            this.addDefaultVolumeFx(channel)
        }

        this.setState({
            channels
        })
    }

    findTrackByEditorId (editorId) {
        const channels = this.state.channels

        let result

        let channel
        for ( let i = 0; i < 4; i++ ) {
            channel = channels[i]
            for ( let j = 0, l = channel.length; j < l; j++ )
                if ( channel[j].editorId === editorId ) {
                    result = {
                        track: channel[j],
                        channel: i
                    }
                    break
                }
        }

        return result

    }

    openChannelFx (channel) {
        // set fx window status to shown
        // set fx window owner (which channel or track)
        this.setState({
            editFx: channel
        })
    }

    updateFlags (channel, fx, action) {
        const channelsFx = this.state.channelsFx.slice()
        const thisChannelFx = Object.assign({}, channelsFx[channel])
        if ( action === 'add' )
            thisChannelFx.flags = thisChannelFx.flags | fx
        else if ( action === 'remove' ) {
            thisChannelFx.flags = thisChannelFx.flags ^ fx
            delete thisChannelFx.fx[fx]
        }

        channelsFx[channel] = thisChannelFx
        this.setState({
            channelsFx
        })
    }

    updateFxValue (channel, fx, key, value) {
        const channelsFx = this.state.channelsFx.slice()
        const thisChannelFx = Object.assign({}, channelsFx[channel])
        thisChannelFx.fx = Object.assign({}, thisChannelFx.fx)

        thisChannelFx.fx[fx] = Object.assign({}, thisChannelFx.fx[fx])
        thisChannelFx.fx[fx][key] = value

        channelsFx[channel] = thisChannelFx

        this.setState({
            channelsFx
        })
    }

    saveJSON () {
        this.props.save({
            fx: this.state.channelsFx,
            channels: this.state.channels
        })
    }

    loadJSON () {
        this.props.load()
    }

    deleteTrackFromChannel (editorId, channel) {
        const channels = this.state.channels.slice()
        const tracks = channels[channel].filter( t => t.editorId !== editorId)
        channels[channel] = tracks

        this.setState({channels})
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
                <button onClick={ this.saveJSON }>save</button>
                <button onClick={ this.loadJSON }>load</button>
                <button onClick={ this.toggleShowCode }>{ `${state.showString ? 'Hide' : 'Show'} code` }</button>

                <div className="song-editor-channels">

                    <div className="channel-titles">
                        <div className="channel-title">
                            <span><i className='fa fa-music' aria-hidden="true"></i></span>
                            <span>CH 0</span>
                        </div>
                        <div className="channel-title">
                            <span><i className='fa fa-music' aria-hidden="true"></i></span>
                            <span>CH 1</span>
                        </div>
                        <div className="channel-title">
                            <span><i className='fa fa-music' aria-hidden="true"></i></span>
                            <span>CH 2</span>
                        </div>
                        <div className="channel-title">
                            <span><i className='fa fa-superpowers' aria-hidden="true"></i></span>
                            <span>CH 3</span>
                        </div>
                    </div>

                    <div className="channel-tracks">
                        <div>
                            <ChannelRow
                                channel={0}
                                tracks={state.channels[0]}
                                addTrackAtIndex={this.addTrackAtIndex}
                                moveTrackToIndex={this.moveTrackToIndex}
                                deleteTrackFromChannel={this.deleteTrackFromChannel}
                            />
                            <ChannelRow
                                channel={1}
                                tracks={state.channels[1]}
                                addTrackAtIndex={this.addTrackAtIndex}
                                moveTrackToIndex={this.moveTrackToIndex}
                                deleteTrackFromChannel={this.deleteTrackFromChannel}
                            />
                            <ChannelRow
                                channel={2}
                                tracks={state.channels[2]}
                                addTrackAtIndex={this.addTrackAtIndex}
                                moveTrackToIndex={this.moveTrackToIndex}
                                deleteTrackFromChannel={this.deleteTrackFromChannel}
                            />
                            <ChannelRow
                                channel={3}
                                tracks={state.channels[3]}
                                addTrackAtIndex={this.addTrackAtIndex}
                                moveTrackToIndex={this.moveTrackToIndex}
                                deleteTrackFromChannel={this.deleteTrackFromChannel}
                            />
                        </div>
                    </div>

                    <div className="channel-fx-box">
                        <div className="channel-fx" onClick={ () => this.openChannelFx(0) }>FX</div>
                        <div className="channel-fx" onClick={ () => this.openChannelFx(1) }>FX</div>
                        <div className="channel-fx" onClick={ () => this.openChannelFx(2) }>FX</div>
                        <div className="channel-fx" onClick={ () => this.openChannelFx(3) }>FX</div>
                    </div>

                </div>

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

                { state.editFx !== null ?
                    <FxEditor
                        channel={state.editFx}
                        openChannelFx={this.openChannelFx}
                        channelFx={this.state.channelsFx[state.editFx]}
                        updateFlags={this.updateFlags}
                        updateFxValue={this.updateFxValue}
                    />
                    :null
                }
            </div>
        )
    }
}

export default SongEditor
