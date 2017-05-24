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
        const props = this.props
        const channelTracks = props.channelTracks
        const tracks = props.tracks
        const fxStatus = props.fxStatus
        const activeFx = fxStatus.fxType === 'track' && fxStatus.id
        return (
            <div
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = {`channel-track droppable ${ props.editingFx ? 'active' : '' }`}
            >
                {channelTracks.map( (track, i) =>
                    <Track
                        key = {track.editorId}
                        position = {i}
                        track = {track}
                        detail = {tracks.find( t => t.id === track.id )}
                        removeTrack = {props.removeTrack}
                        channel = {props.channel}
                        openFx = {props.openFx}
                        activeFx = {activeFx === track.editorId}
                    />
                )}
            </div>
        )
    }
}

export default ChannelRowView
