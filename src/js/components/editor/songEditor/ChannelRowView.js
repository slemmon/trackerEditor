import React, { Component } from 'react'
import Track from './Track'

class ChannelRowView extends Component {
    constructor (props) {
        super()

        this.handleDrop = this.handleDrop.bind(this)
        this.handleDragover = this.handleDragover.bind(this)

        this.iAmTheDrumChannel = props.channel === 3
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
        const channel = this.props.channelTracks
        const tracks = this.props.tracks
        return (
            <div
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = "channel-track droppable"
            >
                {channel.map( (t, i) =>
                    <Track
                        key = {t.editorId}
                        position = {i}
                        track = {t}
                        detail = {tracks.find( t => t.id === t.id )}
                        removeTrack = {this.props.removeTrack}
                        channel = {this.props.channel}
                    />
                )}
            </div>
        )
    }
}

export default ChannelRowView
