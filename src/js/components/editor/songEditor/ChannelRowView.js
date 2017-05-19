import React, { Component } from 'react'
import Track from './Track'

class ChannelRowView extends Component {
    constructor (props) {
        super()

        this.handleDrop = this.handleDrop.bind(this)
        this.handleDragover = this.handleDragover.bind(this)

        this.iAmTheDrumChannel = props.channel === 3
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.status === 0
    }

    handleDragover (e) {
        e.preventDefault()
    }

    handleDrop (e) {
        if ( this.iAmTheDrumChannel !== (e.dataTransfer.getData('type') === 'drum') ) return

        const editorId = e.dataTransfer.getData('editorId')
        if ( editorId )
            //move
            this.props.moveTrackToIndex( this.props.channel, parseInt(e.dataTransfer.getData('channel')), parseInt(editorId), parseInt(e.target.dataset.position||-1) )
        else
            //add
            this.props.addTrackAtIndex( this.props.channel, this.props.tracks.find(t => t.id === parseInt(e.dataTransfer.getData('trackId'))), parseInt(e.target.dataset.position||-1) )
    }

    render () {
        const channelTracks = this.props.channelTracks
        // const channelTracks = this.props.status === 0 ? this.props.channelTracks : []
        const tracks = this.props.tracks
        return (
            <div
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = {`channel-track droppable ${ this.props.editingFx ? 'active' : '' }`}
            >
                {channelTracks.map( (track, i) =>
                    <Track
                        key = {track.editorId}
                        position = {i}
                        track = {track}
                        detail = {tracks.find( t => t.id === track.id )}
                        removeTrack = {this.props.removeTrack}
                        channel = {this.props.channel}
                    />
                )}
            </div>
        )
    }
}

export default ChannelRowView
