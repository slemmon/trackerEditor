import React, { Component } from 'react'
import stringifyColor from '../../../stringifyColor'

class ListOfTracks extends Component {
    constructor (props) {
        super()

        this.handleDrop = this.handleDrop.bind(this)
        this.deleteTrack = this.deleteTrack.bind(this)
        this.handleDragover = this.handleDragover.bind(this)

        this.iAmTheDrumChannel = props.channel === 3
    }

    handleDragover (e) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'copy'
    }

    handleDrop (e) {
        if ( this.iAmTheDrumChannel !== (e.dataTransfer.getData('type') === 'drum') ) return

        const editorId = e.dataTransfer.getData('editorId')
        if ( editorId )
            //move
            this.props.moveTrackToIndex( this.props.channel, parseInt(editorId), parseInt(e.target.dataset.position||-1) )
        else
            //add
            this.props.addTrackAtIndex( this.props.channel, parseInt(e.dataTransfer.getData('trackId')), parseInt(e.target.dataset.position||-1) )
    }

    deleteTrack (editorId) {
        this.props.deleteTrackFromChannel(editorId, this.props.channel)
    }

    render () {
        const tracks = this.props.tracks
        return (
            <div
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = "droppable"
            >
                {tracks.map( (t, i) =>
                    <Track
                        key = {i}
                        position = {i}
                        track = {t}
                        deleteMe = {this.deleteTrack}
                    />
                )}
            </div>
        )
    }
}

export default ListOfTracks

class Track extends Component {
    constructor () {
        super()

        this.state = {
            imBeingDragged: false,
            dragging: null
        }

        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
    }

    handleDragStart (e) {
        e.dataTransfer.setData('trackId', this.props.track.id)
        e.dataTransfer.setData('type', this.props.track.type)
        e.dataTransfer.setData('editorId', this.props.track.editorId)
        setTimeout(
            () => {
                this.setState({
                    imBeingDragged: true,
                    dragging: this.props.track.editorId
                })
            },
            1
        )
    }

    handleDragEnd (e) {
        if ( this.state.dragging === this.props.track.editorId )
            this.props.deleteMe(this.props.track.editorId)

        this.setState({
            imBeingDragged: false,
            dragging: null
        })
    }

    render () {
        const track = this.props.track
        return (
            <span
                draggable = { true }
                onDragStart = { this.handleDragStart }
                onDragEnd = { this.handleDragEnd }
                data-position = { this.props.position }
                className = { `draggable ${track.type === 'tune' ? 'draggable-tune' : 'draggable-drum' } ${this.state.imBeingDragged ? 'beingdragged' : ''}` }
                style = { {width: track.ticks*2, backgroundColor: stringifyColor(track.color, 'rgba', {a: 0.5}), borderColor: stringifyColor(track.color, 'rgb')} }
            >
            </span>
        )
    }
}
