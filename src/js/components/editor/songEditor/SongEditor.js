import React, { Component } from 'react'
import createSong from './createSong'
import ListOfTracks from './ListOfTracks'

class SongEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            song: [],
            songString: '',
            showString: false,
            channels: [
                [],[],[],[]
            ]
        }

        this.playSong = this.playSong.bind(this)
        this.exportSong = this.exportSong.bind(this)
        this.addTrackAtIndex = this.addTrackAtIndex.bind(this)
        this.moveTrackToIndex = this.moveTrackToIndex.bind(this)
        this.removeTrackAtIndex = this.removeTrackAtIndex.bind(this)
    }

    playSong () {
        const updatedSong = createSong(this.props.tracks)
        this.setState(updatedSong)
        if ( !updatedSong.song.length ) return
        this.props.playSong(updatedSong.song, true)
    }

    exportSong () {
        this.setState({
            showString: !this.state.showString
        })
        this.setState(createSong(this.props.tracks))
    }

    addTrackAtIndex (channel, index, trackId) {
        const tracks = this.state.channels[channel]
        const pos = ~index ? index : tracks.length
        const newTracks = [].concat( tracks.slice(0, pos), this.props.tracks.find(t => t.id === trackId), tracks.slice(pos) )
        const newChannels = this.state.channels.slice()
        newChannels[channel] = newTracks
        console.log('addTrackAtIndex', newChannels)
        this.setState({
            channels: newChannels
        })
    }

    moveTrackToIndex (channel, fromIndex, toIndex) {
        console.log(arguments)
        const tracks = this.state.channels[channel]
        const track = tracks[fromIndex]
        let newTracks = [].concat( tracks.slice(0, fromIndex), tracks.slice(fromIndex + 1) )
        newTracks = [].concat( newTracks.slice(0, toIndex), track, newTracks.slice(toIndex) )
        const newChannels = this.state.channels.slice()
        newChannels[channel] = newTracks
        console.log('moveTrackToIndex', newChannels)
        this.setState({
            channels: newChannels
        })
    }

    removeTrackAtIndex (channel, index) {
        const tracks = this.state.channels[channel]
        const newTracks = [].concat( tracks.slice(0, index), tracks.slice(index + 1) )
        const newChannels = this.state.channels.slice()
        newChannels[channel] = newTracks
        console.log('removeTrackAtIndex', newChannels)
        this.setState({
            channels: newChannels
        })
    }

    render () {
        const state = this.state
        return (
            <div id="song-editor-container">
                <h5>Song editor</h5>
                <button onClick={ this.playSong }>Play</button>
                {/*<button>Pause</button>*/}
                <button onClick={ this.props.stopSong }>Stop</button>
                <button onClick={ this.exportSong }>Export song</button>

                <ul className="song-editor-channels">
                    <OneOfTheRows
                        channel={0}
                        tracks={state.channels[0]}
                        addTrackAtIndex={this.addTrackAtIndex}
                        removeTrackAtIndex={this.removeTrackAtIndex}
                        moveTrackToIndex={this.moveTrackToIndex}
                    />
                    <OneOfTheRows
                        channel={1}
                        tracks={state.channels[1]}
                        addTrackAtIndex={this.addTrackAtIndex}
                        removeTrackAtIndex={this.removeTrackAtIndex}
                        moveTrackToIndex={this.moveTrackToIndex}
                    />
                    <OneOfTheRows
                        channel={2}
                        tracks={state.channels[2]}
                        addTrackAtIndex={this.addTrackAtIndex}
                        removeTrackAtIndex={this.removeTrackAtIndex}
                        moveTrackToIndex={this.moveTrackToIndex}
                    />
                    <OneOfTheRows
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
                        {this.state.songString || "Nothing to listen to yet."}
                    </pre>
                    :null
                }
            </div>
        )
    }
}

export default SongEditor

const OneOfTheRows = ({channel, tracks, addTrackAtIndex, removeTrackAtIndex, moveTrackToIndex}) =>
    <li className="song-editor-channels-item">
        <div className="song-editor-channels-item-name">
            <span><i className="fa fa-music" aria-hidden="true"></i></span>
            <span>{`CH ${channel}`}</span>
        </div>
        <div className="song-editor-channels-item-editor">
            <ListOfTracks
                channel={channel}
                tracks={tracks}
                addTrackAtIndex={addTrackAtIndex}
                removeTrackAtIndex={removeTrackAtIndex}
                moveTrackToIndex={moveTrackToIndex}
            />
        </div>
    </li>
